-- 🔧 SCRIPT SQL FINAL POUR RELAYBOOM
-- ===================================================
-- Ce script corrige définitivement tous les problèmes
-- et gère les erreurs de duplication

-- ===================================================
-- 1. FONCTION GET_MISSIONS_WITH_STATS CORRIGÉE
-- ===================================================

-- Supprimer l'ancienne fonction si elle existe
DROP FUNCTION IF EXISTS get_missions_with_stats();

-- Créer la fonction corrigée avec LEFT JOIN simple
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
-- 2. CRÉER UN UTILISATEUR TEST AVEC DONNÉES
-- ===================================================

-- Insérer un utilisateur test (ON CONFLICT pour éviter les erreurs)
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
  6.17,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  pseudo = EXCLUDED.pseudo,
  role = EXCLUDED.role,
  tiktok_username = EXCLUDED.tiktok_username,
  total_earnings = EXCLUDED.total_earnings;

-- ===================================================
-- 3. INSÉRER DES SOUMISSIONS TEST
-- ===================================================

-- Supprimer les anciennes soumissions test pour éviter les doublons
DELETE FROM submissions WHERE user_id = '46fa07e8-1f20-4597-a8e9-74065c4d27c0';

-- Insérer quelques soumissions test
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
);

-- ===================================================
-- 4. METTRE À JOUR LES MISSIONS AVEC LE BON CREATOR_ID
-- ===================================================

UPDATE missions 
SET creator_id = '46fa07e8-1f20-4597-a8e9-74065c4d27c0'
WHERE creator_id IS NULL OR creator_id != '46fa07e8-1f20-4597-a8e9-74065c4d27c0';

-- ===================================================
-- 5. POLITIQUES RLS (gestion des erreurs)
-- ===================================================

-- Supprimer les anciennes politiques si elles existent
DO $$ 
BEGIN
    -- Supprimer les politiques existantes
    DROP POLICY IF EXISTS "Allow public read access to profiles" ON profiles;
    DROP POLICY IF EXISTS "Allow public read access to submissions" ON submissions;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

-- Activer RLS sur les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Créer les nouvelles politiques
CREATE POLICY "Allow public read access to profiles" 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to submissions" 
ON submissions FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- ===================================================
-- 6. FONCTION WALLET STATS
-- ===================================================

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
-- ✅ TESTS FINAUX
-- ===================================================

-- Test 1: Fonction missions avec stats
SELECT 'TEST - Missions avec stats:' as test_name;
SELECT title, total_submissions, pending_validations, total_views, total_earnings 
FROM get_missions_with_stats() 
LIMIT 3;

-- Test 2: Stats utilisateur
SELECT 'TEST - Stats utilisateur:' as test_name;
SELECT * FROM get_user_stats('46fa07e8-1f20-4597-a8e9-74065c4d27c0');

-- Test 3: Wallet stats
SELECT 'TEST - Wallet stats:' as test_name;
SELECT balance, total_earned, pending_earnings, total_submissions 
FROM get_user_wallet_stats('46fa07e8-1f20-4597-a8e9-74065c4d27c0');

-- Test 4: Vérifier les données
SELECT 'TEST - Données de base:' as test_name;
SELECT 
  (SELECT COUNT(*) FROM profiles WHERE id = '46fa07e8-1f20-4597-a8e9-74065c4d27c0') as profiles_count,
  (SELECT COUNT(*) FROM submissions WHERE user_id = '46fa07e8-1f20-4597-a8e9-74065c4d27c0') as submissions_count,
  (SELECT COUNT(*) FROM missions WHERE creator_id = '46fa07e8-1f20-4597-a8e9-74065c4d27c0') as missions_count;

-- ===================================================
-- ✅ SCRIPT TERMINÉ AVEC SUCCÈS
-- ===================================================
SELECT '🎉 Script SQL appliqué avec succès ! Toutes les fonctions sont prêtes.' as success_message; 