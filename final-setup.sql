-- Script final pour RelayBoom - Données d'exemple et configuration complète
-- Exécutez ce script dans Supabase SQL Editor

-- 1. S'assurer que la structure est complète
ALTER TABLE missions 
ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS total_budget INTEGER DEFAULT 1000,
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'UGC',
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Divertissement';

-- 2. Vider et recréer les missions d'exemple
TRUNCATE TABLE submissions, missions CASCADE;

-- 3. Insérer 5 missions d'exemple complètes
INSERT INTO missions (
  title, description, creator_name, creator_image, creator_thumbnail, 
  price_per_1k_views, total_budget, status, featured, content_type, category
) VALUES
(
  'MrBeast Challenge Viral',
  'Clippe les moments les plus fous des challenges MrBeast ! Focus sur les réactions authentiques, les twists inattendus, les moments de tension. Le contenu qui explose sur TikTok !',
  'MrBeast',
  '/mrbeast.jpg',
  '/mrbeast.jpg',
  0.12,
  5000,
  'active',
  true,
  'UGC',
  'Divertissement'
),
(
  'Speed Gaming Reactions',
  'Capture les meilleures réactions gaming de Speed ! Ses explosions de joie, de rage, ses moments de skill - tout ce qui fait vibrer sa communauté. Plus c''est authentique et intense, plus ça paye !',
  'Speed',
  '/speedfan.jpg',
  '/speedfan.jpg',
  0.10,
  3000,
  'active',
  true,
  'UGC',
  'Divertissement'
),
(
  'Kai Cenat Best Moments',
  'Filme les moments les plus épiques de Kai Cenat ! Ses réactions face au contenu viral, ses interactions avec le chat, ses collaborations. Capture cette énergie pure qui fait de lui le roi de Twitch.',
  'Kai Cenat',
  '/kaicenatfan.jpg',
  '/kaicenatfan.jpg',
  0.09,
  2500,
  'active',
  false,
  'UGC',
  'Divertissement'
),
(
  'Drake Moments Iconiques',
  'Les moments les plus mémorables de Drake ! Concerts, interviews, réactions spontanées. Contenu premium pour une audience massive.',
  'Drake',
  '/drakefan.jpg',
  '/drakefan.jpg',
  0.15,
  4000,
  'active',
  true,
  'Découpage de vidéos',
  'Musique'
),
(
  'Andrew Tate Clips Viraux',
  'Moments marquants et déclarations percutantes d''Andrew Tate. Contenu à fort engagement pour audience mature.',
  'Andrew Tate',
  '/tatefan.jpg',
  '/tatefan.jpg',
  0.08,
  2000,
  'active',
  false,
  'UGC',
  'Divertissement'
);

-- 4. Créer un utilisateur créateur de test (si pas déjà fait)
-- Note: Ceci sera fait manuellement via l'interface

-- 5. Politiques RLS finales
DROP POLICY IF EXISTS "missions_select_policy" ON missions;
CREATE POLICY "missions_select_policy" ON missions
FOR SELECT USING (
  status = 'active' OR 
  auth.uid() = creator_id
);

DROP POLICY IF EXISTS "missions_insert_policy" ON missions;
CREATE POLICY "missions_insert_policy" ON missions
FOR INSERT WITH CHECK (auth.uid() = creator_id OR auth.uid() IS NOT NULL);

-- 6. Ajouter quelques soumissions d'exemple
INSERT INTO submissions (mission_id, tiktok_url, views_count, status, description, user_id)
SELECT 
  m.id,
  'https://tiktok.com/@exemple/video/' || floor(random() * 1000000 + 1000000),
  floor(random() * 100000 + 10000),
  CASE 
    WHEN random() < 0.3 THEN 'pending'
    WHEN random() < 0.7 THEN 'approved' 
    ELSE 'paid'
  END,
  'Clip viral de ' || m.creator_name || ' - Moment épique !',
  (SELECT id FROM profiles WHERE role = 'clipper' LIMIT 1)
FROM missions m
WHERE EXISTS (SELECT 1 FROM profiles WHERE role = 'clipper')
LIMIT 15;

-- 7. Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '🎉 RelayBoom configuré avec succès !';
    RAISE NOTICE '✅ 5 missions d''exemple créées';
    RAISE NOTICE '✅ Soumissions d''exemple ajoutées';
    RAISE NOTICE '✅ Politiques de sécurité configurées';
    RAISE NOTICE '🚀 Votre plateforme est prête !';
END
$$; 