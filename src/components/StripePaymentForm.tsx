'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { IconCreditCard, IconLoader2 } from '@tabler/icons-react'
import { supabase } from '@/lib/supabase'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  amount: number
  onSuccess: () => void
  onError: (error: string) => void
  onCancel: () => void
}

function PaymentForm({ amount, onSuccess, onError, onCancel }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    try {
      // Créer le Payment Intent
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('Non authentifié')
      }

      const response = await fetch('/api/wallet/recharge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ amount })
      })

      const { client_secret } = await response.json()

      if (!response.ok) {
        throw new Error('Erreur lors de la création du paiement')
      }

      // Confirmer le paiement
      const { error } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      })

      if (error) {
        onError(error.message || 'Erreur de paiement')
      } else {
        onSuccess()
      }
    } catch (err) {
      onError('Erreur lors du traitement du paiement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Informations de carte bancaire
        </label>
        <div className="p-4 border border-gray-200 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <IconLoader2 className="w-4 h-4 animate-spin" />
              Traitement...
            </>
          ) : (
            <>
              <IconCreditCard className="w-4 h-4" />
              Payer {amount}€
            </>
          )}
        </button>
      </div>
    </form>
  )
}

interface StripePaymentFormProps {
  amount: number
  onSuccess: () => void
  onError: (error: string) => void
  onCancel: () => void
}

export default function StripePaymentForm({ amount, onSuccess, onError, onCancel }: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <IconCreditCard className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold">Paiement sécurisé</h3>
        </div>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Montant :</strong> {amount}€ (Commission 10% incluse)
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Paiement sécurisé par Stripe • Données chiffrées
          </p>
        </div>

        <PaymentForm 
          amount={amount}
          onSuccess={onSuccess}
          onError={onError}
          onCancel={onCancel}
        />
      </div>
    </Elements>
  )
} 