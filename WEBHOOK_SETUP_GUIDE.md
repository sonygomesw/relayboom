# 🚀 Configuration Webhooks Stripe - ClipTokk

## ✅ État actuel
- ✅ Serveur Next.js fonctionne sur localhost:3001
- ✅ API Stripe configurée et fonctionnelle
- ✅ Endpoint webhook créé : `/api/stripe/webhooks`
- ✅ ngrok installé avec votre clé API

## 🔧 Configuration des Webhooks

### Option 1 : Avec ngrok (Recommandé pour le test)

#### 1. Démarrer ngrok manuellement
```bash
# Dans un nouveau terminal
ngrok http 3001
```

Vous verrez quelque chose comme :
```
Session Status                online
Account                       your-account
Version                       3.23.3
Region                        United States (us)
Forwarding                    https://abc123-def456.ngrok.io -> http://localhost:3001
```

#### 2. Copier l'URL https générée
Exemple : `https://abc123-def456.ngrok.io`

#### 3. Configurer dans Stripe Dashboard
1. Allez sur https://dashboard.stripe.com
2. **Développeurs** → **Webhooks** → **Ajouter un endpoint**
3. **URL de l'endpoint :** `https://abc123-def456.ngrok.io/api/stripe/webhooks`
4. **Événements à sélectionner :**
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `account.updated`
   - ✅ `transfer.created`
   - ✅ `transfer.updated`

#### 4. Récupérer la clé secrète
Après création, copiez la clé secrète qui commence par `whsec_`

#### 5. Ajouter dans .env.local
```bash
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...
```

### Option 2 : Test sans webhooks (Alternative)

Si ngrok pose problème, vous pouvez tester sans webhooks :

#### 1. Tester les APIs directement
```bash
# Test création compte Stripe Connect
curl -X POST http://localhost:3001/api/test-stripe

# Test recharge wallet
curl -X POST http://localhost:3001/api/wallet/recharge \
  -H "Content-Type: application/json" \
  -d '{"amount": 100}'
```

#### 2. Simuler les événements manuellement
Les webhooks sont utiles pour :
- Notifier automatiquement des paiements réussis
- Mettre à jour les statuts des comptes
- Déclencher les transferts vers les clippeurs

Sans webhooks, vous devrez gérer ces événements manuellement.

## 🧪 Test des Webhooks

### 1. Vérifier que l'endpoint fonctionne
```bash
curl -X POST https://votre-url-ngrok.ngrok.io/api/stripe/webhooks \
  -H "Content-Type: application/json" \
  -d '{"type": "test.event"}'
```

### 2. Tester depuis le Dashboard Stripe
1. Dans le Dashboard Stripe → Webhooks
2. Cliquez sur votre endpoint
3. Cliquez "Envoyer un événement de test"
4. Sélectionnez un événement (ex: `payment_intent.succeeded`)

## 📋 Checklist finale

- [ ] ngrok démarré et URL obtenue
- [ ] Endpoint webhook configuré dans Stripe
- [ ] Clé secrète ajoutée dans .env.local
- [ ] Test d'événement réussi
- [ ] Logs webhook visibles dans les logs du serveur

## 🔍 Dépannage

### Problème : ngrok ne démarre pas
```bash
# Vérifier la configuration
ngrok config check

# Réinstaller ngrok
brew uninstall ngrok && brew install ngrok

# Reconfigurer avec votre clé
ngrok config add-authtoken 2zE9eWLP1sjofld4SylTheko2wj_4XL3eCiLEZJ9Tmzmthazp
```

### Problème : Signature webhook invalide
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct
- Assurez-vous que l'URL webhook correspond exactement
- Vérifiez que le serveur écoute sur le bon port

### Problème : Événements non reçus
- Vérifiez que ngrok est toujours actif
- Contrôlez les logs du serveur pour les erreurs
- Testez avec l'outil de test Stripe 