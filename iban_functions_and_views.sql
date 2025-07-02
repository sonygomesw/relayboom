-- Fonctions et vues pour le système IBAN
-- À exécuter après fix_iban_migration.sql

-- 1. Vue unifiée pour l'admin des paiements en attente
CREATE OR REPLACE VIEW admin_pending_payments AS
-- Paiements du système missions
SELECT 
  pp.*,
  p.pseudo as clipper_name,
  p.email as clipper_email,
  m.title as mission_title,
  m.creator_name,
  'missions' as source_system,
  (pp.amount::decimal/100) as amount_euros
FROM pending_payments pp
JOIN profiles p ON p.id = pp.clipper_id
JOIN missions m ON m.id = pp.mission_id
WHERE pp.system_type = 'missions' 
  AND pp.status IN ('pending', 'processing')

UNION ALL

-- Paiements du système campaigns
SELECT 
  pp.*,
  p.pseudo as clipper_name,
  p.email as clipper_email,
  c.title as mission_title,
  cp.pseudo as creator_name,
  'campaigns' as source_system,
  (pp.amount::decimal/100) as amount_euros
FROM pending_payments pp
JOIN profiles p ON p.id = pp.clipper_id
JOIN campaigns c ON c.id = pp.campaign_id
JOIN profiles cp ON cp.id = c.creator_id
WHERE pp.system_type = 'campaigns' 
  AND pp.status IN ('pending', 'processing')

ORDER BY created_at DESC;

-- 2. Vue pour les clippeurs de leurs paiements
CREATE OR REPLACE VIEW clipper_payments AS
-- Paiements missions
SELECT 
  pp.*,
  m.title as content_title,
  m.creator_name,
  'Mission' as content_type,
  (pp.amount::decimal/100) as amount_euros,
  CASE 
    WHEN pp.status = 'pending' THEN '⏳ En attente'
    WHEN pp.status = 'processing' THEN '🔄 En cours'
    WHEN pp.status = 'paid' THEN '✅ Payé'
    WHEN pp.status = 'failed' THEN '❌ Échoué'
    ELSE pp.status
  END as status_display
FROM pending_payments pp
JOIN missions m ON m.id = pp.mission_id
WHERE pp.system_type = 'missions' 
  AND pp.clipper_id = auth.uid()

UNION ALL

-- Paiements campaigns
SELECT 
  pp.*,
  c.title as content_title,
  cp.pseudo as creator_name,
  'Campagne' as content_type,
  (pp.amount::decimal/100) as amount_euros,
  CASE 
    WHEN pp.status = 'pending' THEN '⏳ En attente'
    WHEN pp.status = 'processing' THEN '🔄 En cours'
    WHEN pp.status = 'paid' THEN '✅ Payé'
    WHEN pp.status = 'failed' THEN '❌ Échoué'
    ELSE pp.status
  END as status_display
FROM pending_payments pp
JOIN campaigns c ON c.id = pp.campaign_id
JOIN profiles cp ON cp.id = c.creator_id
WHERE pp.system_type = 'campaigns' 
  AND pp.clipper_id = auth.uid()

ORDER BY created_at DESC;

-- 3. Fonction pour créer un paiement en attente (système missions)
CREATE OR REPLACE FUNCTION create_pending_payment_for_mission(
  submission_id_param UUID
) RETURNS UUID AS $$
DECLARE
  submission_record RECORD;
  clipper_profile RECORD;
  mission_record RECORD;
  payment_id UUID;
  calculated_amount INTEGER;
BEGIN
  -- Récupérer la soumission
  SELECT * INTO submission_record
  FROM clip_submissions
  WHERE id = submission_id_param;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Soumission non trouvée: %', submission_id_param;
  END IF;
  
  -- Récupérer la mission
  SELECT * INTO mission_record
  FROM missions
  WHERE id = submission_record.mission_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Mission non trouvée: %', submission_record.mission_id;
  END IF;
  
  -- Récupérer le profil du clippeur avec IBAN
  SELECT p.*, au.email
  INTO clipper_profile
  FROM profiles p
  JOIN auth.users au ON au.id = p.id
  WHERE p.id = submission_record.user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profil clippeur non trouvé: %', submission_record.user_id;
  END IF;
  
  -- Vérifier que l'IBAN est renseigné
  IF clipper_profile.iban IS NULL OR clipper_profile.iban = '' THEN
    RAISE EXCEPTION 'IBAN manquant pour le clippeur %', clipper_profile.email;
  END IF;
  
  -- Calculer le montant (100% car commission déjà prélevée lors de la recharge créateur)
  calculated_amount := (submission_record.views_count * mission_record.price_per_1k_views) / 1000;
  
  -- Créer le paiement en attente
  INSERT INTO pending_payments (
    clip_submission_id, clipper_id, mission_id, system_type,
    amount, iban, bank_name, account_holder_name,
    views_count, price_per_1k_views, calculation_details
  ) VALUES (
    submission_id_param,
    submission_record.user_id,
    submission_record.mission_id,
    'missions',
    calculated_amount,
    clipper_profile.iban,
    clipper_profile.bank_name,
    COALESCE(clipper_profile.account_holder_name, clipper_profile.pseudo),
    submission_record.views_count,
    mission_record.price_per_1k_views,
    format('Mission: %s vues × %s€/1k = %s€', 
      submission_record.views_count, 
      (mission_record.price_per_1k_views::decimal/100), 
      (calculated_amount::decimal/100)
    )
  ) RETURNING id INTO payment_id;
  
  -- Mettre à jour la soumission
  UPDATE clip_submissions 
  SET 
    earnings = calculated_amount,
    status = 'pending_payment',
    pending_payment_id = payment_id,
    updated_at = NOW()
  WHERE id = submission_id_param;
  
  RETURN payment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Fonction pour créer un paiement en attente (système campaigns)
CREATE OR REPLACE FUNCTION create_pending_payment_for_campaign(
  submission_id_param UUID
) RETURNS UUID AS $$
DECLARE
  submission_record RECORD;
  clipper_profile RECORD;
  campaign_record RECORD;
  payment_id UUID;
  calculated_amount INTEGER;
BEGIN
  -- Récupérer la soumission
  SELECT * INTO submission_record
  FROM campaign_submissions
  WHERE id = submission_id_param;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Soumission de campagne non trouvée: %', submission_id_param;
  END IF;
  
  -- Récupérer la campagne
  SELECT * INTO campaign_record
  FROM campaigns
  WHERE id = submission_record.campaign_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Campagne non trouvée: %', submission_record.campaign_id;
  END IF;
  
  -- Récupérer le profil du clippeur avec IBAN
  SELECT p.*, au.email
  INTO clipper_profile
  FROM profiles p
  JOIN auth.users au ON au.id = p.id
  WHERE p.id = submission_record.clipper_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profil clippeur non trouvé: %', submission_record.clipper_id;
  END IF;
  
  -- Vérifier que l'IBAN est renseigné
  IF clipper_profile.iban IS NULL OR clipper_profile.iban = '' THEN
    RAISE EXCEPTION 'IBAN manquant pour le clippeur %', clipper_profile.email;
  END IF;
  
  -- Calculer le montant (100% car commission déjà prélevée lors de la recharge créateur)
  calculated_amount := (submission_record.views_count * campaign_record.price_per_1k_views) / 1000;
  
  -- Créer le paiement en attente
  INSERT INTO pending_payments (
    campaign_submission_id, clipper_id, campaign_id, system_type,
    amount, iban, bank_name, account_holder_name,
    views_count, price_per_1k_views, calculation_details
  ) VALUES (
    submission_id_param,
    submission_record.clipper_id,
    submission_record.campaign_id,
    'campaigns',
    calculated_amount,
    clipper_profile.iban,
    clipper_profile.bank_name,
    COALESCE(clipper_profile.account_holder_name, clipper_profile.pseudo),
    submission_record.views_count,
    campaign_record.price_per_1k_views,
    format('Campagne: %s vues × %s€/1k = %s€', 
      submission_record.views_count, 
      (campaign_record.price_per_1k_views::decimal/100), 
      (calculated_amount::decimal/100)
    )
  ) RETURNING id INTO payment_id;
  
  -- Mettre à jour la soumission
  UPDATE campaign_submissions 
  SET 
    calculated_amount = calculated_amount,
    net_amount = calculated_amount,
    payment_status = 'pending',
    pending_payment_id = payment_id
  WHERE id = submission_id_param;
  
  RETURN payment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Fonction pour marquer un paiement comme effectué
CREATE OR REPLACE FUNCTION mark_payment_as_paid(
  payment_id_param UUID,
  payment_reference_param VARCHAR(255) DEFAULT NULL,
  admin_notes_param TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  payment_record RECORD;
BEGIN
  -- Récupérer le paiement pour connaître le système
  SELECT * INTO payment_record
  FROM pending_payments
  WHERE id = payment_id_param;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Paiement non trouvé: %', payment_id_param;
  END IF;
  
  -- Mettre à jour le paiement
  UPDATE pending_payments 
  SET 
    status = 'paid',
    paid_at = NOW(),
    payment_reference = payment_reference_param,
    admin_notes = admin_notes_param
  WHERE id = payment_id_param;
  
  -- Mettre à jour la soumission correspondante selon le système
  IF payment_record.system_type = 'missions' THEN
    UPDATE clip_submissions 
    SET status = 'paid', updated_at = NOW()
    WHERE pending_payment_id = payment_id_param;
  ELSIF payment_record.system_type = 'campaigns' THEN
    UPDATE campaign_submissions 
    SET payment_status = 'paid', paid_at = NOW()
    WHERE pending_payment_id = payment_id_param;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Fonction pour obtenir les statistiques de paiements
CREATE OR REPLACE FUNCTION get_pending_payments_stats()
RETURNS TABLE (
  total_pending INTEGER,
  total_amount_pending BIGINT,
  missions_pending INTEGER,
  campaigns_pending INTEGER,
  oldest_pending_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_pending,
    COALESCE(SUM(amount), 0)::BIGINT as total_amount_pending,
    COUNT(CASE WHEN system_type = 'missions' THEN 1 END)::INTEGER as missions_pending,
    COUNT(CASE WHEN system_type = 'campaigns' THEN 1 END)::INTEGER as campaigns_pending,
    MIN(created_at) as oldest_pending_date
  FROM pending_payments 
  WHERE status = 'pending';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Fonction pour obtenir l'IBAN d'un clippeur
CREATE OR REPLACE FUNCTION get_clipper_iban_info(clipper_id_param UUID)
RETURNS TABLE (
  has_iban BOOLEAN,
  iban VARCHAR(34),
  bank_name VARCHAR(255),
  account_holder_name VARCHAR(255)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (p.iban IS NOT NULL AND p.iban != '') as has_iban,
    p.iban,
    p.bank_name,
    p.account_holder_name
  FROM profiles p
  WHERE p.id = clipper_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Commentaires pour documentation
COMMENT ON VIEW admin_pending_payments IS 'Vue admin unifiée des paiements en attente (missions + campagnes)';
COMMENT ON VIEW clipper_payments IS 'Vue clippeur de tous ses paiements avec statut formaté';
COMMENT ON FUNCTION create_pending_payment_for_mission IS 'Crée un paiement en attente pour une soumission de mission';
COMMENT ON FUNCTION create_pending_payment_for_campaign IS 'Crée un paiement en attente pour une soumission de campagne';
COMMENT ON FUNCTION mark_payment_as_paid IS 'Marque un paiement comme effectué après virement bancaire';
COMMENT ON FUNCTION get_pending_payments_stats IS 'Statistiques des paiements en attente';
COMMENT ON FUNCTION get_clipper_iban_info IS 'Informations IBAN d''un clippeur';

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Fonctions et vues IBAN créées avec succès !';
    RAISE NOTICE '🎯 Système IBAN prêt à utiliser !';
END
$$; 