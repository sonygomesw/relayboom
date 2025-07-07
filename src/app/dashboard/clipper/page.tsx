'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthContext'
import { useUltraFastDashboard } from '@/hooks/useOptimizedData'
import ClipperSidebar from '@/components/ClipperSidebar'
import { 
  IconCoin,
  IconChevronDown,
  IconTrendingUp,
  IconEye,
  IconVideo
} from '@tabler/icons-react'

// Interface Mission locale pour le clipper dashboard
interface Mission {
  id: string
  title: string
  description: string
  creator_name: string
  creator_image?: string
  price_per_1k_views: number
  total_budget: number
  status: string
  category?: string
}

export default function ClipperDashboard() {
  const { user, profile } = useAuth()
  const router = useRouter()
  
  // 🚀 NAVIGATION ULTRA-RAPIDE : Hook optimisé avec cache localStorage + SWR
  const { userStats, missions, isLoading, error, preloadPage } = useUltraFastDashboard(user?.id || null)
  
  // États pour les filtres uniquement
  const [selectedProduct, setSelectedProduct] = useState('all')
  const [showProductDropdown, setShowProductDropdown] = useState(false)

  // Filtrer les missions selon le produit sélectionné (ultra-rapide)
  const filteredMissions = useMemo(() => {
    const activeMissions = missions?.filter((m: Mission) => m.status === 'active') || []
    
    if (selectedProduct === 'all') {
      return activeMissions
    }
    return activeMissions.filter((mission: Mission) => mission.category === selectedProduct)
  }, [missions, selectedProduct])

  // Préparer les données pour le dashboard (ultra-rapide)
  const dashboardData = useMemo(() => ({
    totalEarnings: userStats?.total_earnings || 0,
    totalViews: userStats?.total_views || 0,
    totalSubmissions: userStats?.total_submissions || 0,
    nextMilestone: 75,
    activeMissions: filteredMissions,
    missionCount: filteredMissions.length
  }), [userStats, filteredMissions])

  // Options pour le filtre Produit
  const productOptions = [
    { value: 'all', label: 'Tous les produits' },
    { value: 'Divertissement', label: 'Divertissement' },
    { value: 'Musique', label: 'Musique' },
    { value: 'Marque', label: 'Marque' },
    { value: 'Gaming', label: 'Gaming' },
    { value: 'Produits', label: 'Produits' }
  ]

  // Navigation ultra-rapide vers les missions
  const handleMissionClick = (missionId: string) => {
    console.log('⚡ Navigation ultra-rapide vers mission:', missionId)
    preloadPage(`/mission/${missionId}`) // Précharger instantanément
    router.push(`/mission/${missionId}`)
  }

  // Affichage de l'erreur (très rare avec le cache)
  if (error && !userStats && !missions?.length) {
    return (
      <RoleProtectionOptimized allowedRoles={['clipper']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Problème de connexion</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </RoleProtectionOptimized>
    )
  }

  // Loading ultra-court (uniquement si vraiment rien en cache)
  if (isLoading) {
    return (
      <RoleProtectionOptimized allowedRoles={['clipper']}>
        <div className="min-h-screen bg-gray-50 flex">
          <ClipperSidebar userStats={dashboardData} profile={profile || undefined} />
          <div className="flex-1 ml-96 p-12">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="grid gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </RoleProtectionOptimized>
    )
  }

  return (
    <RoleProtectionOptimized allowedRoles={['clipper']}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar optimisée */}
        <ClipperSidebar userStats={dashboardData} profile={profile || undefined} />

        {/* Contenu principal */}
        <div className="flex-1 ml-96">
          <main className="p-12">
            <div className="w-full">
              {/* Header style moderne */}
              <div className="mb-12">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <IconCoin className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                      Missions disponibles
                    </h1>
                    <p className="text-xl text-gray-600 mt-2">
                      Parcourez et acceptez des missions de créateurs
                    </p>
                  </div>
                </div>
                
                {/* Stats rapides */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                      <IconCoin className="w-8 h-8 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {dashboardData.totalEarnings.toFixed(2)}€
                        </div>
                        <div className="text-sm text-gray-600">Revenus totaux</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                      <IconEye className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {dashboardData.totalViews.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Vues générées</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                      <IconVideo className="w-8 h-8 text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {dashboardData.totalSubmissions}
                        </div>
                        <div className="text-sm text-gray-600">Clips soumis</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xl text-gray-600 mb-8">
                  {dashboardData.missionCount} {dashboardData.missionCount > 1 
                    ? 'missions actives'
                    : 'mission active'}
                </div>

                {/* Filtres */}
                <div className="flex gap-4 mb-8">
                  {/* Filtre Produit */}
                  <div className="relative">
                    <button
                      onClick={() => setShowProductDropdown(!showProductDropdown)}
                      className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <span className="font-medium">{productOptions.find(opt => opt.value === selectedProduct)?.label}</span>
                      <IconChevronDown className="w-4 h-4" />
                    </button>
                    
                    {showProductDropdown && (
                      <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-xl z-10 min-w-48 overflow-hidden">
                        {productOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSelectedProduct(option.value)
                              setShowProductDropdown(false)
                            }}
                            className="w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Liste des missions */}
              <div className="space-y-6">
                {dashboardData.activeMissions.length > 0 ? (
                  <div className="grid gap-6">
                    {dashboardData.activeMissions.map((mission: Mission) => {
                      // Calculer les données de progression (optimisées)
                      const budgetUsed = mission.total_budget * 0.3 || 300;
                      const totalBudget = mission.total_budget || 1000;
                      const budgetPercentage = totalBudget > 0 ? Math.round((budgetUsed / totalBudget) * 100) : 30;
                      
                      return (
                        <div 
                          key={mission.id}
                          onClick={() => handleMissionClick(mission.id)}
                          onMouseEnter={() => preloadPage(`/mission/${mission.id}`)}
                          className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-200 hover:border-gray-300 cursor-pointer transform hover:scale-[1.01]"
                        >
                          <div className="flex items-start gap-6">
                            {/* Image du créateur */}
                            <div className="flex-shrink-0">
                              <img 
                                src={mission.creator_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(mission.creator_name || 'User')}&background=0066CC&color=fff&size=80`}
                                alt={mission.creator_name}
                                className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                              />
                            </div>
                            
                            {/* Contenu principal */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-2">{mission.title}</h3>
                                  <p className="text-gray-600 leading-relaxed">{mission.description}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-3xl font-bold text-green-600 mb-1">
                                    {mission.price_per_1k_views}€
                                  </div>
                                  <div className="text-sm text-gray-500">par 1k vues</div>
                                </div>
                              </div>
                              
                              {/* Progression du budget */}
                              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                  <span>Budget utilisé</span>
                                  <span>{budgetUsed}€ / {totalBudget}€</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${budgetPercentage}%` }}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                  Créé par <span className="font-medium text-gray-900">{mission.creator_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">Catégorie:</span>
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    {mission.category || 'Divertissement'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconCoin className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune mission disponible</h3>
                    <p className="text-gray-600 mb-6">Aucune mission ne correspond à vos filtres actuels.</p>
                    <button
                      onClick={() => setSelectedProduct('all')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Voir toutes les missions
                    </button>
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

export const dynamic = "force-dynamic"
