# Configuration des Webhooks Stripe - ClipTokk

## 📋 Checklist de configuration

### 1. **Dashboard Stripe**
- [ ] Aller sur https://dashboard.stripe.com
- [ ] Menu **Développeurs** → **Webhooks**
- [ ] Cliquer **Ajouter un endpoint**

### 2. **Configuration de l'endpoint**

**URL de l'endpoint :**
```
Production: https://votre-domaine.com/api/stripe/webhooks
Local (ngrok): https://abc123.ngrok.io/api/stripe/webhooks
```

**Événements à sélectionner :**
```
✅ account.updated
✅ payment_intent.succeeded
✅ payment_intent.payment_failed
✅ transfer.created
✅ transfer.updated
```

### 3. **Variables d'environnement**

Ajouter dans `.env.local` :
```bash
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...
```

### 4. **Test en local**

```bash
# Terminal 1 : Démarrer le serveur
npm run dev

# Terminal 2 : Exposer avec ngrok
brew install ngrok
ngrok http 3001
```

### 5. **Test des webhooks**

Créer un paiement test pour déclencher les webhooks :
- Recharge wallet de 10€
- Vérifier les logs du serveur
- Confirmer réception dans Stripe

### 6. **Événements gérés par ClipTokk**

| Événement | Description | Action |
|-----------|-------------|---------|
| `payment_intent.succeeded` | Recharge wallet réussie | Créditer le wallet créateur |
| `payment_intent.payment_failed` | Recharge échouée | Log d'erreur |
| `account.updated` | Compte clippeur mis à jour | Mettre à jour le statut |
| `transfer.created` | Paiement envoyé à un clippeur | Log du transfert |
| `transfer.updated` | Statut transfert modifié | Mise à jour base de données |

### 7. **Vérification**

```bash
# Tester l'endpoint webhooks
curl -X POST http://localhost:3001/api/stripe/webhooks \
  -H "Content-Type: application/json" \
  -H "stripe-signature: invalid-signature" \
  -d '{"type": "test.event"}'

# Réponse attendue : 400 Bad Request (signature invalide)
```

### 8. **Production**

Pour la production :
1. Remplacer l'URL ngrok par votre domaine réel
2. Vérifier que `STRIPE_WEBHOOK_SECRET` est en production
3. Tester avec un vrai paiement
4. Surveiller les logs webhook dans Stripe

### 🔧 Debug des webhooks

Si les webhooks ne fonctionnent pas :

1. **Vérifier l'URL** : Accessible depuis internet
2. **Vérifier la signature** : Variable `STRIPE_WEBHOOK_SECRET` correcte
3. **Logs Stripe** : Dashboard → Webhooks → Voir les tentatives
4. **Logs serveur** : Vérifier `console.log` dans `/api/stripe/webhooks`

### 🚀 Une fois configuré

Votre plateforme sera automatiquement notifiée de :
- ✅ Recharges wallet réussies/échouées  
- ✅ Mises à jour comptes Stripe clippeurs
- ✅ Transferts vers les clippeurs
- ✅ Tous les événements de paiement

Les paiements automatiques aux clippeurs se feront seamlessly ! 🎉 