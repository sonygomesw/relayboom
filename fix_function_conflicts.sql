-- Script pour corriger les conflits de fonctions
-- À exécuter avant iban_functions_and_views.sql

-- 1. Supprimer les fonctions existantes qui ont des conflits de types
DROP FUNCTION IF EXISTS get_pending_payments_stats();
DROP FUNCTION IF EXISTS create_pending_payment(UUID);
DROP FUNCTION IF EXISTS create_pending_payment_for_mission(UUID);
DROP FUNCTION IF EXISTS create_pending_payment_for_campaign(UUID);
DROP FUNCTION IF EXISTS mark_payment_as_paid(UUID, VARCHAR, TEXT);

-- 2. Supprimer les vues existantes pour éviter les conflits
DROP VIEW IF EXISTS admin_pending_payments;
DROP VIEW IF EXISTS clipper_payments;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Conflits de fonctions et vues résolus !';
    RAISE NOTICE '🔄 Vous pouvez maintenant exécuter iban_functions_and_views.sql';
END
$$; 