'use client'

import { useState, useEffect } from 'react'
import { getClipperEarningsStats } from '@/lib/stripe-cliptokk'

interface ClipperStripeSetupProps {
  userId: string
  userEmail: string
}

export default function ClipperStripeSetup({ userId, userEmail }: ClipperStripeSetupProps) {
  const [stripeAccount, setStripeAccount] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    loadStripeAccountStatus()
  }, [userId])

  const loadStripeAccountStatus = async () => {
    try {
      const stats = await getClipperEarningsStats(userId)
      setStripeAccount(stats.stripeAccount)
    } catch (err) {
      // Pas de compte Stripe encore
      setStripeAccount(null)
    } finally {
      setIsLoading(false)
    }
  }

  const createStripeAccount = async () => {
    setIsCreating(true)
    setError('')

    try {
      const response = await fetch('/api/stripe/connect/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`
        },
        body: JSON.stringify({ 
          email: userEmail,
          country: 'FR' 
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du compte')
      }

      // Rediriger vers l'onboarding Stripe
      window.location.href = data.onboardingUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  // Compte Stripe actif
  if (stripeAccount?.accountId && stripeAccount.payoutsEnabled) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          <div>
            <h3 className="font-semibold text-green-800">Compte Stripe actif</h3>
            <p className="text-sm text-green-600">Vous pouvez recevoir des paiements</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Statut:</span>
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
              {stripeAccount.status}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Paiements:</span>
            <span className="ml-2 text-green-600 font-medium">Activés</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-green-200">
          <p className="text-sm text-green-700">
            🎉 Parfait ! Vous recevrez automatiquement vos paiements selon les performances de vos clips.
          </p>
        </div>
      </div>
    )
  }

  // Compte Stripe en attente
  if (stripeAccount?.accountId && !stripeAccount.payoutsEnabled) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">⏳</span>
          </div>
          <div>
            <h3 className="font-semibold text-yellow-800">Configuration en cours</h3>
            <p className="text-sm text-yellow-600">Votre compte Stripe est en cours de validation</p>
          </div>
        </div>

        <div className="text-sm text-yellow-700 mb-4">
          <p>📋 Étapes restantes à compléter chez Stripe :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Vérification d'identité</li>
            <li>Informations bancaires</li>
            <li>Validation des documents</li>
          </ul>
        </div>

        <button
          onClick={() => window.open(`https://dashboard.stripe.com/connect/accounts/${stripeAccount.accountId}`, '_blank')}
          className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Continuer la configuration sur Stripe
        </button>
      </div>
    )
  }

  // Aucun compte Stripe
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">💳</span>
        </div>
        <h3 className="font-semibold text-lg mb-2">Configuration des paiements</h3>
        <p className="text-gray-600 text-sm">
          Configurez votre compte Stripe pour recevoir vos gains automatiquement
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-green-500 mt-0.5">✓</span>
          <div className="text-sm">
            <p className="font-medium">Paiements automatiques</p>
            <p className="text-gray-600">Recevez vos gains dès que vos clips génèrent des vues</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-green-500 mt-0.5">✓</span>
          <div className="text-sm">
            <p className="font-medium">Sécurité Stripe</p>
            <p className="text-gray-600">Transactions sécurisées par le leader mondial des paiements</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-green-500 mt-0.5">✓</span>
          <div className="text-sm">
            <p className="font-medium">Configuration simple</p>
            <p className="text-gray-600">Quelques minutes seulement pour tout configurer</p>
          </div>
        </div>
      </div>

      <button
        onClick={createStripeAccount}
        disabled={isCreating}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isCreating ? 'Création en cours...' : 'Configurer les paiements'}
      </button>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>En cliquant, vous serez redirigé vers Stripe pour compléter la configuration</p>
      </div>
    </div>
  )
} 