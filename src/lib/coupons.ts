import { supabase } from "../utils/supabase";
import type { Coupon, CouponValidationResult } from "../types/checkout";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ════════════════════════════════════════════════════════════
// ADMIN CRUD
// ════════════════════════════════════════════════════════════

export function subscribeCoupons(
  callback: (coupons: Coupon[]) => void
): RealtimeChannel {
  const fetch = () =>
    supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => callback((data as Coupon[]) || []));

  fetch();

  return supabase
    .channel("coupons_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "coupons" },
      () => fetch()
    )
    .subscribe();
}

export async function createCoupon(
  coupon: Omit<Coupon, "id" | "times_used" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("coupons")
    .insert({ ...coupon, times_used: 0 })
    .select()
    .single();
  if (error) throw error;
  return data as Coupon;
}

export async function updateCoupon(
  id: string,
  updates: Partial<Omit<Coupon, "id" | "created_at">>
) {
  const { data, error } = await supabase
    .from("coupons")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Coupon;
}

export async function deleteCoupon(id: string) {
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) throw error;
}

// ════════════════════════════════════════════════════════════
// PUBLIC VALIDATION
// ════════════════════════════════════════════════════════════

/**
 * Validate a coupon code and calculate the discount.
 * @param code - The coupon code to validate
 * @param amount - The original price in naira
 * @param context - "courses" | "invoices" (what the coupon is being applied to)
 */
export async function validateCoupon(
  code: string,
  amount: number,
  context: "courses" | "invoices" | "devignfx" = "courses"
): Promise<CouponValidationResult> {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .ilike("code", code.trim())
    .eq("active", true)
    .single();

  if (error || !data) {
    return { valid: false, error: "Invalid coupon code." };
  }

  const coupon = data as Coupon;

  // Check expiry
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { valid: false, error: "This coupon has expired." };
  }

  // Check usage limit
  if (coupon.max_uses !== null && coupon.times_used >= coupon.max_uses) {
    return { valid: false, error: "This coupon has reached its usage limit." };
  }

  // Check applicability
  if (coupon.applies_to !== "all" && coupon.applies_to !== context) {
    return { valid: false, error: `This coupon is not valid for ${context}.` };
  }

  // Calculate discount
  let discountAmount: number;
  if (coupon.discount_type === "percentage") {
    discountAmount = Math.round(amount * (coupon.discount_value / 100));
  } else {
    discountAmount = Math.min(coupon.discount_value, amount);
  }

  const finalAmount = Math.max(0, amount - discountAmount);

  return {
    valid: true,
    coupon,
    discountAmount,
    finalAmount,
  };
}

/** Increment usage count after successful payment */
export async function useCoupon(code: string) {
  const { error } = await supabase.rpc("use_coupon", { p_code: code.trim().toUpperCase() });
  if (error) throw error;
}
