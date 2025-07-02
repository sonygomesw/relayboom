'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { formatCurrency } from '@/lib/stripe-cliptokk'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface WalletRechargeProps {
  onSuccess?: (amount: number) => void
  onError?: (error: string) => void
}

// Composant interne avec Stripe Elements
function CheckoutForm({ 
  amount, 
  clientSecret, 
  commission,
  netAmount,
  onSuccess, 
  onError 
}: {
  amount: number
  clientSecret: string
  commission: number
  netAmount: number
  onSuccess?: (amount: number) => void
  onError?: (error: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) return

    setIsProcessing(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/creator?recharge=success`,
        },
        redirect: 'if_required'
      })

      if (error) {
        onError?.(error.message || 'Erreur de paiement')
      } else {
        onSuccess?.(amount)
      }
    } catch (err) {
      onError?.('Erreur lors du traitement du paiement')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-3">Récapitulatif du paiement</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Montant à payer:</span>
            <span className="font-bold">{formatCurrency(amount * 100)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Commission Cliptokk (10%):</span>
            <span>-{formatCurrency(commission * 100)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <span className="font-semibold">Crédits ajoutés au wallet:</span>
            <span className="font-bold text-green-600">{formatCurrency(netAmount * 100)}</span>
          </div>
        </div>
        <div className="text-sm text-gray-600 mt-3">
          💡 Ces crédits seront utilisés pour payer vos clippeurs automatiquement (100% des gains)
        </div>
      </div>

      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Traitement...' : `Payer ${formatCurrency(amount * 100)}`}
      </button>
    </form>
  )
}

// Composant principal
export default function WalletRecharge({ onSuccess, onError }: WalletRechargeProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(100)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [clientSecret, setClientSecret] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [commission, setCommission] = useState<number>(0)
  const [netAmount, setNetAmount] = useState<number>(0)

  const predefinedAmounts = [50, 100, 250, 500, 1000, 2500]

  const createPaymentIntent = async () => {
    setIsLoading(true)
    try {
      const amount = customAmount ? parseFloat(customAmount) : selectedAmount

      if (amount < 10 || amount > 10000) {
        onError?.('Montant invalide (entre 10€ et 10,000€)')
        return
      }

      const response = await fetch('/api/wallet/recharge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`
        },
        body: JSON.stringify({ amount })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du paiement')
      }

      setClientSecret(data.clientSecret)
      setCommission(data.commission)
      setNetAmount(data.netAmount)
      setShowPayment(true)
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(0)
  }

  if (showPayment && clientSecret) {
    return (
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setShowPayment(false)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Retour
          </button>
        </div>

        <Elements 
          stripe={stripePromise} 
          options={{ 
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#2563eb',
              }
            }
          }}
        >
          <CheckoutForm
            amount={customAmount ? parseFloat(customAmount) : selectedAmount}
            clientSecret={clientSecret}
            commission={commission}
            netAmount={netAmount}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Elements>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Recharger votre wallet</h2>
        <p className="text-gray-600">
          Ajoutez des crédits pour payer vos clippeurs automatiquement
        </p>
      </div>

      {/* Montants prédéfinis */}
      <div>
        <label className="block text-sm font-medium mb-3">Montants suggérés</label>
        <div className="grid grid-cols-3 gap-3">
          {predefinedAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountSelect(amount)}
              className={`p-3 border rounded-lg text-center transition-colors ${
                selectedAmount === amount && !customAmount
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {amount}€
            </button>
          ))}
        </div>
      </div>

      {/* Montant personnalisé */}
      <div>
        <label className="block text-sm font-medium mb-2">Montant personnalisé</label>
        <div className="relative">
          <input
            type="number"
            min="10"
            max="10000"
            step="1"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            placeholder="Ex: 150"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="absolute right-3 top-3 text-gray-500">€</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Minimum: 10€ • Maximum: 10,000€
        </p>
      </div>

      {/* Récapitulatif */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Montant à payer:</span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency((customAmount ? parseFloat(customAmount) : selectedAmount) * 100)}
            </span>
          </div>
          <div className="flex justify-between text-red-600 text-sm">
            <span>Commission Cliptokk (10%):</span>
            <span>-{formatCurrency((customAmount ? parseFloat(customAmount) : selectedAmount) * 10)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <span className="font-medium text-green-700">Crédits nets obtenus:</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency((customAmount ? parseFloat(customAmount) : selectedAmount) * 90)}
            </span>
          </div>
        </div>
      </div>

      {/* Bouton de confirmation */}
      <button
        onClick={createPaymentIntent}
        disabled={isLoading || (!selectedAmount && !customAmount)}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Préparation...' : 'Continuer vers le paiement'}
      </button>

      {/* Informations */}
      <div className="text-sm text-gray-600 space-y-2">
        <div className="flex items-start gap-2">
          <span className="text-green-600">✓</span>
          <span>Paiement sécurisé par Stripe</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-green-600">✓</span>
          <span>Commission de 10% prélevée lors de la recharge (clippeurs reçoivent 100%)</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-green-600">✓</span>
          <span>Crédits utilisés automatiquement selon les performances</span>
        </div>
      </div>
    </div>
  )
} 