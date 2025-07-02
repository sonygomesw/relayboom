# 🎯 Guide Complet Stripe - Cliptokk

## 📋 Vue d'ensemble

**Cliptokk** utilise **Stripe Connect Express** pour gérer les paiements automatiques entre créateurs et clippeurs, avec un système de wallet prépayé garantissant 0 avance de fonds pour la plateforme.

### 🏗️ Architecture

```
Créateur → Recharge 500€ (Stripe) → Commission 10% (50€) → Cliptokk
                ↓
        Crédits nets 450€ → Campagnes → Paiements 100% → Clippeurs (Stripe Connect)
```

---

## ⚙️ Configuration

### 1. Variables d'environnement (.env.local)

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# URL de base
NEXT_PUBLIC_BASE_URL=http://localhost:3001

# Supabase (déjà configuré)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 2. Configuration Stripe Dashboard

1. **Activer Stripe Connect**
   - Aller dans "Connect" → "Settings"
   - Activer "Express accounts"
   - Configurer les URLs de redirection

2. **Configurer les Webhooks**
   - URL: `https://votre-domaine.com/api/stripe/webhooks`
   - Événements à écouter:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `account.updated`
     - `transfer.created`
     - `transfer.updated`

---

## 🚀 Flux Utilisateur Complet

### 👨‍💼 Créateur

1. **Recharge du Wallet**
   ```typescript
   // Interface: WalletRecharge component
   // API: /api/wallet/recharge
   // Montants: 50€ - 10,000€
   ```

2. **Création de Campagne**
   ```typescript
   // Budget limité ou illimité
   // Réservation automatique des crédits
   // Prix par 1K vues configuré
   ```

3. **Suivi des Performances**
   ```typescript
   // Dashboard temps réel
   // Statistiques de dépenses
   // Commission générée
   ```

### 👤 Clippeur

1. **Configuration Stripe Connect**
   ```typescript
   // Interface: ClipperStripeSetup component
   // API: /api/stripe/connect/create
   // Onboarding automatique
   ```

2. **Soumission de Clips**
   ```typescript
   // Upload TikTok URL
   // Métriques automatiques
   // Calcul de gains
   ```

3. **Paiements Automatiques**
   ```typescript
   // API: /api/payments/process
   // Transfert Stripe Connect
   // Commission déjà déduite
   ```

---

## 💰 Système de Paiements

### Calcul Automatique

```sql
-- Exemple: Recharge 500€
gross_amount = 50000 centimes (500€)
commission = 50000 * 0.10 = 5000 centimes (50€)
net_credits = 50000 - 5000 = 45000 centimes (450€)

-- Puis: 10K vues à 2€/1K
payment_amount = (10000 / 1000) * 200 = 2000 centimes (20€)
clippeur_reçoit = 2000 centimes (100% - 20€)
```

### Flux de Paiement

1. **Validation**: Soumission approuvée
2. **Calcul**: Fonction SQL `process_automatic_payment()`
3. **Vérification**: Budget disponible
4. **Transfert**: Stripe Connect vers clippeur
5. **Commission**: Automatiquement retenue

---

## 🔧 API Endpoints

### Wallet Management

```typescript
POST /api/wallet/recharge
// Créer une recharge de wallet
{
  "amount": 500 // en euros
}
```

### Stripe Connect

```typescript
POST /api/stripe/connect/create
// Créer un compte clippeur
{
  "email": "clipper@example.com",
  "country": "FR"
}
```

### Paiements

```typescript
POST /api/payments/process
// Traiter un paiement automatique
{
  "submissionId": "uuid"
}
```

### Webhooks

```typescript
POST /api/stripe/webhooks
// Gérer les événements Stripe
// Signature verification automatique
```

---

## 🗄️ Structure Base de Données

### Tables Principales

```sql
-- Wallet des créateurs
creator_wallets (
  total_credits,      -- Total rechargé
  available_credits,  -- Disponible
  reserved_credits,   -- Réservé pour campagnes
  spent_credits      -- Déjà dépensé
)

-- Historique recharges
wallet_recharges (
  stripe_payment_intent_id,
  amount,
  status
)

-- Comptes Stripe clippeurs
clipper_stripe_accounts (
  stripe_account_id,
  payouts_enabled,
  status
)

-- Soumissions avec paiements
campaign_submissions (
  calculated_amount,   -- Montant brut
  commission_amount,   -- Commission 10%
  net_amount,         -- Net clippeur
  stripe_transfer_id  -- ID transfert
)
```

### Fonctions SQL

```sql
-- Recharger wallet
SELECT recharge_wallet(creator_id, amount, payment_intent_id);

-- Réserver budget campagne
SELECT reserve_campaign_budget(creator_id, campaign_id, amount);

-- Traiter paiement automatique
SELECT process_automatic_payment(submission_id);
```

---

## 📊 Dashboard Stripe

### Créateurs - Métriques

```typescript
const stats = await getCreatorDashboardStats(creatorId)
// wallet: { totalCredits, availableCredits, reservedCredits, spentCredits }
// campaigns: { totalCampaigns, totalSubmissions }
// revenue: { totalCommissionEarned, totalPaidToClippers }
```

### Clippeurs - Gains

```typescript
const earnings = await getClipperEarningsStats(clipperId)
// stripeAccount: { accountId, status, payoutsEnabled }
// submissions: { totalSubmissions, approvedSubmissions }
// earnings: { totalEarnings, pendingEarnings }
```

---

## 🛡️ Sécurité

### Authentification

- ✅ Token Supabase requis pour toutes les API
- ✅ Vérification des rôles (créateur/clippeur)
- ✅ RLS (Row Level Security) sur toutes les tables

### Validation

- ✅ Montants minimum/maximum
- ✅ Budget disponible vérifié
- ✅ Comptes Stripe validés
- ✅ Webhooks avec signature verification

### Contraintes Base de Données

```sql
-- Contraintes d'intégrité
CONSTRAINT wallet_balance_consistency CHECK (
  available_credits + reserved_credits + spent_credits = total_credits
)

CONSTRAINT positive_amounts CHECK (amount > 0)
```

---

## 🚀 Déploiement Production

### 1. Configuration Stripe Live

```bash
# Remplacer par les clés live
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
```

### 2. Webhooks Production

- URL: `https://cliptokk.com/api/stripe/webhooks`
- SSL requis
- Endpoints de test configurés

### 3. Monitoring

```typescript
// Logs automatiques
console.log('✅ Wallet rechargé:', paymentIntentId)
console.log('💰 Paiement automatique:', transferId)
console.log('🔔 Webhook reçu:', eventType)
```

---

## 🔍 Dépannage

### Erreurs Communes

1. **"Crédits insuffisants"**
   - Vérifier `available_credits` dans `creator_wallets`
   - Recharger le wallet

2. **"Compte Stripe non activé"**
   - Compléter l'onboarding Stripe Connect
   - Vérifier `payouts_enabled = true`

3. **"Budget dépassé"**
   - Vérifier `spent_budget` vs `reserved_budget`
   - Ajuster le budget de campagne

### Commandes Utiles

```sql
-- Vérifier wallet créateur
SELECT * FROM creator_wallets WHERE creator_id = 'uuid';

-- Vérifier compte Stripe clippeur
SELECT * FROM clipper_stripe_accounts WHERE clipper_id = 'uuid';

-- Historique paiements
SELECT * FROM payment_history WHERE creator_id = 'uuid';
```

---

## 📈 Métriques Business

### Commission Cliptokk

- **10%** sur chaque paiement aux clippeurs
- Prélevée automatiquement
- Visible dans les statistiques créateur

### Exemple Calcul

```
Clippeur gagne 10K vues à 2€/1K = 20€
Commission Cliptokk: 20€ × 10% = 2€
Net clippeur: 18€
Cliptokk gagne: 2€ (+ frais Stripe ~3%)
```

---

## ✅ Checklist Go-Live

- [ ] Variables d'environnement production configurées
- [ ] Base de données Supabase mise à jour
- [ ] Webhooks Stripe configurés
- [ ] Tests de paiement effectués
- [ ] Monitoring en place
- [ ] Documentation équipe complète

---

**🎉 Félicitations ! Cliptokk est maintenant prêt avec un système de paiements automatiques complet et sécurisé.**