-- ============================================================
-- Tech Glossary / Digi Dictionary
-- ============================================================

CREATE TABLE IF NOT EXISTS glossary_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- e.g. general, web, design, data, ai
  letter CHAR(1) GENERATED ALWAYS AS (UPPER(LEFT(term, 1))) STORED,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published terms"
  ON glossary_terms FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can manage terms"
  ON glossary_terms FOR ALL
  USING (auth.role() = 'authenticated');

CREATE INDEX idx_glossary_letter ON glossary_terms(letter);
CREATE INDEX idx_glossary_term ON glossary_terms(term);

ALTER PUBLICATION supabase_realtime ADD TABLE glossary_terms;
