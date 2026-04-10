-- ============================================================
-- Admin Profiles & Role-Based Permissions
-- Table: admin_profiles
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'viewer')),
  display_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  permissions JSONB DEFAULT NULL, -- NULL = use role defaults
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all profiles (needed for UI)
CREATE POLICY "Authenticated users can read admin profiles"
  ON admin_profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only super_admin can insert/update/delete profiles
-- (enforced in app code, but we allow authenticated for self-profile creation)
CREATE POLICY "Authenticated users can insert own profile"
  ON admin_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update profiles"
  ON admin_profiles FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete profiles"
  ON admin_profiles FOR DELETE
  USING (auth.role() = 'authenticated');

-- Index
CREATE INDEX idx_admin_profiles_user_id ON admin_profiles(user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE admin_profiles;
