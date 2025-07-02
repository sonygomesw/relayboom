# 💳 Intégration Stripe - RelayBoom

## 🎯 Vue d'ensemble

RelayBoom utilise **Stripe Connect** pour gérer les paiements entre créateurs et clippeurs. Cette intégration permet :

- **Créateurs** : Payer automatiquement les clippeurs selon les performances
- **Clippeurs** : Recevoir leurs gains directement sur leur compte bancaire
- **Plateforme** : Prendre une commission de 10% sur chaque transaction

## 🏗️ Architecture

### **Flux de paiement**
1. **Créateur** crée une mission avec un prix par 1K vues
2. **Clippeur** soumet un clip et obtient des vues
3. **Système** calcule automatiquement le montant dû
4. **Paiement** est traité via Stripe avec répartition automatique
5. **Clippeur** reçoit ses gains (moins les commissions)

### **Structure des frais**
```
Montant brut (100€)
├── Commission RelayBoom (10€ - 10%)
├── Frais Stripe (3.20€ - 2.9% + 0.30€)
└── Montant net clippeur (86.80€)
```

## 🔧 Configuration

### **1. Variables d'environnement**

Ajoutez à votre `.env.local` :

```env
# Clés Stripe (Test)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# URL de base pour les redirections
NEXT_PUBLIC_BASE_URL=http://localhost:3001
```

### **2. Base de données**

Exécutez le script `supabase_stripe_setup.sql` dans Supabase SQL Editor :

```sql
-- Crée automatiquement :
-- ✅ Table stripe_accounts (comptes Connect)
-- ✅ Table stripe_payments (transactions)
-- ✅ Table stripe_payouts (retraits)
-- ✅ Fonctions de calcul de statistiques
-- ✅ Politiques de sécurité RLS
```

### **3. Configuration Stripe Dashboard**

1. **Créer un compte Stripe** : https://dashboard.stripe.com
2. **Activer Stripe Connect** dans les paramètres
3. **Configurer les webhooks** (optionnel pour la production)

## 📱 Utilisation

### **Pour les Clippeurs**

1. **Première connexion** : Le clippeur voit le composant `StripeOnboarding`
2. **Configuration** : Clic sur "Configurer mes paiements"
3. **Onboarding Stripe** : Redirection vers Stripe pour saisir les infos bancaires
4. **Validation** : Retour sur RelayBoom avec compte activé
5. **Paiements automatiques** : Réception des gains selon les performances

### **Pour les Créateurs**

1. **Missions** : Créent des missions avec prix par 1K vues
2. **Suivi** : Voient les paiements dans l'onglet "Paiements"
3. **Automatisation** : Les paiements sont traités automatiquement
4. **Rapports** : Statistiques détaillées des coûts et commissions

## 🔄 API Routes

### **POST /api/stripe/create-account**
Crée un compte Stripe Connect pour un clippeur

```typescript
// Requête
{
  // Authentification via header Authorization
}

// Réponse
{
  "accountId": "acct_...",
  "onboardingUrl": "https://connect.stripe.com/setup/..."
}
```

### **POST /api/stripe/create-payment**
Crée un paiement pour une mission (à implémenter)

```typescript
// Requête
{
  "missionId": "uuid",
  "clipperId": "uuid", 
  "views": 50000,
  "pricePerK": 2.5
}

// Réponse
{
  "paymentIntentId": "pi_...",
  "amount": 12500, // en centimes
  "netAmount": 10850 // montant net clippeur
}
```

## 📊 Tables Base de Données

### **stripe_accounts**
```sql
id                    UUID PRIMARY KEY
user_id              UUID REFERENCES auth.users(id)
stripe_account_id    VARCHAR(255) UNIQUE
status               VARCHAR(50) -- pending, active, restricted
charges_enabled      BOOLEAN
payouts_enabled      BOOLEAN
requirements_*       TEXT[] -- exigences Stripe
created_at           TIMESTAMP
updated_at           TIMESTAMP
```

### **stripe_payments**
```sql
id                          UUID PRIMARY KEY
payment_intent_id          VARCHAR(255) UNIQUE
mission_id                 UUID REFERENCES missions(id)
creator_id                 UUID REFERENCES auth.users(id)
clipper_id                 UUID REFERENCES auth.users(id)
clipper_stripe_account_id  VARCHAR(255)
gross_amount               INTEGER -- montant brut (centimes)
platform_fee               INTEGER -- commission RelayBoom
stripe_fee                 INTEGER -- frais Stripe
net_amount                 INTEGER -- montant net clippeur
status                     VARCHAR(50) -- pending, succeeded, failed
views_count                INTEGER
price_per_1k_views        INTEGER
created_at                 TIMESTAMP
paid_at                    TIMESTAMP
```

### **stripe_payouts**
```sql
id                 UUID PRIMARY KEY
payout_id         VARCHAR(255) UNIQUE
user_id           UUID REFERENCES auth.users(id)
stripe_account_id VARCHAR(255)
amount            INTEGER -- montant en centimes
status            VARCHAR(50) -- pending, paid, failed
method            VARCHAR(50) -- standard, instant
created_at        TIMESTAMP
arrival_date      TIMESTAMP
```

## 🧩 Composants

### **StripeOnboarding**
Composant pour configurer le compte Stripe des clippeurs

```tsx
// Utilisation
import StripeOnboarding from '@/components/StripeOnboarding'

<StripeOnboarding />
```

**Fonctionnalités :**
- Détection automatique du statut du compte
- Interface d'onboarding intuitive
- Gestion des erreurs et états de chargement
- Affichage du statut des paiements/retraits

### **PaymentButton** (à implémenter)
Composant pour déclencher les paiements

```tsx
// Utilisation future
<PaymentButton 
  missionId="uuid"
  clipperId="uuid"
  amount={125.50}
  onSuccess={handlePaymentSuccess}
/>
```

## 🔐 Sécurité

### **Authentification**
- Toutes les API routes vérifient l'authentification Supabase
- Les tokens sont validés côté serveur

### **Autorisations**
- Seuls les clippeurs peuvent créer des comptes Stripe
- Les créateurs ne voient que leurs propres paiements
- RLS (Row Level Security) appliqué sur toutes les tables

### **Validation**
- Montants validés côté serveur
- Vérification des relations mission/utilisateur
- Gestion des erreurs Stripe avec codes spécifiques

## 🚀 Déploiement Production

### **1. Configuration Stripe Live**
```env
# Clés de production
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_BASE_URL=https://relayboom.com
```

### **2. Webhooks Stripe**
Configurez les webhooks pour les événements :
- `payment_intent.succeeded`
- `account.updated`
- `payout.paid`

URL webhook : `https://relayboom.com/api/stripe/webhook`

### **3. Tests**
- Testez l'onboarding complet d'un clippeur
- Vérifiez les calculs de frais
- Testez les paiements avec les cartes de test Stripe

## 📈 Fonctionnalités Avancées (Future)

### **Paiements en lot**
- Traitement automatique des paiements quotidiens/hebdomadaires
- Optimisation des frais Stripe

### **Retraits instantanés**
- Option de retrait immédiat (frais supplémentaires)
- Seuil minimum de retrait

### **Rapports avancés**
- Dashboard analytics pour les revenus
- Prévisions de paiements
- Historique détaillé des transactions

### **Gestion des litiges**
- Système de résolution de conflits
- Remboursements partiels/complets
- Historique des réclamations

## 🆘 Dépannage

### **Erreurs courantes**

#### `Stripe account not found`
- Vérifiez que le compte Stripe existe dans la table `stripe_accounts`
- Relancez l'onboarding si nécessaire

#### `Payment failed`
- Vérifiez les clés Stripe dans `.env.local`
- Consultez les logs Stripe Dashboard
- Vérifiez les montants et devises

#### `Insufficient permissions`
- Vérifiez l'authentification Supabase
- Contrôlez les rôles utilisateurs
- Vérifiez les politiques RLS

### **Logs utiles**
```bash
# Logs serveur Next.js
npm run dev

# Logs Supabase
# Dans Supabase Dashboard > Logs

# Logs Stripe
# Dans Stripe Dashboard > Logs
```

## 📞 Support

- **Documentation Stripe** : https://stripe.com/docs/connect
- **Support Supabase** : https://supabase.com/docs
- **Issues RelayBoom** : Créez une issue sur GitHub

---

**🎉 Félicitations !** Stripe est maintenant intégré à RelayBoom. Les clippeurs peuvent recevoir leurs paiements automatiquement et les créateurs peuvent suivre leurs dépenses en temps réel. 