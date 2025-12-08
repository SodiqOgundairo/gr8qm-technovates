-- Create portfolio table for project showcase
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('design-build', 'print-shop', 'tech-training')),
  image_url TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  project_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_portfolio_category ON portfolio(category);
CREATE INDEX idx_portfolio_featured ON portfolio(featured);
CREATE INDEX idx_portfolio_created_at ON portfolio(created_at DESC);

-- Enable Row Level Security
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- Public can view all portfolio items
CREATE POLICY "Portfolio items are viewable by everyone"
  ON portfolio FOR SELECT
  USING (true);

-- Only authenticated users can insert portfolio items
CREATE POLICY "Authenticated users can insert portfolio items"
  ON portfolio FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update portfolio items
CREATE POLICY "Authenticated users can update portfolio items"
  ON portfolio FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can delete portfolio items
CREATE POLICY "Authenticated users can delete portfolio items"
  ON portfolio FOR DELETE
  TO authenticated
  USING (true);
