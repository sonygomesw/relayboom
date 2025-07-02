#!/bin/bash

echo "🌐 Test URL Webhook avec ngrok"
echo "=============================="

# Vérifier si ngrok fonctionne
if ! curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
    echo "❌ ngrok n'est pas démarré"
    echo ""
    echo "📋 Pour démarrer ngrok :"
    echo "   1. Ouvrez un nouveau terminal"
    echo "   2. Lancez : ngrok http 3001"
    echo "   3. Copiez l'URL https générée"
    echo "   4. Relancez ce script"
    exit 1
fi

# Récupérer l'URL ngrok
ngrok_url=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url' 2>/dev/null)

if [ "$ngrok_url" = "null" ] || [ -z "$ngrok_url" ]; then
    echo "❌ Impossible de récupérer l'URL ngrok"
    exit 1
fi

echo "✅ URL ngrok détectée : $ngrok_url"
echo ""
echo "🔗 URL webhook à configurer dans Stripe :"
echo "   $ngrok_url/api/stripe/webhooks"
echo ""

# Tester l'endpoint
echo "🧪 Test de l'endpoint webhook..."
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$ngrok_url/api/stripe/webhooks" \
  -H "Content-Type: application/json" \
  -H "stripe-signature: invalid-signature" \
  -d '{"type": "test.event"}')

if [ "$response" = "400" ]; then
    echo "✅ Endpoint webhook accessible et fonctionne"
    echo "   (Réponse 400 = signature invalide = normal)"
else
    echo "❌ Endpoint webhook ne répond pas correctement (code: $response)"
fi

echo ""
echo "📋 Prochaines étapes :"
echo "   1. Allez sur https://dashboard.stripe.com"
echo "   2. Développeurs → Webhooks → Ajouter un endpoint"
echo "   3. URL : $ngrok_url/api/stripe/webhooks"
echo "   4. Événements : payment_intent.succeeded, account.updated, etc."
echo "   5. Copiez la Signing Secret et ajoutez dans .env.local"
echo ""
echo "🎯 Une fois configuré, testez avec un vrai paiement !" 