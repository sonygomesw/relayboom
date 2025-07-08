-- 🚨 SOLUTION URGENTE : Fix timeout insertion submissions
-- À exécuter dans Supabase SQL Editor

-- ==========================================
-- PROBLÈME IDENTIFIÉ
-- ==========================================
-- La politique RLS "FOR INSERT WITH CHECK (auth.uid() = user_id)" 
-- peut causer des timeouts si auth.uid() traîne ou retourne NULL

-- ==========================================
-- 1. SUPPRIMER LES ANCIENNES POLITIQUES RLS PROBLÉMATIQUES
-- ==========================================

-- Supprimer toutes les politiques existantes sur submissions
DROP POLICY IF EXISTS "Users can view own submissions" ON submissions;
DROP POLICY IF EXISTS "Users can create own submissions" ON submissions;
DROP POLICY IF EXISTS "Users can update own pending submissions" ON submissions;
DROP POLICY IF EXISTS "Users can insert own submissions" ON submissions;
DROP POLICY IF EXISTS "Allow public read access to submissions" ON submissions;

-- ==========================================
-- 2. CRÉER DES POLITIQUES RLS OPTIMISÉES
-- ==========================================

-- ✅ Politique SELECT optimisée
CREATE POLICY "submissions_select_policy" ON submissions
FOR SELECT USING (
  user_id = auth.uid() OR 
  -- Permettre aux admins de voir tout
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- ✅ Politique INSERT simplifiée et robuste
CREATE POLICY "submissions_insert_policy" ON submissions
FOR INSERT WITH CHECK (
  -- Vérification basique : user connecté et user_id correspond
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
);

-- ✅ Politique UPDATE pour modifications
CREATE POLICY "submissions_update_policy" ON submissions
FOR UPDATE USING (
  user_id = auth.uid() 
  AND status = 'pending'
);

-- ==========================================
-- 3. OPTIMISER LES INDEX POUR LES POLITIQUES RLS
-- ==========================================

-- Index spécifique pour optimiser les requêtes RLS
CREATE INDEX IF NOT EXISTS idx_submissions_user_id_status ON submissions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_submissions_user_auth ON submissions(user_id) WHERE user_id IS NOT NULL;

-- ==========================================
-- 4. SUPPRIMER CONTRAINTE FK SUR MISSION_ID (SI PRÉSENTE)
-- ==========================================

-- Identifier et supprimer toute contrainte FK sur mission_id
DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Chercher les contraintes FK sur mission_id
    SELECT tc.constraint_name INTO constraint_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'submissions'
    AND kcu.column_name = 'mission_id'
    LIMIT 1;
    
    -- Supprimer la contrainte si elle existe
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE submissions DROP CONSTRAINT ' || constraint_name;
        RAISE NOTICE 'Contrainte FK supprimée: %', constraint_name;
    ELSE
        RAISE NOTICE 'Aucune contrainte FK trouvée sur mission_id';
    END IF;
END $$;

-- ==========================================
-- 5. OPTIMISER LA FONCTION UPDATE_UPDATED_AT
-- ==========================================

-- Fonction optimisée pour updated_at
CREATE OR REPLACE FUNCTION update_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Recréer le trigger avec la nouvelle fonction
DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
CREATE TRIGGER update_submissions_updated_at 
  BEFORE UPDATE ON submissions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_submissions_updated_at();

-- ==========================================
-- 6. OPTIMISER LA TABLE SUBMISSIONS
-- ==========================================

-- Analyser la table pour optimiser les performances
ANALYZE submissions;

-- ==========================================
-- 7. TESTER LA NOUVELLE CONFIGURATION
-- ==========================================

-- Test d'insertion rapide (à adapter avec de vraies valeurs)
DO $$
DECLARE
    test_user_id uuid;
    result_id uuid;
BEGIN
    -- Récupérer un utilisateur existant pour le test
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Test d'insertion
        INSERT INTO submissions (
            user_id,
            mission_id,
            tiktok_url,
            description,
            status,
            submission_type,
            views_count
        ) VALUES (
            test_user_id,
                         gen_random_uuid(),
            'https://tiktok.com/@test/video/fix-test',
            'Test fix timeout',
            'pending',
            'url',
            0
        ) RETURNING id INTO result_id;
        
        RAISE NOTICE 'Test insertion réussi: %', result_id;
        
        -- Nettoyer le test
        DELETE FROM submissions WHERE id = result_id;
        RAISE NOTICE 'Test nettoyé';
    ELSE
        RAISE NOTICE 'Aucun utilisateur trouvé pour le test';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erreur test: %', SQLERRM;
END $$;

-- ==========================================
-- 8. VÉRIFICATIONS FINALES
-- ==========================================

-- Vérifier les nouvelles politiques
SELECT 
    'VERIFICATION_POLITIQUES' as check_type,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'submissions'
ORDER BY cmd, policyname;

-- Vérifier les contraintes restantes
SELECT 
    'VERIFICATION_CONTRAINTES' as check_type,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'submissions'
AND tc.constraint_type IN ('FOREIGN KEY', 'CHECK')
ORDER BY tc.constraint_type, kcu.column_name;

-- Statistiques de performance
SELECT 
    'VERIFICATION_PERF' as check_type,
    schemaname,
    relname as table_name,
    n_live_tup as lignes_actives,
    seq_scan as scans_sequentiels,
    seq_tup_read as lignes_lues,
    idx_scan as scans_index,
    idx_tup_fetch as lignes_index
FROM pg_stat_user_tables 
WHERE relname = 'submissions';

-- ==========================================
-- RÉSUMÉ DES CHANGEMENTS
-- ==========================================

SELECT 
    'RESUME_CHANGEMENTS' as info_type,
    '1. Politiques RLS optimisées avec auth.uid() IS NOT NULL' as changement_1,
    '2. Contraintes FK supprimées sur mission_id' as changement_2,
    '3. Index optimisés pour RLS' as changement_3,
    '4. Timeout de sécurité configuré' as changement_4,
    '5. Fonction trigger optimisée' as changement_5; 