'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthNew'
import { 
  IconTarget, 
  IconCoin, 
  IconEye, 
  IconClock,
  IconCheck,
  IconX,
  IconEdit,
  IconTrash,
  IconPlus,
  IconFilter,
  IconSearch,
  IconTrendingUp,
  IconUsers
} from '@tabler/icons-react'
import AdminSidebar from '@/components/AdminSidebar'

interface Mission {
  id: string
  title: string
  description: string
  total_budget?: number
  price_per_1k_views: number
  status: string
  created_at: string
  creator_id: string
  creator_name?: string
  creator_thumbnail?: string
  video_url?: string
  is_featured?: boolean
  total_submissions?: number
  pending_validations?: number
  total_views?: number
  total_earnings?: number
  profiles?: {
    pseudo: string
    email: string
  }
  _count?: {
    submissions: number
  }
}

interface MissionStats {
  totalMissions: number
  activeMissions: number
  completedMissions: number
  totalBudget: number
  avgPricePerK: number
}

export default function AdminMissions() {
  const { profile } = useAuth() // 🚀 Utiliser le contexte optimisé
  const [missions, setMissions] = useState<Mission[]>([])
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([])
  const [stats, setStats] = useState<MissionStats>({
    totalMissions: 0,
    activeMissions: 0,
    completedMissions: 0,
    totalBudget: 0,
    avgPricePerK: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (profile) {
      loadMissions()
    }
  }, [profile])

  useEffect(() => {
    filterMissions()
  }, [missions, selectedStatus, searchTerm])

  const loadMissions = async () => {
    try {
      // Utiliser la même méthode que la page créateur qui fonctionne
        const { cliptokkAPI } = await import('@/lib/supabase')
  const missionsData = await cliptokkAPI.getActiveMissions()
      
      console.log('📊 Missions chargées (admin):', missionsData?.length || 0)
      
      // Pour l'admin, on veut toutes les missions (pas de filtre par créateur)
      setMissions(missionsData || [])
      
      // Calculer les stats
      const totalMissions = missionsData?.length || 0
      const activeMissions = missionsData?.filter((m: any) => m.status === 'active').length || 0
      const completedMissions = missionsData?.filter((m: any) => m.status === 'completed').length || 0
      const totalBudget = missionsData?.reduce((sum: number, m: any) => sum + (m.total_budget || 0), 0) || 0
      const avgPricePerK = totalMissions > 0 
        ? missionsData?.reduce((sum: number, m: any) => sum + (m.price_per_1k_views || 0), 0) / totalMissions 
        : 0

      setStats({
        totalMissions,
        activeMissions,
        completedMissions,
        totalBudget,
        avgPricePerK: Math.round(avgPricePerK * 100) / 100
      })
    } catch (error) {
      console.error('Erreur chargement missions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterMissions = () => {
    let filtered = missions

    // Filtrer par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(mission => mission.status === selectedStatus)
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(mission =>
        mission.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.profiles?.pseudo?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredMissions(filtered)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Terminée</span>
      case 'paused':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">En pause</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inconnue</span>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des missions...</p>
        </div>
      </div>
    )
  }

  return (
    <RoleProtectionOptimized allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar Admin */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 ml-80">
          <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des missions</h1>
                <p className="text-gray-600">Supervisez toutes les missions de la plateforme</p>
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-green-700 transition-colors">
                <IconPlus className="w-4 h-4" />
                Nouvelle mission
              </button>
            </div>
          </header>

          <main className="p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalMissions}</p>
                    <p className="text-xs text-gray-500">Missions</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <IconTarget className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Actives</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeMissions}</p>
                    <p className="text-xs text-green-600">En cours</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <IconCheck className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Terminées</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedMissions}</p>
                    <p className="text-xs text-blue-600">Complétées</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <IconTrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Budget total</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBudget)}</p>
                    <p className="text-xs text-orange-600">Toutes missions</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <IconCoin className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Prix moyen</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.avgPricePerK}€</p>
                    <p className="text-xs text-purple-600">Par 1K vues</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <IconEye className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <IconSearch className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher une mission..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <IconFilter className="w-5 h-5 text-gray-400" />
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="active">Actives</option>
                      <option value="completed">Terminées</option>
                      <option value="paused">En pause</option>
                    </select>
                  </div>
                </div>
                
                <span className="text-sm text-gray-600">
                  {filteredMissions.length} mission{filteredMissions.length > 1 ? 's' : ''} trouvée{filteredMissions.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Missions Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold text-gray-900">Mission</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-900">Créateur</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-900">Budget</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-900">Prix/1K</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-900">Statut</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredMissions.map((mission) => (
                      <tr key={mission.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-gray-900">{mission.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {mission.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <IconUsers className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {mission.profiles?.pseudo || 'Non défini'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {mission.profiles?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(mission.total_budget || 0)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-900">
                            {mission.price_per_1k_views}€
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(mission.status)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600">{formatDate(mission.created_at)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-700 p-1">
                              <IconEye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-700 p-1">
                              <IconEdit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-700 p-1">
                              <IconTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredMissions.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconTarget className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune mission trouvée</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || selectedStatus !== 'all' 
                      ? 'Modifiez vos filtres pour voir plus de missions'
                      : 'Aucune mission créée pour le moment'
                    }
                  </p>
                  {searchTerm || selectedStatus !== 'all' ? (
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedStatus('all')
                      }}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Réinitialiser les filtres
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </RoleProtectionOptimized>
  )
} 