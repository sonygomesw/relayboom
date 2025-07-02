-- Script pour ajouter des données de test pour les paliers
-- À exécuter APRÈS avoir vérifié que la table clip_submissions existe

-- 1. Récupérer un utilisateur clippeur et une mission pour créer des données de test
WITH clipper_user AS (
  SELECT id as clipper_id 
  FROM profiles 
  WHERE role = 'clipper' 
  LIMIT 1
),
test_mission AS (
  SELECT id as mission_id
  FROM missions 
  LIMIT 1
),
test_submission AS (
  SELECT id as submission_id
  FROM submissions
  LIMIT 1
)

-- 2. Insérer quelques soumissions de paliers de test
INSERT INTO clip_submissions (
  user_id,
  mission_id, 
  submission_id,
  tiktok_link,
  views_declared,
  palier,
  status,
  created_at
)
SELECT 
  clipper_user.clipper_id,
  test_mission.mission_id,
  test_submission.submission_id,
  'https://www.tiktok.com/@test/video/1234567890',
  2500,
  1000,
  'pending',
  NOW() - INTERVAL '2 hours'
FROM clipper_user, test_mission, test_submission
WHERE NOT EXISTS (SELECT 1 FROM clip_submissions)

UNION ALL

SELECT 
  clipper_user.clipper_id,
  test_mission.mission_id,
  test_submission.submission_id,
  'https://www.tiktok.com/@test/video/1234567891',
  7500,
  5000,
  'pending',
  NOW() - INTERVAL '1 hour'
FROM clipper_user, test_mission, test_submission
WHERE NOT EXISTS (SELECT 1 FROM clip_submissions)

UNION ALL

SELECT 
  clipper_user.clipper_id,
  test_mission.mission_id,
  test_submission.submission_id,
  'https://www.tiktok.com/@test/video/1234567892',
  15000,
  10000,
  'approved',
  NOW() - INTERVAL '30 minutes'
FROM clipper_user, test_mission, test_submission
WHERE NOT EXISTS (SELECT 1 FROM clip_submissions);

-- 3. Vérifier les données insérées
SELECT 
  'Données de test ajoutées' as message,
  COUNT(*) as total_test_entries,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count
FROM clip_submissions; 