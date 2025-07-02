-- Structure complète Cliptokk - Wallet + Paiements automatiques
-- Architecture optimisée pour Stripe Connect Express

-- 1. Table Wallet des créateurs (crédits prépayés avec commission prélevée)
CREATE TABLE IF NOT EXISTS creator_wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Montants en centimes (EUR)
  total_deposited INTEGER DEFAULT 0, -- Total déposé par le créateur (montant brut)
  total_commission INTEGER DEFAULT 0, -- Total commission prélevée par Cliptokk
  total_credits INTEGER DEFAULT 0, -- Total crédits nets disponibles (après commission)
  available_credits INTEGER DEFAULT 0, -- Crédits disponibles
  reserved_credits INTEGER DEFAULT 0, -- Crédits réservés pour campagnes actives
  spent_credits INTEGER DEFAULT 0, -- Total dépensé
  
  -- Métadonnées
  last_recharge_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes d'intégrité
  CONSTRAINT positive_available CHECK (available_credits >= 0),
  CONSTRAINT positive_reserved CHECK (reserved_credits >= 0),
  CONSTRAINT wallet_balance_consistency CHECK (
    available_credits + reserved_credits + spent_credits = total_credits
  ),
  CONSTRAINT commission_consistency CHECK (
    total_credits = total_deposited - total_commission
  )
);

-- 2. Table Recharges wallet (historique Stripe avec commission)
CREATE TABLE IF NOT EXISTS wallet_recharges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
  
  -- Montants en centimes
  gross_amount INTEGER NOT NULL, -- Montant déposé par le créateur
  commission_amount INTEGER NOT NULL, -- Commission prélevée (10%)
  net_amount INTEGER NOT NULL, -- Montant net ajouté au wallet
  currency VARCHAR(3) DEFAULT 'eur',
  
  -- Statut
  status VARCHAR(50) DEFAULT 'pending', -- pending, succeeded, failed, cancelled
  
  -- Métadonnées Stripe
  stripe_charge_id VARCHAR(255),
  stripe_receipt_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT positive_recharge_amount CHECK (gross_amount > 0),
  CONSTRAINT commission_calculation CHECK (net_amount = gross_amount - commission_amount)
);

-- 3. Table Campagnes avec budget
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Détails campagne
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price_per_1k_views INTEGER NOT NULL, -- Prix en centimes
  
  -- Budget
  budget_type VARCHAR(20) DEFAULT 'limited', -- 'limited' ou 'unlimited'
  max_budget INTEGER, -- Budget max en centimes (NULL si unlimited)
  reserved_budget INTEGER DEFAULT 0, -- Budget réservé depuis le wallet
  spent_budget INTEGER DEFAULT 0, -- Budget déjà dépensé
  
  -- Statut
  status VARCHAR(50) DEFAULT 'active', -- active, paused, completed, cancelled
  
  -- Métadonnées
  target_audience TEXT,
  content_type VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table Comptes Stripe Connect des clippeurs
CREATE TABLE IF NOT EXISTS clipper_stripe_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clipper_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_account_id VARCHAR(255) UNIQUE NOT NULL,
  
  -- Statut du compte
  status VARCHAR(50) DEFAULT 'pending', -- pending, active, restricted, rejected
  charges_enabled BOOLEAN DEFAULT false,
  payouts_enabled BOOLEAN DEFAULT false,
  
  -- Exigences Stripe
  requirements_currently_due TEXT[],
  requirements_eventually_due TEXT[],
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table Soumissions avec calcul automatique
CREATE TABLE IF NOT EXISTS campaign_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  clipper_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Contenu
  tiktok_url VARCHAR(500) NOT NULL,
  description TEXT,
  
  -- Métriques
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  
  -- Paiement calculé automatiquement
  calculated_amount INTEGER DEFAULT 0, -- Montant calculé en centimes
  commission_amount INTEGER DEFAULT 0, -- Commission Cliptokk (10%)
  net_amount INTEGER DEFAULT 0, -- Montant net pour le clippeur
  
  -- Statut
  submission_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, processing, paid, failed
  
  -- IDs de paiement
  stripe_transfer_id VARCHAR(255), -- ID du transfert Stripe
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Table Historique des paiements (audit trail)
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES campaign_submissions(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  clipper_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Montants en centimes
  gross_amount INTEGER NOT NULL, -- Montant brut calculé
  commission_amount INTEGER NOT NULL, -- Commission Cliptokk
  net_amount INTEGER NOT NULL, -- Montant net clippeur
  
  -- IDs Stripe
  stripe_transfer_id VARCHAR(255),
  stripe_account_id VARCHAR(255),
  
  -- Statut
  status VARCHAR(50) DEFAULT 'pending', -- pending, succeeded, failed
  
  -- Métadonnées
  views_at_payment INTEGER,
  price_per_1k_at_payment INTEGER,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 7. Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_creator_wallets_creator_id ON creator_wallets(creator_id);
CREATE INDEX IF NOT EXISTS idx_wallet_recharges_creator_id ON wallet_recharges(creator_id);
CREATE INDEX IF NOT EXISTS idx_wallet_recharges_status ON wallet_recharges(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_creator_id ON campaigns(creator_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_clipper_stripe_accounts_clipper_id ON clipper_stripe_accounts(clipper_id);
CREATE INDEX IF NOT EXISTS idx_campaign_submissions_campaign_id ON campaign_submissions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_submissions_clipper_id ON campaign_submissions(clipper_id);
CREATE INDEX IF NOT EXISTS idx_campaign_submissions_payment_status ON campaign_submissions(payment_status);
CREATE INDEX IF NOT EXISTS idx_payment_history_creator_id ON payment_history(creator_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_clipper_id ON payment_history(clipper_id);

-- 8. Politiques de sécurité RLS
ALTER TABLE creator_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_recharges ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE clipper_stripe_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Politiques pour les créateurs
CREATE POLICY "Creators can view own wallet" ON creator_wallets
  FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Creators can view own recharges" ON wallet_recharges
  FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Creators can manage own campaigns" ON campaigns
  FOR ALL USING (auth.uid() = creator_id);

-- Politiques pour les clippeurs
CREATE POLICY "Clippers can view own stripe account" ON clipper_stripe_accounts
  FOR ALL USING (auth.uid() = clipper_id);

CREATE POLICY "Clippers can view own submissions" ON campaign_submissions
  FOR SELECT USING (auth.uid() = clipper_id);

CREATE POLICY "Clippers can create submissions" ON campaign_submissions
  FOR INSERT WITH CHECK (auth.uid() = clipper_id);

-- Politiques pour l'historique des paiements
CREATE POLICY "Creators can view payments for their campaigns" ON payment_history
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Clippers can view their own payments" ON payment_history
  FOR SELECT USING (auth.uid() = clipper_id);

-- 9. Fonctions métier automatisées

-- Fonction : Recharger le wallet avec commission prélevée
CREATE OR REPLACE FUNCTION recharge_wallet(
  creator_user_id UUID,
  gross_amount INTEGER,
  payment_intent_id VARCHAR(255)
)
RETURNS BOOLEAN AS $$
DECLARE
  wallet_exists BOOLEAN;
  commission_amount INTEGER;
  net_amount INTEGER;
BEGIN
  -- Calculer la commission (10%)
  commission_amount := ROUND(gross_amount * 0.10);
  net_amount := gross_amount - commission_amount;
  
  -- Vérifier si le wallet existe
  SELECT EXISTS(SELECT 1 FROM creator_wallets WHERE creator_id = creator_user_id) INTO wallet_exists;
  
  -- Créer le wallet s'il n'existe pas
  IF NOT wallet_exists THEN
    INSERT INTO creator_wallets (
      creator_id, 
      total_deposited, 
      total_commission, 
      total_credits, 
      available_credits, 
      last_recharge_at
    )
    VALUES (
      creator_user_id, 
      gross_amount, 
      commission_amount, 
      net_amount, 
      net_amount, 
      NOW()
    );
  ELSE
    -- Mettre à jour le wallet existant
    UPDATE creator_wallets 
    SET 
      total_deposited = total_deposited + gross_amount,
      total_commission = total_commission + commission_amount,
      total_credits = total_credits + net_amount,
      available_credits = available_credits + net_amount,
      last_recharge_at = NOW(),
      updated_at = NOW()
    WHERE creator_id = creator_user_id;
  END IF;
  
  -- Enregistrer la recharge avec détails commission
  UPDATE wallet_recharges 
  SET 
    status = 'succeeded', 
    completed_at = NOW(),
    commission_amount = commission_amount,
    net_amount = net_amount
  WHERE stripe_payment_intent_id = payment_intent_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction : Réserver budget pour campagne
CREATE OR REPLACE FUNCTION reserve_campaign_budget(
  creator_user_id UUID,
  campaign_id_param UUID,
  budget_amount INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  available_credits_val INTEGER;
BEGIN
  -- Vérifier les crédits disponibles
  SELECT available_credits INTO available_credits_val
  FROM creator_wallets 
  WHERE creator_id = creator_user_id;
  
  -- Vérifier si suffisant
  IF available_credits_val IS NULL OR available_credits_val < budget_amount THEN
    RAISE EXCEPTION 'Crédits insuffisants. Disponible: %, Requis: %', available_credits_val, budget_amount;
  END IF;
  
  -- Réserver le budget
  UPDATE creator_wallets 
  SET 
    available_credits = available_credits - budget_amount,
    reserved_credits = reserved_credits + budget_amount,
    updated_at = NOW()
  WHERE creator_id = creator_user_id;
  
  -- Mettre à jour la campagne
  UPDATE campaigns 
  SET reserved_budget = budget_amount
  WHERE id = campaign_id_param;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction : Calculer et traiter paiement automatique (sans commission sur paiement)
CREATE OR REPLACE FUNCTION process_automatic_payment(
  submission_id_param UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  submission_record RECORD;
  campaign_record RECORD;
  payment_amount INTEGER;
BEGIN
  -- Récupérer la soumission
  SELECT *
  INTO submission_record
  FROM campaign_submissions 
  WHERE id = submission_id_param AND submission_status = 'approved' AND payment_status = 'pending';
  
  -- Récupérer la campagne
  SELECT price_per_1k_views, creator_id, reserved_budget, spent_budget
  INTO campaign_record
  FROM campaigns 
  WHERE id = submission_record.campaign_id;
  
  IF submission_record IS NULL THEN
    RAISE EXCEPTION 'Soumission non trouvée ou déjà traitée';
  END IF;
  
  IF campaign_record IS NULL THEN
    RAISE EXCEPTION 'Campagne associée non trouvée';
  END IF;
  
  -- Calculer le montant à payer (100% au clippeur, commission déjà prélevée)
  payment_amount := (submission_record.views_count / 1000.0) * campaign_record.price_per_1k_views;
  
  -- Vérifier le budget disponible
  IF campaign_record.spent_budget + payment_amount > campaign_record.reserved_budget THEN
    RAISE EXCEPTION 'Budget campagne dépassé';
  END IF;
  
  -- Mettre à jour la soumission (pas de commission sur le paiement)
  UPDATE campaign_submissions 
  SET 
    calculated_amount = payment_amount,
    commission_amount = 0, -- Commission déjà prélevée lors de la recharge
    net_amount = payment_amount, -- 100% au clippeur
    payment_status = 'processing',
    updated_at = NOW()
  WHERE id = submission_id_param;
  
  -- Mettre à jour le budget de la campagne
  UPDATE campaigns 
  SET spent_budget = spent_budget + payment_amount
  WHERE id = submission_record.campaign_id;
  
  -- Mettre à jour le wallet du créateur
  UPDATE creator_wallets 
  SET 
    reserved_credits = reserved_credits - payment_amount,
    spent_credits = spent_credits + payment_amount,
    updated_at = NOW()
  WHERE creator_id = campaign_record.creator_id;
  
  -- Créer l'entrée dans l'historique (sans commission sur paiement)
  INSERT INTO payment_history (
    submission_id, campaign_id, creator_id, clipper_id,
    gross_amount, commission_amount, net_amount,
    views_at_payment, price_per_1k_at_payment
  ) VALUES (
    submission_id_param, submission_record.campaign_id, campaign_record.creator_id, submission_record.clipper_id,
    payment_amount, 0, payment_amount, -- Commission = 0 car déjà prélevée
    submission_record.views_count, campaign_record.price_per_1k_views
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_creator_wallets_updated_at
  BEFORE UPDATE ON creator_wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clipper_stripe_accounts_updated_at
  BEFORE UPDATE ON clipper_stripe_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_submissions_updated_at
  BEFORE UPDATE ON campaign_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Vues pour le dashboard
CREATE OR REPLACE VIEW creator_dashboard_stats AS
SELECT 
  cw.creator_id,
  p.pseudo as creator_name,
  cw.total_deposited,
  cw.total_commission,
  cw.total_credits,
  cw.available_credits,
  cw.reserved_credits,
  cw.spent_credits,
  COUNT(DISTINCT c.id) as total_campaigns,
  COUNT(DISTINCT cs.id) as total_submissions,
  cw.total_commission as total_commission_earned, -- Commission prélevée lors des recharges
  COALESCE(SUM(ph.net_amount), 0) as total_paid_to_clippers
FROM creator_wallets cw
LEFT JOIN profiles p ON p.id = cw.creator_id
LEFT JOIN campaigns c ON c.creator_id = cw.creator_id
LEFT JOIN campaign_submissions cs ON cs.campaign_id = c.id AND cs.submission_status = 'approved'
LEFT JOIN payment_history ph ON ph.creator_id = cw.creator_id
GROUP BY cw.creator_id, p.pseudo, cw.total_deposited, cw.total_commission, cw.total_credits, cw.available_credits, cw.reserved_credits, cw.spent_credits;

CREATE OR REPLACE VIEW clipper_earnings_stats AS
SELECT 
  csa.clipper_id,
  p.pseudo as clipper_name,
  csa.stripe_account_id,
  csa.status as stripe_status,
  csa.payouts_enabled,
  COUNT(DISTINCT cs.id) as total_submissions,
  COUNT(DISTINCT CASE WHEN cs.submission_status = 'approved' THEN cs.id END) as approved_submissions,
  COALESCE(SUM(CASE WHEN ph.status = 'succeeded' THEN ph.net_amount ELSE 0 END), 0) as total_earnings,
  COALESCE(SUM(CASE WHEN ph.status = 'pending' THEN ph.net_amount ELSE 0 END), 0) as pending_earnings
FROM clipper_stripe_accounts csa
LEFT JOIN profiles p ON p.id = csa.clipper_id
LEFT JOIN campaign_submissions cs ON cs.clipper_id = csa.clipper_id
LEFT JOIN payment_history ph ON ph.clipper_id = csa.clipper_id
GROUP BY csa.clipper_id, p.pseudo, csa.stripe_account_id, csa.status, csa.payouts_enabled;

-- Fin du script Cliptokk
-- Structure complète pour wallet + paiements automatiques 