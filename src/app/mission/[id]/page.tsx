'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthContext'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import ClipperSidebar from '@/components/ClipperSidebar'
import { IconArrowLeft, IconPlayerPlay, IconStar, IconTarget, IconUsers, IconCheck, IconFlame } from '@tabler/icons-react'

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

export default function MissionDetailPage() {
  const { user, profile } = useAuth()
  const [mission, setMission] = useState<Mission | null>(null)
  const [userStats, setUserStats] = useState({ totalEarnings: 0, totalViews: 0, nextMilestone: 1000 })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const missionId = params.id as string

  useEffect(() => {
    if (user && profile) {
      loadMission()
      loadUserStats()
    }
  }, [user, profile, missionId])

  const loadUserStats = async () => {
    if (!user?.id) return
    
    try {
      const { data: submissions } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)

      const totalEarnings = submissions?.reduce((sum, sub) => sum + (sub.earnings || 0), 0) || 0
      const totalViews = submissions?.reduce((sum, sub) => sum + (sub.views_count || 0), 0) || 0
      const nextMilestone = totalViews < 1000 ? 1000 : totalViews < 10000 ? 10000 : totalViews < 100000 ? 100000 : totalViews + 100000

      setUserStats({ totalEarnings, totalViews, nextMilestone })
    } catch (error) {
      console.error('Erreur chargement stats utilisateur:', error)
    }
  }

  const loadMission = async () => {
    if (!user?.id) return
    
    try {
      // Charger la mission depuis Supabase
      const { data: missionData, error } = await supabase
        .from('missions')
        .select('*')
        .eq('id', missionId)
        .single()

      if (error || !missionData) {
        console.error('Erreur chargement mission:', error)
        router.push('/dashboard/clipper')
        return
      }

      // Calculer le budget restant basé sur les vues réelles validées
      const { data: submissions } = await supabase
        .from('submissions')
        .select('views_count')
        .eq('mission_id', missionId)
        .eq('status', 'approved') // Seulement les vues validées

      const totalViewsValidated = submissions?.reduce((sum, sub) => sum + (sub.views_count || 0), 0) || 0
      const totalSpent = (totalViewsValidated / 1000) * (missionData.reward || 0.1)
      const budgetRemaining = Math.max(0, (missionData.total_budget || 1000) - totalSpent)

      // Compter les submissions réelles
      const { data: allSubmissions } = await supabase
        .from('submissions')
        .select('id')
        .eq('mission_id', missionId)

      // Adapter les données pour l'interface
      const adaptedMission: Mission = {
        ...missionData,
        price_per_1k_views: missionData.reward || 0.1,
        total_budget: missionData.total_budget || 1000,
        long_description: `🎯 **Mission ${missionData.creator_name} !**

${missionData.description}

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
          `Hashtags recommandés : #${missionData.creator_name} #Viral #TikTok`,
          `Mention recommandée : @${missionData.creator_name.toLowerCase()}`,
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
        submissions_count: allSubmissions?.length || 0,
        budget_remaining: Math.round(budgetRemaining),
        deadline: '2024-03-15',
        difficulty: 'Moyen',
        hashtags: [`#${missionData.creator_name}`, '#Viral', '#TikTok'],
        mentions: [`@${missionData.creator_name.toLowerCase()}`]
      }

      setMission(adaptedMission)
    } catch (error) {
      console.error('Erreur chargement mission:', error)
      router.push('/dashboard/clipper')
    } finally {
      setIsLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-800'
      case 'Moyen': return 'bg-yellow-100 text-yellow-800'
      case 'Difficile': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Expirée'
    if (diffDays === 0) return 'Expire aujourd\'hui'
    if (diffDays === 1) return 'Expire demain'
    return `${diffDays} jours restants`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la mission...</p>
        </div>
      </div>
    )
  }

  if (!mission || !user || !profile) {
    return null
  }

  return (
    <RoleProtectionOptimized allowedRoles={['clipper']}>
      <div className="min-h-screen bg-gray-50 flex">
        <ClipperSidebar userStats={userStats} profile={profile} />
        <div className="flex-1 ml-96">
          <main className="p-8">
            {/* Header avec retour */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <IconArrowLeft className="w-5 h-5" />
                Retour
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <h1 className="text-3xl font-bold text-gray-900">Détails de la mission</h1>
            </div>

            {/* Hero mission */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
              <div className="flex items-start gap-8">
                <img 
                  src={mission.creator_image} 
                  alt={mission.creator_name}
                  className="w-24 h-24 rounded-xl object-cover"
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
                        <div className="text-lg font-bold text-green-800">🎯 10K vues = 1€</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-800">💸 100K vues = 10€</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-800">🚀 1M vues = 100€</div>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Description longue */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <IconTarget className="w-7 h-7 text-blue-500" />
                  Description complète
                </h3>
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {mission.long_description}
                  </div>
                </div>
              </div>

              {/* Hashtags et mentions */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <IconFlame className="w-6 h-6 text-orange-500" />
                    Hashtags requis
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mission.hashtags.map((hashtag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <IconUsers className="w-6 h-6 text-purple-500" />
                    Mentions obligatoires
                  </h3>
                  <div className="space-y-2">
                    {mission.mentions.map((mention, index) => (
                      <div key={index} className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium">
                        {mention}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Règles et exemples */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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

          </main>
        </div>
      </div>
    </RoleProtectionOptimized>
  )
}