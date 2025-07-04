'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthContext'
import { useDashboardDataParallel, useMissionsCache } from '@/hooks/useOptimizedData'
import ClipperSidebar from '@/components/ClipperSidebar'
import { useLanguage } from '@/components/LanguageContext'
import { translations } from '@/lib/translations.new'
import { Language } from '@/lib/clipper-translations'
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
  const { language } = useLanguage()
  const t = translations[language as Language]
  
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
    { value: 'all', label: t.filters.allProducts },
    { value: 'Divertissement', label: t.filters.entertainment },
    { value: 'Musique', label: t.filters.music },
    { value: 'Marque', label: t.filters.brand },
    { value: 'Produits', label: t.filters.products }
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
          <p className="text-gray-600">{t.common.loadingDashboard}</p>
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
                    {t.clipper.welcome.title} {profile.pseudo || 'Clippeur'} !
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    {t.clipper.welcome.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-blue-50 rounded-xl">
                      <IconPlayerPlay className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">{t.clipper.welcome.steps.findMissions.title}</h3>
                      <p className="text-sm text-gray-600">{t.clipper.welcome.steps.findMissions.description}</p>
                    </div>
                    <div className="p-6 bg-purple-50 rounded-xl">
                      <IconBolt className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">{t.clipper.welcome.steps.createClips.title}</h3>
                      <p className="text-sm text-gray-600">{t.clipper.welcome.steps.createClips.description}</p>
                    </div>
                    <div className="p-6 bg-green-50 rounded-xl">
                      <IconCoin className="w-8 h-8 text-green-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">{t.clipper.welcome.steps.earnMoney.title}</h3>
                      <p className="text-sm text-gray-600">{t.clipper.welcome.steps.earnMoney.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-600">{t.clipper.stats.totalEarnings.title}</h3>
                        <IconCoin className="w-5 h-5 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">0€</p>
                      <p className="text-sm text-gray-500 mt-1">{t.clipper.stats.totalEarnings.description}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-600">{t.clipper.stats.generatedViews.title}</h3>
                        <IconEye className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                      <p className="text-sm text-gray-500 mt-1">{t.clipper.stats.generatedViews.description}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-600">{t.clipper.stats.createdClips.title}</h3>
                        <IconPlayerPlay className="w-5 h-5 text-purple-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                      <p className="text-sm text-gray-500 mt-1">{t.clipper.stats.createdClips.description}</p>
                    </div>
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
                  <h1 className="text-5xl font-bold text-gray-900 leading-tight">{t.clipper.missions.title}</h1>
                  <p className="text-xl text-gray-600 mt-2">{t.clipper.missions.description}</p>
                </div>
              </div>
              
              <div className="text-xl text-gray-600 mb-8">
                {dashboardData.missionCount} {dashboardData.missionCount > 1 ? t.clipper.missions.activeMissionsCount.plural : t.clipper.missions.activeMissionsCount.singular}
              </div>

              {/* Filtres style Whop - Agrandis et fonctionnels */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {/* Filtre Produit */}
                <div className="relative">
                  <button
                    onClick={() => setShowProductDropdown(!showProductDropdown)}
                    className="px-6 py-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-lg flex items-center gap-2"
                  >
                    {productOptions.find(opt => opt.value === selectedProduct)?.label}
                    <IconChevronDown className="w-5 h-5" />
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
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                            selectedProduct === option.value ? 'text-green-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button className="px-6 py-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-lg">
                    <IconEye className="w-5 h-5 inline mr-2" />
                    {t.clipper.missions.gridView}
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
                          src={mission.creator_avatar || '/default-avatar.png'} 
                          alt={mission.creator_name || 'Creator'} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{mission.title}</h2>
                            <p className="text-gray-600">{mission.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-green-600">{mission.price_per_1k_views}€</span>
                            <span className="text-gray-500">/1k vues</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <IconEye className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600">{mission.views_target} vues</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IconClock className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600">{mission.duration} jours</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IconStar className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600">{mission.difficulty}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow">
                  <p className="text-gray-500">Aucune mission disponible pour le moment</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
    </RoleProtectionOptimized>
  )
} 