-- Job Postings Schema Migration
-- Creates tables and policies for career page with job postings and applications

-- 1. Job Postings table
CREATE TABLE IF NOT EXISTS job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  employment_type TEXT CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'internship', 'temporary')),
  description TEXT NOT NULL,
  requirements TEXT,
  responsibilities TEXT,
  salary_range TEXT,
  application_form_id UUID REFERENCES forms(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
  posted_date TIMESTAMPTZ,
  closing_date TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Job Applications table (links form responses to job postings)
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_posting_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
  form_response_id UUID REFERENCES form_responses(id) ON DELETE CASCADE,
  applicant_name TEXT,
  applicant_email TEXT,
  resume_url TEXT, -- URL to uploaded resume in Supabase Storage
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'rejected', 'hired')),
  notes TEXT, -- Admin notes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_posting_id, form_response_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_department ON job_postings(department);
CREATE INDEX IF NOT EXISTS idx_job_postings_employment_type ON job_postings(employment_type);
CREATE INDEX IF NOT EXISTS idx_job_postings_form_id ON job_postings(application_form_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_posted_date ON job_postings(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_posting_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(applicant_email);

-- RLS Policies

-- Job Postings: Public can view published, admins can CRUD all
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published job postings"
  ON job_postings FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can view all job postings"
  ON job_postings FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can create job postings"
  ON job_postings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update job postings"
  ON job_postings FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete job postings"
  ON job_postings FOR DELETE
  USING (auth.role() = 'authenticated');

-- Job Applications: Public can insert, admins can view and manage
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit job applications"
  ON job_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all job applications"
  ON job_applications FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update job applications"
  ON job_applications FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete job applications"
  ON job_applications FOR DELETE
  USING (auth.role() = 'authenticated');

-- Trigger to update updated_at timestamp for job_postings
CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON job_postings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at timestamp for job_applications
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get application count for a job posting
CREATE OR REPLACE FUNCTION get_job_application_count(job_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM job_applications
    WHERE job_posting_id = job_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View to get job postings with application counts (for admin dashboard)
CREATE OR REPLACE VIEW job_postings_with_stats AS
SELECT 
  jp.*,
  COUNT(ja.id) as application_count,
  COUNT(CASE WHEN ja.status = 'pending' THEN 1 END) as pending_count,
  COUNT(CASE WHEN ja.status = 'reviewing' THEN 1 END) as reviewing_count,
  COUNT(CASE WHEN ja.status = 'shortlisted' THEN 1 END) as shortlisted_count,
  COUNT(CASE WHEN ja.status = 'rejected' THEN 1 END) as rejected_count,
  COUNT(CASE WHEN ja.status = 'hired' THEN 1 END) as hired_count
FROM job_postings jp
LEFT JOIN job_applications ja ON jp.id = ja.job_posting_id
GROUP BY jp.id;

-- Grant access to the view for authenticated users
GRANT SELECT ON job_postings_with_stats TO authenticated;
