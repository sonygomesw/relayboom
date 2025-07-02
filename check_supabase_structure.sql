-- Script pour vérifier la structure complète de la base de données Supabase
-- À exécuter dans l'éditeur SQL de Supabase pour voir ce qui existe déjà

-- 1. VÉRIFIER LES TABLES EXISTANTES
DO $$
BEGIN
    RAISE NOTICE '=== TABLES EXISTANTES ===';
END
$$;

SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. VÉRIFIER LA STRUCTURE DE LA TABLE PROFILES
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== STRUCTURE TABLE PROFILES ===';
END
$$;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. VÉRIFIER LA STRUCTURE DE LA TABLE MISSIONS
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== STRUCTURE TABLE MISSIONS ===';
END
$$;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'missions'
ORDER BY ordinal_position;

-- 4. VÉRIFIER LA STRUCTURE DE LA TABLE SUBMISSIONS
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== STRUCTURE TABLE SUBMISSIONS ===';
END
$$;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'submissions'
ORDER BY ordinal_position;

-- 5. VÉRIFIER SI LA TABLE CREATOR_WALLETS EXISTE
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== STRUCTURE TABLE CREATOR_WALLETS ===';
END
$$;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'creator_wallets'
ORDER BY ordinal_position;

-- 6. VÉRIFIER LES FONCTIONS EXISTANTES
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== FONCTIONS EXISTANTES ===';
END
$$;

SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- 7. VÉRIFIER LES INDEX EXISTANTS
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== INDEX EXISTANTS ===';
END
$$;

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 8. VÉRIFIER LES POLITIQUES RLS
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== POLITIQUES RLS ===';
END
$$;

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 9. VÉRIFIER LES CONTRAINTES FOREIGN KEY
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== CONTRAINTES FOREIGN KEY ===';
END
$$;

SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- 10. RÉCAPITULATIF
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== RÉCAPITULATIF ===';
    RAISE NOTICE 'Vérification terminée !';
    RAISE NOTICE 'Examinez les résultats ci-dessus pour comprendre la structure existante.';
    RAISE NOTICE '';
    RAISE NOTICE 'Étapes suivantes :';
    RAISE NOTICE '1. Vérifier si les colonnes nécessaires existent';
    RAISE NOTICE '2. Adapter le code TypeScript aux vraies colonnes';
    RAISE NOTICE '3. Créer uniquement les éléments manquants';
END
$$; 