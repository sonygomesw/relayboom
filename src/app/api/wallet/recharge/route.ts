import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil'
})

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json()

    // Vérifier l'authentification
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    // Vérifier que l'utilisateur est créateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'creator') {
      return NextResponse.json({ 
        error: 'Seuls les créateurs peuvent recharger leur wallet' 
      }, { status: 403 })
    }

    // Valider le montant
    if (!amount || amount < 10) {
      return NextResponse.json({ 
        error: 'Montant invalide (minimum 10€)' 
      }, { status: 400 })
    }

    // Créer un Payment Intent Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Montant en centimes
      currency: 'eur',
      metadata: {
        user_id: user.id,
        type: 'wallet_recharge',
        platform: 'relayboom'
      },
      description: `Recharge wallet RelayBoom - ${amount}€`
    })

    return NextResponse.json({
      success: true,
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    })

  } catch (error) {
    console.error('Erreur API recharge wallet:', error)
    
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