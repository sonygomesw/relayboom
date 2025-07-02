import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    // Récupérer le token d'authentification
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Token d\'authentification manquant' }, { status: 401 })
    }

    const { amount } = await request.json() // Montant en euros

    if (!amount || amount < 10) {
      return NextResponse.json({ error: 'Montant minimum: 10€' }, { status: 400 })
    }

    // Vérifier l'utilisateur (à implémenter avec auth)
    // const user = await verifyAuth(authHeader)
    
    // Pour l'instant, simuler un user ID (à remplacer)
    const userId = 'temp-user-id'

    // Créer le PaymentIntent Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir en centimes
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        type: 'budget_deposit',
        user_id: userId,
        amount_euros: amount.toString()
      },
      description: `Dépôt de budget RelayBoom - ${amount}€`
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount
    })

  } catch (error) {
    console.error('Erreur création dépôt budget:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
} 