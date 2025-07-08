'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthNew'
import { IconCreditCard, IconCheck, IconAlertCircle, IconLoader, IconArrowRight, IconShield, IconCoin } from '@tabler/icons-react'

interface StripeAccountStatus {
  hasAccount: boolean
  accountId?: string
  status?: string
  chargesEnabled?: boolean
  payoutsEnabled?: boolean
  requirementsDue?: string[]
}

export default function StripeOnboarding() {
  const { user, profile } = useAuth()
  const [accountStatus, setAccountStatus] = useState<StripeAccountStatus>({ hasAccount: false })
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user && profile?.role === 'clipper') {
      checkStripeAccount()
    }
  }, [user, profile])

  const checkStripeAccount = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await supabase
        .from('stripe_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erreur vérification compte Stripe:', error)
        return
      }

      if (data) {
        setAccountStatus({
          hasAccount: true,
          accountId: data.stripe_account_id,
          status: data.status,
          chargesEnabled: data.charges_enabled,
          payoutsEnabled: data.payouts_enabled,
          requirementsDue: data.requirements_currently_due || []
        })
      } else {
        setAccountStatus({ hasAccount: false })
      }
    } catch (error) {
      console.error('Erreur vérification compte Stripe:', error)
      setError('Erreur lors de la vérification du compte Stripe')
    } finally {
      setIsLoading(false)
    }
  }

  const createStripeAccount = async () => {
    if (!user?.id) return

    setIsCreating(true)
    setError('')

    try {
      const response = await fetch('/api/stripe/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur création compte Stripe')
      }

      // Rediriger vers l'onboarding Stripe
      if (data.onboardingUrl) {
        window.location.href = data.onboardingUrl
      }
    } catch (error) {
      console.error('Erreur création compte Stripe:', error)
      setError(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setIsCreating(false)
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'restricted':
        return 'text-orange-600 bg-orange-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'active':
        return 'Actif'
      case 'pending':
        return 'En attente'
      case 'restricted':
        return 'Restreint'
      case 'rejected':
        return 'Rejeté'
      default:
        return 'Inconnu'
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active':
        return <IconCheck className="w-4 h-4" />
      case 'pending':
        return <IconLoader className="w-4 h-4 animate-spin" />
      case 'restricted':
      case 'rejected':
        return <IconAlertCircle className="w-4 h-4" />
      default:
        return <IconAlertCircle className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <IconLoader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Vérification du compte Stripe...</span>
        </div>
      </div>
    )
  }

  if (!accountStatus.hasAccount) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconCreditCard className="w-8 h-8 text-blue-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Configurez vos paiements
          </h3>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Pour recevoir vos gains, vous devez configurer un compte Stripe. 
            C'est sécurisé, gratuit et ne prend que 2 minutes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <IconShield className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-900">Sécurisé</p>
              <p className="text-xs text-green-700">Chiffrement bancaire</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <IconCoin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-900">Gratuit</p>
              <p className="text-xs text-blue-700">Aucun frais d'ouverture</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <IconArrowRight className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-900">Rapide</p>
              <p className="text-xs text-purple-700">2 minutes maximum</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={createStripeAccount}
            disabled={isCreating}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isCreating ? (
              <>
                <IconLoader className="w-4 h-4 animate-spin" />
                Configuration en cours...
              </>
            ) : (
              <>
                <IconCreditCard className="w-4 h-4" />
                Configurer mes paiements
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Vous serez redirigé vers Stripe pour finaliser la configuration
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Compte Stripe
        </h3>
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(accountStatus.status)}`}>
          {getStatusIcon(accountStatus.status)}
          {getStatusText(accountStatus.status)}
        </span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <IconCreditCard className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Paiements</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${accountStatus.chargesEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {accountStatus.chargesEnabled ? 'Activés' : 'Désactivés'}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <IconCoin className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Retraits</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${accountStatus.payoutsEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {accountStatus.payoutsEnabled ? 'Activés' : 'Désactivés'}
            </span>
          </div>
        </div>

        {accountStatus.requirementsDue && accountStatus.requirementsDue.length > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <IconAlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">Actions requises</span>
            </div>
            <ul className="text-xs text-yellow-800 space-y-1">
              {accountStatus.requirementsDue.map((requirement, index) => (
                <li key={index}>• {requirement}</li>
              ))}
            </ul>
          </div>
        )}

        {accountStatus.status === 'active' && accountStatus.payoutsEnabled && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <IconCheck className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                Votre compte est prêt à recevoir des paiements !
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 