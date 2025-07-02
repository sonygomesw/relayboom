-- 🔧 SCRIPT SQL CORRIGÉ POUR RELAYBOOM
-- ===================================================
-- Ce script corrige toutes les fonctions SQL pour qu'elles correspondent 
-- à la vraie structure des tables Supabase

-- ===================================================
-- 1. FONCTION GET_MISSIONS_WITH_STATS CORRIGÉE
-- ===================================================

-- Supprimer l'ancienne fonction si elle existe
DROP FUNCTION IF EXISTS get_missions_with_stats();

-- Créer la fonction corrigée
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
    COALESCE(stats.total_submissions, 0::bigint) as total_submissions,
    COALESCE(stats.pending_validations, 0::bigint) as pending_validations,
    COALESCE(stats.total_views, 0::bigint) as total_views,
    COALESCE(stats.total_earnings, 0::numeric) as total_earnings
  FROM missions m
  LEFT JOIN (
    SELECT 
      s.mission_id,
      COUNT(*) as total_submissions,
      COUNT(*) FILTER (WHERE s.status = 'pending') as pending_validations,
      COALESCE(SUM(s.views_count), 0) as total_views,
      COALESCE(SUM(s.earnings), 0) as total_earnings
    FROM submissions s
    GROUP BY s.mission_id
  ) stats ON m.id = stats.mission_id
  ORDER BY m.created_at DESC;
END;
$$;

-- ===================================================
-- 2. FONCTION GET_USER_STATS CORRIGÉE
-- ===================================================

-- Supprimer l'ancienne fonction si elle existe
DROP FUNCTION IF EXISTS get_user_stats(uuid);

-- Créer la fonction corrigée
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

-- ===================================================
-- 3. FONCTION GET_ADMIN_DASHBOARD_STATS CORRIGÉE
-- ===================================================

-- Supprimer l'ancienne fonction si elle existe
DROP FUNCTION IF EXISTS get_admin_dashboard_stats();

-- Créer la fonction corrigée
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

-- ===================================================
-- 4. FONCTION POUR CRÉER UN UTILISATEUR TEST
-- ===================================================

-- Insérer un utilisateur test pour le développement
INSERT INTO profiles (
  id, 
  email, 
  pseudo, 
  role, 
  tiktok_username,
  total_earnings,
  created_at
) VALUES (
  '46fa07e8-1f20-4597-a8e9-74065c4d27c0',
  'creator@test.com',
  'CreatorTest',
  'creator',
  '@creatortest',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  pseudo = EXCLUDED.pseudo,
  role = EXCLUDED.role,
  tiktok_username = EXCLUDED.tiktok_username;

-- ===================================================
-- 5. INSÉRER DES DONNÉES TEST POUR LES SUBMISSIONS
-- ===================================================

-- Insérer quelques soumissions test
INSERT INTO submissions (
  id,
  user_id,
  mission_id,
  tiktok_url,
  views_count,
  earnings,
  status,
  created_at
) VALUES 
(
  gen_random_uuid(),
  '46fa07e8-1f20-4597-a8e9-74065c4d27c0',
  'd52b7b0b-bb83-4c54-8de4-6e51747e37db',
  'https://tiktok.com/@test/video1',
  15000,
  1.8,
  'approved',
  NOW() - INTERVAL '2 days'
),
(
  gen_random_uuid(),
  '46fa07e8-1f20-4597-a8e9-74065c4d27c0',
  '51b38ecc-a6af-4e67-bac5-78962a15044f',
  'https://tiktok.com/@test/video2',
  8500,
  0.85,
  'pending',
  NOW() - INTERVAL '1 day'
),
(
  gen_random_uuid(),
  '46fa07e8-1f20-4597-a8e9-74065c4d27c0',
  '2fb01a52-7a28-4cba-93ff-f4aab0f02238',
  'https://tiktok.com/@test/video3',
  32000,
  3.52,
  'approved',
  NOW() - INTERVAL '3 days'
)
ON CONFLICT (id) DO NOTHING;

-- ===================================================
-- 6. CRÉER UNE VUE POUR LE WALLET
-- ===================================================

-- Créer ou remplacer la vue wallet_stats
CREATE OR REPLACE VIEW user_wallet_stats AS
SELECT 
  p.id as user_id,
  p.pseudo,
  p.role,
  COALESCE(SUM(s.earnings), 0) as total_earnings,
  COUNT(s.id) as total_submissions,
  COUNT(s.id) FILTER (WHERE s.status = 'pending') as pending_validations,
  COALESCE(SUM(s.views_count), 0) as total_views
FROM profiles p
LEFT JOIN submissions s ON p.id = s.user_id
GROUP BY p.id, p.pseudo, p.role;

-- ===================================================
-- 7. FONCTION POUR RÉCUPÉRER LES STATS WALLET
-- ===================================================

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
-- 8. ACTIVER RLS (ROW LEVEL SECURITY) SI NÉCESSAIRE
-- ===================================================

-- Activer RLS sur les tables sensibles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique des profils
CREATE POLICY "Allow public read access to profiles" 
ON profiles FOR SELECT 
USING (true);

-- Politique pour permettre la lecture publique des soumissions
CREATE POLICY "Allow public read access to submissions" 
ON submissions FOR SELECT 
USING (true);

-- Politique pour permettre aux utilisateurs de modifier leur propre profil
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- ===================================================
-- ✅ SCRIPT TERMINÉ
-- ===================================================

-- Vérifier que toutes les fonctions ont été créées
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('get_missions_with_stats', 'get_user_stats', 'get_admin_dashboard_stats', 'get_user_wallet_stats')
ORDER BY routine_name; 