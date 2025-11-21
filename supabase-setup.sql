-- ============================================
-- GR8QM TECHNOVATES - SUPABASE DATABASE SETUP
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- 1. TECH TRAINING COURSES TABLE
-- Stores all course information managed by admin
create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text not null,
  detailed_description text,
  duration text, -- e.g., "12 weeks"
  commitment_fee numeric default 0,
  cohort_name text,
  start_date date,
  is_open boolean default false,
  category text not null, -- 'product-design', 'product-management', 'frontend-dev', 'backend-dev', 'devops', 'cybersecurity', 'qa-testing'
  max_students integer,
  current_students integer default 0
);

-- 2. COURSE APPLICATIONS TABLE
-- Stores student applications for tech training
create table if not exists public.course_applications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  course_id uuid references public.courses(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  has_other_skills boolean default false,
  other_skills text,
  payment_status text default 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  payment_reference text unique,
  amount_paid numeric,
  paid_at timestamp with time zone
);

-- 3. SERVICE REQUESTS TABLE
-- Stores requests for Build/Design and Print Shop services
create table if not exists public.service_requests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  service_type text not null, -- 'build', 'print'
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text default 'pending', -- 'pending', 'quoted', 'invoiced', 'paid', 'completed', 'cancelled'
  admin_notes text
);

-- 4. INVOICES TABLE
-- Admin-generated invoices for Build and Print Shop services
create table if not exists public.invoices (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  service_request_id uuid references public.service_requests(id) on delete set null,
  invoice_number text unique not null,
  customer_name text not null,
  customer_email text not null,
  amount numeric not null,
  description text,
  payment_status text default 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  payment_reference text unique,
  paid_at timestamp with time zone,
  due_date date
);

-- 5. PORTFOLIO ITEMS TABLE
-- Admin-managed portfolio content
create table if not exists public.portfolio_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  category text not null, -- 'product-design', 'graphics-design', 'motion-design', 'tech-training', 'print-shop'
  image_url text,
  images text[], -- array of image URLs
  project_url text,
  tags text[], -- array of tags
  is_published boolean default true,
  display_order integer default 0
);

-- 6. TRANSACTIONS TABLE
-- Unified transaction history for all payments
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  transaction_type text not null, -- 'course-application', 'service-payment'
  reference_id uuid, -- ID of course_application, invoice, etc.
  payment_reference text unique not null,
  customer_name text not null,
  customer_email text not null,
  amount numeric not null,
  status text not null, -- 'pending', 'successful', 'failed', 'refunded'
  payment_method text, -- 'paystack'
  metadata jsonb -- Store additional payment details
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
alter table public.courses enable row level security;
alter table public.course_applications enable row level security;
alter table public.service_requests enable row level security;
alter table public.invoices enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.transactions enable row level security;

-- COURSES POLICIES
-- Public can view open courses
create policy "Anyone can view open courses"
  on public.courses for select
  to public
  using (is_open = true);

-- Admins can manage all courses
create policy "Admins can manage courses"
  on public.courses for all
  to authenticated
  using (true)
  with check (true);

-- COURSE APPLICATIONS POLICIES
-- Public can submit applications
create policy "Anyone can submit applications"
  on public.course_applications for insert
  to public
  with check (true);

-- Public can view their own applications
create policy "Users can view own applications"
  on public.course_applications for select
  to public
  using (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Admins can view all applications
create policy "Admins can view all applications"
  on public.course_applications for select
  to authenticated
  using (true);

-- Admins can update applications
create policy "Admins can update applications"
  on public.course_applications for update
  to authenticated
  using (true)
  with check (true);

-- SERVICE REQUESTS POLICIES
-- Public can submit service requests
create policy "Anyone can submit service requests"
  on public.service_requests for insert
  to public
  with check (true);

-- Admins can manage service requests
create policy "Admins can manage service requests"
  on public.service_requests for all
  to authenticated
  using (true)
  with check (true);

-- INVOICES POLICIES
-- Admins can manage invoices
create policy "Admins can manage invoices"
  on public.invoices for all
  to authenticated
  using (true)
  with check (true);

-- Public can view invoices by reference
create policy "Anyone can view invoices by reference"
  on public.invoices for select
  to public
  using (true);

-- PORTFOLIO POLICIES
-- Public can view published portfolio items
create policy "Anyone can view published portfolio"
  on public.portfolio_items for select
  to public
  using (is_published = true);

-- Admins can manage portfolio
create policy "Admins can manage portfolio"
  on public.portfolio_items for all
  to authenticated
  using (true)
  with check (true);

-- TRANSACTIONS POLICIES
-- Admins can view all transactions
create policy "Admins can view all transactions"
  on public.transactions for select
  to authenticated
  using (true);

-- Public can view their own transactions
create policy "Users can view own transactions"
  on public.transactions for select
  to public
  using (customer_email = current_setting('request.jwt.claims', true)::json->>'email');

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger set_updated_at
  before update on public.courses
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.portfolio_items
  for each row
  execute function public.handle_updated_at();

-- Function to generate invoice numbers
create or replace function public.generate_invoice_number()
returns text as $$
declare
  next_num integer;
  invoice_num text;
begin
  select coalesce(max(substring(invoice_number from 'INV-(\d+)')::integer), 0) + 1
  into next_num
  from public.invoices;
  
  invoice_num := 'INV-' || lpad(next_num::text, 6, '0');
  return invoice_num;
end;
$$ language plpgsql;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

create index if not exists idx_courses_category on public.courses(category);
create index if not exists idx_courses_is_open on public.courses(is_open);
create index if not exists idx_course_applications_course_id on public.course_applications(course_id);
create index if not exists idx_course_applications_email on public.course_applications(email);
create index if not exists idx_course_applications_payment_status on public.course_applications(payment_status);
create index if not exists idx_service_requests_service_type on public.service_requests(service_type);
create index if not exists idx_service_requests_status on public.service_requests(status);
create index if not exists idx_invoices_payment_status on public.invoices(payment_status);
create index if not exists idx_portfolio_items_category on public.portfolio_items(category);
create index if not exists idx_portfolio_items_is_published on public.portfolio_items(is_published);
create index if not exists idx_transactions_transaction_type on public.transactions(transaction_type);
create index if not exists idx_transactions_status on public.transactions(status);

-- ============================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================

-- Insert sample courses (you can remove this after testing)
insert into public.courses (name, description, detailed_description, duration, commitment_fee, category, is_open, cohort_name, start_date)
values 
  ('Product Design Masterclass', 'Learn end-to-end product design', 'Comprehensive course covering user research, wireframing, prototyping, and UI/UX design principles.', '12 weeks', 5000, 'product-design', true, 'Cohort 1', '2025-02-01'),
  ('Frontend Development Bootcamp', 'Master modern frontend development', 'Learn HTML, CSS, JavaScript, React, and modern frontend tools and practices.', '16 weeks', 7500, 'frontend-dev', true, 'Cohort 1', '2025-02-15');

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Next steps:
-- 1. Copy your Paystack Public Key to .env file
-- 2. Update VITE_PAYSTACK_PUBLIC_KEY in your .env
-- 3. The admin will need to create courses and set commitment fees
-- ============================================
