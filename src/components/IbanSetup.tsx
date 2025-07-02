'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface IbanSetupProps {
  userId: string
  onComplete?: () => void
}

export default function IbanSetup({ userId, onComplete }: IbanSetupProps) {
  const [formData, setFormData] = useState({
    iban: '',
    bank_name: '',
    account_holder_name: ''
  })
  const [loading, setLoading] = useState(false)
  const [hasIban, setHasIban] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    loadExistingIban()
  }, [userId])

  const loadExistingIban = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('iban, bank_name, account_holder_name')
        .eq('id', userId)
        .single()

      if (error) throw error

      if (data?.iban) {
        setFormData({
          iban: data.iban || '',
          bank_name: data.bank_name || '',
          account_holder_name: data.account_holder_name || ''
        })
        setHasIban(true)
      }
    } catch (error) {
      console.error('Erreur chargement IBAN:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation basique IBAN (format européen)
      const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/
      if (!ibanRegex.test(formData.iban.replace(/\s/g, ''))) {
        alert('Format IBAN invalide. Exemple : FR76 1234 5678 9012 3456 7890 123')
        setLoading(false)
        return
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          iban: formData.iban.replace(/\s/g, ''), // Supprimer les espaces
          bank_name: formData.bank_name,
          account_holder_name: formData.account_holder_name
        })
        .eq('id', userId)

      if (error) throw error

      setHasIban(true)
      setIsEditing(false)
      onComplete?.()
      
      alert('✅ Informations bancaires sauvegardées avec succès !')
    } catch (error) {
      console.error('Erreur sauvegarde IBAN:', error)
      alert('❌ Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const formatIban = (value: string) => {
    // Formater l'IBAN avec des espaces tous les 4 caractères
    const cleaned = value.replace(/\s/g, '').toUpperCase()
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.substring(0, 34) // Limite à 34 caractères max
  }

  if (hasIban && !isEditing) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-800">
            🏦 Informations bancaires configurées
          </h3>
          <button
            onClick={() => setIsEditing(true)}
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Modifier
          </button>
        </div>
        
        <div className="space-y-3 text-sm text-green-700">
          <div>
            <span className="font-medium">IBAN :</span> {formData.iban.replace(/(.{4})/g, '$1 ')}
          </div>
          <div>
            <span className="font-medium">Banque :</span> {formData.bank_name || 'Non renseigné'}
          </div>
          <div>
            <span className="font-medium">Titulaire :</span> {formData.account_holder_name}
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-100 rounded-md">
          <p className="text-sm text-green-700">
            ✅ Vous pouvez maintenant recevoir des paiements par virement bancaire pour vos clips approuvés.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🏦 Configuration bancaire
        </h3>
        <p className="text-sm text-gray-600">
          Renseignez vos informations bancaires pour recevoir vos paiements par virement.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IBAN <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.iban}
            onChange={(e) => setFormData({ ...formData, iban: formatIban(e.target.value) })}
            placeholder="FR76 1234 5678 9012 3456 7890 123"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Format européen avec code pays (FR, DE, ES, IT, etc.)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la banque
          </label>
          <input
            type="text"
            value={formData.bank_name}
            onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
            placeholder="Ex: Crédit Agricole, BNP Paribas, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du titulaire <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.account_holder_name}
            onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
            placeholder="Nom complet tel qu'il apparaît sur votre compte"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Doit correspondre exactement au nom sur votre compte bancaire
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">
                Sécurité et confidentialité
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Vos informations bancaires sont stockées de manière sécurisée et ne sont utilisées que pour vos paiements. 
                Aucun prélèvement ne peut être effectué avec ces informations.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Sauvegarde...' : hasIban ? 'Mettre à jour' : 'Sauvegarder'}
          </button>
          
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false)
                loadExistingIban()
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  )
} 