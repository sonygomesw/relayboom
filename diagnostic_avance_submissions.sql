-- 🚨 DIAGNOSTIC AVANCÉ : Pourquoi l'insertion traîne encore
-- À exécuter dans Supabase SQL Editor

-- ==========================================
-- 1. VÉRIFIER LES POLITIQUES ACTUELLES
-- ==========================================

SELECT 
    '1_POLITIQUES_ACTUELLES' as etape,
    policyname,
    cmd,
    CASE 
        WHEN qual IS NULL THEN 'NULL (utilise with_check)'
        ELSE qual
    END as condition,
    CASE 
        WHEN with_check IS NULL THEN 'NULL'
        ELSE with_check
    END as with_check_condition
FROM pg_policies 
WHERE tablename = 'submissions'
ORDER BY cmd, policyname;

-- ==========================================
-- 2. TESTER AUTH.UID() DIRECTEMENT
-- ==========================================

SELECT 
    '2_TEST_AUTH_UID' as etape,
    auth.uid() as current_user_id,
    CASE 
        WHEN auth.uid() IS NULL THEN 'PROBLÈME: auth.uid() est NULL'
        ELSE 'OK: auth.uid() fonctionne'
    END as diagnostic;

-- ==========================================
-- 3. VÉRIFIER LA PERFORMANCE DES POLITIQUES RLS
-- ==========================================

-- Test de performance : SELECT avec RLS
EXPLAIN (ANALYZE, BUFFERS) 
SELECT COUNT(*) 
FROM submissions 
WHERE user_id = auth.uid();

-- ==========================================
-- 4. TESTER INSERTION SIMPLE SANS RLS
-- ==========================================

-- Désactiver temporairement RLS
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;

-- Test insertion rapide
DO $$
DECLARE
    start_time timestamp;
    end_time timestamp;
    duration interval;
    result_id uuid;
BEGIN
    start_time := clock_timestamp();
    
    INSERT INTO submissions (
        user_id,
        mission_id,
        tiktok_url,
        description,
        status,
        submission_type,
        views_count
    ) VALUES (
        gen_random_uuid(),
        gen_random_uuid(),
        'https://tiktok.com/@test/diagnostic-avance',
        'Test sans RLS',
        'pending',
        'url',
        0
    ) RETURNING id INTO result_id;
    
    end_time := clock_timestamp();
    duration := end_time - start_time;
    
    RAISE NOTICE '3_TEST_SANS_RLS: Insertion réussie en % (ID: %)', duration, result_id;
    
    -- Nettoyer
    DELETE FROM submissions WHERE id = result_id;
    RAISE NOTICE '3_TEST_SANS_RLS: Test nettoyé';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '3_TEST_SANS_RLS: ERREUR - %', SQLERRM;
END $$;

-- ==========================================
-- 5. RÉACTIVER RLS ET TESTER AVEC USER RÉEL
-- ==========================================

-- Réactiver RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Test avec un vrai utilisateur
DO $$
DECLARE
    start_time timestamp;
    end_time timestamp;
    duration interval;
    test_user_id uuid;
    result_id uuid;
BEGIN
    -- Récupérer un utilisateur réel
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE '4_TEST_AVEC_RLS: PROBLÈME - Aucun utilisateur trouvé dans auth.users';
        RETURN;
    END IF;
    
    start_time := clock_timestamp();
    
    -- Test insertion avec RLS
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
        'https://tiktok.com/@test/diagnostic-rls',
        'Test avec RLS',
        'pending',
        'url',
        0
    ) RETURNING id INTO result_id;
    
    end_time := clock_timestamp();
    duration := end_time - start_time;
    
    RAISE NOTICE '4_TEST_AVEC_RLS: Insertion réussie en % (ID: %)', duration, result_id;
    
    -- Nettoyer
    DELETE FROM submissions WHERE id = result_id;
    RAISE NOTICE '4_TEST_AVEC_RLS: Test nettoyé';
    
EXCEPTION
    WHEN OTHERS THEN
        end_time := clock_timestamp();
        duration := end_time - start_time;
        RAISE NOTICE '4_TEST_AVEC_RLS: ERREUR après % - %', duration, SQLERRM;
END $$;

-- ==========================================
-- 6. ANALYSER LES CONTRAINTES RESTANTES
-- ==========================================

SELECT 
    '5_CONTRAINTES_RESTANTES' as etape,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    COALESCE(ccu.table_name, 'N/A') as referenced_table,
    COALESCE(ccu.column_name, 'N/A') as referenced_column
FROM information_schema.table_constraints AS tc
LEFT JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'submissions'
AND tc.constraint_type IN ('FOREIGN KEY', 'CHECK', 'UNIQUE')
ORDER BY tc.constraint_type, kcu.column_name;

-- ==========================================
-- 7. VÉRIFIER LES TRIGGERS ACTIFS
-- ==========================================

SELECT 
    '6_TRIGGERS_ACTIFS' as etape,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'submissions'
ORDER BY trigger_name;

-- ==========================================
-- 8. ANALYSER LA PERFORMANCE DE LA TABLE
-- ==========================================

SELECT 
    '7_PERFORMANCE_TABLE' as etape,
    schemaname,
    relname as table_name,
    n_live_tup as lignes_vivantes,
    n_dead_tup as lignes_mortes,
    ROUND((n_dead_tup::float / GREATEST(n_live_tup, 1) * 100)::numeric, 2) as pourcentage_mort,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables 
WHERE relname = 'submissions';

-- ==========================================
-- 9. DIAGNOSTIC FINAL ET RECOMMANDATIONS
-- ==========================================

SELECT 
    '8_DIAGNOSTIC_FINAL' as etape,
    'Vérifiez les NOTICES ci-dessus pour identifier le goulot d''étranglement' as instruction_1,
    'Si TEST_SANS_RLS est rapide mais TEST_AVEC_RLS lent → Problème RLS' as diagnostic_1,
    'Si les deux sont lents → Problème contrainte/trigger/table' as diagnostic_2,
    'Si auth.uid() est NULL → Problème de session utilisateur' as diagnostic_3; 