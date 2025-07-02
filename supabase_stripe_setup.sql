-- Script SQL pour intégrer Stripe à RelayBoom
-- Exécutez ce script dans Supabase SQL Editor

-- 1. Table pour les comptes Stripe Connect des clippeurs
CREATE TABLE IF NOT EXISTS stripe_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_account_id VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, active, restricted, rejected
  charges_enabled BOOLEAN DEFAULT false,
  payouts_enabled BOOLEAN DEFAULT false,
  requirements_currently_due TEXT[], -- Tableau des exigences en cours
  requirements_eventually_due TEXT[], -- Tableau des exigences futures
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table pour les paiements Stripe
CREATE TABLE IF NOT EXISTS stripe_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  clipper_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  clipper_stripe_account_id VARCHAR(255) REFERENCES stripe_accounts(stripe_account_id),
  
  -- Montants en centimes (EUR)
  gross_amount INTEGER NOT NULL, -- Montant brut
  platform_fee INTEGER NOT NULL, -- Commission RelayBoom
  stripe_fee INTEGER NOT NULL, -- Frais Stripe
  net_amount INTEGER NOT NULL, -- Montant net pour le clippeur
  
  -- Statut du paiement
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, succeeded, failed, cancelled
  
  -- Métadonnées
  views_count INTEGER DEFAULT 0,
  price_per_1k_views INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table pour les retraits (payouts) des clippeurs
CREATE TABLE IF NOT EXISTS stripe_payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payout_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_account_id VARCHAR(255) REFERENCES stripe_accounts(stripe_account_id),
  
  -- Montant en centimes
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'eur',
  
  -- Statut
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_transit, paid, failed, cancelled
  method VARCHAR(50) DEFAULT 'standard', -- standard, instant
  
  -- Métadonnées
  description TEXT,
  failure_code VARCHAR(100),
  failure_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  arrival_date TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Ajout de colonnes Stripe aux tables existantes
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_account_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT false;

-- 5. Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_stripe_accounts_user_id ON stripe_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_accounts_stripe_id ON stripe_accounts(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payments_mission_id ON stripe_payments(mission_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payments_creator_id ON stripe_payments(creator_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payments_clipper_id ON stripe_payments(clipper_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payments_status ON stripe_payments(status);
CREATE INDEX IF NOT EXISTS idx_stripe_payouts_user_id ON stripe_payouts(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payouts_status ON stripe_payouts(status);

-- 6. Politiques de sécurité RLS (Row Level Security)
ALTER TABLE stripe_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_payouts ENABLE ROW LEVEL SECURITY;

-- Politique pour stripe_accounts : les utilisateurs ne peuvent voir que leur propre compte
CREATE POLICY "Users can view own stripe account" ON stripe_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stripe account" ON stripe_accounts
  FOR UPDATE USING (auth.uid() = user_id);

-- Politique pour stripe_payments : créateurs voient leurs paiements, clippeurs voient les leurs
CREATE POLICY "Creators can view their payments" ON stripe_payments
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Clippers can view their earnings" ON stripe_payments
  FOR SELECT USING (auth.uid() = clipper_id);

-- Politique pour stripe_payouts : utilisateurs voient seulement leurs retraits
CREATE POLICY "Users can view own payouts" ON stripe_payouts
  FOR SELECT USING (auth.uid() = user_id);

-- 7. Fonctions pour calculer les statistiques
CREATE OR REPLACE FUNCTION get_clipper_earnings_stats(clipper_user_id UUID)
RETURNS TABLE (
  total_earnings BIGINT,
  pending_earnings BIGINT,
  paid_earnings BIGINT,
  total_payouts BIGINT,
  available_balance BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN sp.status = 'succeeded' THEN sp.net_amount ELSE 0 END), 0) as total_earnings,
    COALESCE(SUM(CASE WHEN sp.status IN ('pending', 'processing') THEN sp.net_amount ELSE 0 END), 0) as pending_earnings,
    COALESCE(SUM(CASE WHEN sp.status = 'succeeded' THEN sp.net_amount ELSE 0 END), 0) as paid_earnings,
    COALESCE(SUM(spo.amount), 0) as total_payouts,
    COALESCE(SUM(CASE WHEN sp.status = 'succeeded' THEN sp.net_amount ELSE 0 END), 0) - COALESCE(SUM(spo.amount), 0) as available_balance
  FROM stripe_payments sp
  LEFT JOIN stripe_payouts spo ON spo.user_id = clipper_user_id AND spo.status = 'paid'
  WHERE sp.clipper_id = clipper_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_creator_payment_stats(creator_user_id UUID)
RETURNS TABLE (
  total_spent BIGINT,
  total_platform_fees BIGINT,
  total_stripe_fees BIGINT,
  monthly_spent BIGINT,
  pending_payments BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(sp.gross_amount), 0) as total_spent,
    COALESCE(SUM(sp.platform_fee), 0) as total_platform_fees,
    COALESCE(SUM(sp.stripe_fee), 0) as total_stripe_fees,
    COALESCE(SUM(CASE WHEN sp.created_at >= date_trunc('month', CURRENT_DATE) THEN sp.gross_amount ELSE 0 END), 0) as monthly_spent,
    COALESCE(SUM(CASE WHEN sp.status IN ('pending', 'processing') THEN sp.gross_amount ELSE 0 END), 0) as pending_payments
  FROM stripe_payments sp
  WHERE sp.creator_id = creator_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stripe_accounts_updated_at
  BEFORE UPDATE ON stripe_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stripe_payments_updated_at
  BEFORE UPDATE ON stripe_payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stripe_payouts_updated_at
  BEFORE UPDATE ON stripe_payouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Données d'exemple (optionnel - pour les tests)
-- Décommentez si vous voulez des données de test
/*
INSERT INTO stripe_accounts (user_id, stripe_account_id, status, charges_enabled, payouts_enabled)
SELECT 
  id,
  'acct_test_' || substr(id::text, 1, 10),
  'active',
  true,
  true
FROM auth.users 
WHERE id IN (
  SELECT id FROM profiles WHERE role = 'clipper'
) LIMIT 3;
*/

-- 10. Vue pour faciliter les requêtes
CREATE OR REPLACE VIEW stripe_payments_detailed AS
SELECT 
  sp.*,
  p_creator.pseudo as creator_pseudo,
  p_clipper.pseudo as clipper_pseudo,
  m.title as mission_title,
  m.price_per_1k_views as mission_price_per_1k,
  sa.status as stripe_account_status,
  sa.payouts_enabled
FROM stripe_payments sp
LEFT JOIN profiles p_creator ON p_creator.id = sp.creator_id
LEFT JOIN profiles p_clipper ON p_clipper.id = sp.clipper_id
LEFT JOIN missions m ON m.id = sp.mission_id
LEFT JOIN stripe_accounts sa ON sa.stripe_account_id = sp.clipper_stripe_account_id;

-- Fin du script Stripe
-- Vos clés Stripe doivent être ajoutées dans .env.local :
-- STRIPE_SECRET_KEY=sk_test_...
-- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
-- NEXT_PUBLIC_BASE_URL=http://localhost:3001 