-- Script pour appliquer les fonctions SQL nécessaires à RelayBoom
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Fonction pour récupérer les missions avec statistiques
CREATE OR REPLACE FUNCTION get_missions_with_stats()
RETURNS TABLE(
    id UUID,
    creator_id UUID,
    title TEXT,
    description TEXT,
    total_budget NUMERIC,
    price_per_1k_views NUMERIC,
    status TEXT,
    created_at TIMESTAMPTZ,
    submissions_count BIGINT,
    views_count BIGINT,
    pending_validations_count BIGINT,
    earnings NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.creator_id,
        m.title,
        m.description,
        m.total_budget,
        m.price_per_1k_views,
        m.status,
        m.created_at,
        COALESCE(COUNT(s.id), 0) as submissions_count,
        COALESCE(SUM(s.views), 0) as views_count,
        COALESCE(COUNT(s.id) FILTER (WHERE s.status = 'pending'), 0) as pending_validations_count,
        COALESCE(SUM(s.views), 0) * m.price_per_1k_views / 1000 as earnings
    FROM missions m
    LEFT JOIN submissions s ON m.id = s.mission_id AND s.status IN ('pending', 'approved')
    GROUP BY m.id, m.creator_id, m.title, m.description, m.total_budget, m.price_per_1k_views, m.status, m.created_at
    ORDER BY m.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 2. Vérifier que la table creator_wallets existe
CREATE TABLE IF NOT EXISTS creator_wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    available_credits BIGINT DEFAULT 0, -- en centimes
    reserved_credits BIGINT DEFAULT 0, -- en centimes
    total_deposited BIGINT DEFAULT 0, -- en centimes
    spent_credits BIGINT DEFAULT 0, -- en centimes
    last_recharge_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. S'assurer que RLS est activé
ALTER TABLE creator_wallets ENABLE ROW LEVEL SECURITY;

-- 4. Créer les politiques RLS pour creator_wallets
DROP POLICY IF EXISTS "Users can view own wallet" ON creator_wallets;
CREATE POLICY "Users can view own wallet" ON creator_wallets
FOR SELECT USING (creator_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own wallet" ON creator_wallets;
CREATE POLICY "Users can update own wallet" ON creator_wallets
FOR UPDATE USING (creator_id = auth.uid());

-- 5. S'assurer que les colonnes nécessaires existent dans les tables
ALTER TABLE missions ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS views BIGINT DEFAULT 0;

-- 6. Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_missions_creator_id ON missions(creator_id);
CREATE INDEX IF NOT EXISTS idx_submissions_mission_status ON submissions(mission_id, status);
CREATE INDEX IF NOT EXISTS idx_creator_wallets_creator_id ON creator_wallets(creator_id);

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Fonctions SQL appliquées avec succès !';
    RAISE NOTICE '🔧 Tables créées/mises à jour :';
    RAISE NOTICE '   - creator_wallets avec politiques RLS';
    RAISE NOTICE '   - missions avec creator_id';
    RAISE NOTICE '   - submissions avec views';
    RAISE NOTICE '⚡ Fonctions disponibles :';
    RAISE NOTICE '   - get_missions_with_stats() pour les stats des missions';
    RAISE NOTICE '📊 Index créés pour optimiser les performances';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 L''application RelayBoom peut maintenant utiliser les vraies données !';
END
$$; 