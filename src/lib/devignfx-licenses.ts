import { supabase } from "../utils/supabase";
import type { DevignFXLicense, DevignFXActivationLog } from "../types/devignfx";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ════════════════════════════════════════════════════════════
// ADMIN CRUD
// ════════════════════════════════════════════════════════════

export function subscribeLicenses(
  callback: (licenses: DevignFXLicense[]) => void
): RealtimeChannel {
  const fetch = () =>
    supabase
      .from("devignfx_licenses")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => callback((data as DevignFXLicense[]) || []));

  fetch();

  return supabase
    .channel("devignfx_licenses_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "devignfx_licenses" },
      () => fetch()
    )
    .subscribe();
}

export async function createLicense(
  license: Partial<Omit<DevignFXLicense, "id" | "created_at" | "updated_at">>
) {
  // Generate key if not provided
  if (!license.license_key) {
    const { data: keyData } = await supabase.rpc("generate_devignfx_key");
    license.license_key = keyData as string;
  }

  const { data, error } = await supabase
    .from("devignfx_licenses")
    .insert(license)
    .select()
    .single();
  if (error) throw error;
  return data as DevignFXLicense;
}

export async function updateLicense(
  id: string,
  updates: Partial<Omit<DevignFXLicense, "id" | "created_at">>
) {
  const { data, error } = await supabase
    .from("devignfx_licenses")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as DevignFXLicense;
}

export async function deleteLicense(id: string) {
  const { error } = await supabase
    .from("devignfx_licenses")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function getLicenseByKey(key: string) {
  const { data, error } = await supabase
    .from("devignfx_licenses")
    .select("*")
    .eq("license_key", key)
    .single();
  if (error) return null;
  return data as DevignFXLicense;
}

// ════════════════════════════════════════════════════════════
// ACTIVATION LOG
// ════════════════════════════════════════════════════════════

export async function getActivationLog(
  licenseKey: string,
  limit = 50
): Promise<DevignFXActivationLog[]> {
  const { data, error } = await supabase
    .from("devignfx_activation_log")
    .select("*")
    .eq("license_key", licenseKey)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as DevignFXActivationLog[]) || [];
}

// ════════════════════════════════════════════════════════════
// BULK ACTIONS
// ════════════════════════════════════════════════════════════

export async function revokeLicense(id: string, silent = false, message = "") {
  return updateLicense(id, {
    status: "revoked",
    silent_kill: silent,
    message,
  });
}

export async function suspendLicense(id: string, message = "") {
  return updateLicense(id, {
    status: "suspended",
    message,
  });
}

export async function reactivateLicense(id: string) {
  return updateLicense(id, {
    status: "active",
    silent_kill: false,
    message: "",
  });
}

export async function unbindMachine(id: string) {
  return updateLicense(id, {
    machine: null,
    activated_at: null,
  });
}
