-- Script pour diagnostiquer la table wallets_recharge
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier si la table wallets_recharge existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'wallets_recharge';

-- 2. Voir la structure de wallets_recharge (si elle existe)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'wallets_recharge'
ORDER BY ordinal_position;

-- 3. Voir les données dans wallets_recharge
SELECT * FROM wallets_recharge LIMIT 5;

-- 4. Compter les enregistrements
SELECT COUNT(*) as total_recharges FROM wallets_recharge;

-- 5. Si la table n'a pas la bonne structure, créons-la correctement
CREATE TABLE IF NOT EXISTS wallets_recharge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- en centimes
    description TEXT,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Activer RLS sur wallets_recharge
ALTER TABLE wallets_recharge ENABLE ROW LEVEL SECURITY;

-- 7. Créer les politiques RLS
DROP POLICY IF EXISTS "Users can view their own recharges" ON wallets_recharge;
CREATE POLICY "Users can view their own recharges" ON wallets_recharge
    FOR SELECT USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Users can insert their own recharges" ON wallets_recharge;
CREATE POLICY "Users can insert their own recharges" ON wallets_recharge
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- 8. Vérifier la structure finale
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'wallets_recharge'
ORDER BY ordinal_position; 