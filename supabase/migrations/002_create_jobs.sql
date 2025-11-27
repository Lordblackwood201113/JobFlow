-- Create jobs table (main application tracking)
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Basic Info
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  job_url TEXT,
  location TEXT,
  work_type TEXT CHECK (work_type IN ('remote', 'hybrid', 'onsite')),
  contract_type TEXT CHECK (contract_type IN ('CDI', 'CDD', 'Stage', 'Freelance')),

  -- Application Details
  status TEXT NOT NULL DEFAULT 'Envoyé' CHECK (status IN ('Envoyé', 'Entretien', 'Refus', 'Offre')),
  date_applied DATE NOT NULL DEFAULT CURRENT_DATE,
  date_interview DATE,
  date_response DATE,

  -- Compensation
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'EUR',

  -- Additional Info
  description TEXT,
  requirements TEXT,
  notes TEXT,
  source TEXT,

  -- Contact Info
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,

  -- Metadata
  is_favorite BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 0 CHECK (priority IN (0, 1, 2)),

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_date_applied ON jobs(date_applied DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_user_status ON jobs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_jobs_is_archived ON jobs(is_archived);

-- Create policies for jobs
CREATE POLICY "Users can view own jobs"
  ON jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs"
  ON jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs"
  ON jobs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own jobs"
  ON jobs FOR DELETE
  USING (auth.uid() = user_id);
