'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getMissionsWithStatsOptimized } from '@/lib/supabase-optimized'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthContext'
import useSWR from 'swr'
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
  IconUsers,
  IconVideo,
  IconAlertCircle
} from '@tabler/icons-react'

interface Mission {
  id: string
  creator_id: string
  title: string
  description: string
  price_per_1k_views: number
  status: string
  created_at: string
  total_submissions: number
  total_views: number
  pending_validations: number
  total_earnings: number
}

interface MissionStats {
  totalMissions: number
  activeMissions: number
  completedMissions: number
  totalBudget: number
  pendingValidations: number
  totalSubmissions: number
}

const fetcher = async (userId: string) => {
  console.log('Fetching missions for user:', userId)
  try {
    // Utiliser la fonction optimisée pour récupérer les missions avec leurs stats
    const missionsData = await getMissionsWithStatsOptimized()
    
    // Filtrer pour n'avoir que les missions du créateur connecté
    const creatorMissions = missionsData.filter((mission: any) => mission.creator_id === userId)

    return creatorMissions
  } catch (error) {
    console.error('Erreur chargement missions:', error)
    throw error
  }
}

export default function CreatorMissions() {
  const { user, profile } = useAuth()
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Utiliser SWR pour la gestion du cache et des requêtes
  const { data: missions, error, isLoading } = useSWR(
    user?.id ? user.id : null,
    fetcher,
    {
      refreshInterval: 30000, // Rafraîchir toutes les 30 secondes
      revalidateOnFocus: true,
      dedupingInterval: 5000 // Éviter les requêtes en double dans un intervalle de 5 secondes
    }
  )

  const formatNumber = (num: number | undefined) => {
    if (!num && num !== 0) return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toString()
  }

  const formatCurrency = (amount: number | undefined) => {
    if (!amount && amount !== 0) return '0,00 €'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
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

  if (error) {
    console.error('Erreur chargement missions:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Une erreur est survenue lors du chargement des missions.</p>
          <p className="text-sm text-gray-500 mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos missions...</p>
        </div>
      </div>
    )
  }

  // Filtrer les missions selon le statut et le terme de recherche
  const getFilteredMissions = () => {
    // Vérifier que missions est un tableau valide
    if (!missions || !Array.isArray(missions)) {
      console.log('⚠️ Missions n\'est pas un tableau valide:', missions)
      return []
    }
    
    return missions.filter((mission: any) => {
      const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           mission.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatus === 'all' || mission.status === selectedStatus
      
      return matchesSearch && matchesStatus
    })
  }

  const filteredMissions = getFilteredMissions()
  
  // Calculer les stats à partir des missions
  const stats = (missions && Array.isArray(missions)) ? {
    totalMissions: missions.length,
    activeMissions: missions.filter((m: any) => m.status === 'active').length,
    completedMissions: missions.filter((m: any) => m.status === 'completed').length,
    totalBudget: missions.reduce((sum: number, m: any) => sum + (m.total_earnings || 0), 0),
    pendingValidations: missions.reduce((sum: number, m: any) => sum + (m.pending_validations || 0), 0),
    totalSubmissions: missions.reduce((sum: number, m: any) => sum + (m.total_submissions || 0), 0)
  } : {
    totalMissions: 0,
    activeMissions: 0,
    completedMissions: 0,
    totalBudget: 0,
    pendingValidations: 0,
    totalSubmissions: 0
  }

  return (
    <RoleProtectionOptimized allowedRoles={['creator']}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mes missions</h1>
              <p className="text-gray-600">Gérez toutes vos missions et suivez leurs performances</p>
            </div>
            <div className="flex items-center gap-4">
              {stats.pendingValidations > 0 && (
                <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium">
                  🕒 {stats.pendingValidations} validation(s) en attente
                </div>
              )}
              <a
                href="/dashboard/creator/nouvelle-mission"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-green-700 transition-colors"
              >
                <IconPlus className="w-4 h-4" />
                Nouvelle mission
              </a>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* KPIs Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Missions totales</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMissions}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <IconTarget className="w-3 h-3" />
                    {stats.activeMissions} actives
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <IconTarget className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Budget total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBudget)}</p>
                  <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                    <IconCoin className="w-3 h-3" />
                    Investissement
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <IconCoin className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Clips soumis</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
                  <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                    <IconVideo className="w-3 h-3" />
                    Total
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <IconVideo className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Validations en attente</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingValidations}</p>
                  <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                    <IconClock className="w-3 h-3" />
                    À traiter
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <IconClock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher une mission..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actives</option>
                  <option value="completed">Terminées</option>
                  <option value="paused">En pause</option>
                  </select>
              </div>
              <a
                href="/dashboard/creator/nouvelle-mission"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <IconPlus className="w-5 h-5 mr-2" />
                Nouvelle mission
              </a>
            </div>
          </div>

          {/* Missions Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                    <th className="px-6 py-4 font-medium">Mission</th>
                    <th className="px-6 py-4 font-medium">Budget</th>
                    <th className="px-6 py-4 font-medium">Vues</th>
                    <th className="px-6 py-4 font-medium">Clips</th>
                    <th className="px-6 py-4 font-medium">Validations</th>
                    <th className="px-6 py-4 font-medium">Statut</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMissions.map((mission: Mission) => (
                    <tr key={mission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <a
                          href={`/dashboard/creator/missions/${mission.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {mission.title}
                        </a>
                      </td>
                      <td className="px-6 py-4">{formatCurrency(mission.total_earnings)}</td>
                      <td className="px-6 py-4">{formatNumber(mission.total_views)}</td>
                      <td className="px-6 py-4">{mission.total_submissions}</td>
                      <td className="px-6 py-4">
                        {mission.pending_validations > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {mission.pending_validations} en attente
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(mission.status)}</td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(mission.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
          </div>
        </main>
      </div>
    </RoleProtectionOptimized>
  )
} 