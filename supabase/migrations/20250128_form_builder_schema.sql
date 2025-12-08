-- Form Builder Schema Migration
-- Creates tables for custom form builder with conditional logic

-- 1. Forms table
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}', -- {theme, thankYouMessage, allowMultipleResponses, etc}
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  short_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Form fields table
CREATE TABLE IF NOT EXISTS form_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('text', 'textarea', 'email', 'phone', 'radio', 'checkbox', 'dropdown', 'range', 'date')),
  label TEXT NOT NULL,
  description TEXT,
  placeholder TEXT,
  options JSONB, -- For radio, checkbox, dropdown: [{"label": "Option 1", "value": "opt1"}]
  validation JSONB, -- {required: true, min: 1, max: 100, pattern: "regex"}
  conditional_logic JSONB, -- {show_if: {field_id: "xxx", operator: "equals", value: "yes"}}
  is_screener BOOLEAN DEFAULT FALSE,
  screener_logic JSONB, -- {disqualify_if: {operator: "equals", value: "no"}, message: "Thank you..."}
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Form responses table
CREATE TABLE IF NOT EXISTS form_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  respondent_email TEXT,
  respondent_metadata JSONB, -- {ip, userAgent, location, etc}
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'disqualified', 'abandoned')),
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Form field responses table
CREATE TABLE IF NOT EXISTS form_field_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id UUID REFERENCES form_responses(id) ON DELETE CASCADE,
  field_id UUID REFERENCES form_fields(id) ON DELETE CASCADE,
  value JSONB NOT NULL, -- Supports any value type (string, number, array, etc)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Short URLs table
CREATE TABLE IF NOT EXISTS short_urls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  short_code TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_forms_status ON forms(status);
CREATE INDEX IF NOT EXISTS idx_forms_short_code ON forms(short_code);
CREATE INDEX IF NOT EXISTS idx_form_fields_form_id ON form_fields(form_id);
CREATE INDEX IF NOT EXISTS idx_form_fields_order ON form_fields(form_id, order_index);
CREATE INDEX IF NOT EXISTS idx_form_responses_form_id ON form_responses(form_id);
CREATE INDEX IF NOT EXISTS idx_form_responses_status ON form_responses(status);
CREATE INDEX IF NOT EXISTS idx_field_responses_response_id ON form_field_responses(response_id);
CREATE INDEX IF NOT EXISTS idx_short_urls_code ON short_urls(short_code);

-- RLS Policies

-- Forms: Admins can CRUD, public can read published
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all forms"
  ON forms FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can create forms"
  ON forms FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update their forms"
  ON forms FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete their forms"
  ON forms FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view published forms"
  ON forms FOR SELECT
  USING (status = 'published');

-- Form fields: Admins can CRUD, public can read for published forms
ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage form fields"
  ON form_fields FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view fields of published forms"
  ON form_fields FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM forms
      WHERE forms.id = form_fields.form_id
      AND forms.status = 'published'
    )
  );

-- Form responses: Public can insert, admins can read all
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit responses"
  ON form_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all responses"
  ON form_responses FOR SELECT
  USING (auth.role() = 'authenticated');

-- Form field responses: Public can insert, admins can read all
ALTER TABLE form_field_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit field responses"
  ON form_field_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all field responses"
  ON form_field_responses FOR SELECT
  USING (auth.role() = 'authenticated');

-- Short URLs: Admins can CRUD, public can read
ALTER TABLE short_urls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage short URLs"
  ON short_urls FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view short URLs"
  ON short_urls FOR SELECT
  USING (true);

-- Function to update clicks count
CREATE OR REPLACE FUNCTION increment_short_url_clicks(short_code_param TEXT)
RETURNS void AS $$
BEGIN
  UPDATE short_urls
  SET clicks = clicks + 1
  WHERE short_code = short_code_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_forms_updated_at
  BEFORE UPDATE ON forms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
