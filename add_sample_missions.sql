-- ===============================================
-- 🎯 AJOUT DE MISSIONS D'EXEMPLE
-- ===============================================

-- Insérer des missions d'exemple pour les clippers
INSERT INTO missions (
  id,
  title,
  description,
  creator_name,
  creator_thumbnail,
  video_url,
  price_per_1k_views,
  status,
  is_featured,
  category,
  created_at
) VALUES 
-- Mission MrBeast
(
  gen_random_uuid(),
  'Clips MrBeast - Défis Extrêmes',
  'Créez des clips viraux à partir des dernières vidéos de MrBeast. Concentrez-vous sur les moments les plus fous et les réactions les plus intenses !',
  'MrBeast',
  '/mrbeast.jpg',
  'https://www.youtube.com/watch?v=example1',
  8.50,
  'active',
  true,
  'Divertissement',
  NOW()
),
-- Mission Speed
(
  gen_random_uuid(),
  'Speed Gaming Moments',
  'Clippez les meilleurs moments gaming de Speed ! Rage, victoires épiques, fails - tout ce qui peut devenir viral sur TikTok.',
  'IShowSpeed',
  '/speedfan.jpg',
  'https://www.youtube.com/watch?v=example2',
  7.00,
  'active',
  true,
  'Gaming',
  NOW()
),
-- Mission Kai Cenat
(
  gen_random_uuid(),
  'Kai Cenat Stream Highlights',
  'Transformez les moments les plus drôles des streams de Kai Cenat en clips TikTok. Réactions, interactions avec le chat, moments spontanés !',
  'Kai Cenat',
  '/kaicenatfan.jpg',
  'https://www.twitch.tv/kaicenat',
  9.00,
  'active',
  false,
  'Streaming',
  NOW()
),
-- Mission Drake
(
  gen_random_uuid(),
  'Drake - Behind the Scenes',
  'Créez des clips à partir du contenu exclusif de Drake. Studio sessions, lifestyle, collaborations - montrez le côté authentique !',
  'Drake',
  '/drakefan.jpg',
  'https://www.instagram.com/champagnepapi',
  12.00,
  'active',
  true,
  'Musique',
  NOW()
),
-- Mission Tate
(
  gen_random_uuid(),
  'Andrew Tate - Success Mindset',
  'Clippez les meilleurs conseils business et mindset d''Andrew Tate. Motivation, success stories, lifestyle entrepreneurial.',
  'Andrew Tate',
  '/tatefan.jpg',
  'https://www.youtube.com/watch?v=example3',
  6.50,
  'active',
  false,
  'Business',
  NOW()
),
-- Mission Travis Scott
(
  gen_random_uuid(),
  'Travis Scott - Concert Vibes',
  'Capturez l''énergie des performances de Travis Scott ! Concerts, studio, collaborations - créez des clips qui transmettent l''émotion.',
  'Travis Scott',
  '/traviscottfan.jpg',
  'https://www.youtube.com/watch?v=example4',
  10.00,
  'active',
  true,
  'Musique',
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Vérifier que les missions ont été ajoutées
SELECT 
  title,
  creator_name,
  price_per_1k_views,
  status,
  category
FROM missions 
WHERE status = 'active'
ORDER BY created_at DESC; 