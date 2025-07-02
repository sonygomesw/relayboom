-- 🔧 SCRIPT SQL SIMPLIFIÉ POUR RELAYBOOM
-- ===================================================
-- Ce script utilise des requêtes simples qui correspondent 
-- exactement à votre structure de base de données

-- ===================================================
-- 1. FONCTION GET_MISSIONS_WITH_STATS SIMPLIFIÉE
-- ===================================================

-- Supprimer l'ancienne fonction
DROP FUNCTION IF EXISTS get_missions_with_stats();

-- Créer la fonction simplifiée avec les vraies colonnes
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

-- ===================================================
-- 2. FONCTION GET_USER_STATS SIMPLIFIÉE (déjà OK)
-- ===================================================

-- Cette fonction fonctionne déjà, pas de changement nécessaire

-- ===================================================
-- 3. CRÉER UN UTILISATEUR TEST AVEC DONNÉES
-- ===================================================

-- Insérer un utilisateur test
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
-- 4. INSÉRER DES SOUMISSIONS TEST
-- ===================================================

-- Insérer quelques soumissions test pour voir des données
INSERT INTO submissions (
  id,
  user_id,
  mission_id,
  tiktok_url,
  views_count,
  earnings,
  status,
  created_at,
  updated_at
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '46fa07e8-1f20-4597-a8e9-74065c4d27c0',
  'd52b7b0b-bb83-4c54-8de4-6e51747e37db',
  'https://tiktok.com/@test/video1',
  15000,
  1.8,
  'approved',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),
(
  '22222222-2222-2222-2222-222222222222',
  '46fa07e8-1f20-4597-a8e9-74065c4d27c0',
  '51b38ecc-a6af-4e67-bac5-78962a15044f',
  'https://tiktok.com/@test/video2',
  8500,
  0.85,
  'pending',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
),
(
  '33333333-3333-3333-3333-333333333333',
  '46fa07e8-1f20-4597-a8e9-74065c4d27c0',
  '2fb01a52-7a28-4cba-93ff-f4aab0f02238',
  'https://tiktok.com/@test/video3',
  32000,
  3.52,
  'approved',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
)
ON CONFLICT (id) DO UPDATE SET
  views_count = EXCLUDED.views_count,
  earnings = EXCLUDED.earnings,
  status = EXCLUDED.status;

-- ===================================================
-- 5. METTRE À JOUR LES MISSIONS AVEC LE BON CREATOR_ID
-- ===================================================

UPDATE missions 
SET creator_id = '46fa07e8-1f20-4597-a8e9-74065c4d27c0'
WHERE creator_id IS NULL OR creator_id != '46fa07e8-1f20-4597-a8e9-74065c4d27c0';

-- ===================================================
-- ✅ VÉRIFICATION FINALE
-- ===================================================

-- Vérifier que tout fonctionne
SELECT 'Missions avec stats:' as info;
SELECT * FROM get_missions_with_stats() LIMIT 3;

SELECT 'Stats utilisateur:' as info;
SELECT * FROM get_user_stats('46fa07e8-1f20-4597-a8e9-74065c4d27c0');

SELECT 'Profils:' as info;
SELECT id, pseudo, role FROM profiles WHERE id = '46fa07e8-1f20-4597-a8e9-74065c4d27c0';

SELECT 'Soumissions:' as info;
SELECT mission_id, views_count, earnings, status FROM submissions WHERE user_id = '46fa07e8-1f20-4597-a8e9-74065c4d27c0'; 