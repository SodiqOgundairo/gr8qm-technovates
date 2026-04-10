export interface DevignFXLicense {
  id: string;
  license_key: string;
  name: string;
  email: string;
  status: "active" | "revoked" | "suspended" | "expired";
  expires: string | null;
  max_days: number | null;
  max_profit_pct: number | null;
  silent_kill: boolean;
  message: string;
  machine: string | null;
  build_id: string | null;
  payment_reference: string | null;
  amount_paid: number | null;
  coupon_code: string | null;
  tier: "standard" | "premium" | "enterprise";
  activated_at: string | null;
  last_check_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DevignFXActivationLog {
  id: string;
  license_key: string;
  event: string;
  machine: string | null;
  ip_address: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

export interface DevignFXPricingTier {
  id: string;
  name: string;
  price: number;
  max_days: number | null;
  max_profit_pct: number | null;
  features: string[];
}
