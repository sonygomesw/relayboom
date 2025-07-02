-- Script pour créer et remplir la table missions avec seulement 3 missions propres
-- Speed, Kai Cenat, MrBeast

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Allow read access to all authenticated users" ON missions;
DROP POLICY IF EXISTS "Allow insert for admins only" ON missions;
DROP POLICY IF EXISTS "Allow update for admins only" ON missions;
DROP POLICY IF EXISTS "Allow read access to all" ON missions;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON missions;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON missions;
DROP POLICY IF EXISTS "missions_select_policy" ON missions;
DROP POLICY IF EXISTS "missions_insert_policy" ON missions;
DROP POLICY IF EXISTS "missions_update_policy" ON missions;

-- Ajouter les colonnes manquantes à la table missions existante
ALTER TABLE missions 
ADD COLUMN IF NOT EXISTS creator_image TEXT,
ADD COLUMN IF NOT EXISTS creator_thumbnail TEXT;

-- Rendre video_url nullable car on ne veut pas l'utiliser
ALTER TABLE missions ALTER COLUMN video_url DROP NOT NULL;

-- Vider les tables en respectant les contraintes de clés étrangères
TRUNCATE TABLE submissions, missions CASCADE;

-- Insérer seulement 3 missions propres avec les bonnes colonnes
INSERT INTO missions (title, description, creator_name, creator_image, creator_thumbnail, reward, status, featured) VALUES
('Speed - Gaming Reactions', 'Capture les meilleures réactions gaming de Speed ! Ses explosions de joie, de rage, ses moments de skill - tout ce qui fait vibrer sa communauté. Plus c''est authentique et intense, plus ça paye !', 'Speed', '/speedfan.jpg', '/speedfan.jpg', 0.12, 'active', true),

('Kai Cenat - Best Moments', 'Filme les moments les plus épiques de Kai Cenat ! Ses réactions face au contenu viral, ses interactions avec le chat, ses collaborations. Capture cette énergie pure qui fait de lui le roi de Twitch.', 'Kai Cenat', '/kaicenatfan.jpg', '/kaicenatfan.jpg', 0.09, 'active', false),

('MrBeast - Challenge Viral', 'Clippe les moments les plus fous des challenges MrBeast ! Focus sur les réactions authentiques, les twists inattendus, les moments de tension. Le contenu qui explose sur TikTok !', 'MrBeast', '/mrbeast.jpg', '/mrbeast.jpg', 0.10, 'active', true);

-- Activer RLS (Row Level Security)
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture à tous
CREATE POLICY "missions_select_policy" ON missions
FOR SELECT USING (true);

-- Politique pour permettre l'insertion aux utilisateurs authentifiés
CREATE POLICY "missions_insert_policy" ON missions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "missions_update_policy" ON missions
FOR UPDATE USING (auth.uid() IS NOT NULL); 