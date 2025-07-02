#!/bin/bash

echo "🚀 Configuration et test des webhooks Stripe"
echo "============================================="

# Vérifier si ngrok est installé
if ! command -v ngrok &> /dev/null; then
    echo "📦 Installation de ngrok..."
    if command -v brew &> /dev/null; then
        brew install ngrok
    else
        echo "❌ Homebrew non trouvé. Installez ngrok manuellement :"
        echo "   https://ngrok.com/download"
        exit 1
    fi
fi

# Vérifier si le serveur fonctionne
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "❌ Serveur Next.js non démarré sur le port 3001"
    echo "   Lancez d'abord : npm run dev"
    exit 1
fi

echo "✅ Serveur Next.js détecté sur localhost:3001"

# Tester l'endpoint webhooks
echo "🧪 Test de l'endpoint webhooks..."
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3001/api/stripe/webhooks \
  -H "Content-Type: application/json" \
  -H "stripe-signature: invalid-signature" \
  -d '{"type": "test.event"}')

if [ "$response" = "400" ]; then
    echo "✅ Endpoint webhooks fonctionne (refuse signature invalide)"
else
    echo "❌ Endpoint webhooks ne répond pas correctement (code: $response)"
    exit 1
fi

# Instructions ngrok
echo ""
echo "🌐 Pour exposer votre serveur local :"
echo "   1. Ouvrez un nouveau terminal"
echo "   2. Lancez : ngrok http 3001"
echo "   3. Copiez l'URL https (ex: https://abc123.ngrok.io)"
echo "   4. Utilisez cette URL dans le dashboard Stripe"
echo ""
echo "📋 URL à configurer dans Stripe :"
echo "   https://VOTRE-URL-NGROK.ngrok.io/api/stripe/webhooks"
echo ""
echo "🔑 N'oubliez pas d'ajouter STRIPE_WEBHOOK_SECRET dans .env.local"
echo ""
echo "✅ Configuration terminée ! Testez maintenant avec un vrai paiement." 