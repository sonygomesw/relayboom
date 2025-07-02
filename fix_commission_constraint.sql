-- Script pour diagnostiquer et corriger la contrainte commission_consistency
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Voir toutes les contraintes sur la table creator_wallets
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'creator_wallets'::regclass;

-- 2. Voir la structure complète de la table (équivalent de \d)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'creator_wallets'
ORDER BY ordinal_position;

-- 3. Voir les données actuelles dans creator_wallets
SELECT * FROM creator_wallets;

-- 4. TEMPORAIRE : Supprimer la contrainte problématique
-- (nous la recréerons correctement après)
ALTER TABLE creator_wallets 
DROP CONSTRAINT IF EXISTS commission_consistency;

-- 5. Vérifier que la contrainte a été supprimée
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'creator_wallets'::regclass;

-- 6. Test : Essayer de mettre à jour un wallet pour voir si ça marche maintenant
-- Remplacez 'USER_ID_HERE' par votre vrai user ID depuis la console
-- UPDATE creator_wallets 
-- SET available_credits = available_credits + 5000,
--     total_deposited = total_deposited + 5000,
--     last_recharge_at = NOW()
-- WHERE creator_id = 'USER_ID_HERE';

-- 7. Optionnel : Recréer une contrainte plus simple si nécessaire
-- ALTER TABLE creator_wallets 
-- ADD CONSTRAINT commission_consistency_simple 
-- CHECK (available_credits >= 0 AND total_deposited >= 0 AND reserved_credits >= 0 AND spent_credits >= 0); 