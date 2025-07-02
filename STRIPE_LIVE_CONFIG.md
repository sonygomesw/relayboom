# 🔴 STRIPE LIVE - Configuration Production

## 🚨 **IMPORTANT : Variables d'environnement Production**

Pour déployer RelayBoom avec Stripe LIVE, vous devez configurer ces variables sur **Vercel** :

### **Variables à configurer sur Vercel :**

```env
# ===================================
# 💳 STRIPE CONFIGURATION (LIVE MODE)
# ===================================

# REMPLACEZ PAR VOS VRAIES CLÉS STRIPE LIVE
STRIPE_SECRET_KEY=sk_live_VOTRE_VRAIE_CLE_SECRETE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_VOTRE_VRAIE_CLE_PUBLIQUE

# Webhook secret pour les webhooks LIVE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET_LIVE

# URL de base en production
NEXT_PUBLIC_BASE_URL=https://votre-domaine.vercel.app
```

### **Variables Supabase (à garder) :**

```env
# ===================================
# 📊 SUPABASE CONFIGURATION
# ===================================
NEXT_PUBLIC_SUPABASE_URL=https://qhpgqkpmfqexwtxwjkmh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔧 **Configuration sur Vercel**

### **Méthode 1 : Via l'Interface Vercel**

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet RelayBoom
3. `Settings` → `Environment Variables`
4. Ajoutez une par une les variables ci-dessus

### **Méthode 2 : Via CLI Vercel**

```bash
# Installer Vercel CLI si pas fait
npm i -g vercel

# Se connecter
vercel login

# Ajouter les variables d'environnement
vercel env add STRIPE_SECRET_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add NEXT_PUBLIC_BASE_URL production

# Supabase (si pas déjà fait)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

## 🔒 **Sécurité et Vérifications**

### **✅ Checklist avant déploiement :**

- [ ] **Clés Stripe LIVE** récupérées depuis le dashboard
- [ ] **Webhook configuré** avec la bonne URL de production
- [ ] **Variables d'environnement** ajoutées sur Vercel
- [ ] **Domain configuré** sur Vercel
- [ ] **Test de paiement** en mode LIVE (petit montant)

### **🚨 Sécurité :**

- ⚠️ **JAMAIS** commiter les clés LIVE dans Git
- ⚠️ **TOUJOURS** utiliser les variables d'environnement
- ⚠️ **VÉRIFIER** que les webhooks sont sécurisés
- ⚠️ **TESTER** avec de petits montants d'abord

## 🧪 **Test en Production**

### **Après déploiement, testez :**

1. **Inscription** d'un nouveau créateur
2. **Recharge wallet** avec un petit montant (5-10€)
3. **Création** d'une mission
4. **Soumission** d'un clip (test)
5. **Validation** admin et paiement automatique

### **Monitoring :**

- **Stripe Dashboard** : Surveillez les transactions
- **Vercel Logs** : Vérifiez les erreurs
- **Supabase Logs** : Contrôlez les données

---

## 🎯 **Commandes de Déploiement**

Une fois vos clés LIVE configurées :

```bash
# 1. Build final
npm run build

# 2. Déploiement
vercel --prod

# 3. Test du site en production
curl https://votre-domaine.vercel.app
```

**🎉 Votre plateforme sera alors en LIVE avec de vrais paiements !** 