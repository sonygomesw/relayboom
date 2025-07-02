import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// Configuration Stripe côté serveur
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

// Configuration Stripe côté client
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Types pour les paiements RelayBoom
export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  client_secret: string
}

export interface StripeAccount {
  id: string
  type: 'express' | 'standard'
  charges_enabled: boolean
  payouts_enabled: boolean
  requirements: {
    currently_due: string[]
    eventually_due: string[]
    past_due: string[]
  }
}

// Configuration des frais de la plateforme
export const PLATFORM_FEE_PERCENTAGE = 10 // 10% de commission RelayBoom
export const STRIPE_FEE_PERCENTAGE = 2.9 // 2.9% + 0.30€ frais Stripe
export const STRIPE_FEE_FIXED = 0.30

// Calculer les frais
export const calculateFees = (amount: number) => {
  const platformFee = Math.round(amount * (PLATFORM_FEE_PERCENTAGE / 100))
  const stripeFee = Math.round(amount * (STRIPE_FEE_PERCENTAGE / 100)) + Math.round(STRIPE_FEE_FIXED * 100)
  const netAmount = amount - platformFee - stripeFee
  
  return {
    grossAmount: amount, // Montant brut
    platformFee, // Commission RelayBoom
    stripeFee, // Frais Stripe
    netAmount, // Montant net pour le clippeur
  }
}

// Créer un compte Stripe Connect pour un clippeur
export const createStripeAccount = async (email: string, country: string = 'FR') => {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      country,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })
    return account
  } catch (error) {
    console.error('Erreur création compte Stripe:', error)
    throw error
  }
}

// Créer un lien d'onboarding pour un compte Stripe Connect
export const createAccountLink = async (accountId: string, refreshUrl: string, returnUrl: string) => {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    })
    return accountLink
  } catch (error) {
    console.error('Erreur création lien onboarding:', error)
    throw error
  }
}

// Créer un paiement avec transfert vers le clippeur
export const createPaymentWithTransfer = async (
  amount: number, // en centimes
  clipperStripeAccountId: string,
  missionId: string,
  clipperUserId: string
) => {
  try {
    const fees = calculateFees(amount)
    
    // Créer le PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: fees.grossAmount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        mission_id: missionId,
        clipper_user_id: clipperUserId,
        platform_fee: fees.platformFee.toString(),
        net_amount: fees.netAmount.toString(),
      },
      // Transfert automatique vers le clippeur après paiement réussi
      transfer_data: {
        destination: clipperStripeAccountId,
        amount: fees.netAmount,
      },
      application_fee_amount: fees.platformFee,
    })
    
    return paymentIntent
  } catch (error) {
    console.error('Erreur création paiement:', error)
    throw error
  }
}

// Vérifier le statut d'un compte Stripe
export const getAccountStatus = async (accountId: string) => {
  try {
    const account = await stripe.accounts.retrieve(accountId)
    return account
  } catch (error) {
    console.error('Erreur récupération compte:', error)
    throw error
  }
}

// Créer un payout manuel (retrait) pour un clippeur
export const createPayout = async (accountId: string, amount: number) => {
  try {
    const payout = await stripe.payouts.create(
      {
        amount,
        currency: 'eur',
        method: 'instant', // ou 'standard'
      },
      {
        stripeAccount: accountId,
      }
    )
    return payout
  } catch (error) {
    console.error('Erreur création payout:', error)
    throw error
  }
} 