-- ============================================================
-- DevignFX License Management
-- ============================================================

-- Main licenses table (replaces GitHub Gist)
CREATE TABLE IF NOT EXISTS devignfx_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- License key (DEVFX-XXXXXXXXXXXX format)
  license_key TEXT NOT NULL UNIQUE,

  -- Client info
  name TEXT NOT NULL DEFAULT '',
  email TEXT DEFAULT '',

  -- License status
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'revoked', 'suspended', 'expired')),

  -- Expiry (NULL = no limit)
  expires DATE,

  -- Usage limits
  max_days INTEGER,           -- max days from first activation (NULL = unlimited)
  max_profit_pct NUMERIC,     -- max profit % cap (NULL = unlimited)

  -- Control flags
  silent_kill BOOLEAN NOT NULL DEFAULT false,
  message TEXT DEFAULT '',

  -- Machine binding (auto-set on first activation)
  machine TEXT,

  -- Build tracking
  build_id TEXT,

  -- Payment linkage
  payment_reference TEXT,
  amount_paid NUMERIC,
  coupon_code TEXT,

  -- Pricing tier
  tier TEXT DEFAULT 'standard' CHECK (tier IN ('standard', 'premium', 'enterprise')),

  -- Activation tracking
  activated_at TIMESTAMPTZ,
  last_check_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_devignfx_status ON devignfx_licenses(status);
CREATE INDEX IF NOT EXISTS idx_devignfx_email ON devignfx_licenses(email);

-- Activation log for audit trail
CREATE TABLE IF NOT EXISTS devignfx_activation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key TEXT NOT NULL,
  event TEXT NOT NULL,  -- 'check', 'activate', 'bind_machine', 'device_conflict', 'revoke'
  machine TEXT,
  ip_address TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_devignfx_log_key ON devignfx_activation_log(license_key);
CREATE INDEX IF NOT EXISTS idx_devignfx_log_created ON devignfx_activation_log(created_at DESC);

-- RLS
ALTER TABLE devignfx_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE devignfx_activation_log ENABLE ROW LEVEL SECURITY;

-- Admin (authenticated) gets full access
CREATE POLICY "Admin full access to devignfx_licenses"
  ON devignfx_licenses FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to devignfx_activation_log"
  ON devignfx_activation_log FOR ALL
  USING (auth.role() = 'authenticated');

-- Extend coupons applies_to to include 'devignfx'
ALTER TABLE coupons DROP CONSTRAINT IF EXISTS coupons_applies_to_check;
ALTER TABLE coupons ADD CONSTRAINT coupons_applies_to_check
  CHECK (applies_to IN ('all', 'courses', 'invoices', 'devignfx'));

-- Generate license key function
CREATE OR REPLACE FUNCTION generate_devignfx_key()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := 'DEVFX-';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Enable Realtime for admin dashboard
ALTER PUBLICATION supabase_realtime ADD TABLE devignfx_licenses;
