-- Add one-time download token column to devignfx_licenses
ALTER TABLE devignfx_licenses
  ADD COLUMN IF NOT EXISTS download_token TEXT;

-- Index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_devignfx_licenses_download_token
  ON devignfx_licenses (download_token)
  WHERE download_token IS NOT NULL;
