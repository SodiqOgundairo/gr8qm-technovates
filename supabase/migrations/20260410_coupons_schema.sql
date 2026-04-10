-- ============================================================
-- Coupon / Discount System for GR8QM Technovates
-- Table: coupons
-- ============================================================

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL DEFAULT 0,
  applies_to TEXT NOT NULL DEFAULT 'all' CHECK (applies_to IN ('all', 'courses', 'invoices')),
  max_uses INTEGER, -- NULL = unlimited
  times_used INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage coupons"
  ON coupons FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read active coupons"
  ON coupons FOR SELECT USING (active = true);

CREATE UNIQUE INDEX idx_coupons_code ON coupons(UPPER(code));

-- RPC: Validate coupon (server-side)
CREATE OR REPLACE FUNCTION validate_coupon(p_code TEXT, p_context TEXT DEFAULT 'courses')
RETURNS JSONB AS $$
DECLARE
  v_coupon RECORD;
BEGIN
  SELECT * INTO v_coupon
  FROM coupons
  WHERE UPPER(code) = UPPER(p_code) AND active = true;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invalid coupon code.');
  END IF;

  IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < now() THEN
    RETURN jsonb_build_object('valid', false, 'error', 'This coupon has expired.');
  END IF;

  IF v_coupon.max_uses IS NOT NULL AND v_coupon.times_used >= v_coupon.max_uses THEN
    RETURN jsonb_build_object('valid', false, 'error', 'This coupon has reached its usage limit.');
  END IF;

  IF v_coupon.applies_to != 'all' AND v_coupon.applies_to != p_context THEN
    RETURN jsonb_build_object('valid', false, 'error', 'This coupon is not valid for ' || p_context || '.');
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'discount_type', v_coupon.discount_type,
    'discount_value', v_coupon.discount_value,
    'code', v_coupon.code
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Use coupon (increment usage)
CREATE OR REPLACE FUNCTION use_coupon(p_code TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE coupons SET times_used = times_used + 1 WHERE UPPER(code) = UPPER(p_code);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE coupons;
