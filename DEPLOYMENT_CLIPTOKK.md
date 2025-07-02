# 🚀 DÉPLOIEMENT CLIPTOKK.COM - Guide Complet

## 📋 **CHECKLIST DE DÉPLOIEMENT**

### **✅ ÉTAPE 1 : Configuration Vercel**

#### **1.1 Commandes de Déploiement**
```bash
# Si pas encore fait
npx vercel login

# Déploiement initial
npx vercel

# Répondre aux questions :
# - Set up and deploy? → Y
# - Which scope? → [Votre compte]
# - Project name? → cliptokk
# - Directory? → ./
# - Want to modify settings? → N
```

#### **1.2 Variables d'Environnement à Configurer**
```bash
# Configuration des variables via CLI
npx vercel env add STRIPE_SECRET_KEY
npx vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
npx vercel env add STRIPE_WEBHOOK_SECRET
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel env add SUPABASE_SERVICE_ROLE_KEY
npx vercel env add NEXT_PUBLIC_BASE_URL
```

### **✅ ÉTAPE 2 : Configuration du Domaine cliptokk.com**

#### **2.1 Ajouter le Domaine sur Vercel**
```bash
# Via CLI
npx vercel domains add cliptokk.com

# Ou via Dashboard :
# 1. Aller sur https://vercel.com/dashboard
# 2. Sélectionner le projet "cliptokk"
# 3. Settings → Domains
# 4. Ajouter "cliptokk.com"
```

#### **2.2 Configuration DNS chez Namecheap**
```
Type: A Record
Host: @
Value: 76.76.19.61

Type: CNAME
Host: www
Value: cname.vercel-dns.com
```

### **✅ ÉTAPE 3 : Configuration Stripe LIVE**

#### **3.1 Webhooks Stripe (IMPORTANT)**
1. Dashboard Stripe → Webhooks → Ajouter endpoint
2. **URL** : `https://cliptokk.com/api/stripe/webhooks`
3. **Événements** :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
4. Copier le secret webhook : `whsec_...`

### **✅ ÉTAPE 4 : Configuration Supabase**

#### **4.1 URLs de Redirection**
Dashboard Supabase → Authentication → URL Configuration:
```
Site URL: https://cliptokk.com
Redirect URLs:
- https://cliptokk.com/auth/callback
- https://cliptokk.com/dashboard
- https://cliptokk.com/onboarding/role
```

### **✅ ÉTAPE 5 : Variables d'Environnement Complètes**

```env
# ===================================
# 💳 STRIPE CONFIGURATION (LIVE)
# ===================================
STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_LIVE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_VOTRE_CLE_LIVE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET_LIVE

# ===================================
# 📊 SUPABASE CONFIGURATION
# ===================================
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ===================================
# 🌐 PRODUCTION CONFIGURATION
# ===================================
NEXT_PUBLIC_BASE_URL=https://cliptokk.com
NODE_ENV=production
```

### **✅ ÉTAPE 6 : Tests de Production**

#### **6.1 Tests Critiques**
- [ ] Page d'accueil : https://cliptokk.com
- [ ] Authentification : https://cliptokk.com/auth/callback
- [ ] Dashboard : https://cliptokk.com/dashboard
- [ ] Paiements Stripe (mode test puis LIVE)
- [ ] Webhooks Stripe
- [ ] Téléchargement de vidéos

#### **6.2 Vérifications Techniques**
```bash
# Test HTTPS
curl -I https://cliptokk.com

# Test Webhooks
curl -X POST https://cliptokk.com/api/stripe/webhooks \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## 🎯 **COMMANDES DE DÉPLOIEMENT RAPIDE**

```bash
# Déploiement production
npx vercel --prod

# Voir les logs
npx vercel logs

# Redéployer
npx vercel redeploy
```

## 🔧 **DÉPANNAGE COMMUN**

### **Domaine ne fonctionne pas**
1. Vérifier les DNS (propagation 24-48h max)
2. Vérifier le certificat SSL
3. Vider le cache navigateur

### **Stripe ne fonctionne pas**
1. Vérifier les clés LIVE dans Vercel
2. Vérifier l'URL webhook : `https://cliptokk.com/api/stripe/webhooks`
3. Tester avec un petit paiement

### **Supabase Auth ne fonctionne pas**
1. Vérifier les URLs de redirection
2. Vérifier les variables d'environnement
3. Vérifier les RLS policies

## 🎉 **VALIDATION FINALE**

Votre site sera prêt quand :
- ✅ https://cliptokk.com se charge
- ✅ L'authentification fonctionne
- ✅ Les paiements Stripe passent
- ✅ Les webhooks reçoivent les données
- ✅ Le CSS/JS se charge correctement

---
**🚀 Bonne chance pour le lancement de ClipTokk !** 