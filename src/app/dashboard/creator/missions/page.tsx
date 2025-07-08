'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthNew'
import { usePreloadedData, useSmartPreload, useCacheOptimization } from '@/hooks/usePreloadedData'
import { DashboardSkeleton } from '@/components/SkeletonLoader'
import { 
  IconEye,
  IconTrendingUp,
  IconFlame,
  IconBolt,
  IconStar,
  IconCoin,
  IconChartBar,
  IconRocket,
  IconCheck,
  IconClock,
  IconPlus,
  IconPlayerPlay,
  IconChevronDown,
  IconFilter,
  IconEdit,
  IconTrash
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
  submissions_count: number
  total_views: number
  total_spent: number
  created_at: string
}

export default function CreatorMissions() {
  const { user, profile } = useAuth()
  const router = useRouter()
  
  // Hook de préchargement ultra-performant
  const { missions, stats, isLoading, error } = usePreloadedData(user?.id)
  
  // Préchargement intelligent
  useSmartPreload(user?.id)
  
  // Optimisation du cache
  useCacheOptimization()
  
  // États pour les filtres
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrer les missions
  const filteredMissions = useMemo(() => {
    if (!missions) return []
    
    let filtered = missions

    // Filtre par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((mission: Mission) => mission.status === selectedStatus)
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter((mission: Mission) => 
        mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [missions, selectedStatus, searchTerm])

  // Options pour le filtre Statut
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'active', label: 'Actives' },
    { value: 'paused', label: 'En pause' },
    { value: 'completed', label: 'Terminées' }
  ]

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return (
      <RoleProtectionOptimized allowedRoles={['creator']}>
        <DashboardSkeleton />
      </RoleProtectionOptimized>
    )
  }

  // Afficher l'erreur si nécessaire
  if (error) {
    return (
      <RoleProtectionOptimized allowedRoles={['creator']}>
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
    <RoleProtectionOptimized allowedRoles={['creator']}>
      <div className="min-h-screen bg-gray-50">
        <main className="p-12">
          <div className="w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-purple-500 rounded-lg flex items-center justify-center">
                    <IconRocket className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                      Vos Missions
                    </h1>
                    <p className="text-xl text-gray-600 mt-2">
                      Gérez vos missions et suivez leurs performances
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => router.push('/dashboard/creator/nouvelle-mission')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <IconPlus className="w-5 h-5" />
                  Nouvelle mission
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Missions */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconChartBar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Missions</p>
                      <p className="text-2xl font-bold text-gray-900">{filteredMissions.length}</p>
                    </div>
                  </div>
                </div>

                {/* Total Vues */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <IconEye className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Vues</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats?.total_views ? `${(stats.total_views / 1000).toFixed(1)}K` : '0'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Budget Dépensé */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <IconCoin className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Budget Dépensé</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats?.total_spent ? `${(stats.total_spent / 100).toFixed(2)}€` : '0€'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Clips Soumis */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <IconPlayerPlay className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Clips Soumis</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats?.total_submissions || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtres */}
              <div className="flex gap-4 mb-8">
                {/* Recherche */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Rechercher une mission..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Filtre Statut */}
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <IconFilter className="w-5 h-5" />
                    <span>{statusOptions.find(opt => opt.value === selectedStatus)?.label}</span>
                    <IconChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showStatusDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-48">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedStatus(option.value)
                            setShowStatusDropdown(false)
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
              {filteredMissions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconRocket className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune mission trouvée</h3>
                  <p className="text-gray-600">
                    {searchTerm 
                      ? "Aucune mission ne correspond à votre recherche"
                      : "Commencez par créer votre première mission"}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => router.push('/dashboard/creator/nouvelle-mission')}
                      className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Créer une mission
                    </button>
                  )}
                </div>
              ) : (
                filteredMissions.map((mission: Mission) => (
                  <div key={mission.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start gap-6">
                      {/* Image de la mission */}
                      <div className="flex-shrink-0 w-1/4">
                        <img 
                          src={mission.creator_image || `/images/creators/${mission.creator_name.toLowerCase()}.jpg`}
                          alt={mission.title}
                          className="w-full h-40 rounded-xl object-cover"
                        />
                      </div>

                      {/* Informations de la mission */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{mission.title}</h3>
                            <p className="text-gray-600 mb-4">{mission.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => router.push(`/dashboard/creator/missions/${mission.id}/edit`)}
                              className="p-2 text-gray-600 hover:text-purple-600 rounded-lg hover:bg-purple-50"
                            >
                              <IconEdit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) {
                                  // Logique de suppression
                                }
                              }}
                              className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50"
                            >
                              <IconTrash className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Statistiques de la mission */}
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Prix/1K vues</p>
                            <p className="text-lg font-semibold text-gray-900">{mission.price_per_1k_views}€</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Budget total</p>
                            <p className="text-lg font-semibold text-gray-900">{mission.total_budget}€</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Clips soumis</p>
                            <p className="text-lg font-semibold text-gray-900">{mission.submissions_count}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total vues</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {mission.total_views > 1000 
                                ? `${(mission.total_views / 1000).toFixed(1)}K` 
                                : mission.total_views}
                            </p>
                          </div>
                        </div>

                        {/* Barre de progression et statut */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600">
                              Budget utilisé: {((mission.total_spent / mission.total_budget) * 100).toFixed(1)}%
                            </p>
                            <div className={`px-3 py-1 rounded-full text-sm ${
                              mission.status === 'active' ? 'bg-green-100 text-green-800' :
                              mission.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {mission.status === 'active' ? 'Active' :
                               mission.status === 'paused' ? 'En pause' :
                               'Terminée'}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${Math.min((mission.total_spent / mission.total_budget) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </RoleProtectionOptimized>
  )
}
