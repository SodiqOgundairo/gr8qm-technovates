-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invoice_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  service_description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled')),
  payment_date TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_invoices_client_email ON public.invoices(client_email);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_status ON public.invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all invoices
CREATE POLICY "Allow authenticated users to read invoices"
  ON public.invoices
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to insert invoices
CREATE POLICY "Allow authenticated users to create invoices"
  ON public.invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update invoices
CREATE POLICY "Allow authenticated users to update invoices"
  ON public.invoices
  FOR UPDATE
  TO authenticated
  USING (true);

-- Grant permissions
GRANT ALL ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
