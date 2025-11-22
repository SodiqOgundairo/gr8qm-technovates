-- Update or create service_requests table with correct schema
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  service_type TEXT NOT NULL CHECK (service_type IN ('design-build', 'print-shop', 'other')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  budget_range TEXT,
  timeline TEXT,
  project_description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'in-progress', 'completed', 'cancelled'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_service_requests_email ON public.service_requests(email);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON public.service_requests(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert service requests (public form submissions)
CREATE POLICY "Allow public to create service requests"
  ON public.service_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all requests
CREATE POLICY "Allow authenticated users to read service requests"
  ON public.service_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update requests
CREATE POLICY "Allow authenticated users to update service requests"
  ON public.service_requests
  FOR UPDATE
  TO authenticated
  USING (true);

-- Grant permissions
GRANT INSERT ON public.service_requests TO anon;
GRANT ALL ON public.service_requests TO authenticated;
GRANT ALL ON public.service_requests TO service_role;
