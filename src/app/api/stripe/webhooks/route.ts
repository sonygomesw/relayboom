import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-cliptokk'
import { confirmWalletRecharge, updateClipperAccountStatus } from '@/lib/stripe-cliptokk'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')!

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log(`🔔 Webhook reçu: ${event.type}`)

    switch (event.type) {
      // Recharge wallet réussie
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        
        if (paymentIntent.metadata.type === 'wallet_recharge') {
          try {
            await confirmWalletRecharge(paymentIntent.id)
            console.log(`✅ Wallet rechargé via webhook: ${paymentIntent.id}`)
          } catch (error) {
            console.error('Erreur confirmation recharge:', error)
          }
        }
        
        // Gestion spéciale pour les tests
        if (paymentIntent.metadata.test_mode === 'true') {
          console.log(`🧪 TEST: Paiement réussi ${paymentIntent.id}`)
          console.log(`💰 Montant: ${paymentIntent.metadata.gross_amount_euros}€ (Commission: ${paymentIntent.metadata.commission_euros}€)`)
          // Pour les tests, on simule juste le succès sans mettre à jour la DB
        }
        
        break
      }

      // Mise à jour compte Stripe Connect
      case 'account.updated': {
        const account = event.data.object
        
        if (account.metadata?.platform === 'cliptokk') {
          try {
            await updateClipperAccountStatus(account.id)
            console.log(`✅ Compte clipper mis à jour: ${account.id}`)
          } catch (error) {
            console.error('Erreur mise à jour compte:', error)
          }
        }
        break
      }

      // Transfert réussi
      case 'transfer.created':
      case 'transfer.updated': {
        const transfer = event.data.object
        
        if (transfer.metadata?.submission_id) {
          console.log(`💰 Transfert ${transfer.id}: ${transfer.amount/100}€ → ${transfer.destination}`)
          
          // Optionnel: Mettre à jour le statut en base de données
          // Déjà géré dans processAutomaticPayment()
        }
        break
      }

      // Paiement échoué
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        
        if (paymentIntent.metadata?.type === 'wallet_recharge') {
          console.error(`❌ Recharge échouée: ${paymentIntent.id}`)
          
          // TODO: Marquer la recharge comme échouée en base
        }
        break
      }

      default:
        console.log(`⚠️ Événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erreur webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
} 