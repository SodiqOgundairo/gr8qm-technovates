-- Add payment_link column to invoices table
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS payment_link TEXT;

-- Add payment_reference column to store Paystack reference
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS payment_reference TEXT;

-- Create index for payment reference lookups
CREATE INDEX IF NOT EXISTS idx_invoices_payment_reference ON public.invoices(payment_reference);
