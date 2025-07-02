-- 🚀 Script d'optimisation des performances RelayBoom (Version Supabase)
-- À exécuter dans Supabase SQL Editor

-- ===============================================
-- 1. OPTIMISATION DES INDEX (Sans CONCURRENTLY)
-- ===============================================

-- Index composites pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_submissions_user_status 
ON submissions(user_id, status);

CREATE INDEX IF NOT EXISTS idx_submissions_mission_created 
ON submissions(mission_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_missions_status_featured 
ON missions(status, featured, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_clip_submissions_user_status 
ON clip_submissions(user_id, status, declared_at DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_role_created 
ON profiles(role, created_at DESC);

-- Index pour les statistiques rapides
CREATE INDEX IF NOT EXISTS idx_submissions_views 
ON submissions(views) WHERE views > 0;

CREATE INDEX IF NOT EXISTS idx_submissions_user_views 
ON submissions(user_id, views) WHERE views > 0;

-- ===============================================
-- 2. FONCTIONS D'OPTIMISATION SIMPLIFIÉES
-- ===============================================

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
        COALESCE(SUM(s.views), 0) as total_views,
        COALESCE(COUNT(s.id), 0) as total_submissions,
        COALESCE(SUM(cs.palier * 0.001), 0) as total_earnings,
        COALESCE(AVG(s.views), 0) as avg_views
    FROM submissions s
    LEFT JOIN clip_submissions cs ON cs.user_id = p_user_id AND cs.status = 'approved'
    WHERE s.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour récupérer les missions avec statistiques
CREATE OR REPLACE FUNCTION get_missions_with_stats()
RETURNS TABLE(
    mission_id UUID,
    title TEXT,
    creator_name TEXT,
    reward NUMERIC,
    total_submissions BIGINT,
    total_views BIGINT,
    avg_views NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.title,
        m.creator_name,
        m.reward,
        COALESCE(COUNT(s.id), 0) as total_submissions,
        COALESCE(SUM(s.views), 0) as total_views,
        COALESCE(AVG(s.views), 0) as avg_views
    FROM missions m
    LEFT JOIN submissions s ON m.id = s.mission_id
    WHERE m.status = 'active'
    GROUP BY m.id, m.title, m.creator_name, m.reward
    ORDER BY m.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- 3. POLITIQUES RLS OPTIMISÉES
-- ===============================================

-- Optimiser les politiques RLS pour éviter les scans complets
DROP POLICY IF EXISTS "Users can view own submissions" ON submissions;
CREATE POLICY "Users can view own submissions" ON submissions
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own clip submissions" ON clip_submissions;
CREATE POLICY "Users can view own clip submissions" ON clip_submissions
FOR SELECT USING (user_id = auth.uid());

-- ===============================================
-- 4. OPTIMISATION DES STATISTIQUES
-- ===============================================

-- Mettre à jour les statistiques des tables pour l'optimiseur
ANALYZE profiles;
ANALYZE missions;
ANALYZE submissions;
ANALYZE clip_submissions;

-- ===============================================
-- 5. FONCTION DE NETTOYAGE
-- ===============================================

-- Fonction de nettoyage des données obsolètes
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Supprimer les soumissions rejetées de plus de 6 mois
    DELETE FROM submissions 
    WHERE status = 'rejected' 
    AND created_at < NOW() - INTERVAL '6 months';
    
    -- Mettre à jour les statistiques après nettoyage
    ANALYZE submissions;
    ANALYZE clip_submissions;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- 6. FONCTION POUR STATISTIQUES RAPIDES ADMIN
-- ===============================================

CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE(
    total_users BIGINT,
    total_creators BIGINT,
    total_clippers BIGINT,
    total_missions BIGINT,
    active_missions BIGINT,
    total_submissions BIGINT,
    pending_validations BIGINT,
    total_views BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM profiles) as total_users,
        (SELECT COUNT(*) FROM profiles WHERE role = 'creator') as total_creators,
        (SELECT COUNT(*) FROM profiles WHERE role = 'clipper') as total_clippers,
        (SELECT COUNT(*) FROM missions) as total_missions,
        (SELECT COUNT(*) FROM missions WHERE status = 'active') as active_missions,
        (SELECT COUNT(*) FROM submissions) as total_submissions,
        (SELECT COUNT(*) FROM clip_submissions WHERE status = 'pending') as pending_validations,
        (SELECT COALESCE(SUM(views), 0) FROM submissions) as total_views;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- CONFIRMATION
-- ===============================================

DO $$
BEGIN
    RAISE NOTICE '🚀 Optimisations de performance appliquées !';
    RAISE NOTICE '🔍 Index optimisés créés';
    RAISE NOTICE '⚡ Fonctions d''optimisation disponibles :';
    RAISE NOTICE '   - get_user_stats(user_id)';
    RAISE NOTICE '   - get_missions_with_stats()';
    RAISE NOTICE '   - get_admin_dashboard_stats()';
    RAISE NOTICE '   - cleanup_old_data()';
    RAISE NOTICE '';
    RAISE NOTICE '💡 Utilisation recommandée :';
    RAISE NOTICE '1. Utilisez ces fonctions dans votre code TypeScript';
    RAISE NOTICE '2. Exécutez cleanup_old_data() mensuellement';
    RAISE NOTICE '3. Surveillez les performances dans Supabase Dashboard';
END
$$; 