-- ============================================
-- ADDITIONAL FIX: Allow Public to Update Payment Status
-- ============================================
-- This allows unauthenticated users to update their application
-- after successful Paystack payment redirect
-- ============================================

-- Allow public to update applications by payment reference
-- This is needed for the PaymentSuccess page after Paystack redirect
create policy "Public can update own applications by payment reference"
  on public.course_applications for update
  to public
  using (payment_reference is not null)
  with check (payment_reference is not null);

-- ============================================
-- Run this in addition to supabase-fixes.sql
-- ============================================
