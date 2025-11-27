-- =====================================================
-- JOB TRACKER - COMPLETE DATABASE SETUP
-- Exécutez ce fichier dans SQL Editor de Supabase
-- =====================================================

-- =====================================================
-- 1. CREATE PROFILES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  current_position TEXT,
  location TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Trigger pour créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 2. CREATE JOBS TABLE
-- =====================================================

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

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_date_applied ON jobs(date_applied DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_user_status ON jobs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_jobs_is_archived ON jobs(is_archived);

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

-- =====================================================
-- 3. CREATE DOCUMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- File Info
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('CV', 'Lettre de motivation', 'Portfolio', 'Autre')),
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,

  -- Metadata
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_documents_job_id ON documents(job_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);

CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. CREATE STORAGE BUCKET & POLICIES
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('job-documents', 'job-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'job-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'job-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'job-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'job-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =====================================================
-- 5. CREATE FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to jobs table
DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create view for job statistics
CREATE OR REPLACE VIEW job_stats AS
SELECT
  user_id,
  COUNT(*) as total_applications,
  COUNT(CASE WHEN status = 'Envoyé' THEN 1 END) as sent_count,
  COUNT(CASE WHEN status = 'Entretien' THEN 1 END) as interview_count,
  COUNT(CASE WHEN status = 'Offre' THEN 1 END) as offer_count,
  COUNT(CASE WHEN status = 'Refus' THEN 1 END) as rejection_count,
  ROUND(
    (COUNT(CASE WHEN status = 'Offre' THEN 1 END)::DECIMAL /
     NULLIF(COUNT(*), 0) * 100), 2
  ) as success_rate,
  ROUND(
    (COUNT(CASE WHEN status = 'Entretien' THEN 1 END)::DECIMAL /
     NULLIF(COUNT(*), 0) * 100), 2
  ) as interview_rate,
  MIN(date_applied) as first_application_date,
  MAX(date_applied) as last_application_date
FROM jobs
WHERE is_archived = FALSE
GROUP BY user_id;

GRANT SELECT ON job_stats TO authenticated;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Vérifiez que toutes les tables ont été créées :
-- - profiles
-- - jobs
-- - documents
-- - Storage bucket: job-documents
-- =====================================================
