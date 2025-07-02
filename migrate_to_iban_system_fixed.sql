-- Migration vers système IBAN simple pour RelayBoom (VERSION CORRIGÉE)
-- Remplace le système Stripe Connect complexe par des virements IBAN

-- 1. Ajouter les champs IBAN aux profils clippeurs
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS iban VARCHAR(34);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bank_name VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_holder_name VARCHAR(255);

-- 2. Créer table des paiements en attente (remplace Stripe Connect)
CREATE TABLE IF NOT EXISTS pending_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES campaign_submissions(id) ON DELETE CASCADE,
  clipper_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  
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
  payment_reference VARCHAR(255) -- Référence du virement
);

-- 3. Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_pending_payments_status ON pending_payments(status);
CREATE INDEX IF NOT EXISTS idx_pending_payments_clipper_id ON pending_payments(clipper_id);
CREATE INDEX IF NOT EXISTS idx_pending_payments_created_at ON pending_payments(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_iban ON profiles(iban) WHERE iban IS NOT NULL;

-- 4. RLS pour pending_payments
ALTER TABLE pending_payments ENABLE ROW LEVEL SECURITY;

-- Les clippeurs peuvent voir leurs propres paiements
CREATE POLICY "Clippers can view own payments" ON pending_payments
  FOR SELECT USING (auth.uid() = clipper_id);

-- Les admins peuvent tout voir et modifier
CREATE POLICY "Admins can manage all payments" ON pending_payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5. Modifier campaign_submissions pour le nouveau système
ALTER TABLE campaign_submissions DROP COLUMN IF EXISTS stripe_transfer_id;
ALTER TABLE campaign_submissions ADD COLUMN IF NOT EXISTS pending_payment_id UUID REFERENCES pending_payments(id);

-- 6. Maintenant créer la vue (après que pending_payments existe)
CREATE OR REPLACE VIEW admin_pending_payments AS
SELECT 
  pp.*,
  p.pseudo as clipper_name,
  p.email as clipper_email,
  c.title as campaign_title,
  cr.pseudo as creator_name,
  (pp.amount::decimal/100) as amount_euros
FROM pending_payments pp
JOIN profiles p ON p.id = pp.clipper_id
JOIN campaigns c ON c.id = pp.campaign_id
JOIN profiles cr ON cr.id = c.creator_id
WHERE pp.status IN ('pending', 'processing')
ORDER BY pp.created_at DESC;

-- 7. Fonction pour créer automatiquement un paiement en attente
CREATE OR REPLACE FUNCTION create_pending_payment(
  submission_id_param UUID
) RETURNS UUID AS $$
DECLARE
  submission_record RECORD;
  clipper_profile RECORD;
  payment_id UUID;
  calculated_amount INTEGER;
BEGIN
  -- Récupérer la soumission avec les détails de campagne
  SELECT cs.*, c.price_per_1k_views, c.creator_id
  INTO submission_record
  FROM campaign_submissions cs
  JOIN campaigns c ON c.id = cs.campaign_id
  WHERE cs.id = submission_id_param;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Soumission non trouvée: %', submission_id_param;
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
  calculated_amount := (submission_record.views_count * submission_record.price_per_1k_views) / 1000;
  
  -- Créer le paiement en attente
  INSERT INTO pending_payments (
    submission_id, clipper_id, campaign_id,
    amount, iban, bank_name, account_holder_name,
    views_count, price_per_1k_views,
    calculation_details
  ) VALUES (
    submission_id_param,
    submission_record.clipper_id,
    submission_record.campaign_id,
    calculated_amount,
    clipper_profile.iban,
    clipper_profile.bank_name,
    COALESCE(clipper_profile.account_holder_name, clipper_profile.pseudo),
    submission_record.views_count,
    submission_record.price_per_1k_views,
    format('Calcul: %s vues × %s€/1k = %s€', 
      submission_record.views_count, 
      (submission_record.price_per_1k_views::decimal/100), 
      (calculated_amount::decimal/100)
    )
  ) RETURNING id INTO payment_id;
  
  -- Mettre à jour la soumission
  UPDATE campaign_submissions 
  SET 
    calculated_amount = calculated_amount,
    net_amount = calculated_amount, -- 100% car commission déjà prélevée
    payment_status = 'pending',
    pending_payment_id = payment_id
  WHERE id = submission_id_param;
  
  RETURN payment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Fonction pour marquer un paiement comme effectué
CREATE OR REPLACE FUNCTION mark_payment_as_paid(
  payment_id_param UUID,
  payment_reference_param VARCHAR(255) DEFAULT NULL,
  admin_notes_param TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  -- Mettre à jour le paiement
  UPDATE pending_payments 
  SET 
    status = 'paid',
    paid_at = NOW(),
    payment_reference = payment_reference_param,
    admin_notes = admin_notes_param
  WHERE id = payment_id_param;
  
  -- Mettre à jour la soumission correspondante
  UPDATE campaign_submissions 
  SET payment_status = 'paid', paid_at = NOW()
  WHERE pending_payment_id = payment_id_param;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Fonction pour obtenir les stats de paiements
CREATE OR REPLACE FUNCTION get_pending_payments_stats()
RETURNS TABLE (
  total_pending INTEGER,
  total_amount_pending BIGINT,
  oldest_pending_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER,
    COALESCE(SUM(amount), 0)::BIGINT,
    MIN(created_at)
  FROM pending_payments 
  WHERE status = 'pending';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Commentaires pour documentation
COMMENT ON TABLE pending_payments IS 'Table des paiements IBAN en attente pour les clippeurs';
COMMENT ON FUNCTION create_pending_payment IS 'Crée automatiquement un paiement en attente après validation d''une soumission';
COMMENT ON FUNCTION mark_payment_as_paid IS 'Marque un paiement comme effectué après virement bancaire';
COMMENT ON VIEW admin_pending_payments IS 'Vue admin des paiements en attente avec toutes les informations nécessaires';

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Migration vers système IBAN terminée avec succès !';
    RAISE NOTICE '📝 Les clippeurs peuvent maintenant renseigner leur IBAN dans leur profil';
    RAISE NOTICE '💰 Les paiements seront gérés via la table pending_payments';
    RAISE NOTICE '👨‍💼 L''admin peut voir tous les paiements en attente via admin_pending_payments';
END
$$; 