-- ============================================================
-- Certificate & Alumni System for GR8QM Technovates
-- Tables: certificate_templates, certificates, alumni
-- ============================================================

-- 1. Certificate Templates (design presets)
CREATE TABLE IF NOT EXISTS certificate_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  orientation TEXT NOT NULL DEFAULT 'landscape' CHECK (orientation IN ('landscape', 'portrait')),
  background_color TEXT NOT NULL DEFAULT '#05235a',
  accent_color TEXT NOT NULL DEFAULT '#0098da',
  logo_url TEXT,
  border_style TEXT NOT NULL DEFAULT 'double' CHECK (border_style IN ('none', 'single', 'double', 'ornate')),
  header_text TEXT NOT NULL DEFAULT 'Certificate of Completion',
  subheader_text TEXT DEFAULT 'This is to certify that',
  footer_text TEXT DEFAULT 'GR8QM Technovates — Faith that builds. Impact that lasts.',
  signature_name TEXT DEFAULT 'Faith Ogunbayo',
  signature_title TEXT DEFAULT 'Founder & CEO, GR8QM Technovates',
  signature_image_url TEXT,
  show_qr_code BOOLEAN NOT NULL DEFAULT true,
  course_prefix TEXT NOT NULL DEFAULT 'GR8QM',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage certificate_templates"
  ON certificate_templates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read certificate_templates"
  ON certificate_templates FOR SELECT USING (true);

-- 2. Alumni (graduate profiles)
CREATE TABLE IF NOT EXISTS alumni (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  photo_url TEXT,
  bio TEXT,
  linkedin_url TEXT,
  cohort TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage alumni"
  ON alumni FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read alumni"
  ON alumni FOR SELECT USING (true);

CREATE UNIQUE INDEX idx_alumni_email_unique ON alumni (LOWER(email));

-- 3. Certificates (issued certificates linking alumni to courses)
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_number TEXT NOT NULL UNIQUE,
  alumni_id UUID NOT NULL REFERENCES alumni(id) ON DELETE CASCADE,
  template_id UUID REFERENCES certificate_templates(id) ON DELETE SET NULL,
  course_name TEXT NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  pdf_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage certificates"
  ON certificates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read active certificates"
  ON certificates FOR SELECT USING (status = 'active');

CREATE INDEX idx_certificates_alumni ON certificates(alumni_id);
CREATE INDEX idx_certificates_number ON certificates(certificate_number);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE certificate_templates;
ALTER PUBLICATION supabase_realtime ADD TABLE alumni;
ALTER PUBLICATION supabase_realtime ADD TABLE certificates;
