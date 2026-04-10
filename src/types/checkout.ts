export interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number; // percentage (0-100) or fixed amount in naira
  applies_to: "all" | "courses" | "invoices" | "devignfx";
  max_uses: number | null; // null = unlimited
  times_used: number;
  expires_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  error?: string;
  discountAmount?: number; // calculated discount in naira
  finalAmount?: number; // price after discount
}
