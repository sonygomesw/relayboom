-- Script pour vérifier et corriger les liens TikTok
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier les données actuelles dans clip_submissions
SELECT 
  id,
  user_id,
  mission_id,
  tiktok_link,
  views_declared,
  palier,
  status,
  created_at
FROM clip_submissions
ORDER BY created_at DESC;

-- 2. Compter les liens vides ou invalides
SELECT 
  COUNT(*) as total_submissions,
  COUNT(CASE WHEN tiktok_link IS NULL OR tiktok_link = '' THEN 1 END) as liens_vides,
  COUNT(CASE WHEN tiktok_link LIKE 'https://www.tiktok.com/%' THEN 1 END) as liens_valides
FROM clip_submissions;

-- 3. Mettre à jour les liens TikTok vides avec des liens de test valides
UPDATE clip_submissions 
SET tiktok_link = 'https://www.tiktok.com/@test/video/1234567890'
WHERE tiktok_link IS NULL OR tiktok_link = '' OR tiktok_link = 'https://www.tiktok.com/@test/video/1234567890';

-- 4. Ajouter des liens TikTok plus réalistes pour les tests
UPDATE clip_submissions 
SET tiktok_link = CASE 
  WHEN palier = 1000 THEN 'https://www.tiktok.com/@username/video/7123456789012345678'
  WHEN palier = 5000 THEN 'https://www.tiktok.com/@creator/video/7234567890123456789'
  WHEN palier = 10000 THEN 'https://www.tiktok.com/@viral/video/7345678901234567890'
  ELSE 'https://www.tiktok.com/@test/video/7456789012345678901'
END
WHERE tiktok_link = 'https://www.tiktok.com/@test/video/1234567890';

-- 5. Vérification finale
SELECT 
  id,
  tiktok_link,
  palier,
  status,
  'Lien mis à jour' as message
FROM clip_submissions
ORDER BY created_at DESC; 