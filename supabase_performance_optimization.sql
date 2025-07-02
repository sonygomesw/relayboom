-- 🚀 Script d'optimisation des performances RelayBoom
-- À exécuter dans Supabase SQL Editor

-- ===============================================
-- 1. OPTIMISATION DES INDEX
-- ===============================================

-- Index composites pour les requêtes fréquentes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submissions_user_status 
ON submissions(user_id, status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submissions_mission_created 
ON submissions(mission_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_missions_status_featured 
ON missions(status, featured, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clip_submissions_user_status 
ON clip_submissions(user_id, status, declared_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_role_created 
ON profiles(role, created_at DESC);

-- Index pour les statistiques rapides
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submissions_views 
ON submissions(views) WHERE views > 0;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submissions_user_views 
ON submissions(user_id, views) WHERE views > 0;

-- ===============================================
-- 2. OPTIMISATION DES VUES MATERIALISÉES
-- ===============================================

-- Vue matérialisée pour les statistiques utilisateur
CREATE MATERIALIZED VIEW IF NOT EXISTS user_stats AS
SELECT 
    s.user_id,
    COUNT(*) as total_submissions,
    SUM(s.views) as total_views,
    AVG(s.views) as avg_views,
    MAX(s.created_at) as last_submission,
    COUNT(CASE WHEN s.status = 'approved' THEN 1 END) as approved_submissions
FROM submissions s
GROUP BY s.user_id;

-- Index sur la vue matérialisée
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_stats_user_id 
ON user_stats(user_id);

-- Vue matérialisée pour les statistiques des missions
CREATE MATERIALIZED VIEW IF NOT EXISTS mission_stats AS
SELECT 
    m.id as mission_id,
    m.creator_name,
    COUNT(s.id) as total_submissions,
    SUM(s.views) as total_views,
    AVG(s.views) as avg_views,
    COUNT(CASE WHEN s.status = 'approved' THEN 1 END) as approved_submissions,
    MAX(s.created_at) as last_submission
FROM missions m
LEFT JOIN submissions s ON m.id = s.mission_id
GROUP BY m.id, m.creator_name;

-- Index sur la vue matérialisée
CREATE UNIQUE INDEX IF NOT EXISTS idx_mission_stats_mission_id 
ON mission_stats(mission_id);

-- ===============================================
-- 3. FONCTIONS D'OPTIMISATION
-- ===============================================

-- Fonction pour rafraîchir les vues matérialisées
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mission_stats;
END;
$$ LANGUAGE plpgsql;

-- Fonction optimisée pour récupérer les stats utilisateur
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS TABLE(
    total_views BIGINT,
    total_submissions BIGINT,
    total_earnings NUMERIC,
    avg_views NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(us.total_views, 0),
        COALESCE(us.total_submissions, 0),
        COALESCE(SUM(cs.palier * 0.001), 0) as total_earnings,
        COALESCE(us.avg_views, 0)
    FROM user_stats us
    LEFT JOIN clip_submissions cs ON cs.user_id = p_user_id AND cs.status = 'approved'
    WHERE us.user_id = p_user_id
    GROUP BY us.total_views, us.total_submissions, us.avg_views;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- 4. POLITIQUES RLS OPTIMISÉES
-- ===============================================

-- Optimiser les politiques RLS pour éviter les scans complets
DROP POLICY IF EXISTS "Users can view own submissions" ON submissions;
CREATE POLICY "Users can view own submissions" ON submissions
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own clip submissions" ON clip_submissions;
CREATE POLICY "Users can view own clip submissions" ON clip_submissions
FOR SELECT USING (user_id = auth.uid());

-- ===============================================
-- 5. CONFIGURATION DES PERFORMANCES
-- ===============================================

-- Optimiser les paramètres de la base pour les requêtes fréquentes
-- (Ces paramètres sont généralement configurés au niveau serveur)

-- Augmenter le cache des plans de requête
-- SET plan_cache_mode = 'force_generic_plan';

-- Optimiser les statistiques des tables
ANALYZE profiles;
ANALYZE missions;
ANALYZE submissions;
ANALYZE clip_submissions;

-- ===============================================
-- 6. TRIGGERS D'OPTIMISATION
-- ===============================================

-- Trigger pour rafraîchir automatiquement les stats
CREATE OR REPLACE FUNCTION trigger_refresh_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Rafraîchir les vues matérialisées de manière asynchrone
    PERFORM pg_notify('refresh_stats', 'user_stats,mission_stats');
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger sur les tables importantes
DROP TRIGGER IF EXISTS refresh_stats_on_submission ON submissions;
CREATE TRIGGER refresh_stats_on_submission
    AFTER INSERT OR UPDATE OR DELETE ON submissions
    FOR EACH ROW EXECUTE FUNCTION trigger_refresh_stats();

-- ===============================================
-- 7. NETTOYAGE ET MAINTENANCE
-- ===============================================

-- Fonction de nettoyage des données obsolètes
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Supprimer les soumissions rejetées de plus de 6 mois
    DELETE FROM submissions 
    WHERE status = 'rejected' 
    AND created_at < NOW() - INTERVAL '6 months';
    
    -- Supprimer les sessions expirées
    DELETE FROM auth.sessions 
    WHERE expires_at < NOW();
    
    -- Mettre à jour les statistiques
    ANALYZE;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- CONFIRMATION
-- ===============================================

DO $$
BEGIN
    RAISE NOTICE '🚀 Optimisations de performance appliquées !';
    RAISE NOTICE '📊 Vues matérialisées créées pour les statistiques';
    RAISE NOTICE '🔍 Index optimisés pour les requêtes fréquentes';
    RAISE NOTICE '⚡ Fonctions d''optimisation disponibles';
    RAISE NOTICE '';
    RAISE NOTICE '💡 Pour maintenir les performances :';
    RAISE NOTICE '1. Exécutez "SELECT refresh_materialized_views();" quotidiennement';
    RAISE NOTICE '2. Exécutez "SELECT cleanup_old_data();" mensuellement';
    RAISE NOTICE '3. Surveillez les logs de performance dans Supabase';
END
$$; 