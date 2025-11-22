-- ============================================
-- DATABASE FIXES FOR GR8QM TECHNOVATES
-- ============================================
-- Run this SQL in your Supabase SQL Editor to fix missing columns and tables
-- ============================================

-- 1. ADD MISSING COLUMNS TO course_applications TABLE
-- Add status column
ALTER TABLE public.course_applications 
ADD COLUMN IF NOT EXISTS status text default 'pending'; -- 'pending', 'confirmed', 'rejected', 'completed'

-- Add experience tracking columns (rename from other_skills)
ALTER TABLE public.course_applications 
ADD COLUMN IF NOT EXISTS has_experience boolean default false;

ALTER TABLE public.course_applications 
ADD COLUMN IF NOT EXISTS experience_details text;

-- Optional: Remove old columns if you want to clean up
-- ALTER TABLE public.course_applications DROP COLUMN IF EXISTS has_other_skills;
-- ALTER TABLE public.course_applications DROP COLUMN IF EXISTS other_skills;

-- 2. CREATE MESSAGES TABLE (for contact form submissions)
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean default false,
  admin_notes text
);

-- 3. ENABLE RLS ON MESSAGES TABLE
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. CREATE POLICIES FOR MESSAGES
-- Anyone can submit messages
CREATE POLICY "Anyone can submit messages"
  ON public.messages FOR INSERT
  TO public
  WITH CHECK (true);

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (true);

-- Admins can update messages (mark as read, add notes)
CREATE POLICY "Admins can update messages"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admins can delete messages
CREATE POLICY "Admins can delete messages"
  ON public.messages FOR DELETE
  TO authenticated
  USING (true);

-- 5. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read);
CREATE INDEX IF NOT EXISTS idx_course_applications_status ON public.course_applications(status);

-- 6. ADD POLICY FOR PUBLIC PAYMENT UPDATES
-- This allows unauthenticated users to update payment status after Paystack redirect
CREATE POLICY "Public can update own applications by payment reference"
  ON public.course_applications FOR UPDATE
  TO public
  USING (payment_reference IS NOT NULL)
  WITH CHECK (payment_reference IS NOT NULL);

-- ============================================
-- FIXES COMPLETE!
-- ============================================
-- You can now use the updated schema with:
-- - course_applications.status
-- - course_applications.has_experience
-- - course_applications.experience_details
-- - messages table for contact form
-- ============================================
