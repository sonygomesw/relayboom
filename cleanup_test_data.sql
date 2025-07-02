-- 🧹 NETTOYAGE DES DONNÉES TEST
-- ===================================================
-- Ce script supprime toutes les données de test créées
-- et garde seulement vos vraies données + les fonctions SQL

-- 1. SUPPRIMER L'UTILISATEUR TEST
DELETE FROM auth.users WHERE email = 'creator@test.com';
DELETE FROM profiles WHERE email = 'creator@test.com';

-- 2. SUPPRIMER LES SUBMISSIONS TEST
DELETE FROM submissions WHERE user_id = '46fa07e8-1f20-4597-a8e9-74065c4d27c0';

-- 3. REMETTRE LES MISSIONS À LEUR ÉTAT ORIGINAL
-- (Vous devrez peut-être ajuster les creator_id avec vos vrais IDs d'utilisateurs)
UPDATE missions SET creator_id = NULL WHERE creator_id = '46fa07e8-1f20-4597-a8e9-74065c4d27c0';

-- 4. GARDER SEULEMENT LES FONCTIONS SQL NÉCESSAIRES
-- ===================================================

-- Fonction pour récupérer les missions avec statistiques
DROP FUNCTION IF EXISTS get_missions_with_stats();

CREATE OR REPLACE FUNCTION get_missions_with_stats()
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  creator_name text,
  creator_thumbnail text,
  video_url text,
  price_per_1k_views numeric,
  status text,
  is_featured boolean,
  created_at timestamptz,
  creator_id uuid,
  total_submissions bigint,
  pending_validations bigint,
  total_views bigint,
  total_earnings numeric
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.title,
    m.description,
    m.creator_name,
    m.creator_thumbnail,
    m.video_url,
    m.price_per_1k_views,
    m.status,
    m.is_featured,
    m.created_at,
    m.creator_id,
    COALESCE(COUNT(s.id), 0)::bigint as total_submissions,
    COALESCE(COUNT(s.id) FILTER (WHERE s.status = 'pending'), 0)::bigint as pending_validations,
    COALESCE(SUM(s.views_count), 0)::bigint as total_views,
    COALESCE(SUM(s.earnings), 0)::numeric as total_earnings
  FROM missions m
  LEFT JOIN submissions s ON m.id = s.mission_id
  GROUP BY m.id, m.title, m.description, m.creator_name, m.creator_thumbnail, 
           m.video_url, m.price_per_1k_views, m.status, m.is_featured, 
           m.created_at, m.creator_id
  ORDER BY m.created_at DESC;
END;
$$;

-- Fonction pour récupérer les stats d'un utilisateur
DROP FUNCTION IF EXISTS get_user_stats(uuid);

CREATE OR REPLACE FUNCTION get_user_stats(p_user_id uuid)
RETURNS TABLE (
  total_views bigint,
  total_submissions bigint,
  total_earnings numeric,
  avg_views numeric,
  pending_submissions bigint,
  approved_submissions bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(s.views_count), 0)::bigint as total_views,
    COUNT(*)::bigint as total_submissions,
    COALESCE(SUM(s.earnings), 0)::numeric as total_earnings,
    CASE 
      WHEN COUNT(*) > 0 THEN COALESCE(AVG(s.views_count), 0)::numeric
      ELSE 0::numeric
    END as avg_views,
    COUNT(*) FILTER (WHERE s.status = 'pending')::bigint as pending_submissions,
    COUNT(*) FILTER (WHERE s.status = 'approved')::bigint as approved_submissions
  FROM submissions s
  WHERE s.user_id = p_user_id;
END;
$$;

-- Fonction pour les stats admin
DROP FUNCTION IF EXISTS get_admin_dashboard_stats();

CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE (
  total_users bigint,
  total_creators bigint,
  total_clippers bigint,
  total_missions bigint,
  active_missions bigint,
  total_submissions bigint,
  pending_validations bigint,
  total_views bigint,
  total_earnings numeric
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM profiles)::bigint as total_users,
    (SELECT COUNT(*) FROM profiles WHERE role = 'creator')::bigint as total_creators,
    (SELECT COUNT(*) FROM profiles WHERE role = 'clipper')::bigint as total_clippers,
    (SELECT COUNT(*) FROM missions)::bigint as total_missions,
    (SELECT COUNT(*) FROM missions WHERE status = 'active')::bigint as active_missions,
    (SELECT COUNT(*) FROM submissions)::bigint as total_submissions,
    (SELECT COUNT(*) FROM submissions WHERE status = 'pending')::bigint as pending_validations,
    (SELECT COALESCE(SUM(views_count), 0) FROM submissions)::bigint as total_views,
    (SELECT COALESCE(SUM(earnings), 0) FROM submissions)::numeric as total_earnings;
END;
$$;

-- Fonction pour les stats wallet
DROP FUNCTION IF EXISTS get_user_wallet_stats(uuid);

CREATE OR REPLACE FUNCTION get_user_wallet_stats(p_user_id uuid)
RETURNS TABLE (
  balance numeric,
  total_earned numeric,
  pending_earnings numeric,
  total_submissions bigint,
  recent_transactions jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(p.total_earnings, 0)::numeric as balance,
    COALESCE(SUM(s.earnings) FILTER (WHERE s.status = 'approved'), 0)::numeric as total_earned,
    COALESCE(SUM(s.earnings) FILTER (WHERE s.status = 'pending'), 0)::numeric as pending_earnings,
    COUNT(s.id)::bigint as total_submissions,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'amount', s.earnings,
          'status', s.status,
          'mission_title', m.title,
          'views', s.views_count,
          'date', s.created_at
        ) ORDER BY s.created_at DESC
      ) FILTER (WHERE s.id IS NOT NULL),
      '[]'::jsonb
    ) as recent_transactions
  FROM profiles p
  LEFT JOIN submissions s ON p.id = s.user_id
  LEFT JOIN missions m ON s.mission_id = m.id
  WHERE p.id = p_user_id
  GROUP BY p.id, p.total_earnings;
END;
$$;

-- ===================================================
-- ✅ NETTOYAGE TERMINÉ
-- ===================================================
SELECT '🧹 Données de test supprimées, fonctions SQL créées !' as cleanup_message;
SELECT 'Connectez-vous maintenant avec vos vrais comptes Supabase.' as instruction; 