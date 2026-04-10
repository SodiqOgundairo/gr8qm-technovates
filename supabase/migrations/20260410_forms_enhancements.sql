-- ============================================================
-- Form Builder Enhancements
-- Adds: completion_action, max_responses columns to forms
-- Adds: file upload support via Supabase Storage
-- ============================================================

-- Add completion action and max responses to forms table
ALTER TABLE forms ADD COLUMN IF NOT EXISTS completion_action JSONB DEFAULT NULL;
ALTER TABLE forms ADD COLUMN IF NOT EXISTS max_responses INTEGER DEFAULT NULL;

-- Create storage bucket for form file uploads (run via Supabase dashboard or CLI)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('form-uploads', 'form-uploads', true)
-- ON CONFLICT (id) DO NOTHING;
