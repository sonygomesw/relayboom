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
                          <div className="flex-shrink-0 w-1/3">
                            <img 
                              src={(mission as any).creator_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(mission.creator_name || 'User')}&background=0066CC&color=fff&size=160`}
                              alt={mission.creator_name}
                              className="w-full h-32 rounded-xl object-cover border border-gray-200"
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
                                {/* TikTok */}
                                <div className="w-6 h-6 rounded flex items-center justify-center bg-black">
                                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                                  </svg>
                                </div>
                                {/* Instagram */}
                                <div className="w-6 h-6 rounded flex items-center justify-center bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045]">
                                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                                  </svg>
                                </div>
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
