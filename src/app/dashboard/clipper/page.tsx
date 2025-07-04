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
  const t = translations[language as Language] || translations.en
  
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
                    Bienvenue {profile.pseudo || 'Clippeur'} !
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    Commencez avec ClipTokk et gagnez de l'argent en créant des clips !
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-blue-50 rounded-xl">
                      <IconPlayerPlay className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">Trouver des Missions</h3>
                      <p className="text-sm text-gray-600">Parcourez les missions disponibles des créateurs</p>
                    </div>
                    <div className="p-6 bg-purple-50 rounded-xl">
                      <IconBolt className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">Créer des Clips</h3>
                      <p className="text-sm text-gray-600">Créez des clips engageants qui suivent les directives de la mission</p>
                    </div>
                    <div className="p-6 bg-green-50 rounded-xl">
                      <IconCoin className="w-8 h-8 text-green-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">Gagner de l'argent</h3>
                      <p className="text-sm text-gray-600">Soyez payé pour vos vues et vos clips réussis</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-600">Gains totaux</h3>
                        <IconCoin className="w-5 h-5 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">0€</p>
                      <p className="text-sm text-gray-500 mt-1">Vos gains totaux sur tous les clips</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-600">Vues générées</h3>
                        <IconEye className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                      <p className="text-sm text-gray-500 mt-1">Nombre total de vues sur vos clips</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-600">Clips créés</h3>
                        <IconPlayerPlay className="w-5 h-5 text-purple-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                      <p className="text-sm text-gray-500 mt-1">Nombre de clips que vous avez créés</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => router.push('/missions')}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-medium transition-colors"
                    >
                      Voir les missions disponibles
                    </button>
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
                    <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                      Missions disponibles
                    </h1>
                    <p className="text-xl text-gray-600 mt-2">
                      Parcourez et acceptez des missions de créateurs
                    </p>
                  </div>
                </div>
                
                <div className="text-xl text-gray-600 mb-8">
                  {dashboardData.missionCount} {dashboardData.missionCount > 1 ? 'missions actives' : 'mission active'}
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

                {/* Grille des missions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData.activeMissions.map((mission) => (
                    <div key={mission.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{mission.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-500">
                          Récompense: {mission.price_per_1k_views}€ / 1k vues
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          {mission.category}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => router.push(`/mission/${mission.id}`)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        Voir la mission
                      </button>
                    </div>
                  ))}
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
