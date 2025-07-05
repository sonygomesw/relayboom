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
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
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
                    <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                      Missions disponibles
                    </h1>
                    <p className="text-xl text-gray-600 mt-2">
                      Parcourez et acceptez des missions de créateurs
                    </p>
                  </div>
                </div>
                
                <div className="text-xl text-gray-600 mb-8">
                  {dashboardData.missionCount} {dashboardData.missionCount > 1 
                    ? 'missions actives'
                    : 'mission active'}
                </div>

                {/* Filtres */}
                <div className="flex gap-4 mb-8">
                  <div className="relative">
                    <button
                      onClick={() => setShowProductDropdown(!showProductDropdown)}
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <span>{productOptions.find(opt => opt.value === selectedProduct)?.label}</span>
                      <IconChevronDown className="w-4 h-4" />
                    </button>
                    
                    {showProductDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-10">
                        {productOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSelectedProduct(option.value)
                              setShowProductDropdown(false)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Missions horizontales style Content Rewards */}
                <div className="space-y-4">
                  {dashboardData.activeMissions.map((mission) => {
                    // Calculer les données de progression
                    const budgetUsed = (mission as any).budget_used || (mission as any).total_budget * 0.3 || 300;
                    const totalBudget = (mission as any).total_budget || 1000;
                    const budgetPercentage = totalBudget > 0 ? Math.round((budgetUsed / totalBudget) * 100) : 30;
                    const totalViews = (mission as any).total_views || Math.round(budgetUsed / mission.price_per_1k_views * 1000);
                    
                    return (
                      <div key={mission.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300 relative">
                        <div className="flex items-start gap-6">
                          {/* Image du créateur */}
                          <div className="flex-shrink-0">
                            <img 
                              src={(mission as any).creator_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(mission.creator_name || 'User')}&background=0066CC&color=fff&size=120`}
                              alt={mission.creator_name}
                              className="w-32 h-24 rounded-xl object-cover border border-gray-200"
                            />
                          </div>
                          
                          {/* Contenu principal */}
                          <div className="flex-1 min-w-0">
                            {/* Header avec titre et statut */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                                  {mission.title || 'Mission sans titre'}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {mission.description || 'Description non disponible'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <span className="text-sm text-gray-500">Actif</span>
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>
                            </div>
                            
                            {/* Budget et progression */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-bold text-gray-900">
                                  {(budgetUsed || 0).toFixed(2)} $US sur {totalBudget.toFixed(2)} $US versés
                                </span>
                                <span className="text-sm font-medium text-gray-600">
                                  {budgetPercentage}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            {/* Détails en bas */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Récompense</span>
                                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium inline-block ml-2">
                                    {mission.price_per_1k_views?.toFixed(2) || '0.00'} $US / 1k
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium">Catégorie</span>
                                  <span className="ml-2">{mission.category || 'Non spécifiée'}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Type</span>
                                  <span className="ml-2">{(mission as any).content_type || 'Découpage'}</span>
                                </div>
                              </div>
                              
                              {/* Plateformes */}
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 mr-2">Plateformes</span>
                                {/* YouTube */}
                                <div className="w-6 h-6 rounded flex items-center justify-center bg-red-500">
                                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Lien invisible pour navigation */}
                        <button
                          onClick={() => router.push(`/mission/${mission.id}`)}
                          className="absolute inset-0 z-10"
                        >
                          <span className="sr-only">Voir la mission {mission.title}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {dashboardData.activeMissions.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconCoin className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune mission disponible</h3>
                    <p className="text-gray-600">Aucune mission ne correspond à vos filtres actuels.</p>
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
