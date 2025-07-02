-- 🚀 Script d'optimisation des performances RelayBoom (Version Finale)
-- À exécuter dans Supabase SQL Editor

-- ===============================================
-- 1. OPTIMISATION DES INDEX (Noms corrects)
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

-- Index pour les statistiques rapides (avec le bon nom de colonne)
CREATE INDEX IF NOT EXISTS idx_submissions_views_count 
ON submissions(views_count) WHERE views_count > 0;

CREATE INDEX IF NOT EXISTS idx_submissions_user_views 
ON submissions(user_id, views_count) WHERE views_count > 0;

-- ===============================================
-- 2. FONCTIONS D'OPTIMISATION CORRIGÉES
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
        COALESCE(SUM(s.views_count), 0) as total_views,
        COALESCE(COUNT(s.id), 0) as total_submissions,
        COALESCE(SUM(cs.palier * 0.001), 0) as total_earnings,
        COALESCE(AVG(s.views_count), 0) as avg_views
    FROM submissions s
    LEFT JOIN clip_submissions cs ON cs.user_id = p_user_id AND cs.status = 'approved'
    WHERE s.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour récupérer les missions avec statistiques
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

-- ===============================================
-- 3. FONCTION POUR STATISTIQUES RAPIDES ADMIN
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
        (SELECT COALESCE(SUM(views_count), 0) FROM submissions) as total_views;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- 4. FONCTION DE SYNCHRONISATION DES VUES
-- ===============================================

-- Fonction pour synchroniser les vues entre submissions et clip_submissions
CREATE OR REPLACE FUNCTION sync_submission_views()
RETURNS void AS $$
BEGIN
    -- Mettre à jour les vues dans submissions basé sur les paliers approuvés
    UPDATE submissions 
    SET views_count = (
        SELECT MAX(cs.views_declared)
        FROM clip_submissions cs 
        WHERE cs.submission_id = submissions.id 
        AND cs.status = 'approved'
    )
    WHERE id IN (
        SELECT DISTINCT submission_id 
        FROM clip_submissions 
        WHERE status = 'approved'
    );
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- 5. POLITIQUES RLS OPTIMISÉES
-- ===============================================

-- Optimiser les politiques RLS pour éviter les scans complets
DROP POLICY IF EXISTS "Users can view own submissions" ON submissions;
CREATE POLICY "Users can view own submissions" ON submissions
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own clip submissions" ON clip_submissions;
CREATE POLICY "Users can view own clip submissions" ON clip_submissions
FOR SELECT USING (user_id = auth.uid());

-- ===============================================
-- 6. OPTIMISATION DES STATISTIQUES
-- ===============================================

-- Mettre à jour les statistiques des tables pour l'optimiseur
ANALYZE profiles;
ANALYZE missions;
ANALYZE submissions;
ANALYZE clip_submissions;

-- ===============================================
-- 7. FONCTION DE NETTOYAGE
-- ===============================================

-- Fonction de nettoyage des données obsolètes
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Supprimer les soumissions rejetées de plus de 6 mois
    DELETE FROM submissions 
    WHERE status = 'rejected' 
    AND created_at < NOW() - INTERVAL '6 months';
    
    -- Supprimer les déclarations de paliers rejetées de plus de 3 mois
    DELETE FROM clip_submissions
    WHERE status = 'rejected' 
    AND declared_at < NOW() - INTERVAL '3 months';
    
    -- Mettre à jour les statistiques après nettoyage
    ANALYZE submissions;
    ANALYZE clip_submissions;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- 8. TRIGGER POUR SYNCHRONISATION AUTOMATIQUE
-- ===============================================

-- Trigger pour synchroniser automatiquement les vues quand un palier est approuvé
CREATE OR REPLACE FUNCTION trigger_sync_views()
RETURNS TRIGGER AS $$
BEGIN
    -- Si un palier est approuvé, mettre à jour les vues de la submission
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        UPDATE submissions 
        SET views_count = NEW.views_declared,
            status = 'approved'
        WHERE id = NEW.submission_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger
DROP TRIGGER IF EXISTS sync_views_on_approval ON clip_submissions;
CREATE TRIGGER sync_views_on_approval
    AFTER UPDATE ON clip_submissions
    FOR EACH ROW 
    EXECUTE FUNCTION trigger_sync_views();

-- ===============================================
-- CONFIRMATION
-- ===============================================

DO $$
BEGIN
    RAISE NOTICE '🚀 Optimisations de performance appliquées !';
    RAISE NOTICE '🔍 Index optimisés créés avec les bons noms de colonnes';
    RAISE NOTICE '⚡ Fonctions d''optimisation disponibles :';
    RAISE NOTICE '   - get_user_stats(user_id) - Stats utilisateur optimisées';
    RAISE NOTICE '   - get_missions_with_stats() - Missions avec statistiques';
    RAISE NOTICE '   - get_admin_dashboard_stats() - Stats admin complètes';
    RAISE NOTICE '   - sync_submission_views() - Synchroniser les vues';
    RAISE NOTICE '   - cleanup_old_data() - Nettoyer les données obsolètes';
    RAISE NOTICE '';
    RAISE NOTICE '🔄 Synchronisation automatique activée :';
    RAISE NOTICE '   - Les vues se synchronisent automatiquement lors de l''approbation';
    RAISE NOTICE '';
    RAISE NOTICE '💡 Utilisation recommandée :';
    RAISE NOTICE '1. Utilisez ces fonctions dans votre code TypeScript';
    RAISE NOTICE '2. Exécutez cleanup_old_data() mensuellement';
    RAISE NOTICE '3. Les vues se synchronisent automatiquement';
END
$$; 