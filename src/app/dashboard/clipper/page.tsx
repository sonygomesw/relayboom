'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthContext'
import { usePreloadedData, useSmartPreload, useCacheOptimization } from '@/hooks/usePreloadedData'
import { DashboardSkeleton } from '@/components/SkeletonLoader'
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

interface Mission {
  id: string
  title: string
  description: string
  creator_name: string
  creator_image?: string
  price_per_1k_views: number
  total_budget: number
  status: string
  category: string
}

export default function ClipperDashboard() {
  const { user, profile } = useAuth()
  const router = useRouter()
  
  // Hook de préchargement ultra-performant
  const { profile: userProfile, userStats, missions, isLoading, error } = usePreloadedData(user?.id)
  
  // Préchargement intelligent
  useSmartPreload(user?.id)
  
  // Optimisation du cache
  useCacheOptimization()
  
  // États pour les filtres
  const [selectedProduct, setSelectedProduct] = useState('all')
  const [showProductDropdown, setShowProductDropdown] = useState(false)

  // Filtrer les missions selon le produit sélectionné
  const filteredMissions = useMemo(() => {
    if (selectedProduct === 'all') {
      return missions
    }
    return missions.filter((mission: Mission) => mission.category === selectedProduct)
  }, [missions, selectedProduct])

  // Préparer les données pour le dashboard
  const dashboardData = useMemo(() => ({
    totalEarnings: userStats?.total_earnings || 0,
    totalViews: userStats?.total_views || 0,
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
    { value: 'Produits', label: 'Produits' }
  ]

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return (
      <RoleProtectionOptimized allowedRoles={['clipper']}>
        <DashboardSkeleton />
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
              <IconBolt className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
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
                  {/* Filtre Produit */}
                  <div className="relative">
                    <button
                      onClick={() => setShowProductDropdown(!showProductDropdown)}
                      className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <span>{productOptions.find(opt => opt.value === selectedProduct)?.label}</span>
                      <IconChevronDown className="w-4 h-4" />
                    </button>
                    
                    {showProductDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-48">
                        {productOptions.map((option) => (
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
              </div>

              {/* Liste des missions */}
              <div className="space-y-6">
                <div className="space-y-4">
                  {dashboardData.activeMissions.map((mission: Mission) => {
                    // Calculer les données de progression (simulées pour la performance)
                    const budgetUsed = mission.total_budget * 0.3 || 300;
                    const totalBudget = mission.total_budget || 1000;
                    const budgetPercentage = totalBudget > 0 ? Math.round((budgetUsed / totalBudget) * 100) : 30;
                    
                    return (
                      <Link 
                        href={`/mission/${mission.id}`}
                        key={mission.id}
                        className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300 relative"
                      >
                        <div className="flex items-start gap-6">
                          {/* Image du créateur */}
                          <div className="flex-shrink-0 w-1/3">
                            <img 
                              src={mission.creator_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(mission.creator_name || 'User')}&background=0066CC&color=fff&size=160`}
                              alt={mission.creator_name}
                              className="w-full h-32 rounded-xl object-cover border border-gray-200"
                            />
                          </div>
                          
                          {/* Contenu principal */}
                          <div className="flex-1 space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{mission.title}</h3>
                                <p className="text-gray-600">{mission.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">
                                  {mission.price_per_1k_views.toFixed(2)}€
                                </div>
                                <div className="text-sm text-gray-500">par 1K vues</div>
                              </div>
                            </div>

                            {/* Budget et progression */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Budget utilisé</span>
                                <span className="font-semibold">{budgetUsed}€ / {totalBudget}€</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" 
                                  style={{width: `${budgetPercentage}%`}}
                                ></div>
                              </div>
                            </div>

                            {/* Plateformes */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
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
                      </Link>
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
