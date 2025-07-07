'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { cliptokkAPI } from '@/lib/supabase'
import { useAuth } from '@/components/AuthContext'
import { usePreloadedData } from '@/hooks/usePreloadedData'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import ClipperSidebar from '@/components/ClipperSidebar'
import { MissionsSkeleton } from '@/components/SkeletonLoader'
import { IconArrowLeft, IconPlayerPlay, IconStar, IconTarget, IconUsers, IconCheck, IconFlame, IconCoin, IconEye, IconBolt } from '@tabler/icons-react'

interface Mission {
  id: string
  title: string
  description: string
  long_description: string
  creator_name: string
  creator_image: string
  price_per_1k_views: number
  total_budget: number
  rules: string[]
  examples: string[]
  successful_clips: any[]
  status: string
  submissions_count: number
  budget_remaining: number
  deadline: string
  difficulty: 'Facile' | 'Moyen' | 'Difficile'
  hashtags: string[]
  mentions: string[]
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data: mission } = await cliptokkAPI.getMission(params.id)
  
  if (!mission) {
    return {
      title: 'Mission non trouvée - Cliptokk',
      description: 'Cette mission n\'existe pas ou a été supprimée.'
    }
  }

  return {
    title: `${mission.title} - Mission Cliptokk`,
    description: mission.description,
    openGraph: {
      title: mission.title,
      description: mission.description,
      type: 'article',
      url: `https://cliptokk.com/mission/${params.id}`,
    }
  }
}

// Générer les routes statiques
export async function generateStaticParams() {
  const { data: missions } = await cliptokkAPI.getActiveMissions()

  return missions?.map((mission) => ({
    id: mission.slug || mission.id
  })) || []
}


export default function MissionDetailPage() {
  const { user, profile } = useAuth()
  const [mission, setMission] = useState<Mission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const missionId = params.id as string

  // Hook de préchargement pour les stats utilisateur
  const { userStats } = usePreloadedData(user?.id)

  useEffect(() => {
    if (missionId) {
      loadMission()
    }
  }, [missionId])

  const loadMission = async () => {
    if (!missionId) return
    
    try {
      setIsLoading(true)
      setError(null)

      console.log('🔍 Chargement mission:', missionId)

      // Charger la mission depuis notre API optimisée
      const missions = await cliptokkAPI.getActiveMissions()
      const foundMission = missions.find((m: any) => m.id === missionId)

      if (!foundMission) {
        console.error('❌ Mission non trouvée:', missionId)
        setError('Mission non trouvée')
        return
      }

      console.log('✅ Mission trouvée:', foundMission)

      // Adapter les données pour l'interface
      const adaptedMission: Mission = {
        ...foundMission,
        long_description: foundMission.brand_guidelines || `🎯 **Mission ${foundMission.creator_name} !**

${foundMission.description}

**Ce qu'on cherche :**
- Contenu authentique et viral
- Moments forts et émotionnels
- Réactions spontanées
- Interactions naturelles

**Pourquoi cette mission cartonne :**
✅ Créateur populaire avec audience massive
✅ Contenu optimisé pour TikTok
✅ Potentiel viral énorme
✅ Rémunération attractive

Tu as toutes les cartes en main pour faire un carton ! 🚀`,
        rules: [
          'Durée : 15 à 60 secondes maximum',
          `Hashtags recommandés : #${foundMission.creator_name} #Viral #TikTok`,
          `Mention recommandée : @${foundMission.creator_name.toLowerCase()}`,
          'Pas de contenu violent ou inapproprié',
          'Sous-titres recommandés pour l\'accessibilité',
          'Audio original préservé',
          'Format vertical optimisé TikTok'
        ],
        examples: [
          'Réaction authentique et spontanée',
          'Moment fort émotionnellement',
          'Interaction naturelle et drôle',
          'Séquence avec fort potentiel viral',
          'Contenu engageant pour la communauté'
        ],
        successful_clips: [],
        submissions_count: 0, // À calculer si nécessaire
        budget_remaining: foundMission.total_budget * 0.7, // Simulation
        deadline: '2024-03-15',
        difficulty: 'Moyen',
        hashtags: [`#${foundMission.creator_name}`, '#Viral', '#TikTok'],
        mentions: [`@${foundMission.creator_name.toLowerCase()}`]
      }

      setMission(adaptedMission)
      console.log('✅ Mission adaptée et définie')

    } catch (error) {
      console.error('❌ Erreur chargement mission:', error)
      setError('Erreur de chargement de la mission')
    } finally {
      setIsLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile':
        return 'bg-green-100 text-green-800'
      case 'Moyen':
        return 'bg-yellow-100 text-yellow-800'
      case 'Difficile':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return (
      <RoleProtectionOptimized allowedRoles={['clipper']}>
        <MissionsSkeleton />
      </RoleProtectionOptimized>
    )
  }

  // Afficher l'erreur si nécessaire
  if (error || !mission) {
    return (
      <RoleProtectionOptimized allowedRoles={['clipper']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconBolt className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Mission non trouvée</h3>
            <p className="text-gray-600 mb-4">{error || 'Cette mission n\'existe pas ou n\'est plus disponible.'}</p>
            <button 
              onClick={() => router.push('/dashboard/clipper')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retour au dashboard
            </button>
          </div>
        </div>
      </RoleProtectionOptimized>
    )
  }

  return (
    <RoleProtectionOptimized allowedRoles={['clipper']}>
      <div className="min-h-screen bg-gray-50 flex">
        <ClipperSidebar 
          userStats={{
            totalEarnings: userStats?.total_earnings || 0,
            totalViews: userStats?.total_views || 0,
            nextMilestone: 1000
          }} 
          profile={profile || { pseudo: '', email: '', role: '' }} 
        />
        <div className="flex-1 ml-96">
          <main className="p-8">
            {/* Header avec retour */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.push('/dashboard/clipper')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <IconArrowLeft className="w-5 h-5" />
                Retour au dashboard
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <h1 className="text-3xl font-bold text-gray-900">Détails de la mission</h1>
            </div>

            {/* Hero mission */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
              <div className="flex items-start gap-12">
                <img 
                  src={mission.creator_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(mission.creator_name || 'User')}&background=0066CC&color=fff&size=192`}
                  alt={mission.creator_name}
                  className="w-48 h-48 rounded-2xl object-cover shadow-2xl ring-4 ring-white"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{mission.title}</h2>
                      <p className="text-xl text-gray-600 mb-4">{mission.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-2 rounded-lg text-sm font-bold ${getDifficultyColor(mission.difficulty)}`}>
                        {mission.difficulty}
                      </span>
                      <span className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-bold">
                        {mission.status === 'active' ? 'Active' : 'Fermée'}
                      </span>
                    </div>
                  </div>

                  {/* Budget total centré */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-green-100 text-green-800 px-8 py-4 rounded-2xl">
                      <p className="text-3xl font-black text-center">{mission.total_budget}€</p>
                      <p className="text-sm text-center font-medium">Budget total</p>
                    </div>
                  </div>

                  {/* Paliers de paiement */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="bg-yellow-100 text-yellow-800 text-sm font-bold px-3 py-2 rounded-md w-fit mb-4 flex items-center gap-2">
                      💰 Paiement fixe par vues
                      <span className="text-xs bg-yellow-200 px-2 py-1 rounded">💡 Garanti</span>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-800">🎯 10K vues = {(mission.price_per_1k_views * 10).toFixed(0)}€</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-800">💸 100K vues = {(mission.price_per_1k_views * 100).toFixed(0)}€</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-800">🚀 1M vues = {(mission.price_per_1k_views * 1000).toFixed(0)}€</div>
                      </div>
                    </div>
                  </div>

                  {/* CTA principal */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => router.push(`/mission/${mission.id}/submit`)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-3"
                    >
                      <IconPlayerPlay className="w-6 h-6" />
                      Clipper cette mission
                    </button>
                    <button className="bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                      <IconStar className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de contenu */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Description détaillée */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <IconTarget className="w-6 h-6 text-blue-500" />
                  Description de la mission
                </h3>
                <div className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-line text-gray-700">
                    {mission.long_description}
                  </div>
                </div>
              </div>

              {/* Stats mission */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <IconUsers className="w-6 h-6 text-purple-500" />
                  Statistiques
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Budget restant</span>
                    <span className="font-bold text-green-600">{mission.budget_remaining}€</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Prix par 1K vues</span>
                    <span className="font-bold text-blue-600">{mission.price_per_1k_views.toFixed(2)}€</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Clips soumis</span>
                    <span className="font-bold text-purple-600">{mission.submissions_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Statut</span>
                    <span className="font-bold text-green-600">Actif</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Règles et exemples */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Règles */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <IconCheck className="w-6 h-6 text-green-500" />
                  Règles à respecter
                </h3>
                <ul className="space-y-4">
                  {mission.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exemples */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <IconStar className="w-6 h-6 text-yellow-500" />
                  Idées de clips gagnants
                </h3>
                <ul className="space-y-4">
                  {mission.examples.map((example, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA fixe en bas */}
            <div className="fixed bottom-0 left-96 right-0 bg-white border-t border-gray-200 p-6 z-40">
              <div className="max-w-4xl mx-auto flex gap-4">
                <button
                  onClick={() => router.push('/dashboard/clipper')}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={() => router.push(`/mission/${mission.id}/submit`)}
                  className="flex-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-8 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <IconPlayerPlay className="w-5 h-5" />
                  Soumettre mon clip
                </button>
              </div>
            </div>

            {/* Espacement pour le CTA fixe */}
            <div className="h-24"></div>

          </main>
        </div>
      </div>
    </RoleProtectionOptimized>
  )
}