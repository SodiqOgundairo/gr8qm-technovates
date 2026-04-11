-- ═══ DevignFX Build Management Schema ═══

-- Builds table — tracks all uploaded bot versions
CREATE TABLE IF NOT EXISTS devignfx_builds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  build_id TEXT NOT NULL UNIQUE,
  version TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'stable'
    CHECK (channel IN ('stable', 'beta')),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  tier TEXT NOT NULL DEFAULT 'standard'
    CHECK (tier IN ('standard', 'premium', 'enterprise', 'root')),
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  sha256 TEXT,
  signature TEXT,
  signed BOOLEAN NOT NULL DEFAULT false,
  release_notes TEXT DEFAULT '',
  metadata JSONB DEFAULT '{}',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_builds_tier_channel ON devignfx_builds(tier, channel);
CREATE INDEX IF NOT EXISTS idx_builds_status ON devignfx_builds(status);
CREATE INDEX IF NOT EXISTS idx_builds_published ON devignfx_builds(published_at DESC);

ALTER TABLE devignfx_builds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage devignfx_builds"
  ON devignfx_builds FOR ALL
  USING (auth.role() = 'authenticated');

-- Download tokens — per-version, consumed only when download actually starts
CREATE TABLE IF NOT EXISTS devignfx_download_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  license_key TEXT NOT NULL,
  build_id TEXT NOT NULL REFERENCES devignfx_builds(build_id),
  consumed BOOLEAN NOT NULL DEFAULT false,
  consumed_at TIMESTAMPTZ,
  ip_address TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_download_tokens_token
  ON devignfx_download_tokens(token) WHERE NOT consumed;
CREATE INDEX IF NOT EXISTS idx_download_tokens_license_build
  ON devignfx_download_tokens(license_key, build_id);

ALTER TABLE devignfx_download_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage devignfx_download_tokens"
  ON devignfx_download_tokens FOR ALL
  USING (auth.role() = 'authenticated');

-- Download log — tracks which license downloaded which build (one per combo)
CREATE TABLE IF NOT EXISTS devignfx_download_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key TEXT NOT NULL,
  build_id TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(license_key, build_id)
);

CREATE INDEX IF NOT EXISTS idx_download_log_license
  ON devignfx_download_log(license_key);

ALTER TABLE devignfx_download_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage devignfx_download_log"
  ON devignfx_download_log FOR ALL
  USING (auth.role() = 'authenticated');

-- ═══ Storage RLS policies for devignfx-builds bucket ═══
-- Allow authenticated users (admins) to upload, read, and delete builds
INSERT INTO storage.buckets (id, name, public)
  VALUES ('devignfx-builds', 'devignfx-builds', false)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload to devignfx-builds"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'devignfx-builds' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read devignfx-builds"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'devignfx-builds' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update devignfx-builds"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'devignfx-builds' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete devignfx-builds"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'devignfx-builds' AND auth.role() = 'authenticated');
