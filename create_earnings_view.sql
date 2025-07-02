-- Vue pour calculer automatiquement les revenus des clippeurs
-- À exécuter dans Supabase SQL Editor

-- 1. Vue principale des revenus par clippeur
CREATE OR REPLACE VIEW clipper_earnings AS
SELECT
  cs.user_id,
  p.pseudo as clipper_name,
  COUNT(DISTINCT cs.id) as total_palier_submissions,
  COUNT(DISTINCT CASE WHEN cs.status = 'approved' THEN cs.id END) as approved_paliers,
  COUNT(DISTINCT CASE WHEN cs.status = 'pending' THEN cs.id END) as pending_paliers,
  COUNT(DISTINCT CASE WHEN cs.status = 'rejected' THEN cs.id END) as rejected_paliers,
  SUM(CASE WHEN cs.status = 'approved' THEN cs.views_declared ELSE 0 END) as total_approved_views,
  SUM(CASE 
    WHEN cs.status = 'approved' THEN 
      ROUND((cs.views_declared / 1000.0) * m.price_per_1k_views, 2)
    ELSE 0 
  END) as total_earnings,
  SUM(CASE 
    WHEN cs.status = 'pending' THEN 
      ROUND((cs.views_declared / 1000.0) * m.price_per_1k_views, 2)
    ELSE 0 
  END) as pending_earnings,
  AVG(CASE 
    WHEN cs.status = 'approved' AND cs.views_declared > 0 THEN cs.views_declared
    ELSE NULL 
  END) as avg_views_per_approved_clip,
  MAX(cs.created_at) as last_submission_date,
  COUNT(DISTINCT m.id) as missions_participated
FROM clip_submissions cs
LEFT JOIN profiles p ON p.id = cs.user_id
LEFT JOIN missions m ON m.id = cs.mission_id
GROUP BY cs.user_id, p.pseudo;

-- 2. Vue détaillée par mission pour les clippeurs
CREATE OR REPLACE VIEW clipper_mission_earnings AS
SELECT
  cs.user_id,
  p.pseudo as clipper_name,
  m.id as mission_id,
  m.title as mission_title,
  m.price_per_1k_views,
  creator_profile.pseudo as creator_name,
  COUNT(cs.id) as total_submissions,
  COUNT(CASE WHEN cs.status = 'approved' THEN 1 END) as approved_submissions,
  COUNT(CASE WHEN cs.status = 'pending' THEN 1 END) as pending_submissions,
  SUM(CASE WHEN cs.status = 'approved' THEN cs.views_declared ELSE 0 END) as total_views,
  SUM(CASE 
    WHEN cs.status = 'approved' THEN 
      ROUND((cs.views_declared / 1000.0) * m.price_per_1k_views, 2)
    ELSE 0 
  END) as earnings_from_mission,
  MAX(CASE WHEN cs.status = 'approved' THEN cs.views_declared ELSE 0 END) as best_clip_views,
  MIN(cs.created_at) as first_submission,
  MAX(cs.created_at) as last_submission
FROM clip_submissions cs
LEFT JOIN profiles p ON p.id = cs.user_id
LEFT JOIN missions m ON m.id = cs.mission_id
LEFT JOIN profiles creator_profile ON creator_profile.id = m.creator_id
GROUP BY cs.user_id, p.pseudo, m.id, m.title, m.price_per_1k_views, creator_profile.pseudo;

-- 3. Vue pour l'admin - validations en attente avec détails
CREATE OR REPLACE VIEW admin_pending_validations AS
SELECT
  cs.id as submission_id,
  cs.created_at as submitted_at,
  cs.palier,
  cs.views_declared,
  cs.tiktok_link,
  p.pseudo as clipper_name,
  p.email as clipper_email,
  m.title as mission_title,
  m.price_per_1k_views,
  creator_profile.pseudo as creator_name,
  ROUND((cs.views_declared / 1000.0) * m.price_per_1k_views, 2) as potential_earnings,
  s.created_at as original_clip_date,
  s.status as current_clip_status,
  s.views_count as current_clip_views,
  EXTRACT(DAYS FROM (NOW() - cs.created_at)) as days_waiting
FROM clip_submissions cs
LEFT JOIN profiles p ON p.id = cs.user_id
LEFT JOIN missions m ON m.id = cs.mission_id
LEFT JOIN profiles creator_profile ON creator_profile.id = m.creator_id
LEFT JOIN submissions s ON s.id = cs.submission_id
WHERE cs.status = 'pending'
ORDER BY cs.created_at ASC;

-- 4. Vue pour les stats globales admin
CREATE OR REPLACE VIEW admin_platform_stats AS
SELECT
  COUNT(DISTINCT cs.user_id) as total_active_clippers,
  COUNT(DISTINCT m.id) as total_missions_with_submissions,
  COUNT(cs.id) as total_palier_submissions,
  COUNT(CASE WHEN cs.status = 'pending' THEN 1 END) as pending_validations,
  COUNT(CASE WHEN cs.status = 'approved' THEN 1 END) as approved_submissions,
  COUNT(CASE WHEN cs.status = 'rejected' THEN 1 END) as rejected_submissions,
  SUM(CASE WHEN cs.status = 'approved' THEN cs.views_declared ELSE 0 END) as total_platform_views,
  SUM(CASE 
    WHEN cs.status = 'approved' THEN 
      ROUND((cs.views_declared / 1000.0) * m.price_per_1k_views, 2)
    ELSE 0 
  END) as total_platform_earnings,
  AVG(CASE 
    WHEN cs.status = 'approved' THEN 
      ROUND((cs.views_declared / 1000.0) * m.price_per_1k_views, 2)
    ELSE NULL 
  END) as avg_earnings_per_approved_clip,
  COUNT(CASE 
    WHEN cs.status = 'pending' AND cs.created_at < NOW() - INTERVAL '24 hours' 
    THEN 1 
  END) as overdue_validations
FROM clip_submissions cs
LEFT JOIN missions m ON m.id = cs.mission_id;

-- 5. Vue mensuelle pour les revenus
CREATE OR REPLACE VIEW monthly_clipper_earnings AS
SELECT
  cs.user_id,
  p.pseudo as clipper_name,
  DATE_TRUNC('month', cs.created_at) as month,
  COUNT(CASE WHEN cs.status = 'approved' THEN 1 END) as approved_clips,
  SUM(CASE WHEN cs.status = 'approved' THEN cs.views_declared ELSE 0 END) as total_views,
  SUM(CASE 
    WHEN cs.status = 'approved' THEN 
      ROUND((cs.views_declared / 1000.0) * m.price_per_1k_views, 2)
    ELSE 0 
  END) as monthly_earnings
FROM clip_submissions cs
LEFT JOIN profiles p ON p.id = cs.user_id
LEFT JOIN missions m ON m.id = cs.mission_id
WHERE cs.status = 'approved'
GROUP BY cs.user_id, p.pseudo, DATE_TRUNC('month', cs.created_at)
ORDER BY month DESC, monthly_earnings DESC;

-- 6. Fonction pour calculer les gains d'un clippeur
CREATE OR REPLACE FUNCTION get_clipper_total_earnings(clipper_user_id UUID)
RETURNS DECIMAL(10,2) AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(
      ROUND((cs.views_declared / 1000.0) * m.price_per_1k_views, 2)
    ), 0)
    FROM clip_submissions cs
    LEFT JOIN missions m ON m.id = cs.mission_id
    WHERE cs.user_id = clipper_user_id 
    AND cs.status = 'approved'
  );
END;
$$ LANGUAGE plpgsql;

-- 7. Fonction pour les gains du mois en cours
CREATE OR REPLACE FUNCTION get_clipper_monthly_earnings(clipper_user_id UUID, target_month DATE DEFAULT DATE_TRUNC('month', NOW()))
RETURNS DECIMAL(10,2) AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(
      ROUND((cs.views_declared / 1000.0) * m.price_per_1k_views, 2)
    ), 0)
    FROM clip_submissions cs
    LEFT JOIN missions m ON m.id = cs.mission_id
    WHERE cs.user_id = clipper_user_id 
    AND cs.status = 'approved'
    AND DATE_TRUNC('month', cs.created_at) = target_month
  );
END;
$$ LANGUAGE plpgsql;

-- Ajout de commentaires pour la documentation
COMMENT ON VIEW clipper_earnings IS 'Vue principale des revenus par clippeur avec toutes les métriques';
COMMENT ON VIEW clipper_mission_earnings IS 'Détail des revenus par clippeur et par mission';
COMMENT ON VIEW admin_pending_validations IS 'Liste des validations en attente pour les admins';
COMMENT ON VIEW admin_platform_stats IS 'Statistiques globales de la plateforme pour les admins';
COMMENT ON VIEW monthly_clipper_earnings IS 'Revenus mensuels des clippeurs';
COMMENT ON FUNCTION get_clipper_total_earnings IS 'Calcule le total des gains d''un clippeur';
COMMENT ON FUNCTION get_clipper_monthly_earnings IS 'Calcule les gains mensuels d''un clippeur';

-- Test des vues (optionnel)
-- SELECT * FROM clipper_earnings LIMIT 5;
-- SELECT * FROM admin_pending_validations LIMIT 5;
-- SELECT * FROM admin_platform_stats; 