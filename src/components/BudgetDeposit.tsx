'use client'

import { useState } from 'react'
import { IconCreditCard, IconPlus, IconWallet, IconCheck, IconAlertCircle, IconLoader } from '@tabler/icons-react'

interface BudgetDepositProps {
  currentBalance: number
  onDepositSuccess: (amount: number) => void
}

export default function BudgetDeposit({ currentBalance, onDepositSuccess }: BudgetDepositProps) {
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const predefinedAmounts = [50, 100, 200, 500, 1000]

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString())
    setError('')
  }

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount)
    
    if (!depositAmount || depositAmount < 10) {
      setError('Montant minimum: 10€')
      return
    }

    if (depositAmount > 10000) {
      setError('Montant maximum: 10 000€')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      // Simuler le processus de paiement
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simuler succès
      setShowSuccess(true)
      onDepositSuccess(depositAmount)
      setAmount('')
      
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      setError('Erreur lors du dépôt. Veuillez réessayer.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  if (showSuccess) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconCheck className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Dépôt réussi !
          </h3>
          <p className="text-gray-600 mb-4">
            {formatCurrency(parseFloat(amount))} ont été ajoutés à votre budget.
          </p>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <span className="font-medium">Nouveau solde :</span> {formatCurrency(currentBalance + parseFloat(amount))}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <IconWallet className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recharger mon budget</h3>
          <p className="text-sm text-gray-600">Solde actuel: {formatCurrency(currentBalance)}</p>
        </div>
      </div>

      {/* Montants prédéfinis */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Montants suggérés
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {predefinedAmounts.map((preAmount) => (
            <button
              key={preAmount}
              onClick={() => handleAmountSelect(preAmount)}
              className={`p-3 rounded-lg border text-center transition-colors ${
                amount === preAmount.toString()
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <span className="text-sm font-medium">{preAmount}€</span>
            </button>
          ))}
        </div>
      </div>

      {/* Montant personnalisé */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ou montant personnalisé
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              setError('')
            }}
            placeholder="Montant en euros"
            min="10"
            max="10000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 text-sm">€</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Minimum: 10€ • Maximum: 10 000€
        </p>
      </div>

      {/* Informations sur les frais */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Informations importantes</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Aucun frais de dépôt</li>
          <li>• Budget disponible immédiatement</li>
          <li>• Remboursement possible du solde non utilisé</li>
          <li>• Paiement sécurisé par Stripe</li>
        </ul>
      </div>

      {/* Erreur */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <IconAlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {/* Bouton de dépôt */}
      <button
        onClick={handleDeposit}
        disabled={!amount || isProcessing || parseFloat(amount) < 10}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
      >
        {isProcessing ? (
          <>
            <IconLoader className="w-4 h-4 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <IconCreditCard className="w-4 h-4" />
            Déposer {amount ? formatCurrency(parseFloat(amount)) : '0€'}
          </>
        )}
      </button>

      {/* Récapitulatif */}
      {amount && parseFloat(amount) >= 10 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Solde actuel:</span>
            <span className="font-medium">{formatCurrency(currentBalance)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Dépôt:</span>
            <span className="font-medium text-blue-600">+{formatCurrency(parseFloat(amount))}</span>
          </div>
          <div className="border-t border-blue-200 mt-2 pt-2 flex justify-between text-sm font-semibold">
            <span className="text-gray-900">Nouveau solde:</span>
            <span className="text-blue-600">{formatCurrency(currentBalance + parseFloat(amount))}</span>
          </div>
        </div>
      )}
    </div>
  )
} 