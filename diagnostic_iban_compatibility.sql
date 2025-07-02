-- Script de diagnostic pour vérifier la compatibilité du système IBAN
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier toutes les tables existantes
DO $$
BEGIN
    RAISE NOTICE '=== DIAGNOSTIC DE LA BASE DE DONNÉES ===';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Tables existantes:';
END
$$;

SELECT 
    table_name,
    CASE 
        WHEN table_name LIKE '%submission%' THEN '🎬 Soumissions'
        WHEN table_name LIKE '%campaign%' THEN '📢 Campagnes'
        WHEN table_name LIKE '%profile%' THEN '👤 Profils'
        WHEN table_name LIKE '%payment%' THEN '💰 Paiements'
        WHEN table_name LIKE '%wallet%' THEN '💳 Wallets'
        ELSE '📁 Autre'
    END as category
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY category, table_name;

-- 2. Vérifier la structure de clip_submissions
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎬 Structure de clip_submissions:';
END
$$;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN column_name LIKE '%payment%' THEN '💰'
        WHEN column_name LIKE '%status%' THEN '📊'
        WHEN column_name LIKE '%amount%' THEN '💵'
        WHEN column_name LIKE '%stripe%' THEN '🔷'
        ELSE '📝'
    END as icon
FROM information_schema.columns 
WHERE table_name = 'clip_submissions' 
ORDER BY ordinal_position;

-- 3. Vérifier la structure de profiles pour les champs IBAN
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '👤 Champs IBAN dans profiles:';
END
$$;

SELECT 
    column_name,
    data_type,
    is_nullable,
    CASE 
        WHEN column_name = 'iban' THEN '🏦 IBAN'
        WHEN column_name = 'bank_name' THEN '🏛️ Banque'
        WHEN column_name = 'account_holder_name' THEN '👤 Titulaire'
        ELSE '📝 Autre'
    END as description
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('iban', 'bank_name', 'account_holder_name')
ORDER BY column_name;

-- 4. Vérifier si pending_payments existe
DO $$
DECLARE
    table_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'pending_payments'
    ) INTO table_exists;
    
    IF table_exists THEN
        RAISE NOTICE '';
        RAISE NOTICE '✅ Table pending_payments existe';
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '❌ Table pending_payments n''existe pas - à créer';
    END IF;
END
$$;

-- 5. Vérifier les campagnes/missions existantes
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '📢 Tables de campagnes/missions:';
END
$$;

SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND (table_name LIKE '%campaign%' OR table_name LIKE '%mission%')
ORDER BY table_name;

-- 6. Diagnostic des relations manquantes
DO $$
DECLARE
    has_campaigns boolean;
    has_missions boolean;
    submission_table text;
BEGIN
    -- Vérifier quelle table de campagne existe
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'campaigns') INTO has_campaigns;
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'missions') INTO has_missions;
    
    RAISE NOTICE '';
    RAISE NOTICE '🔗 Analyse des relations:';
    
    IF has_campaigns THEN
        RAISE NOTICE '✅ Table campaigns trouvée';
        submission_table := 'campaign_submissions';
    ELSIF has_missions THEN
        RAISE NOTICE '✅ Table missions trouvée';
        submission_table := 'clip_submissions';
    ELSE
        RAISE NOTICE '❌ Aucune table de campagne/mission trouvée';
    END IF;
    
    -- Vérifier si on a les bonnes colonnes dans clip_submissions
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clip_submissions' AND column_name = 'mission_id') THEN
        RAISE NOTICE '✅ clip_submissions.mission_id existe';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clip_submissions' AND column_name = 'campaign_id') THEN
        RAISE NOTICE '✅ clip_submissions.campaign_id existe';
    END IF;
END
$$;

-- 7. Script de correction automatique
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🔧 RECOMMANDATIONS DE CORRECTION:';
    RAISE NOTICE '';
    
    -- Vérifier si on doit ajouter les champs IBAN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'iban') THEN
        RAISE NOTICE '📝 Exécuter: ALTER TABLE profiles ADD COLUMN iban VARCHAR(34);';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bank_name') THEN
        RAISE NOTICE '📝 Exécuter: ALTER TABLE profiles ADD COLUMN bank_name VARCHAR(255);';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'account_holder_name') THEN
        RAISE NOTICE '📝 Exécuter: ALTER TABLE profiles ADD COLUMN account_holder_name VARCHAR(255);';
    END IF;
    
    -- Vérifier si on doit créer pending_payments
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pending_payments') THEN
        RAISE NOTICE '📝 Exécuter le script: migrate_to_iban_system_fixed.sql';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ Diagnostic terminé !';
END
$$; 