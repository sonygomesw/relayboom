-- ===============================================
-- 🔍 DIAGNOSTIC - Flux nouvel utilisateur
-- ===============================================

-- Vérifier la structure de la table profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier les derniers profils créés
SELECT 
    id,
    email,
    pseudo,
    role,
    created_at,
    updated_at
FROM profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- Vérifier la structure de la table missions
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'missions' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Compter les missions actives
SELECT 
    status,
    COUNT(*) as count
FROM missions 
GROUP BY status;

-- Vérifier les politiques RLS sur profiles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Vérifier les politiques RLS sur missions
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'missions';

-- Vérifier s'il y a des triggers sur la table profiles
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'profiles';

-- Test d'insertion d'un profil (pour voir s'il y a des erreurs)
-- ATTENTION: Ne pas exécuter en production, juste pour voir la structure
SELECT 'Test structure - ne pas exécuter' as note; 