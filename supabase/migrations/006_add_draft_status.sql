-- =====================================================
-- Ajouter le statut "Brouillon" pour les candidatures non envoyées
-- =====================================================

-- Modifier la contrainte CHECK de la colonne status pour inclure "Brouillon"
ALTER TABLE jobs
DROP CONSTRAINT IF EXISTS jobs_status_check;

ALTER TABLE jobs
ADD CONSTRAINT jobs_status_check
CHECK (status IN ('Brouillon', 'Envoyé', 'Entretien', 'Refus', 'Offre'));

-- Supprimer l'ancienne vue puis la recréer avec la nouvelle colonne
DROP VIEW IF EXISTS job_stats;

CREATE VIEW job_stats AS
SELECT
  user_id,
  COUNT(*) as total_applications,
  COUNT(CASE WHEN status = 'Brouillon' THEN 1 END) as draft_count,
  COUNT(CASE WHEN status = 'Envoyé' THEN 1 END) as sent_count,
  COUNT(CASE WHEN status = 'Entretien' THEN 1 END) as interview_count,
  COUNT(CASE WHEN status = 'Offre' THEN 1 END) as offer_count,
  COUNT(CASE WHEN status = 'Refus' THEN 1 END) as rejection_count,
  ROUND(
    (COUNT(CASE WHEN status = 'Offre' THEN 1 END)::DECIMAL /
     NULLIF(COUNT(CASE WHEN status != 'Brouillon' THEN 1 END), 0) * 100), 2
  ) as success_rate,
  ROUND(
    (COUNT(CASE WHEN status = 'Entretien' THEN 1 END)::DECIMAL /
     NULLIF(COUNT(CASE WHEN status != 'Brouillon' THEN 1 END), 0) * 100), 2
  ) as interview_rate,
  MIN(date_applied) as first_application_date,
  MAX(date_applied) as last_application_date
FROM jobs
WHERE is_archived = FALSE
GROUP BY user_id;

GRANT SELECT ON job_stats TO authenticated;

-- =====================================================
-- Migration terminée
-- =====================================================
-- Exécutez ce fichier dans SQL Editor de Supabase
-- Le statut "Brouillon" est maintenant disponible
-- =====================================================
