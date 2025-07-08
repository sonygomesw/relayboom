-- 🔍 DIAGNOSTIC RAPIDE : État actuel de la table submissions
-- À exécuter AVANT le script de fix

-- ==========================================
-- 1. VÉRIFIER LES POLITIQUES RLS ACTUELLES
-- ==========================================

SELECT 
    'POLITIQUES_ACTUELLES' as check_type,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'submissions'
ORDER BY cmd, policyname;

-- ==========================================
-- 2. VÉRIFIER LES CONTRAINTES ACTUELLES
-- ==========================================

SELECT 
    'CONTRAINTES_ACTUELLES' as check_type,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'submissions'
ORDER BY tc.constraint_type, kcu.column_name;

-- ==========================================
-- 3. VÉRIFIER LA STRUCTURE DE LA TABLE
-- ==========================================

SELECT 
    'STRUCTURE_TABLE' as check_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'submissions'
ORDER BY ordinal_position;

-- ==========================================
-- 4. VÉRIFIER LES INDEX EXISTANTS
-- ==========================================

SELECT 
    'INDEX_EXISTANTS' as check_type,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'submissions'
ORDER BY indexname;

-- ==========================================
-- 5. COMPTER LES DONNÉES EXISTANTES
-- ==========================================

SELECT 
    'DONNEES_EXISTANTES' as check_type,
    COUNT(*) as total_submissions,
    COUNT(DISTINCT user_id) as utilisateurs_uniques,
    COUNT(DISTINCT mission_id) as missions_uniques,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
FROM submissions;

-- ==========================================
-- 6. TESTER UNE INSERTION SIMPLE
-- ==========================================

-- Test d'insertion avec timeout
DO $$
DECLARE
    test_user_id uuid;
    start_time timestamp;
    end_time timestamp;
    duration_ms integer;
BEGIN
    -- Récupérer un utilisateur existant
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        start_time := clock_timestamp();
        
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
            'https://tiktok.com/@test/video/diagnostic-test',
            'Test diagnostic performance',
            'pending',
            'url',
            0
        );
        
        end_time := clock_timestamp();
        duration_ms := EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
        
        RAISE NOTICE 'TEST_INSERTION_SUCCESS: Durée = %ms', duration_ms;
        
        -- Nettoyer le test
        DELETE FROM submissions WHERE tiktok_url = 'https://tiktok.com/@test/video/diagnostic-test';
        
    ELSE
        RAISE NOTICE 'TEST_INSERTION_FAILED: Aucun utilisateur trouvé';
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'TEST_INSERTION_ERROR: %', SQLERRM;
END $$; 