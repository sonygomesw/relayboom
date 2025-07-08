'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthNew'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { cliptokkAPI } from '@/lib/supabase'
import { 
  IconRocket,
  IconArrowLeft,
  IconCoin,
  IconVideo,
  IconBolt,
  IconCheck
} from '@tabler/icons-react'

interface MissionFormData {
  title: string
  description: string
  price_per_1k_views: number
  total_budget: number
  category: string
  video_url: string
  brand_guidelines?: string
}

export default function NewMission() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<MissionFormData>({
    title: '',
    description: '',
    price_per_1k_views: 0.10,
    total_budget: 100,
    category: 'Divertissement',
    video_url: '',
    brand_guidelines: ''
  })

  const categoryOptions = [
    { value: 'Divertissement', label: 'Divertissement' },
    { value: 'Musique', label: 'Musique' },
    { value: 'Marque', label: 'Marque' },
    { value: 'Produits', label: 'Produits' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      setError(null)

      // Validation
      if (!formData.title || !formData.description || !formData.video_url) {
        throw new Error('Veuillez remplir tous les champs obligatoires')
      }

      if (formData.price_per_1k_views < 0.05) {
        throw new Error('Le prix par 1K vues doit être d\'au moins 0.05€')
      }

      if (formData.total_budget < 50) {
        throw new Error('Le budget total doit être d\'au moins 50€')
      }

      // Créer la mission
      const mission = await cliptokkAPI.createMission({
        ...formData,
        creator_id: user?.id,
        creator_name: profile?.pseudo || '',
        status: 'active'
      })

      setSuccess(true)
      
      // Rediriger vers la page des missions après 1 seconde
      setTimeout(() => {
        router.push('/dashboard/creator/missions')
      }, 1000)

    } catch (error: any) {
      console.error('Erreur création mission:', error)
      setError(error.message || 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <RoleProtectionOptimized allowedRoles={['creator']}>
      <div className="min-h-screen bg-gray-50">
        <main className="p-12">
          <div className="w-full max-w-4xl mx-auto">
            {/* Header avec retour */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.push('/dashboard/creator/missions')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <IconArrowLeft className="w-5 h-5" />
                Retour aux missions
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <IconRocket className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Nouvelle Mission</h1>
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8">
              {/* Titre et Description */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Réaction hilarante de Kai Cenat"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez votre mission en détail..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                    required
                  />
                </div>
              </div>

              {/* Prix et Budget */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix par 1K vues (€) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IconCoin className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={formData.price_per_1k_views}
                      onChange={(e) => setFormData({ ...formData, price_per_1k_views: parseFloat(e.target.value) })}
                      step="0.01"
                      min="0.05"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget total (€) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IconCoin className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={formData.total_budget}
                      onChange={(e) => setFormData({ ...formData, total_budget: parseInt(e.target.value) })}
                      min="50"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Catégorie et URL Vidéo */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de la vidéo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IconVideo className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Guidelines optionnels */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guidelines de marque (optionnel)
                </label>
                <textarea
                  value={formData.brand_guidelines}
                  onChange={(e) => setFormData({ ...formData, brand_guidelines: e.target.value })}
                  placeholder="Instructions spécifiques, ton à adopter, mentions obligatoires..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                />
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                  <IconBolt className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Message de succès */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
                  <IconCheck className="w-5 h-5 flex-shrink-0" />
                  <p>Mission créée avec succès ! Redirection...</p>
                </div>
              )}

              {/* Bouton de soumission */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <IconRocket className="w-5 h-5" />
                  {isSubmitting ? 'Création...' : 'Créer la mission'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </RoleProtectionOptimized>
  )
}
