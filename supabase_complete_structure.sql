-- Script minimal pour compléter la structure de la base de données RelayBoom
-- Ajoute seulement les colonnes manquantes

-- 1. Ajouter creator_id pour lier les missions aux créateurs
ALTER TABLE missions 
ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Ajouter la colonne featured pour les missions mises en avant
ALTER TABLE missions 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- 3. Mettre à jour les missions existantes avec un créateur par défaut
UPDATE missions 
SET creator_id = (
  SELECT id FROM profiles 
  WHERE role = 'creator' 
  LIMIT 1
)
WHERE creator_id IS NULL;

-- 4. Index pour optimiser les requêtes par créateur
CREATE INDEX IF NOT EXISTS idx_missions_creator_id ON missions(creator_id);

-- 5. Politiques RLS mises à jour
DROP POLICY IF EXISTS "missions_select_policy" ON missions;
CREATE POLICY "missions_select_policy" ON missions
FOR SELECT USING (
  status = 'active' OR 
  auth.uid() = creator_id
);

DROP POLICY IF EXISTS "missions_insert_policy" ON missions;
CREATE POLICY "missions_insert_policy" ON missions
FOR INSERT WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "missions_update_policy" ON missions;
CREATE POLICY "missions_update_policy" ON missions
FOR UPDATE USING (auth.uid() = creator_id);

-- 6. Politique pour la suppression
DROP POLICY IF EXISTS "missions_delete_policy" ON missions;
CREATE POLICY "missions_delete_policy" ON missions
FOR DELETE USING (auth.uid() = creator_id);

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Structure de la base de données complétée ✅';
    RAISE NOTICE 'Relations créateur ⟷ missions configurées';
END
$$; 