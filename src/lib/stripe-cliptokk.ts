import Stripe from 'stripe'
import { supabase } from './supabase'

// Configuration Stripe pour Cliptokk
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

// Types spécifiques Cliptokk
export interface WalletRecharge {
  amount: number // en euros
  currency: string
  creatorId: string
}

export interface AutomaticPayment {
  submissionId: string
  clipperId: string
  clipperStripeAccountId: string
  grossAmount: number // en centimes
  commission: number // en centimes
  netAmount: number // en centimes
}

export interface ClipperStripeAccount {
  clipperId: string
  stripeAccountId: string
  status: string
  payoutsEnabled: boolean
}

// 1. RECHARGE WALLET - Créer PaymentIntent avec commission prélevée
export const createWalletRecharge = async (
  creatorId: string,
  amount: number // en euros
): Promise<{ clientSecret: string; paymentIntentId: string; commission: number; netAmount: number }> => {
  try {
    const grossAmount = Math.round(amount * 100) // en centimes
    const commissionAmount = Math.round(grossAmount * 0.10) // 10% commission
    const netAmount = grossAmount - commissionAmount

    // Créer l'entrée en base de données d'abord
    const { data: recharge, error } = await supabase
      .from('wallet_recharges')
      .insert({
        creator_id: creatorId,
        gross_amount: grossAmount,
        commission_amount: commissionAmount,
        net_amount: netAmount,
        status: 'pending',
        stripe_payment_intent_id: `temp_${Date.now()}` // Temporaire
      })
      .select()
      .single()

    if (error) throw error

    // Créer le PaymentIntent Stripe (montant brut)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: grossAmount, // Le créateur paie le montant brut
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        type: 'wallet_recharge',
        creator_id: creatorId,
        recharge_id: recharge.id,
        gross_amount_euros: amount.toString(),
        commission_euros: (commissionAmount / 100).toString(),
        net_amount_euros: (netAmount / 100).toString()
      },
      description: `Recharge wallet Cliptokk - ${amount}€ (net: ${netAmount/100}€ après commission 10%)`
    })

    // Mettre à jour avec le vrai PaymentIntent ID
    await supabase
      .from('wallet_recharges')
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq('id', recharge.id)

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
      commission: commissionAmount / 100, // en euros pour l'affichage
      netAmount: netAmount / 100 // en euros pour l'affichage
    }
  } catch (error) {
    console.error('Erreur création recharge wallet:', error)
    throw error
  }
}

// 2. CONFIRMER RECHARGE - Webhook ou confirmation manuelle avec commission
export const confirmWalletRecharge = async (
  paymentIntentId: string
): Promise<boolean> => {
  try {
    // Récupérer le PaymentIntent depuis Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status !== 'succeeded') {
      throw new Error(`Paiement non réussi: ${paymentIntent.status}`)
    }

    const creatorId = paymentIntent.metadata.creator_id
    const grossAmount = parseInt(paymentIntent.metadata.gross_amount_euros) * 100 // en centimes
    const commission = parseInt(paymentIntent.metadata.commission_euros) * 100
    const netAmount = parseInt(paymentIntent.metadata.net_amount_euros) * 100

    // Utiliser la fonction SQL pour mettre à jour le wallet avec commission
    const { error } = await supabase.rpc('recharge_wallet', {
      creator_user_id: creatorId,
      gross_amount: grossAmount,
      payment_intent_id: paymentIntentId
    })

    if (error) throw error

    console.log(`✅ Wallet rechargé: ${creatorId} - Brut: ${grossAmount/100}€, Commission: ${commission/100}€, Net: ${netAmount/100}€`)
    return true
  } catch (error) {
    console.error('Erreur confirmation recharge:', error)
    throw error
  }
}

// 3. CRÉER COMPTE STRIPE CONNECT pour clippeur
export const createClipperStripeAccount = async (
  clipperId: string,
  email: string,
  country: string = 'FR'
): Promise<{ accountId: string; onboardingUrl: string }> => {
  try {
    // Vérifier si le compte existe déjà
    const { data: existingAccount } = await supabase
      .from('clipper_stripe_accounts')
      .select('stripe_account_id')
      .eq('clipper_id', clipperId)
      .single()

    if (existingAccount) {
      throw new Error('Compte Stripe déjà existant')
    }

    // Créer le compte Stripe Connect Express
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      country,
      capabilities: {
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: {
        clipper_id: clipperId,
        platform: 'cliptokk'
      }
    })

    // Sauvegarder en base de données
    await supabase
      .from('clipper_stripe_accounts')
      .insert({
        clipper_id: clipperId,
        stripe_account_id: account.id,
        status: 'pending'
      })

    // Créer le lien d'onboarding
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${baseUrl}/dashboard/clipper/stripe/refresh`,
      return_url: `${baseUrl}/dashboard/clipper/stripe/success`,
      type: 'account_onboarding',
    })

    return {
      accountId: account.id,
      onboardingUrl: accountLink.url
    }
  } catch (error) {
    console.error('Erreur création compte Stripe clipper:', error)
    throw error
  }
}

// 4. PAIEMENT AUTOMATIQUE aux clippeurs (100% car commission déjà prélevée)
export const processAutomaticPayment = async (
  submissionId: string
): Promise<boolean> => {
  try {
    // 1. Calculer les montants via la fonction SQL (sans commission sur paiement)
    const { error: calcError } = await supabase.rpc('process_automatic_payment', {
      submission_id_param: submissionId
    })

    if (calcError) throw calcError

    // 2. Récupérer les détails de la soumission mise à jour
    const { data: submission, error: submissionError } = await supabase
      .from('campaign_submissions')
      .select(`
        *,
        campaigns(creator_id, title),
        clipper_stripe_accounts!inner(stripe_account_id, payouts_enabled)
      `)
      .eq('id', submissionId)
      .single()

    if (submissionError || !submission) throw submissionError

    const clipperAccount = submission.clipper_stripe_accounts as any
    
    if (!clipperAccount.payouts_enabled) {
      throw new Error('Compte Stripe du clippeur non activé pour les paiements')
    }

    // 3. Créer le transfert Stripe vers le clippeur (100% du montant calculé)
    const transfer = await stripe.transfers.create({
      amount: submission.net_amount, // 100% au clippeur (commission déjà prélevée lors de la recharge)
      currency: 'eur',
      destination: clipperAccount.stripe_account_id,
      metadata: {
        submission_id: submissionId,
        campaign_id: submission.campaign_id,
        clipper_id: submission.clipper_id,
        commission_amount: '0', // Commission déjà prélevée lors de la recharge
        gross_amount: submission.calculated_amount.toString()
      },
      description: `Paiement Cliptokk - ${submission.campaigns.title} (100% - commission déjà prélevée)`
    })

    // 4. Mettre à jour la soumission avec l'ID du transfert
    await supabase
      .from('campaign_submissions')
      .update({
        stripe_transfer_id: transfer.id,
        payment_status: 'paid',
        paid_at: new Date().toISOString()
      })
      .eq('id', submissionId)

    // 5. Mettre à jour l'historique des paiements
    await supabase
      .from('payment_history')
      .update({
        stripe_transfer_id: transfer.id,
        stripe_account_id: clipperAccount.stripe_account_id,
        status: 'succeeded',
        completed_at: new Date().toISOString()
      })
      .eq('submission_id', submissionId)

    console.log(`✅ Paiement automatique réussi: ${submission.net_amount/100}€ → ${clipperAccount.stripe_account_id} (100% - commission déjà prélevée)`)
    return true
  } catch (error) {
    console.error('Erreur paiement automatique:', error)
    
    // Marquer le paiement comme échoué
    await supabase
      .from('campaign_submissions')
      .update({ payment_status: 'failed' })
      .eq('id', submissionId)

    throw error
  }
}

// 5. VÉRIFIER STATUT COMPTE STRIPE
export const updateClipperAccountStatus = async (
  stripeAccountId: string
): Promise<boolean> => {
  try {
    const account = await stripe.accounts.retrieve(stripeAccountId)
    
    await supabase
      .from('clipper_stripe_accounts')
      .update({
        status: account.charges_enabled ? 'active' : 'pending',
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        requirements_currently_due: account.requirements?.currently_due || [],
        requirements_eventually_due: account.requirements?.eventually_due || [],
        updated_at: new Date().toISOString()
      })
      .eq('stripe_account_id', stripeAccountId)

    return true
  } catch (error) {
    console.error('Erreur mise à jour statut compte:', error)
    throw error
  }
}

// 6. DASHBOARD - Récupérer statistiques créateur
export const getCreatorDashboardStats = async (creatorId: string) => {
  try {
    const { data, error } = await supabase
      .from('creator_dashboard_stats')
      .select('*')
      .eq('creator_id', creatorId)
      .single()

    if (error) throw error

    return {
      wallet: {
        totalDeposited: data.total_deposited,
        totalCommission: data.total_commission,
        totalCredits: data.total_credits,
        availableCredits: data.available_credits,
        reservedCredits: data.reserved_credits,
        spentCredits: data.spent_credits
      },
      campaigns: {
        totalCampaigns: data.total_campaigns,
        totalSubmissions: data.total_submissions
      },
      revenue: {
        totalCommissionEarned: data.total_commission_earned,
        totalPaidToClippers: data.total_paid_to_clippers
      }
    }
  } catch (error) {
    console.error('Erreur stats créateur:', error)
    throw error
  }
}

// 7. DASHBOARD - Récupérer statistiques clippeur
export const getClipperEarningsStats = async (clipperId: string) => {
  try {
    const { data, error } = await supabase
      .from('clipper_earnings_stats')
      .select('*')
      .eq('clipper_id', clipperId)
      .single()

    if (error) throw error

    return {
      stripeAccount: {
        accountId: data.stripe_account_id,
        status: data.stripe_status,
        payoutsEnabled: data.payouts_enabled
      },
      submissions: {
        totalSubmissions: data.total_submissions,
        approvedSubmissions: data.approved_submissions
      },
      earnings: {
        totalEarnings: data.total_earnings,
        pendingEarnings: data.pending_earnings
      }
    }
  } catch (error) {
    console.error('Erreur stats clippeur:', error)
    throw error
  }
}

// 8. UTILITAIRES
export const formatCurrency = (amountInCents: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amountInCents / 100)
}

export const calculateCommission = (grossAmount: number, rate: number = 0.10): number => {
  return Math.round(grossAmount * rate)
}

export const validateWalletBalance = async (creatorId: string, requiredAmount: number): Promise<boolean> => {
  const { data } = await supabase
    .from('creator_wallets')
    .select('available_credits')
    .eq('creator_id', creatorId)
    .single()

  return data ? data.available_credits >= requiredAmount : false
} 