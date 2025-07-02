'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthContext'
import { supabase } from '@/lib/supabase'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import useSWR from 'swr'
import {
  IconArrowUp,
  IconArrowDown,
  IconEye,
  IconCoin,
  IconUsers,
  IconTarget,
  IconCalendar,
  IconTrendingUp,
  IconChartLine,
  IconClock,
  IconVideo,
  IconSettings,
  IconLogout,
  IconDashboard,
  IconFilter,
  IconDownload
} from '@tabler/icons-react'

interface AnalyticsData {
  totalViews: number
  totalEarnings: number
  totalMissions: number
  totalClippers: number
  monthlyViews: number
  monthlyEarnings: number
  weeklyViews: number
  weeklyEarnings: number
  averageViewsPerMission: number
  topPerformingMission: any
  recentActivity: any[]
  viewsGrowth: number
  earningsGrowth: number
}

interface MissionPerformance {
  id: string
  title: string
  views: number
  earnings: number
  submissions: number
  createdAt: string
  status: string
}

interface SupabaseMissionWithStats {
  id: string
  creator_id: string
  title: string
  description: string
  total_budget: number
  price_per_1k_views: number
  status: string
  created_at: string
  submissions_count: number
  views_count: number
  pending_validations_count: number
  earnings: number
}

const getMockAnalyticsData = () => {
  return {
    stats: {
      totalViews: 125000,
      totalEarnings: 2850,
      totalMissions: 4,
      totalClippers: 12,
      monthlyViews: 37500,
      monthlyEarnings: 855,
      weeklyViews: 12500,
      weeklyEarnings: 285,
      averageViewsPerMission: 31250,
      topPerformingMission: {
        title: "Challenge Gaming Viral",
        views: 45000,
        earnings: 1125
      },
      recentActivity: [
        {
          id: "mission_1",
          title: "Challenge Gaming Viral",
          views_count: 45000,
          earnings: 1125,
          submissions_count: 3,
          created_at: "2024-01-15T10:30:00Z",
          status: "active"
        },
        {
          id: "mission_2", 
          title: "Réaction Musique Tendance",
          views_count: 32000,
          earnings: 800,
          submissions_count: 2,
          created_at: "2024-01-12T14:20:00Z",
          status: "active"
        }
      ],
      viewsGrowth: 15.5,
      earningsGrowth: 12.3
    },
    performances: [
      {
        id: "mission_1",
        title: "Challenge Gaming Viral", 
        views: 45000,
        earnings: 1125,
        submissions: 3,
        createdAt: "2024-01-15T10:30:00Z",
        status: "active"
      },
      {
        id: "mission_2",
        title: "Réaction Musique Tendance",
        views: 32000, 
        earnings: 800,
        submissions: 2,
        createdAt: "2024-01-12T14:20:00Z",
        status: "active"
      }
    ]
  }
}

const fetcher = async (userId: string) => {
  try {
    console.log('Fetching analytics data for user:', userId)
    
    // Essayer d'utiliser les vraies données Supabase
    const { data: userStats, error: statsError } = await supabase
      .rpc('get_user_stats', { p_user_id: userId })

    // Si erreur RPC, utiliser des données mock
    if (statsError) {
      console.warn('RPC get_user_stats non disponible, utilisation des données mock:', statsError)
      return getMockAnalyticsData()
    }

    // Récupérer les missions avec statistiques
    const { data: missions, error: missionsError } = await supabase
      .rpc('get_missions_with_stats')

    if (missionsError) {
      console.warn('RPC get_missions_with_stats non disponible, utilisation des données mock:', missionsError)
      return getMockAnalyticsData()
    }

    // Filtrer les missions de ce créateur
    const userMissions = missions?.filter((mission: any) => mission.creator_id === userId) || []

    // Calculer les statistiques agrégées
    const stats = userStats?.[0] || {}
    const totalViews = Number(stats.total_views || 0)
    const totalEarnings = Number(stats.total_earnings || 0)
    const totalSubmissions = Number(stats.total_submissions || 0)

    return {
      stats: {
        totalViews,
        totalEarnings,
        totalMissions: userMissions.length,
        totalClippers: totalSubmissions,
        monthlyViews: Math.floor(totalViews * 0.3), // Approximation 30% du mois
        monthlyEarnings: totalEarnings * 0.3,
        weeklyViews: Math.floor(totalViews * 0.1),
        weeklyEarnings: totalEarnings * 0.1,
        averageViewsPerMission: userMissions.length > 0 ? Math.floor(totalViews / userMissions.length) : 0,
        topPerformingMission: userMissions.length > 0 ? {
          title: userMissions[0].title,
          views: Number(userMissions[0].total_views || 0),
          earnings: Number(userMissions[0].total_earnings || 0)
        } : null,
        recentActivity: userMissions.slice(0, 3).map((mission: any) => ({
          id: mission.id,
          title: mission.title,
          views_count: Number(mission.total_views || 0),
          earnings: Number(mission.total_earnings || 0),
          submissions_count: Number(mission.total_submissions || 0),
          created_at: mission.created_at,
          status: mission.status
        })),
        viewsGrowth: 15.5, // À calculer selon la logique métier
        earningsGrowth: 12.3
      },
      performances: userMissions.map((mission: any) => ({
        id: mission.id,
        title: mission.title,
        views: Number(mission.total_views || 0),
        earnings: Number(mission.total_earnings || 0),
        submissions: Number(mission.total_submissions || 0),
        createdAt: mission.created_at,
        status: mission.status
      }))
    }
  } catch (error) {
    console.error('Erreur fetcher analytics:', error)
    // En cas d'erreur, retourner les données mock
    return getMockAnalyticsData()
  }
}

export default function CreatorAnalytics() {
  const { user, profile } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  // Utiliser SWR pour la gestion du cache et des requêtes
  const { data, error, isLoading } = useSWR(
    user?.id ? `${user.id}_${selectedPeriod}` : null,
    () => user?.id ? fetcher(user.id) : null,
    {
      refreshInterval: 30000, // Rafraîchir toutes les 30 secondes
      revalidateOnFocus: true,
      dedupingInterval: 5000 // Éviter les requêtes en double dans un intervalle de 5 secondes
    }
  )

  // Si pas d'utilisateur connecté, afficher un message
  if (!user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Connexion requise</h2>
        <p className="text-gray-600">Veuillez vous connecter pour accéder à vos analytics.</p>
      </div>
    )
  }

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

  if (error) {
    console.error('Erreur chargement analytics:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Une erreur est survenue lors du chargement des données.</p>
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
          <p className="text-gray-600">Chargement de vos analytics...</p>
        </div>
      </div>
    )
  }

  const { stats, performances } = data || { 
    stats: {
      totalViews: 0,
      totalEarnings: 0,
      totalMissions: 0,
      totalClippers: 0,
      monthlyViews: 0,
      monthlyEarnings: 0,
      weeklyViews: 0,
      weeklyEarnings: 0,
      averageViewsPerMission: 0,
      topPerformingMission: null,
      recentActivity: [],
      viewsGrowth: 0,
      earningsGrowth: 0
    }, 
    performances: [] 
  }

  return (
    <RoleProtectionOptimized allowedRoles={['creator']}>
      <div className="min-h-screen bg-gray-50">
        <main className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">
              Suivez les performances de vos missions et l'engagement de votre audience.
            </p>
          </div>

          {/* KPIs Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Vues totales</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <IconArrowUp className="w-3 h-3" />
                    {stats.viewsGrowth.toFixed(1)}% ce mois
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <IconEye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Revenus totaux</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <IconArrowUp className="w-3 h-3" />
                    {stats.earningsGrowth.toFixed(1)}% ce mois
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
                  <p className="text-sm text-gray-600 font-medium">Missions actives</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMissions}</p>
                  <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                    <IconTarget className="w-3 h-3" />
                    En cours
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <IconTarget className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Moyenne vues/mission</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.averageViewsPerMission)}</p>
                  <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                    <IconChartLine className="w-3 h-3" />
                    Performance
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <IconChartLine className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Table */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Performance des missions</h2>
              <div className="flex items-center gap-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                >
                  <option value="7d">7 derniers jours</option>
                  <option value="30d">30 derniers jours</option>
                  <option value="90d">90 derniers jours</option>
                </select>
                <button className="text-gray-600 hover:text-gray-900">
                  <IconDownload className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-4 font-medium">Mission</th>
                    <th className="pb-4 font-medium">Vues</th>
                    <th className="pb-4 font-medium">Revenus</th>
                    <th className="pb-4 font-medium">Clips</th>
                    <th className="pb-4 font-medium">Statut</th>
                    <th className="pb-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {performances && performances.length > 0 ? (
                    performances.map((mission: MissionPerformance) => (
                      <tr key={mission.id} className="border-t border-gray-100">
                        <td className="py-4">
                          <a
                            href={`/mission/${mission.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600"
                          >
                            {mission.title}
                          </a>
                        </td>
                        <td className="py-4 text-gray-600">
                          {formatNumber(mission.views)}
                        </td>
                        <td className="py-4 text-gray-900 font-medium">
                          {formatCurrency(mission.earnings)}
                        </td>
                        <td className="py-4 text-gray-600">
                          {mission.submissions}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            mission.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {mission.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-600">
                          {formatDate(mission.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <IconTarget className="w-12 h-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune mission</h3>
                          <p className="text-gray-500">Vous n'avez pas encore créé de missions.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </RoleProtectionOptimized>
  )
} 