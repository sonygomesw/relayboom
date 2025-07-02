-- Script de diagnostic pour les tables de wallet existantes
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier les tables existantes
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%wallet%';

-- 2. Structure de la table creator_wallets (si elle existe)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'creator_wallets'
ORDER BY ordinal_position;

-- 3. Structure de la table wallet_transactions (si elle existe)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'wallet_transactions'
ORDER BY ordinal_position;

-- 4. Structure de la table wallets_recharge (si elle existe)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'wallets_recharge'
ORDER BY ordinal_position;

-- 5. Vérifier s'il y a des données dans creator_wallets
SELECT COUNT(*) as total_wallets FROM creator_wallets;

-- 6. Vérifier s'il y a des données dans wallets_recharge
SELECT COUNT(*) as total_recharges FROM wallets_recharge;

-- 7. Exemple de données dans creator_wallets (5 premières lignes)
SELECT * FROM creator_wallets LIMIT 5;

-- 8. Exemple de données dans wallets_recharge (5 premières lignes)
SELECT * FROM wallets_recharge LIMIT 5; 