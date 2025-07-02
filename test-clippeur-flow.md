# 🧪 Test Flow Clippeur - Paiement Automatique

## 📋 **État Actuel du Système**

### ✅ **Fonctionnalités Implémentées**

1. **Compte Stripe Connect** : `/api/stripe/connect/create`
   - Création automatique pour clippeurs
   - Onboarding Stripe Express
   - Validation des payouts

2. **Paiement Automatique** : `/api/payments/process`
   - Calcul basé sur les vues (ex: 0.10€/1000 vues)
   - Transfert direct vers compte clippeur
   - Commission 0% (déjà prélevée lors recharge créateur)

3. **Fonction SQL** : `process_automatic_payment()`
   - Vérification budget créateur
   - Calcul montant exact
   - Mise à jour wallets et statuts

### 🔄 **Flow Complet**

```
1. Clippeur crée compte Stripe → Onboarding
2. Clippeur soumet clip TikTok → Validation admin
3. Admin valide → API /payments/process appelée
4. Système calcule montant → Transfer Stripe automatique
5. Clippeur reçoit paiement → 100% du montant calculé
```

---

## 🎯 **Tests à Effectuer**

### Test 1: Création Compte Stripe Clippeur

```bash
# API Call
POST /api/stripe/connect/create
{
  "email": "clippeur@test.com",
  "country": "FR"
}

# Résultat attendu
{
  "accountId": "acct_...",
  "onboardingUrl": "https://connect.stripe.com/..."
}
```

### Test 2: Soumission et Validation

```sql
-- Créer une soumission test
INSERT INTO campaign_submissions (
  campaign_id, clipper_id, tiktok_url, views_count,
  submission_status, payment_status
) VALUES (
  'campaign-uuid', 'clipper-uuid', 'https://tiktok.com/@test',
  50000, 'approved', 'pending'
);
```

### Test 3: Paiement Automatique

```bash
# API Call
POST /api/payments/process
{
  "submissionId": "submission-uuid"
}

# Résultat attendu
{
  "success": true,
  "message": "Paiement traité avec succès"
}
```

---

## 📊 **Calculs de Test**

### Exemple Concret

- **Campagne** : 0.10€ pour 1000 vues
- **Clip soumis** : 50,000 vues
- **Calcul** : (50,000 / 1000) × 0.10€ = **5.00€**
- **Commission clippeur** : 0% (déjà prélevée sur créateur)
- **Paiement final** : **5.00€ → compte Stripe clippeur**

### Budget Créateur

```sql
-- Avant validation
available_credits: 100€
reserved_credits: 20€

-- Après paiement 5€
available_credits: 100€  
reserved_credits: 15€    -- -5€
spent_credits: 5€        -- +5€
```

---

## 🔧 **Vérifications Nécessaires**

### 1. Base de Données

```sql
-- Vérifier fonction existe
SELECT EXISTS (
  SELECT 1 FROM pg_proc 
  WHERE proname = 'process_automatic_payment'
);

-- Tester appel fonction
SELECT process_automatic_payment('test-submission-id');
```

### 2. Tables Required

- ✅ `clipper_stripe_accounts` 
- ✅ `campaign_submissions`
- ✅ `payment_history`
- ✅ `creator_wallets`
- ✅ `campaigns`

### 3. APIs Fonctionnelles

- ✅ `/api/stripe/connect/create` - Création compte
- ✅ `/api/payments/process` - Traitement paiement
- ✅ `/api/stripe/webhooks` - Events transferts

---

## 🚨 **Points d'Attention**

### Problèmes Potentiels

1. **Compte Stripe non activé**
   ```
   Erreur: "Compte Stripe du clippeur non activé pour les paiements"
   Solution: Compléter onboarding Stripe
   ```

2. **Budget insuffisant**
   ```
   Erreur: "Budget campagne dépassé"
   Solution: Créateur doit recharger wallet
   ```

3. **Soumission déjà traitée**
   ```
   Erreur: "Soumission non trouvée ou déjà traitée"
   Solution: Vérifier statut en DB
   ```

---

## 🧪 **Test Complet Recommandé**

### Étape 1: Simuler Clippeur
```bash
# 1. Créer compte clippeur Supabase
# 2. Appeler /api/stripe/connect/create
# 3. Compléter onboarding Stripe (simulation)
```

### Étape 2: Simuler Mission
```sql
-- 1. Créer campagne avec budget
-- 2. Créer soumission "approved"
-- 3. Appeler API paiement
```

### Étape 3: Vérifier Résultat
```bash
# 1. Check logs Stripe (transfers)
# 2. Check DB (payment_history)
# 3. Check compte clippeur (solde)
```

---

## ✅ **Statut: PRÊT POUR TESTS**

Le système de paiement clippeur est **entièrement implémenté** avec :

- Architecture Stripe Connect ✅
- Calculs automatiques ✅  
- APIs sécurisées ✅
- Webhooks configurés ✅
- Fonctions SQL optimisées ✅

**Il ne reste qu'à tester en conditions réelles !** 🚀 