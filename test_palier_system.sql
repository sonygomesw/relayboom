-- Script de test pour le système de paliers RelayBoom
-- À exécuter dans Supabase SQL Editor pour vérifier que tout fonctionne

-- 1. Vérifier que la table clip_submissions existe
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'clip_submissions'
ORDER BY ordinal_position;

-- 2. Vérifier les policies RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'clip_submissions';

-- 3. Test flow complet (simulé)
-- Supposons qu'on ait un user_id = 'test-user-123' et mission_id = 'test-mission-456'

-- Créer une soumission de clip test (si pas déjà existante)
INSERT INTO submissions (id, user_id, mission_id, tiktok_url, status, views_count, created_at)
VALUES (
  'test-submission-789',
  'test-user-123', 
  'test-mission-456',
  'https://tiktok.com/@test/video/123456',
  'pending',
  0,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Le clippeur déclare un palier de 10K vues
INSERT INTO clip_submissions (
  user_id,
  mission_id, 
  submission_id,
  tiktok_link,
  views_declared,
  palier,
  status
) VALUES (
  'test-user-123',
  'test-mission-456',
  'test-submission-789', 
  'https://tiktok.com/@test/video/123456',
  10000,
  10000,
  'pending'
) ON CONFLICT DO NOTHING;

-- 4. Vérifier l'insertion
SELECT 
  cs.*,
  s.status as clip_status,
  s.views_count as clip_views
FROM clip_submissions cs
LEFT JOIN submissions s ON s.id = cs.submission_id
WHERE cs.submission_id = 'test-submission-789';

-- 5. Simuler l'approbation admin
UPDATE clip_submissions 
SET status = 'approved' 
WHERE submission_id = 'test-submission-789';

-- Mettre à jour le clip original (comme fait par l'admin)
UPDATE submissions 
SET 
  status = 'approved',
  views_count = (
    SELECT views_declared 
    FROM clip_submissions 
    WHERE submission_id = 'test-submission-789' 
    AND status = 'approved'
    LIMIT 1
  )
WHERE id = 'test-submission-789';

-- 6. Vérifier le résultat final
SELECT 
  'FINAL RESULT' as test_step,
  cs.id as submission_palier_id,
  cs.status as palier_status,
  cs.views_declared,
  cs.palier,
  s.id as clip_id,
  s.status as clip_status,
  s.views_count as clip_views,
  CASE 
    WHEN cs.status = 'approved' AND s.status = 'approved' AND s.views_count = cs.views_declared 
    THEN '✅ SUCCÈS'
    ELSE '❌ ÉCHEC'
  END as test_result
FROM clip_submissions cs
LEFT JOIN submissions s ON s.id = cs.submission_id
WHERE cs.submission_id = 'test-submission-789';

-- 7. Calcul des gains (simulation)
SELECT 
  'EARNINGS CALCULATION' as test_step,
  s.views_count,
  m.price_per_1k_views,
  ROUND((s.views_count / 1000.0) * m.price_per_1k_views, 2) as calculated_earnings
FROM submissions s
LEFT JOIN missions m ON m.id = s.mission_id  
WHERE s.id = 'test-submission-789';

-- 8. Nettoyage (optionnel - décommenter pour nettoyer)
-- DELETE FROM clip_submissions WHERE submission_id = 'test-submission-789';
-- DELETE FROM submissions WHERE id = 'test-submission-789';

-- 9. Vue pour les admins - toutes les validations en attente
SELECT 
  'ADMIN VIEW - PENDING VALIDATIONS' as view_name,
  cs.id,
  cs.palier,
  cs.views_declared,
  cs.created_at,
  m.title as mission_title,
  m.price_per_1k_views,
  p.pseudo as clipper_name,
  ROUND((cs.views_declared / 1000.0) * m.price_per_1k_views, 2) as potential_earnings
FROM clip_submissions cs
LEFT JOIN submissions s ON s.id = cs.submission_id
LEFT JOIN missions m ON m.id = cs.mission_id
LEFT JOIN profiles p ON p.id = cs.user_id
WHERE cs.status = 'pending'
ORDER BY cs.created_at DESC;

-- 10. Vue pour clippeurs - leurs revenus
SELECT 
  'CLIPPER VIEW - APPROVED EARNINGS' as view_name,
  p.pseudo as clipper_name,
  COUNT(*) as approved_clips,
  SUM(s.views_count) as total_views,
  SUM(ROUND((s.views_count / 1000.0) * m.price_per_1k_views, 2)) as total_earnings
FROM submissions s
LEFT JOIN missions m ON m.id = s.mission_id
LEFT JOIN profiles p ON p.id = s.user_id
WHERE s.status = 'approved'
GROUP BY p.id, p.pseudo
ORDER BY total_earnings DESC; 