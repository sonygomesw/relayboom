-- 🔍 DIAGNOSTIC COMPLET DES DONNÉES ADMIN
-- Copiez et exécutez ces requêtes une par une dans Supabase SQL Editor

-- 1. D'abord voir la structure de la table missions
SELECT * FROM missions LIMIT 5;

-- 1bis. Voir les colonnes de la table missions
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'missions' 
ORDER BY ordinal_position;

-- 2. Vérifier les soumissions de clips
SELECT 
  s.id,
  s.tiktok_link,
  s.views_count,
  s.status,
  s.created_at,
  p.pseudo as clipper_name,
  m.title as mission_title
FROM submissions s
LEFT JOIN profiles p ON p.id = s.user_id
LEFT JOIN missions m ON m.id = s.mission_id
ORDER BY s.created_at DESC
LIMIT 10;

-- 3. Vérifier les déclarations de paliers
SELECT 
  cs.id,
  cs.user_id,
  cs.mission_id,
  cs.tiktok_link,
  cs.views_declared,
  cs.palier,
  cs.status,
  cs.declared_at,
  cs.submission_id,
  p.pseudo as clipper_name,
  m.title as mission_title
FROM clip_submissions cs
LEFT JOIN profiles p ON p.id = cs.user_id
LEFT JOIN missions m ON m.id = cs.mission_id
ORDER BY cs.declared_at DESC
LIMIT 10;

-- 4. Statistiques générales
SELECT 
  'Missions totales' as type,
  COUNT(*) as count
FROM missions
UNION ALL
SELECT 
  'Soumissions totales' as type,
  COUNT(*) as count
FROM submissions
UNION ALL
SELECT 
  'Déclarations paliers totales' as type,
  COUNT(*) as count
FROM clip_submissions
UNION ALL
SELECT 
  'Utilisateurs totaux' as type,
  COUNT(*) as count
FROM profiles;

-- 5. Vérifier si les tables existent et leur structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('missions', 'submissions', 'clip_submissions', 'profiles')
ORDER BY table_name, ordinal_position; 