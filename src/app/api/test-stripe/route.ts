import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil'
})

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json()

    // Valider le montant
    if (!amount || amount < 10) {
      return NextResponse.json({ 
        error: 'Montant invalide (minimum 10€)' 
      }, { status: 400 })
    }

    console.log(`🧪 TEST: Création Payment Intent pour ${amount}€`)

    // Calculer la commission (10%)
    const grossAmount = Math.round(amount * 1.10 * 100) // en centimes
    const commission = Math.round(amount * 0.10 * 100)
    const netAmount = amount * 100

    // Créer un Payment Intent Stripe (montant brut avec commission)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: grossAmount, // Le client paie le montant + commission
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        type: 'wallet_recharge',
        test_mode: 'true',
        gross_amount_euros: (grossAmount / 100).toString(),
        commission_euros: (commission / 100).toString(),
        net_amount_euros: (netAmount / 100).toString(),
        platform: 'relayboom_test'
      },
      description: `TEST - Recharge wallet RelayBoom - ${amount}€ (+ ${commission/100}€ commission)`
    })

    console.log(`✅ Payment Intent créé: ${paymentIntent.id}`)
    console.log(`💰 Montant brut: ${grossAmount/100}€, Commission: ${commission/100}€, Net: ${netAmount/100}€`)

    return NextResponse.json({
      success: true,
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      commission: commission / 100,
      net_amount: netAmount / 100,
      gross_amount: grossAmount / 100
    })

  } catch (error) {
    console.error('❌ Erreur API test Stripe:', error)
    
    let errorMessage = 'Erreur interne du serveur'
    
    if (error instanceof Stripe.errors.StripeError) {
      errorMessage = `Erreur Stripe: ${error.message}`
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 