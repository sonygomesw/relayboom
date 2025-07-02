-- Fix Row Level Security pour la table missions
-- Permet aux créateurs d'insérer leurs propres missions

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can insert own missions" ON missions;
DROP POLICY IF EXISTS "Users can view own missions" ON missions;
DROP POLICY IF EXISTS "Users can update own missions" ON missions;
DROP POLICY IF EXISTS "Creators can insert missions" ON missions;
DROP POLICY IF EXISTS "Creators can manage own missions" ON missions;

-- S'assurer que RLS est activé
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux créateurs d'insérer leurs propres missions
CREATE POLICY "Creators can insert missions" ON missions
    FOR INSERT WITH CHECK (
        auth.uid() = creator_id::uuid
    );

-- Politique pour permettre aux créateurs de voir leurs propres missions
CREATE POLICY "Creators can view own missions" ON missions
    FOR SELECT USING (
        auth.uid() = creator_id::uuid OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    );

-- Politique pour permettre aux créateurs de modifier leurs propres missions
CREATE POLICY "Creators can update own missions" ON missions
    FOR UPDATE USING (
        auth.uid() = creator_id::uuid
    );

-- Politique pour permettre aux créateurs de supprimer leurs propres missions
CREATE POLICY "Creators can delete own missions" ON missions
    FOR DELETE USING (
        auth.uid() = creator_id::uuid
    );

-- Vérifier la structure de la table missions
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'missions' 
ORDER BY ordinal_position;

-- Afficher les politiques actuelles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'missions'; 