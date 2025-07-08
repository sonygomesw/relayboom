-- 🚨 DIAGNOSTIC URGENT : Problème insertion submissions
-- À exécuter dans Supabase SQL Editor pour identifier le blocage

-- ==========================================
-- 1. VÉRIFIER LA STRUCTURE ACTUELLE
-- ==========================================

SELECT 
  'STRUCTURE_SUBMISSIONS' as test_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'submissions'
ORDER BY ordinal_position;

-- ==========================================
-- 2. VÉRIFIER LES CONTRAINTES FK
-- ==========================================

SELECT 
  'CONTRAINTES_FK' as test_type,
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS referenced_table,
  ccu.column_name AS referenced_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'submissions';

-- ==========================================
-- 3. VÉRIFIER LES POLITIQUES RLS
-- ==========================================

SELECT 
  'POLITIQUES_RLS' as test_type,
  policyname,
  cmd as action,
  qual as condition,
  with_check
FROM pg_policies 
WHERE tablename = 'submissions';

-- ==========================================
-- 4. TESTER L'INSERTION DIRECTE (SANS RLS)
-- ==========================================

-- Désactiver temporairement RLS pour tester
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;

-- Test d'insertion simple
INSERT INTO submissions (
  user_id,
  mission_id,
  tiktok_url,
  description,
  status,
  submission_type,
  views_count,
  created_at
) VALUES (
  gen_random_uuid(),  -- user_id temporaire
  gen_random_uuid(),  -- mission_id temporaire (UUID valide)
  'https://tiktok.com/@test/video/diagnostic',
  'Test diagnostic insertion',
  'pending',
  'url',
  0,
  now()
) RETURNING id, mission_id, created_at;

-- Compter les résultats
SELECT COUNT(*) as insertion_reussie 
FROM submissions 
WHERE description = 'Test diagnostic insertion';

-- Supprimer le test
DELETE FROM submissions 
WHERE description = 'Test diagnostic insertion';

-- ==========================================
-- 5. TESTER AVEC RLS ACTIVÉ
-- ==========================================

-- Réactiver RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Tester avec un user_id réel (remplacer par un vrai UUID d'un utilisateur existant)
-- ⚠️ ATTENTION : Remplacer 'VOTRE_USER_ID_REEL' par un vrai UUID utilisateur

-- Commenter cette partie si pas d'utilisateur réel disponible
/*
INSERT INTO submissions (
  user_id,
  mission_id,
  tiktok_url,
  description,
  status,
  submission_type,
  views_count,
  created_at
) VALUES (
  'VOTRE_USER_ID_REEL',  -- ⚠️ À remplacer
  gen_random_uuid(),
  'https://tiktok.com/@test/video/rls-test',
  'Test RLS insertion',
  'pending',
  'url',
  0,
  now()
) RETURNING id, mission_id, created_at;
*/

-- ==========================================
-- 6. ANALYSER LES PERFORMANCES
-- ==========================================

-- Vérifier les locks en cours
SELECT 
  'LOCKS_ACTIFS' as test_type,
  pid,
  locktype,
  mode,
  granted,
  query
FROM pg_locks pl
JOIN pg_stat_activity psa ON pl.pid = psa.pid
WHERE psa.query LIKE '%submissions%'
AND psa.state = 'active';

-- Statistiques table submissions
SELECT 
  'STATS_TABLE' as test_type,
  schemaname,
  tablename,
  n_tup_ins as insertions_totales,
  n_tup_upd as updates_totales,
  n_tup_del as deletions_totales,
  n_live_tup as lignes_actuelles,
  n_dead_tup as lignes_mortes,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables 
WHERE tablename = 'submissions';

-- ==========================================
-- 7. RECOMMANDATIONS BASÉES SUR LES RÉSULTATS
-- ==========================================

SELECT 
  'RECOMMANDATIONS' as test_type,
  'Si insertion sans RLS fonctionne → Problème RLS auth.uid()' as diagnostic_1,
  'Si insertion sans RLS bloque → Problème contrainte FK ou lock' as diagnostic_2,
  'Si locks présents → Problème concurrent d''accès' as diagnostic_3,
  'Vérifier que auth.uid() retourne bien une valeur' as solution_1,
  'Supprimer contrainte FK sur mission_id si présente' as solution_2,
  'Optimiser politiques RLS pour éviter timeouts' as solution_3; 