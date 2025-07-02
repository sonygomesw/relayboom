-- Diagnostic de l'état actuel de la base de données RelayBoom
-- Exécutez ce script dans Supabase SQL Editor pour voir ce qui existe déjà

-- 1. VÉRIFIER LES TABLES EXISTANTES
SELECT 
  'TABLES EXISTANTES' as diagnostic_step,
  table_name,
  CASE 
    WHEN table_name IN ('profiles', 'missions', 'submissions', 'clip_submissions') 
    THEN '✅ TABLE CORE'
    ELSE '📋 AUTRE TABLE'
  END as importance
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY 
  CASE WHEN table_name IN ('profiles', 'missions', 'submissions', 'clip_submissions') THEN 1 ELSE 2 END,
  table_name;

-- 2. STRUCTURE DE LA TABLE CLIP_SUBMISSIONS
SELECT 
  'STRUCTURE CLIP_SUBMISSIONS' as diagnostic_step,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'clip_submissions'
ORDER BY ordinal_position;

-- 3. POLITIQUES RLS SUR CLIP_SUBMISSIONS
SELECT 
  'POLITIQUES RLS CLIP_SUBMISSIONS' as diagnostic_step,
  policyname,
  cmd as action,
  qual as condition
FROM pg_policies 
WHERE tablename = 'clip_submissions';

-- 4. CONTENU ACTUEL DE CLIP_SUBMISSIONS
SELECT 
  'CONTENU CLIP_SUBMISSIONS' as diagnostic_step,
  COUNT(*) as total_rows,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
  COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count
FROM clip_submissions;

-- 5. STRUCTURE DE LA TABLE SUBMISSIONS
SELECT 
  'STRUCTURE SUBMISSIONS' as diagnostic_step,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'submissions'
ORDER BY ordinal_position;

-- 6. CONTENU ACTUEL DE SUBMISSIONS
SELECT 
  'CONTENU SUBMISSIONS' as diagnostic_step,
  COUNT(*) as total_clips,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_clips,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_clips,
  COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_clips,
  SUM(views_count) as total_views,
  AVG(views_count) as avg_views
FROM submissions;

-- 7. STRUCTURE DE LA TABLE MISSIONS
SELECT 
  'STRUCTURE MISSIONS' as diagnostic_step,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'missions'
AND column_name IN ('id', 'title', 'creator_id', 'price_per_1k_views', 'status', 'total_budget')
ORDER BY ordinal_position;

-- 8. CONTENU ACTUEL DE MISSIONS
SELECT 
  'CONTENU MISSIONS' as diagnostic_step,
  COUNT(*) as total_missions,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_missions,
  AVG(price_per_1k_views) as avg_price_per_1k,
  SUM(total_budget) as total_budget_all_missions
FROM missions;

-- 9. STRUCTURE DE LA TABLE PROFILES
SELECT 
  'STRUCTURE PROFILES' as diagnostic_step,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'profiles'
AND column_name IN ('id', 'pseudo', 'role', 'email')
ORDER BY ordinal_position;

-- 10. CONTENU ACTUEL DE PROFILES
SELECT 
  'CONTENU PROFILES' as diagnostic_step,
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'clipper' THEN 1 END) as clippers,
  COUNT(CASE WHEN role = 'creator' THEN 1 END) as creators,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins
FROM profiles;

-- 11. RELATIONS ENTRE LES TABLES (FOREIGN KEYS)
SELECT 
  'FOREIGN KEYS' as diagnostic_step,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name IN ('missions', 'submissions', 'clip_submissions')
ORDER BY tc.table_name, kcu.column_name;

-- 12. TEST DE COHÉRENCE - SOUMISSIONS AVEC MISSIONS
SELECT 
  'TEST COHÉRENCE MISSIONS ↔ SUBMISSIONS' as diagnostic_step,
  m.title as mission_title,
  COUNT(s.id) as total_submissions,
  COUNT(CASE WHEN s.status = 'approved' THEN 1 END) as approved_submissions,
  SUM(s.views_count) as total_views
FROM missions m
LEFT JOIN submissions s ON s.mission_id = m.id::text
GROUP BY m.id, m.title
ORDER BY total_submissions DESC;

-- 13. TEST DE COHÉRENCE - PALIERS DÉCLARÉS
SELECT 
  'TEST COHÉRENCE CLIP_SUBMISSIONS ↔ SUBMISSIONS' as diagnostic_step,
  cs.palier,
  COUNT(*) as declarations_count,
  AVG(cs.views_declared) as avg_views_declared,
  COUNT(CASE WHEN cs.status = 'pending' THEN 1 END) as pending_validations
FROM clip_submissions cs
LEFT JOIN submissions s ON s.id = cs.submission_id
GROUP BY cs.palier
ORDER BY cs.palier;

-- 14. VUES EXISTANTES
SELECT 
  'VUES EXISTANTES' as diagnostic_step,
  table_name as view_name,
  CASE 
    WHEN table_name LIKE '%earnings%' THEN '💰 REVENUS'
    WHEN table_name LIKE '%admin%' THEN '👨‍💼 ADMIN'
    ELSE '📊 AUTRE'
  END as category
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- 15. RÉSUMÉ GLOBAL
SELECT 
  'RÉSUMÉ GLOBAL' as diagnostic_step,
  (SELECT COUNT(*) FROM profiles WHERE role = 'clipper') as total_clippers,
  (SELECT COUNT(*) FROM missions WHERE status = 'active') as active_missions,
  (SELECT COUNT(*) FROM submissions) as total_submissions,
  (SELECT COUNT(*) FROM clip_submissions WHERE status = 'pending') as pending_paliers,
  (SELECT SUM(views_count) FROM submissions WHERE status = 'approved') as total_approved_views,
  (SELECT 
    SUM((s.views_count / 1000.0) * m.price_per_1k_views) 
    FROM submissions s 
    JOIN missions m ON m.id::text = s.mission_id 
    WHERE s.status = 'approved'
  ) as total_platform_earnings; 