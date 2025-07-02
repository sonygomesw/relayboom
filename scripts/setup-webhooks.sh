#!/bin/bash

echo "🚀 Configuration des Webhooks Stripe - ClipTokk"
echo "================================================"

# Vérifier si ngrok est configuré
if ! ngrok version > /dev/null 2>&1; then
    echo "❌ ngrok n'est pas installé"
    echo "   Installez-le avec : brew install ngrok"
    exit 1
fi

# Vérifier si le serveur fonctionne
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "❌ Serveur Next.js non démarré sur le port 3001"
    echo "   Lancez d'abord : npm run dev"
    exit 1
fi

echo "✅ Serveur Next.js détecté sur localhost:3001"

# Démarrer ngrok en arrière-plan
echo "🌐 Démarrage de ngrok..."
ngrok http 3001 > /dev/null 2>&1 &
NGROK_PID=$!

# Attendre que ngrok démarre
echo "⏳ Attente du démarrage de ngrok..."
sleep 5

# Récupérer l'URL ngrok
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | jq -r '.tunnels[0].public_url' 2>/dev/null)

if [ "$NGROK_URL" = "null" ] || [ -z "$NGROK_URL" ]; then
    echo "❌ Impossible de récupérer l'URL ngrok"
    kill $NGROK_PID 2>/dev/null
    exit 1
fi

echo "✅ URL ngrok générée : $NGROK_URL"
echo ""
echo "🔗 URL webhook à configurer dans Stripe :"
echo "   $NGROK_URL/api/stripe/webhooks"
echo ""

# Tester l'endpoint webhook
echo "🧪 Test de l'endpoint webhook..."
WEBHOOK_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$NGROK_URL/api/stripe/webhooks")

if [ "$WEBHOOK_RESPONSE" = "200" ] || [ "$WEBHOOK_RESPONSE" = "400" ]; then
    echo "✅ Endpoint webhook accessible (HTTP $WEBHOOK_RESPONSE)"
else
    echo "❌ Endpoint webhook non accessible (HTTP $WEBHOOK_RESPONSE)"
fi

echo ""
echo "📋 Configuration dans le Dashboard Stripe :"
echo "   1. Allez sur https://dashboard.stripe.com"
echo "   2. Développeurs → Webhooks → Ajouter un endpoint"
echo "   3. URL : $NGROK_URL/api/stripe/webhooks"
echo "   4. Événements à sélectionner :"
echo "      - payment_intent.succeeded"
echo "      - payment_intent.payment_failed"
echo "      - account.updated"
echo "      - transfer.created"
echo "      - transfer.updated"
echo ""
echo "🔑 Après configuration, récupérez la clé secrète et ajoutez-la dans .env.local :"
echo "   STRIPE_WEBHOOK_SECRET=whsec_..."
echo ""
echo "💡 ngrok reste actif en arrière-plan (PID: $NGROK_PID)"
echo "   Pour arrêter : kill $NGROK_PID" 