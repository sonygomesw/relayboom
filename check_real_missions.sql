-- ===============================================
-- 🔍 VÉRIFICATION DES MISSIONS RÉELLES
-- ===============================================
-- Ce script vérifie quelles missions existent vraiment dans la base de données

-- 1. Vérifier la structure actuelle de la table missions
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'missions' 
ORDER BY ordinal_position;

-- 2. Lister toutes les missions existantes
SELECT 
  id,
  title,
  creator_name,
  creator_image,
  price_per_1k_views,
  total_budget,
  status,
  category,
  created_at
FROM missions 
ORDER BY created_at DESC;

-- 3. Compter les missions par statut
SELECT 
  status,
  COUNT(*) as count
FROM missions 
GROUP BY status;

-- 4. Vérifier les missions actives avec leurs détails
SELECT 
  id,
  title,
  creator_name,
  description,
  creator_image,
  price_per_1k_views,
  total_budget,
  status
FROM missions 
WHERE status = 'active'
ORDER BY created_at DESC;

-- 5. Nettoyer et recréer les missions de base si nécessaire
-- (Décommentez cette section si vous voulez repartir à zéro)

/*
-- Supprimer toutes les missions existantes
TRUNCATE TABLE submissions CASCADE;
TRUNCATE TABLE missions CASCADE;

-- Recréer les missions de base
INSERT INTO missions (
  id,
  title,
  description,
  creator_name,
  creator_image,
  price_per_1k_views,
  total_budget,
  status,
  category,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'MrBeast - Challenge Viral',
  'Clippez les moments les plus fous des challenges MrBeast ! Focus sur les réactions authentiques, les twists inattendus, les moments de tension pure.',
  'MrBeast',
  '/mrbeast.jpg',
  0.12,
  5000,
  'active',
  'Divertissement',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Speed - Gaming Reactions',
  'Capturez les meilleures réactions gaming de Speed ! Ses explosions de joie, de rage, ses moments de skill pur - tout ce qui fait vibrer sa communauté.',
  'IShowSpeed',
  '/speedfan.jpg',
  0.10,
  3000,
  'active',
  'Divertissement',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Kai Cenat - Stream Highlights',
  'Transformez les moments les plus drôles des streams de Kai Cenat en clips TikTok ! Réactions, interactions avec le chat, moments spontanés.',
  'Kai Cenat',
  '/kaicenatfan.jpg',
  0.09,
  2500,
  'active',
  'Divertissement',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Drake - Moments Iconiques',
  'Les moments les plus mémorables de Drake ! Concerts, interviews, réactions spontanées. Contenu premium pour une audience massive.',
  'Drake',
  '/drakefan.jpg',
  0.15,
  4000,
  'active',
  'Musique',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Andrew Tate - Business Tips',
  'Clippez les meilleurs conseils business et mindset ! Motivation, success stories, tips pratiques pour entrepreneurs.',
  'Andrew Tate',
  '/tatefan.jpg',
  0.08,
  2000,
  'active',
  'Business',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440006',
  'Travis Scott - Concert Vibes',
  'Capturez l\'énergie des performances de Travis Scott ! Concerts, studio, collaborations - créez des clips qui transmettent l\'émotion.',
  'Travis Scott',
  '/traviscottfan.jpg',
  0.11,
  3500,
  'active',
  'Musique',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440007',
  'Central Cee - UK Drill',
  'Moments forts de Central Cee ! Clips musicaux, freestyles, collaborations. Capturez l\'essence du UK drill.',
  'Central Cee',
  '/centralfan.jpg',
  0.09,
  2800,
  'active',
  'Musique',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440008',
  'Keine Musik - Electronic Vibes',
  'Créez des clips des meilleures performances électroniques ! Sets, festivals, moments d\'émotion pure.',
  'Keine Musik',
  '/keinemusikfan.jpg',
  0.07,
  2200,
  'active',
  'Musique',
  NOW()
);
*/

-- 6. Vérifier les missions après insertion
SELECT 
  'Missions vérifiées' as message,
  COUNT(*) as total_missions,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_missions
FROM missions;

-- 7. Afficher les IDs des missions pour debug
SELECT 
  id,
  title,
  creator_name,
  status
FROM missions 
WHERE status = 'active'
ORDER BY title; 