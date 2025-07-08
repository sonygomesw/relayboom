'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthNew'
import { api, Mission } from '@/lib/supabase-new'

interface SubmitPageProps {
  params: { id: string }
}

export default function SubmitPage({ params }: SubmitPageProps) {
  const [mission, setMission] = useState<Mission | null>(null)
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loadingMission, setLoadingMission] = useState(true)
  
  const { user, profile } = useAuth()
  const router = useRouter()

  // Charger la mission
  useEffect(() => {
    loadMission()
  }, [params.id])

  const loadMission = async () => {
    try {
      console.log('🎯 Chargement mission:', params.id)
      const missionData = await api.getMission(params.id)
      
      if (missionData) {
        setMission(missionData)
        console.log('✅ Mission chargée:', missionData.title)
      } else {
        console.log('❌ Mission non trouvée')
        setError('Mission non trouvée')
      }
    } catch (err) {
      console.error('❌ Erreur chargement mission:', err)
      setError('Erreur lors du chargement de la mission')
    } finally {
      setLoadingMission(false)
    }
  }

  // Rediriger si pas connecté
  if (!user) {
    router.push('/')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!tiktokUrl.trim()) {
      setError('URL TikTok requise')
      return
    }

    setIsLoading(true)
    setError('')

    console.log('📤 Soumission en cours...', {
      userId: user.id,
      missionId: params.id,
      tiktokUrl,
      description
    })

    try {
      const success = await api.createSubmission(
        user.id,
        params.id,
        tiktokUrl.trim(),
        description.trim()
      )

      if (success) {
        console.log('✅ Soumission réussie !')
        setSuccess(true)
      } else {
        console.log('❌ Échec soumission')
        setError('Erreur lors de la soumission. Veuillez réessayer.')
      }
    } catch (err) {
      console.error('❌ Erreur soumission:', err)
      setError('Erreur lors de la soumission. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  // Loading mission
  if (loadingMission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la mission...</p>
        </div>
      </div>
    )
  }

  // Mission not found
  if (!mission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Mission non trouvée
          </h1>
          <p className="text-gray-600 mb-6">
            La mission que vous cherchez n'existe pas ou a été supprimée.
          </p>
          <button
            onClick={() => router.push('/missions')}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Retour aux missions
          </button>
        </div>
      </div>
    )
  }

  // Success page
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Soumission envoyée !
          </h1>
          <p className="text-gray-600 mb-6">
            Votre clip a été soumis avec succès pour la mission "{mission.title}". 
            Vous recevrez une notification quand il sera approuvé.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard/clipper')}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-medium"
            >
              Retour au dashboard
            </button>
            <button
              onClick={() => router.push('/missions')}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium"
            >
              Voir d'autres missions
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Submit form
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <h1 className="text-2xl font-bold">{mission.title}</h1>
            <p className="text-blue-100 mt-2">{mission.description}</p>
            <div className="mt-4 flex items-center text-blue-100">
              <span className="text-sm">💰 {mission.price_per_1k_views}€ / 1k vues</span>
              <span className="mx-2">•</span>
              <span className="text-sm">👤 {mission.creator_name}</span>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL TikTok *
                </label>
                <input
                  type="url"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@username/video/..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Collez l'URL complète de votre clip TikTok
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optionnel)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez votre clip, les moments forts choisis..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !tiktokUrl.trim()}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? 'Envoi en cours...' : 'Soumettre le clip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 