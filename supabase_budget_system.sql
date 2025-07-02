-- Système de Budget Prépayé pour RelayBoom
-- Les créateurs/brands doivent déposer un budget avant de créer des missions

-- 1. Table pour les budgets des créateurs
CREATE TABLE IF NOT EXISTS creator_budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Montants en centimes (EUR)
  total_deposited INTEGER DEFAULT 0, -- Total déposé depuis le début
  current_balance INTEGER DEFAULT 0, -- Solde actuel disponible
  reserved_amount INTEGER DEFAULT 0, -- Montant réservé pour missions actives
  spent_amount INTEGER DEFAULT 0, -- Total dépensé
  
  -- Métadonnées
  last_deposit_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT positive_balance CHECK (current_balance >= 0),
  CONSTRAINT positive_reserved CHECK (reserved_amount >= 0)
);

-- 2. Table pour l'historique des dépôts
CREATE TABLE IF NOT EXISTS budget_deposits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
  
  -- Montant en centimes
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'eur',
  
  -- Statut du dépôt
  status VARCHAR(50) DEFAULT 'pending', -- pending, succeeded, failed, cancelled
  
  -- Métadonnées Stripe
  stripe_charge_id VARCHAR(255),
  stripe_receipt_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT positive_amount CHECK (amount > 0)
);

-- 3. Table pour les réservations de budget (missions actives)
CREATE TABLE IF NOT EXISTS budget_reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  
  -- Montant réservé en centimes
  reserved_amount INTEGER NOT NULL,
  used_amount INTEGER DEFAULT 0, -- Montant déjà utilisé pour les paiements
  
  -- Statut
  status VARCHAR(50) DEFAULT 'active', -- active, completed, cancelled, expired
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT positive_reserved_amount CHECK (reserved_amount > 0),
  CONSTRAINT valid_used_amount CHECK (used_amount <= reserved_amount AND used_amount >= 0)
);

-- 4. Modifier la table missions pour inclure le budget requis
ALTER TABLE missions 
ADD COLUMN IF NOT EXISTS required_budget INTEGER, -- Budget minimum requis
ADD COLUMN IF NOT EXISTS budget_reservation_id UUID REFERENCES budget_reservations(id);

-- 5. Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_creator_budgets_user_id ON creator_budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_deposits_user_id ON budget_deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_deposits_status ON budget_deposits(status);
CREATE INDEX IF NOT EXISTS idx_budget_reservations_user_id ON budget_reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_reservations_mission_id ON budget_reservations(mission_id);
CREATE INDEX IF NOT EXISTS idx_budget_reservations_status ON budget_reservations(status);

-- 6. Politiques de sécurité RLS
ALTER TABLE creator_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_reservations ENABLE ROW LEVEL SECURITY;

-- Seuls les utilisateurs peuvent voir leur propre budget
CREATE POLICY "Users can view own budget" ON creator_budgets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own deposits" ON budget_deposits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reservations" ON budget_reservations
  FOR SELECT USING (auth.uid() = user_id);

-- 7. Fonctions pour gérer le budget

-- Fonction pour déposer du budget
CREATE OR REPLACE FUNCTION deposit_budget(
  creator_user_id UUID,
  deposit_amount INTEGER,
  payment_intent_id VARCHAR(255)
)
RETURNS BOOLEAN AS $$
DECLARE
  budget_exists BOOLEAN;
BEGIN
  -- Vérifier si un budget existe déjà
  SELECT EXISTS(SELECT 1 FROM creator_budgets WHERE user_id = creator_user_id) INTO budget_exists;
  
  -- Créer le budget s'il n'existe pas
  IF NOT budget_exists THEN
    INSERT INTO creator_budgets (user_id, current_balance, total_deposited, last_deposit_at)
    VALUES (creator_user_id, deposit_amount, deposit_amount, NOW());
  ELSE
    -- Mettre à jour le budget existant
    UPDATE creator_budgets 
    SET 
      current_balance = current_balance + deposit_amount,
      total_deposited = total_deposited + deposit_amount,
      last_deposit_at = NOW(),
      updated_at = NOW()
    WHERE user_id = creator_user_id;
  END IF;
  
  -- Enregistrer le dépôt
  INSERT INTO budget_deposits (user_id, stripe_payment_intent_id, amount, status, completed_at)
  VALUES (creator_user_id, payment_intent_id, deposit_amount, 'succeeded', NOW());
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour réserver du budget pour une mission
CREATE OR REPLACE FUNCTION reserve_budget_for_mission(
  creator_user_id UUID,
  mission_id_param UUID,
  required_amount INTEGER
)
RETURNS UUID AS $$
DECLARE
  current_balance_val INTEGER;
  reservation_id UUID;
BEGIN
  -- Vérifier le solde disponible
  SELECT current_balance INTO current_balance_val
  FROM creator_budgets 
  WHERE user_id = creator_user_id;
  
  -- Vérifier si le solde est suffisant
  IF current_balance_val IS NULL OR current_balance_val < required_amount THEN
    RAISE EXCEPTION 'Budget insuffisant. Solde: %, Requis: %', current_balance_val, required_amount;
  END IF;
  
  -- Créer la réservation
  INSERT INTO budget_reservations (user_id, mission_id, reserved_amount)
  VALUES (creator_user_id, mission_id_param, required_amount)
  RETURNING id INTO reservation_id;
  
  -- Mettre à jour le budget (réserver le montant)
  UPDATE creator_budgets 
  SET 
    current_balance = current_balance - required_amount,
    reserved_amount = reserved_amount + required_amount,
    updated_at = NOW()
  WHERE user_id = creator_user_id;
  
  RETURN reservation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour utiliser le budget réservé (lors d'un paiement)
CREATE OR REPLACE FUNCTION use_reserved_budget(
  reservation_id_param UUID,
  used_amount_param INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  reservation_record RECORD;
  remaining_reserved INTEGER;
BEGIN
  -- Récupérer la réservation
  SELECT * INTO reservation_record
  FROM budget_reservations 
  WHERE id = reservation_id_param AND status = 'active';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Réservation non trouvée ou inactive';
  END IF;
  
  -- Vérifier que le montant utilisé ne dépasse pas le montant réservé
  IF reservation_record.used_amount + used_amount_param > reservation_record.reserved_amount THEN
    RAISE EXCEPTION 'Montant utilisé dépasse la réservation';
  END IF;
  
  -- Mettre à jour la réservation
  UPDATE budget_reservations 
  SET 
    used_amount = used_amount + used_amount_param
  WHERE id = reservation_id_param;
  
  -- Mettre à jour le budget du créateur
  UPDATE creator_budgets 
  SET 
    reserved_amount = reserved_amount - used_amount_param,
    spent_amount = spent_amount + used_amount_param,
    updated_at = NOW()
  WHERE user_id = reservation_record.user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour libérer le budget non utilisé d'une mission terminée
CREATE OR REPLACE FUNCTION release_unused_budget(
  reservation_id_param UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  reservation_record RECORD;
  unused_amount INTEGER;
BEGIN
  -- Récupérer la réservation
  SELECT * INTO reservation_record
  FROM budget_reservations 
  WHERE id = reservation_id_param;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Réservation non trouvée';
  END IF;
  
  -- Calculer le montant non utilisé
  unused_amount := reservation_record.reserved_amount - reservation_record.used_amount;
  
  -- Libérer le budget non utilisé
  IF unused_amount > 0 THEN
    UPDATE creator_budgets 
    SET 
      current_balance = current_balance + unused_amount,
      reserved_amount = reserved_amount - unused_amount,
      updated_at = NOW()
    WHERE user_id = reservation_record.user_id;
  END IF;
  
  -- Marquer la réservation comme terminée
  UPDATE budget_reservations 
  SET 
    status = 'completed',
    completed_at = NOW()
  WHERE id = reservation_id_param;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Vue pour faciliter les requêtes de budget
CREATE OR REPLACE VIEW creator_budget_summary AS
SELECT 
  cb.user_id,
  p.pseudo as creator_pseudo,
  cb.current_balance,
  cb.reserved_amount,
  cb.spent_amount,
  cb.total_deposited,
  cb.last_deposit_at,
  COUNT(br.id) as active_reservations,
  COALESCE(SUM(br.reserved_amount), 0) as total_reserved_check
FROM creator_budgets cb
LEFT JOIN profiles p ON p.id = cb.user_id
LEFT JOIN budget_reservations br ON br.user_id = cb.user_id AND br.status = 'active'
GROUP BY cb.user_id, p.pseudo, cb.current_balance, cb.reserved_amount, cb.spent_amount, cb.total_deposited, cb.last_deposit_at;

-- 9. Trigger pour mettre à jour updated_at
CREATE TRIGGER update_creator_budgets_updated_at
  BEFORE UPDATE ON creator_budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_reservations_updated_at
  BEFORE UPDATE ON budget_reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Contraintes d'intégrité supplémentaires
ALTER TABLE creator_budgets 
ADD CONSTRAINT budget_consistency 
CHECK (current_balance + reserved_amount + spent_amount = total_deposited);

-- Fin du script budget système
-- Les créateurs devront maintenant déposer un budget avant de créer des missions 