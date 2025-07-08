'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/components/AuthNew'
import { supabase } from '@/lib/supabase'
import { api } from '@/lib/supabase-new'
import { ClipsSkeleton } from '@/components/SkeletonLoader'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import ClipperSidebar from '@/components/ClipperSidebar'
import { 
  IconVideo, 
  IconEye, 
  IconCurrencyEuro, 
  IconClock, 
  IconCheck, 
  IconX, 
  IconSearch, 
  IconTrendingUp,
  IconExternalLink,
  IconSparkles,
  IconTarget,
  IconBrandTiktok
} from '@tabler/icons-react'

interface ClipSubmission {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  views_count?: number
  created_at: string
  tiktok_url: string
  mission_id: string
  user_id: string
  description: string
  mission_title?: string
  mission_creator?: string
  mission_price?: number
}

interface ClipperStats {
  totalSubmissions: number
  totalViews: number
  totalEarnings: number
  pendingSubmissions: number
  approvedSubmissions: number
  rejectedSubmissions: number
  activeMissions: number
  avgViewsPerClip: number
}

interface PalierModal {
  isOpen: boolean
  clip: ClipSubmission | null
  selectedPalier: number | null
}

export default function ClipperClips() {
  const { user, profile } = useAuth()
  
  // États pour les données
  const [clips, setClips] = useState<ClipSubmission[]>([])
  const [userStats, setUserStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  // États pour les filtres
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // États pour la modale de paliers
  const [palierModal, setPalierModal] = useState<PalierModal>({
    isOpen: false,
    clip: null,
    selectedPalier: null
  })
  const [isSubmittingPalier, setIsSubmittingPalier] = useState(false)

  // Paliers disponibles
  const paliers = [
    { views: 1000, label: '1K', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { views: 5000, label: '5K', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { views: 10000, label: '10K', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    { views: 50000, label: '50K', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
    { views: 100000, label: '100K', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
    { views: 500000, label: '500K', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
    { views: 1000000, label: '1M', color: 'bg-pink-100 text-pink-800 hover:bg-pink-200' }
  ]

  // Charger les données
  useEffect(() => {
    if (user?.id) {
      loadClipsWithMissions()
    }
  }, [user?.id])

  const loadClipsWithMissions = async () => {
    try {
      setIsLoading(true)
      console.log('🔄 Chargement clips avec missions...')

      // Récupérer les soumissions de l'utilisateur
      const submissions = await api.getUserSubmissions(user!.id)
      console.log('✅ Soumissions récupérées:', submissions.length)

      // Récupérer toutes les missions pour faire le mapping
      const missions = await api.getMissions()
      console.log('✅ Missions récupérées:', missions.length)

      // Créer un map des missions pour un accès rapide
      const missionsMap = missions.reduce((acc, mission) => {
        acc[mission.id] = mission
        return acc
      }, {} as Record<string, any>)

      // Enrichir les soumissions avec les données des missions
      const enrichedClips = submissions.map(submission => {
        const mission = missionsMap[submission.mission_id]
        return {
          ...submission,
          views_count: 0, // Initialiser à 0 pour l'instant
          mission_title: mission?.title || 'Mission inconnue',
          mission_creator: mission?.creator_name || 'Créateur inconnu',
          mission_price: mission?.price_per_1k_views || 0
        }
      })

      setClips(enrichedClips)

      // Calculer les stats utilisateur directement
      const totalViews = enrichedClips.reduce((sum, clip) => sum + (clip.views_count || 0), 0)
      const totalEarnings = enrichedClips.reduce((sum, clip) => {
        const views = clip.views_count || 0
        const price = clip.mission_price || 0
        return sum + (views / 1000) * price
      }, 0)

      setUserStats({
        total_views: totalViews,
        total_earnings: totalEarnings
      })

      console.log('✅ Données chargées avec succès')
    } catch (err) {
      console.error('❌ Erreur chargement clips:', err)
      setError('Erreur lors du chargement des clips')
    } finally {
      setIsLoading(false)
    }
  }

  // Ouvrir la modale de palier
  const openPalierModal = (clip: ClipSubmission, palier: number) => {
    setPalierModal({
      isOpen: true,
      clip,
      selectedPalier: palier
    })
  }

  // Fermer la modale
  const closePalierModal = () => {
    setPalierModal({
      isOpen: false,
      clip: null,
      selectedPalier: null
    })
  }

  // Soumettre le palier
  const submitPalier = async () => {
    if (!palierModal.clip || !palierModal.selectedPalier || !user?.id) return

    try {
      setIsSubmittingPalier(true)
      console.log('🎯 Soumission palier:', {
        clip: palierModal.clip.id,
        palier: palierModal.selectedPalier
      })

      // Insérer dans la table clip_submissions
      const { error } = await supabase
        .from('clip_submissions')
        .insert({
          user_id: user.id,
          mission_id: palierModal.clip.mission_id,
          submission_id: palierModal.clip.id,
          tiktok_link: palierModal.clip.tiktok_url,
          views_declared: palierModal.selectedPalier,
          palier: palierModal.selectedPalier,
          status: 'pending'
        })

      if (error) {
        console.error('❌ Erreur soumission palier:', error)
        alert('Erreur lors de la soumission du palier')
        return
      }

      console.log('✅ Palier soumis avec succès')
      alert('Palier soumis avec succès ! Il sera validé par un administrateur.')
      
      closePalierModal()
      loadClipsWithMissions() // Recharger les données

    } catch (err) {
      console.error('❌ Erreur soumission palier:', err)
      alert('Erreur lors de la soumission du palier')
    } finally {
      setIsSubmittingPalier(false)
    }
  }

  // Calculer les gains potentiels
  const calculatePotentialEarnings = (views: number, pricePerK: number) => {
    return ((views / 1000) * pricePerK).toFixed(2)
  }

  // Calcul des stats optimisé
  const clipperStats = useMemo((): ClipperStats => {
    if (!clips || clips.length === 0) {
      return {
        totalSubmissions: 0,
        totalViews: 0,
        totalEarnings: 0,
        pendingSubmissions: 0,
        approvedSubmissions: 0,
        rejectedSubmissions: 0,
        activeMissions: 0,
        avgViewsPerClip: 0
      }
    }

    return {
      totalSubmissions: clips.length,
      totalViews: userStats?.total_views || 0,
      totalEarnings: userStats?.total_earnings || 0,
      pendingSubmissions: clips.filter((c: ClipSubmission) => c.status === 'pending').length,
      approvedSubmissions: clips.filter((c: ClipSubmission) => c.status === 'approved').length,
      rejectedSubmissions: clips.filter((c: ClipSubmission) => c.status === 'rejected').length,
      activeMissions: 0,
      avgViewsPerClip: clips.length > 0 ? Math.round((userStats?.total_views || 0) / clips.length) : 0
    }
  }, [clips, userStats])

  // Filtrage des clips optimisé
  const filteredClips = useMemo(() => {
    if (!clips) return []
    
    let filtered = clips

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((clip: ClipSubmission) => clip.status === selectedStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter((clip: ClipSubmission) =>
        clip.mission_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clip.mission_creator?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [clips, selectedStatus, searchTerm])

  // Séparer les clips en attente pour la section spéciale
  const pendingClips = clips.filter(clip => clip.status === 'pending')

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toString()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <IconCheck className="w-4 h-4 text-green-600" />
      case 'rejected':
        return <IconX className="w-4 h-4 text-red-600" />
      default:
        return <IconClock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé'
      case 'rejected':
        return 'Rejeté'
      default:
        return 'En attente'
    }
  }

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return (
      <RoleProtectionOptimized allowedRoles={['clipper']}>
        <ClipsSkeleton />
      </RoleProtectionOptimized>
    )
  }

  // Afficher l'erreur si nécessaire
  if (error) {
    return (
      <RoleProtectionOptimized allowedRoles={['clipper']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconSparkles className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => loadClipsWithMissions()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Réessayer
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
          userStats={{...clipperStats, nextMilestone: 1000}} 
          profile={profile || { pseudo: '', email: '', role: 'clipper' } as any} 
        />

        <div className="flex-1 ml-96">
          <main className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <IconVideo className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Mes Clips</h1>
                  <p className="text-gray-600">Suivez vos soumissions et leurs performances</p>
                </div>
              </div>
            </div>

            {/* Section Déclaration de Paliers - Uniquement pour les clips en attente */}
            {pendingClips.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8 mb-8 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                    <IconTarget className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">🎯 Déclarez vos paliers de vues</h2>
                    <p className="text-gray-600 mt-1">Vos clips sont en attente - déclarez les paliers de vues atteints pour être rémunéré</p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {pendingClips.map((clip) => (
                    <div key={clip.id} className="bg-white rounded-xl p-6 border-2 border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                      {/* En-tête de la carte mission */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              {clip.mission_title?.charAt(0) || 'M'}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{clip.mission_title}</h3>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <span>👤</span>
                                Par <span className="font-medium">{clip.mission_creator}</span>
                              </p>
                            </div>
                          </div>
                          
                          {/* Infos mission */}
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                              <IconCurrencyEuro className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                {clip.mission_price}€ / 1k vues
                              </span>
                            </div>
                            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                              <IconClock className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-700">
                                {new Date(clip.created_at).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          </div>

                          {/* Lien TikTok */}
                          {clip.tiktok_url && (
                            <a 
                              href={clip.tiktok_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                            >
                              <IconExternalLink className="w-4 h-4" />
                              Voir mon clip TikTok
                            </a>
                          )}
                        </div>
                        
                        {/* Badge statut */}
                        <div className="flex items-center gap-2 bg-yellow-100 px-3 py-2 rounded-full">
                          <IconClock className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">En attente</span>
                        </div>
                      </div>

                      {/* Séparateur */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Sélectionnez le palier de vues atteint :</h4>
                        
                        {/* Boutons paliers */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
                          {paliers.map((palier) => (
                            <button
                              key={palier.views}
                              onClick={() => openPalierModal(clip, palier.views)}
                              className={`relative p-3 rounded-xl text-center transition-all duration-200 hover:scale-105 hover:shadow-md ${palier.color} border-2 border-transparent hover:border-white`}
                            >
                              <div className="font-bold text-lg">{palier.label}</div>
                              <div className="text-xs opacity-75">{formatNumber(palier.views)} vues</div>
                              <div className="text-xs font-medium mt-1">
                                +{calculatePotentialEarnings(palier.views, clip.mission_price || 0)}€
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Clips</p>
                    <p className="text-2xl font-bold text-gray-900">{clipperStats.totalSubmissions}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <IconVideo className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Vues</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(clipperStats.totalViews)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <IconEye className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Revenus</p>
                    <p className="text-2xl font-bold text-gray-900">{clipperStats.totalEarnings.toFixed(2)}€</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <IconCurrencyEuro className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">En attente</p>
                    <p className="text-2xl font-bold text-gray-900">{clipperStats.pendingSubmissions}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <IconClock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <IconSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Rechercher par mission ou créateur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="approved">Approuvés</option>
                    <option value="rejected">Rejetés</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Clips List - Design amélioré */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <IconVideo className="w-5 h-5" />
                Historique de vos clips
              </h3>
              
              {filteredClips.length > 0 ? (
                <div className="grid gap-4">
                  {filteredClips.map((clip: ClipSubmission) => (
                    <div key={clip.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* En-tête du clip */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                              {clip.mission_title?.charAt(0) || 'M'}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-lg">{clip.mission_title}</h4>
                              <p className="text-sm text-gray-600">Par {clip.mission_creator}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(clip.status)}`}>
                              {getStatusIcon(clip.status)}
                              {getStatusText(clip.status)}
                            </span>
                          </div>
                          
                          {/* Détails du clip */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                              <IconEye className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-700">
                                {formatNumber(clip.views_count || 0)} vues
                              </span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                              <IconCurrencyEuro className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-700">
                                {clip.mission_price}€ / 1k vues
                              </span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                              <IconClock className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-700">
                                {new Date(clip.created_at).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            {clip.tiktok_url && (
                              <a 
                                href={clip.tiktok_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <IconExternalLink className="w-4 h-4" />
                                <span className="text-sm">Voir le clip</span>
                              </a>
                            )}
                          </div>

                          {/* Actions pour clips en attente */}
                          {clip.status === 'pending' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-sm text-blue-800 font-medium mb-2">
                                💡 Ce clip est en attente - déclarez vos vues dans la section ci-dessus !
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconVideo className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun clip trouvé</h3>
                  <p className="text-gray-600">Commencez par soumettre votre premier clip !</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modale de Confirmation de Palier */}
      {palierModal.isOpen && palierModal.clip && palierModal.selectedPalier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmer le palier de vues
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{palierModal.clip.mission_title}</h4>
                <p className="text-sm text-gray-600">Par {palierModal.clip.mission_creator}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Palier déclaré :</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(palierModal.selectedPalier)} vues
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Gains potentiels :</span>
                <span className="font-semibold text-green-600">
                  {calculatePotentialEarnings(
                    palierModal.selectedPalier,
                    palierModal.clip.mission_price || 0
                  )}€
                </span>
              </div>
              
              <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                ⚠️ Cette déclaration sera vérifiée par un administrateur avant validation.
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={closePalierModal}
                disabled={isSubmittingPalier}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={submitPalier}
                disabled={isSubmittingPalier}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmittingPalier ? 'Envoi...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </RoleProtectionOptimized>
  )
} 