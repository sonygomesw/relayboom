-- Script de correction pour la migration IBAN
-- Corrige les erreurs de politiques et de colonnes

-- 1. Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Clippers can view own payments" ON pending_payments;
DROP POLICY IF EXISTS "Admins can manage all payments" ON pending_payments;

-- 2. Supprimer la table pending_payments si elle existe déjà (pour repartir proprement)
DROP TABLE IF EXISTS pending_payments CASCADE;

-- 3. Recréer la table pending_payments avec la bonne structure
CREATE TABLE pending_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Références flexibles (une seule sera remplie selon le système)
  clip_submission_id UUID REFERENCES clip_submissions(id) ON DELETE CASCADE,
  campaign_submission_id UUID REFERENCES campaign_submissions(id) ON DELETE CASCADE,
  
  -- Références communes
  clipper_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  
  -- Type de système pour différencier
  system_type VARCHAR(20) NOT NULL CHECK (system_type IN ('missions', 'campaigns')),
  
  -- Informations de paiement
  amount INTEGER NOT NULL, -- en centimes
  iban VARCHAR(34) NOT NULL,
  bank_name VARCHAR(255),
  account_holder_name VARCHAR(255) NOT NULL,
  
  -- Métadonnées
  views_count INTEGER,
  price_per_1k_views INTEGER,
  calculation_details TEXT,
  
  -- Statut
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, paid, failed
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Notes admin
  admin_notes TEXT,
  payment_reference VARCHAR(255), -- Référence du virement
  
  -- Contrainte : une seule soumission référencée
  CONSTRAINT single_submission_ref CHECK (
    (clip_submission_id IS NOT NULL AND campaign_submission_id IS NULL) OR
    (clip_submission_id IS NULL AND campaign_submission_id IS NOT NULL)
  ),
  
  -- Contrainte : cohérence système/références
  CONSTRAINT system_consistency CHECK (
    (system_type = 'missions' AND mission_id IS NOT NULL AND campaign_id IS NULL) OR
    (system_type = 'campaigns' AND campaign_id IS NOT NULL AND mission_id IS NULL)
  )
);

-- 4. Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_pending_payments_status ON pending_payments(status);
CREATE INDEX IF NOT EXISTS idx_pending_payments_clipper_id ON pending_payments(clipper_id);
CREATE INDEX IF NOT EXISTS idx_pending_payments_system_type ON pending_payments(system_type);
CREATE INDEX IF NOT EXISTS idx_pending_payments_created_at ON pending_payments(created_at);

-- 5. RLS pour pending_payments
ALTER TABLE pending_payments ENABLE ROW LEVEL SECURITY;

-- Créer les politiques (maintenant que la table existe)
CREATE POLICY "Clippers can view own payments" ON pending_payments
  FOR SELECT USING (auth.uid() = clipper_id);

CREATE POLICY "Admins can manage all payments" ON pending_payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. Ajouter les colonnes pending_payment_id aux tables de soumissions
ALTER TABLE clip_submissions DROP COLUMN IF EXISTS pending_payment_id;
ALTER TABLE clip_submissions ADD COLUMN pending_payment_id UUID REFERENCES pending_payments(id);

ALTER TABLE campaign_submissions DROP COLUMN IF EXISTS pending_payment_id;
ALTER TABLE campaign_submissions ADD COLUMN pending_payment_id UUID REFERENCES pending_payments(id);

-- 7. Vue unifiée pour l'admin (maintenant que tout existe)
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

-- 8. Fonction pour missions (corrigée)
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
  
  -- Calculer le montant
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

-- 9. Fonction pour campaigns (corrigée)
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
  
  -- Calculer le montant
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

-- 10. Fonction pour marquer comme payé
CREATE OR REPLACE FUNCTION mark_payment_as_paid(
  payment_id_param UUID,
  payment_reference_param VARCHAR(255) DEFAULT NULL,
  admin_notes_param TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  payment_record RECORD;
BEGIN
  -- Récupérer le paiement
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
  
  -- Mettre à jour la soumission correspondante
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

-- 11. Vue pour les clippeurs
CREATE OR REPLACE VIEW clipper_payments AS
-- Paiements missions
SELECT 
  pp.*,
  m.title as content_title,
  m.creator_name,
  'Mission' as content_type,
  (pp.amount::decimal/100) as amount_euros
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
  (pp.amount::decimal/100) as amount_euros
FROM pending_payments pp
JOIN campaigns c ON c.id = pp.campaign_id
JOIN profiles cp ON cp.id = c.creator_id
WHERE pp.system_type = 'campaigns' 
  AND pp.clipper_id = auth.uid()

ORDER BY created_at DESC;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Correction de la migration IBAN terminée !';
    RAISE NOTICE '📋 Table pending_payments recréée avec succès';
    RAISE NOTICE '🔒 Politiques RLS configurées';
    RAISE NOTICE '🎯 Prêt pour les fonctions et vues !';
END
$$; 