-- Script pour corriger la relation créateur ⟷ missions
-- RelayBoom Database Fix

-- 1. Ajouter la colonne creator_id à la table missions
ALTER TABLE missions 
ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Mettre à jour les missions existantes avec un créateur par défaut
-- (Pour les 3 missions existantes, on les attribue au premier utilisateur créateur)
UPDATE missions 
SET creator_id = (
  SELECT id FROM profiles 
  WHERE role = 'creator' 
  LIMIT 1
)
WHERE creator_id IS NULL;

-- 3. Ajouter un index pour optimiser les requêtes par créateur
CREATE INDEX IF NOT EXISTS idx_missions_creator_id ON missions(creator_id);

-- 4. Ajouter une contrainte pour s'assurer que creator_id est toujours défini
-- (Optionnel : décommentez si vous voulez rendre creator_id obligatoire)
-- ALTER TABLE missions ALTER COLUMN creator_id SET NOT NULL;

-- 5. Politique RLS mise à jour pour permettre aux créateurs de voir leurs missions
DROP POLICY IF EXISTS "missions_select_creator_policy" ON missions;
CREATE POLICY "missions_select_creator_policy" ON missions
FOR SELECT USING (
  -- Tout le monde peut voir les missions actives
  status = 'active' OR 
  -- Les créateurs peuvent voir leurs propres missions
  auth.uid() = creator_id
);

-- 6. Politique pour que les créateurs puissent modifier leurs propres missions
DROP POLICY IF EXISTS "missions_update_creator_policy" ON missions;
CREATE POLICY "missions_update_creator_policy" ON missions
FOR UPDATE USING (auth.uid() = creator_id);

-- 7. Politique pour que les créateurs puissent supprimer leurs propres missions
DROP POLICY IF EXISTS "missions_delete_creator_policy" ON missions;
CREATE POLICY "missions_delete_creator_policy" ON missions
FOR DELETE USING (auth.uid() = creator_id);

-- 8. Mettre à jour la politique d'insertion pour utiliser creator_id
DROP POLICY IF EXISTS "missions_insert_policy" ON missions;
CREATE POLICY "missions_insert_policy" ON missions
FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Commentaire pour documentation
COMMENT ON COLUMN missions.creator_id IS 'ID de l''utilisateur créateur (référence à auth.users.id)';

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Relation créateur ⟷ missions configurée ✅';
    RAISE NOTICE 'Les créateurs peuvent maintenant gérer leurs propres missions';
END
$$; 