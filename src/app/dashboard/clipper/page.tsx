'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthContext'
import { useDashboardDataParallel, useMissionsCache } from '@/hooks/useOptimizedData'
import ClipperSidebar from '@/components/ClipperSidebar'
import { 
  IconEye,
  IconTrendingUp,
  IconFlame,
  IconBolt,
  IconStar,
  IconCoin,
  IconChartBar,
  IconRobot,
  IconCheck,
  IconClock,
  IconShoppingCart,
  IconPlayerPlay,
  IconChevronDown
} from '@tabler/icons-react'

export default function ClipperDashboard() {
  const { user, profile } = useAuth()
  const router = useRouter()
  
  // États pour les filtres (uniquement Produit maintenant)
  const [selectedProduct, setSelectedProduct] = useState('all')
  const [showProductDropdown, setShowProductDropdown] = useState(false)
  
  // 🚀 NOUVEAU : Utiliser les hooks optimisés avec cache
  const { userStats, isLoading: statsLoading } = useDashboardDataParallel(user?.id || null)
  const { missions, loading: missionsLoading } = useMissionsCache() // Toutes les missions pour les clippers

  // Loading global
  const isLoading = statsLoading || missionsLoading

  // 🚀 Mémoïser les calculs pour éviter les re-calculs avec filtres
  const dashboardData = useMemo(() => {
    const totalEarnings = userStats?.total_earnings || 0
    const totalViews = userStats?.total_views || 0
    let activeMissions = missions?.filter(m => m.status === 'active') || []
    
    // Appliquer le filtre Produit uniquement
    if (selectedProduct !== 'all') {
      activeMissions = activeMissions.filter(m => m.category === selectedProduct)
    }
    
    return {
      totalEarnings,
      totalViews,
      nextMilestone: 75,
      activeMissions,
      missionCount: activeMissions.length
    }
  }, [userStats, missions, selectedProduct])

  // Options pour le filtre Produit uniquement
  const productOptions = [
    { value: 'all', label: 'Tous les produits' },
    { value: 'Divertissement', label: 'Divertissement' },
    { value: 'Musique', label: 'Musique' },
    { value: 'Marque', label: 'Marque' },
    { value: 'Produits', label: 'Produits' }
  ]

  // Debug optimisé
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Clipper Dashboard (optimisé):', {
      userId: user?.id,
      statsLoaded: !!userStats,
      missionsCount: missions?.length || 0,
      filteredCount: dashboardData.missionCount,
      filters: { selectedProduct },
      isLoading
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  // 🆕 État d'accueil pour nouveaux clippers
  const isNewClipper = !userStats || (userStats.total_earnings === 0 && userStats.total_views === 0)
  
  if (isNewClipper && dashboardData.activeMissions.length === 0) {
    return (
      <RoleProtectionOptimized allowedRoles={['clipper']}>
        <div className="min-h-screen bg-gray-50 flex">
          <ClipperSidebar userStats={dashboardData} profile={profile} />
          <div className="flex-1 ml-96">
            <main className="p-12">
              <div className="max-w-4xl mx-auto text-center">
                {/* Message d'accueil pour nouveau clipper */}
                <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🎉</span>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Bienvenue sur ClipTokk, {profile.pseudo || 'Clippeur'} !
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    Vous êtes maintenant prêt(e) à commencer votre aventure de clipping et à gagner de l'argent avec vos créations !
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-blue-50 rounded-xl">
                      <IconPlayerPlay className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">1. Trouvez des missions</h3>
                      <p className="text-sm text-gray-600">Parcourez les missions disponibles et choisissez celles qui vous intéressent</p>
                    </div>
                    <div className="p-6 bg-purple-50 rounded-xl">
                      <IconBolt className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">2. Créez vos clips</h3>
                      <p className="text-sm text-gray-600">Utilisez votre créativité pour faire des clips viraux à partir du contenu des créateurs</p>
                    </div>
                    <div className="p-6 bg-green-50 rounded-xl">
                      <IconCoin className="w-8 h-8 text-green-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">3. Gagnez de l'argent</h3>
                      <p className="text-sm text-gray-600">Soyez payé en fonction des vues que génèrent vos clips sur TikTok</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => router.push('/missions')}
                      className="w-full md:w-auto px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors text-lg"
                    >
                      <IconShoppingCart className="w-5 h-5 inline mr-2" />
                      Voir les missions disponibles
                    </button>
                    <p className="text-sm text-gray-500">
                      Aucune mission disponible pour le moment ? Revenez bientôt, de nouvelles missions sont ajoutées régulièrement !
                    </p>
                  </div>
                </div>

                {/* Statistiques vides mais encourageantes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-600">Gains totaux</h3>
                      <IconCoin className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">0€</p>
                    <p className="text-sm text-gray-500 mt-1">Vos premiers gains arrivent bientôt !</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-600">Vues générées</h3>
                      <IconEye className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-500 mt-1">Prêt à faire le buzz ?</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-600">Clips créés</h3>
                      <IconPlayerPlay className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-500 mt-1">Votre créativité n'attend que vous !</p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </RoleProtectionOptimized>
    )
  }

  return (
    <RoleProtectionOptimized allowedRoles={['clipper']}>
      <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <ClipperSidebar userStats={dashboardData} profile={profile} />

      {/* Contenu principal */}
      <div className="flex-1 ml-96">
        <main className="p-12">
          <div className="w-full">
            {/* Header style Whop - Agrandi */}
            <div className="mb-12">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-14 h-14 bg-orange-500 rounded-lg flex items-center justify-center">
                  <IconCoin className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-5xl font-bold text-gray-900 leading-tight">Missions de contenu</h1>
                  <p className="text-xl text-gray-600 mt-2">Publiez du contenu sur les réseaux sociaux et soyez rémunéré(e) pour les vues que vous générez. Si vous souhaitez lancer une campagne, cliquez ici.</p>
                </div>
              </div>
              
              <div className="text-xl text-gray-600 mb-8">
                {dashboardData.missionCount} {dashboardData.missionCount > 1 ? 'missions de contenu en directs' : 'mission de contenu en direct'}
              </div>

              {/* Filtres style Whop - Agrandis et fonctionnels */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-6">
                  {/* Filtre Produit */}
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setShowProductDropdown(!showProductDropdown)
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-lg"
                    >
                      <IconRobot className="w-5 h-5" />
                      {productOptions.find(opt => opt.value === selectedProduct)?.label}
                      <IconChevronDown className={`w-4 h-4 transition-transform ${showProductDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showProductDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
                        {productOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSelectedProduct(option.value)
                              setShowProductDropdown(false)
                            }}
                            className={`w-full text-left px-4 py-3 text-lg hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors ${
                              selectedProduct === option.value ? 'bg-green-50 text-green-700 font-medium' : ''
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-6 py-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-lg">
                    <IconEye className="w-5 h-5 inline mr-2" />
                    Vue grille
                  </button>
                </div>
              </div>
            </div>

            {/* Liste des missions optimisée */}
            <div className="space-y-6">
              {dashboardData.activeMissions.length > 0 ? (
                dashboardData.activeMissions.slice(0, 10).map((mission) => (
                  <div key={mission.id} className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start gap-6">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={mission.creator_thumbnail || '/placeholder-mission.jpg'} 
                          alt={mission.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{mission.title}</h3>
                            <div className="flex items-center gap-4 text-lg text-gray-600">
                              <span className="flex items-center gap-2">
                                <IconCoin className="w-5 h-5 text-green-500" />
                                {mission.price_per_1k_views}€/1k vues
                              </span>
                              <span className="flex items-center gap-2">
                                <IconEye className="w-5 h-5 text-blue-500" />
                                {mission.total_views?.toLocaleString() || 0} vues
                              </span>
                              <span className="flex items-center gap-2">
                                <IconPlayerPlay className="w-5 h-5 text-purple-500" />
                                {mission.total_submissions || 0} clips
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center -space-x-2">
                                <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                  <IconCheck className="w-4 h-4 text-white" />
                                </div>
                                <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                                  <IconClock className="w-4 h-4 text-white" />
                                </div>
                              </div>
                              <span className="text-lg text-gray-600">{mission.pending_validations || 0}</span>
                            </div>
                            <button 
                              onClick={() => router.push(`/mission/${mission.id}`)}
                              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 text-lg font-semibold"
                            >
                              Voir la mission
                            </button>
                          </div>
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed">{mission.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconShoppingCart className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {selectedProduct !== 'all' 
                      ? 'Aucune mission trouvée'
                      : 'Aucune mission disponible'
                    }
                  </h3>
                  <p className="text-xl text-gray-600">
                    {selectedProduct !== 'all' 
                      ? 'Ajustez vos filtres pour voir plus de missions.'
                      : 'Les nouvelles missions apparaîtront ici bientôt.'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Pagination si nécessaire */}
            {dashboardData.activeMissions.length > 10 && (
              <div className="flex justify-center mt-12">
                <button className="px-8 py-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-lg">
                  Voir plus de missions
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
    </RoleProtectionOptimized>
  )
} 