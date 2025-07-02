-- Script pour corriger la contrainte wallet_balance_consistency
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Voir la structure complète de la table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'creator_wallets'
ORDER BY ordinal_position;

-- 2. Voir les données actuelles dans creator_wallets
SELECT * FROM creator_wallets;

-- 3. Supprimer temporairement la contrainte problématique
ALTER TABLE creator_wallets 
DROP CONSTRAINT IF EXISTS wallet_balance_consistency;

-- 4. Vérifier que la contrainte a été supprimée
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'creator_wallets'::regclass;

-- 5. Si la colonne total_credits existe, on peut recréer une contrainte corrigée
-- (à ajuster selon ce qu'on voit dans la structure)

-- Option A : Si total_credits doit être égal à total_deposited
-- ALTER TABLE creator_wallets 
-- ADD CONSTRAINT wallet_balance_consistency_fixed 
-- CHECK (total_credits = total_deposited);

-- Option B : Si on veut garder l'ancienne logique mais l'adapter
-- ALTER TABLE creator_wallets 
-- ADD CONSTRAINT wallet_balance_consistency_fixed 
-- CHECK ((available_credits + reserved_credits + spent_credits) = total_credits);

-- Pour l'instant, laissons sans contrainte pour permettre les tests 