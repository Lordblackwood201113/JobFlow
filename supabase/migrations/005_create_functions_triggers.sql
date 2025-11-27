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

-- Grant access to authenticated users for the view
GRANT SELECT ON job_stats TO authenticated;
