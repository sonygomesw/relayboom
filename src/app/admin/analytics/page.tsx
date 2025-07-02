'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthContext'
import { 
  IconChartBar, 
  IconUsers, 
  IconTarget, 
  IconCoin,
  IconEye,
  IconTrendingUp,
  IconTrendingDown,
  IconClock,
  IconShield,
  IconAlertCircle,
  IconVideo,
  IconCalendar
} from '@tabler/icons-react'
import AdminSidebar from '@/components/AdminSidebar'

interface AnalyticsData {
  totalUsers: number
  totalCreators: number
  totalClippers: number
  totalMissions: number
  activeMissions: number
  completedMissions: number
  totalSubmissions: number
  approvedSubmissions: number
  pendingSubmissions: number
  totalViews: number
  totalEarnings: number
  avgPricePerK: number
  topCreators: Array<{
    pseudo: string
    missions_count: number
    total_budget: number
  }>
  topClippers: Array<{
    pseudo: string
    submissions_count: number
    total_earnings: number
  }>
  recentActivity: Array<{
    type: string
    description: string
    timestamp: string
  }>
}

export default function AdminAnalytics() {
  const { profile } = useAuth() // 🚀 Utiliser le contexte optimisé
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalCreators: 0,
    totalClippers: 0,
    totalMissions: 0,
    activeMissions: 0,
    completedMissions: 0,
    totalSubmissions: 0,
    approvedSubmissions: 0,
    pendingSubmissions: 0,
    totalViews: 0,
    totalEarnings: 0,
    avgPricePerK: 0,
    topCreators: [],
    topClippers: [],
    recentActivity: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  useEffect(() => {
    if (profile) {
      loadAnalytics()
    }
  }, [profile, selectedPeriod])

  const loadAnalytics = async () => {
    try {
      console.log('📊 Chargement des analytics...')
      
      // Calculer la date de début selon la période
      const startDate = getStartDate(selectedPeriod)
      
      // Charger toutes les données en parallèle
      const [
        profilesData,
        missionsData,
        submissionsData,
        clipSubmissionsData
      ] = await Promise.all([
        loadProfilesData(startDate),
        loadMissionsData(startDate),
        loadSubmissionsData(startDate),
        loadClipSubmissionsData(startDate)
      ])

      // Calculer les métriques
      const analytics: AnalyticsData = {
        // Utilisateurs
        totalUsers: profilesData.profiles?.length || 0,
        totalCreators: profilesData.profiles?.filter(p => p.role === 'creator').length || 0,
        totalClippers: profilesData.profiles?.filter(p => p.role === 'clipper').length || 0,
        
        // Missions
        totalMissions: missionsData.missions?.length || 0,
        activeMissions: missionsData.missions?.filter(m => m.status === 'active').length || 0,
        completedMissions: missionsData.missions?.filter(m => m.status === 'completed').length || 0,
        
        // Soumissions
        totalSubmissions: submissionsData.submissions?.length || 0,
        approvedSubmissions: clipSubmissionsData.clipSubmissions?.filter(cs => cs.status === 'approved').length || 0,
        pendingSubmissions: clipSubmissionsData.clipSubmissions?.filter(cs => cs.status === 'pending').length || 0,
        
        // Métriques financières
        totalViews: submissionsData.submissions?.reduce((sum, s) => sum + (s.views_count || 0), 0) || 0,
        totalEarnings: calculateTotalEarnings(clipSubmissionsData.clipSubmissions || []),
        avgPricePerK: calculateAvgPricePerK(missionsData.missions || []),
        
        // Top performers
        topCreators: calculateTopCreators(missionsData.missions || []),
        topClippers: calculateTopClippers(clipSubmissionsData.clipSubmissions || []),
        
        // Activité récente
        recentActivity: generateRecentActivity(profilesData.profiles || [], missionsData.missions || [])
      }

      console.log('📈 Analytics calculées:', analytics)
      setAnalytics(analytics)
      
    } catch (error) {
      console.error('❌ Erreur chargement analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStartDate = (period: string) => {
    const now = new Date()
    switch (period) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
      default:
        return '2020-01-01T00:00:00.000Z' // Toutes les données
    }
  }

  const loadProfilesData = async (startDate: string) => {
    const query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (selectedPeriod !== 'all') {
      query.gte('created_at', startDate)
    }
    
    const { data: profiles, error } = await query
    if (error) throw error
    
    return { profiles }
  }

  const loadMissionsData = async (startDate: string) => {
    const query = supabase
      .from('missions')
      .select(`
        *,
        profiles!missions_creator_id_fkey (
          pseudo,
          email
        )
      `)
      .order('created_at', { ascending: false })
    
    if (selectedPeriod !== 'all') {
      query.gte('created_at', startDate)
    }
    
    const { data: missions, error } = await query
    if (error) throw error
    
    return { missions }
  }

  const loadSubmissionsData = async (startDate: string) => {
    const query = supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (selectedPeriod !== 'all') {
      query.gte('created_at', startDate)
    }
    
    const { data: submissions, error } = await query
    if (error) throw error
    
    return { submissions }
  }

  const loadClipSubmissionsData = async (startDate: string) => {
    const query = supabase
      .from('clip_submissions')
      .select(`
        *,
        profiles!clip_submissions_clipper_id_fkey (
          pseudo,
          email
        ),
        missions!clip_submissions_mission_id_fkey (
          title,
          price_per_1k_views
        )
      `)
      .order('created_at', { ascending: false })
    
    if (selectedPeriod !== 'all') {
      query.gte('created_at', startDate)
    }
    
    const { data: clipSubmissions, error } = await query
    if (error) throw error
    
    return { clipSubmissions }
  }

  const calculateTotalEarnings = (clipSubmissions: any[]) => {
    return clipSubmissions
      .filter(cs => cs.status === 'approved')
      .reduce((sum, cs) => {
        const price = cs.missions?.price_per_1k_views || 0
        const earnings = (cs.palier / 1000) * price
        return sum + earnings
      }, 0)
  }

  const calculateAvgPricePerK = (missions: any[]) => {
    if (missions.length === 0) return 0
    const total = missions.reduce((sum, m) => sum + (m.price_per_1k_views || 0), 0)
    return Math.round((total / missions.length) * 100) / 100
  }

  const calculateTopCreators = (missions: any[]) => {
    const creatorStats = missions.reduce((acc, mission) => {
      const creatorId = mission.creator_id
      const pseudo = mission.profiles?.pseudo || 'Inconnu'
      
      if (!acc[creatorId]) {
        acc[creatorId] = {
          pseudo,
          missions_count: 0,
          total_budget: 0
        }
      }
      
      acc[creatorId].missions_count++
      acc[creatorId].total_budget += mission.total_budget || 0
      
      return acc
    }, {} as any)
    
    return (Object.values(creatorStats) as { pseudo: string; missions_count: number; total_budget: number }[])
      .sort((a, b) => b.total_budget - a.total_budget)
      .slice(0, 5)
  }

  const calculateTopClippers = (clipSubmissions: any[]) => {
    const clipperStats = clipSubmissions
      .filter(cs => cs.status === 'approved')
      .reduce((acc, cs) => {
        const clipperId = cs.clipper_id
        const pseudo = cs.profiles?.pseudo || 'Inconnu'
        const earnings = (cs.palier / 1000) * (cs.missions?.price_per_1k_views || 0)
        
        if (!acc[clipperId]) {
          acc[clipperId] = {
            pseudo,
            submissions_count: 0,
            total_earnings: 0
          }
        }
        
        acc[clipperId].submissions_count++
        acc[clipperId].total_earnings += earnings
        
        return acc
      }, {} as any)
    
    return (Object.values(clipperStats) as { pseudo: string; submissions_count: number; total_earnings: number }[])
      .sort((a, b) => b.total_earnings - a.total_earnings)
      .slice(0, 5)
  }

  const generateRecentActivity = (profiles: any[], missions: any[]) => {
    const activity: { type: string; description: string; timestamp: string }[] = []
    
    // Nouveaux utilisateurs
    profiles.slice(0, 3).forEach(profile => {
      activity.push({
        type: 'new_user',
        description: `Nouvel utilisateur ${profile.role}: ${profile.pseudo}`,
        timestamp: profile.created_at
      })
    })
    
    // Nouvelles missions
    missions.slice(0, 3).forEach(mission => {
      activity.push({
        type: 'new_mission',
        description: `Nouvelle mission: ${mission.title}`,
        timestamp: mission.created_at
      })
    })
    
    return activity
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
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

  const getGrowthIcon = (value: number) => {
    if (value > 0) return <IconTrendingUp className="w-4 h-4 text-green-500" />
    if (value < 0) return <IconTrendingDown className="w-4 h-4 text-red-500" />
    return <IconClock className="w-4 h-4 text-gray-500" />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des analytics...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Analytics & Statistiques</h1>
                <p className="text-gray-600">Analysez les performances de votre plateforme</p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="7d">7 derniers jours</option>
                  <option value="30d">30 derniers jours</option>
                  <option value="90d">90 derniers jours</option>
                  <option value="all">Toutes les données</option>
                </select>
                <IconCalendar className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </header>

          <main className="p-8">
            {/* KPIs principaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Utilisateurs totaux</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getGrowthIcon(analytics.totalUsers)}
                      <span className="text-xs text-gray-500">
                        {analytics.totalCreators} créateurs • {analytics.totalClippers} clippeurs
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <IconUsers className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Missions actives</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.activeMissions}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getGrowthIcon(analytics.activeMissions)}
                      <span className="text-xs text-gray-500">
                        {analytics.totalMissions} au total
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <IconTarget className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Vues totales</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.totalViews)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getGrowthIcon(analytics.totalViews)}
                      <span className="text-xs text-gray-500">
                        {analytics.totalSubmissions} soumissions
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <IconEye className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Gains distribués</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalEarnings)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getGrowthIcon(analytics.totalEarnings)}
                      <span className="text-xs text-gray-500">
                        {analytics.pendingSubmissions} en attente
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <IconCoin className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Graphiques et métriques détaillées */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Répartition des utilisateurs */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition des utilisateurs</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm font-medium text-gray-700">Créateurs</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">{analytics.totalCreators}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({analytics.totalUsers > 0 ? Math.round((analytics.totalCreators / analytics.totalUsers) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm font-medium text-gray-700">Clippeurs</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">{analytics.totalClippers}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({analytics.totalUsers > 0 ? Math.round((analytics.totalClippers / analytics.totalUsers) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-sm font-medium text-gray-700">Admins</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">
                        {analytics.totalUsers - analytics.totalCreators - analytics.totalClippers}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({analytics.totalUsers > 0 ? Math.round(((analytics.totalUsers - analytics.totalCreators - analytics.totalClippers) / analytics.totalUsers) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statut des missions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Statut des missions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm font-medium text-gray-700">Actives</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">{analytics.activeMissions}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({analytics.totalMissions > 0 ? Math.round((analytics.activeMissions / analytics.totalMissions) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm font-medium text-gray-700">Terminées</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">{analytics.completedMissions}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({analytics.totalMissions > 0 ? Math.round((analytics.completedMissions / analytics.totalMissions) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-sm font-medium text-gray-700">En pause</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">
                        {analytics.totalMissions - analytics.activeMissions - analytics.completedMissions}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({analytics.totalMissions > 0 ? Math.round(((analytics.totalMissions - analytics.activeMissions - analytics.completedMissions) / analytics.totalMissions) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Métriques avancées */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <IconChartBar className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Taux d'approbation</h3>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {analytics.totalSubmissions > 0 
                      ? Math.round((analytics.approvedSubmissions / analytics.totalSubmissions) * 100)
                      : 0
                    }%
                  </p>
                  <p className="text-sm text-gray-600">
                    {analytics.approvedSubmissions} / {analytics.totalSubmissions} soumissions
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <IconCoin className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Prix moyen/1K</h3>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{analytics.avgPricePerK}€</p>
                  <p className="text-sm text-gray-600">Par 1000 vues</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <IconVideo className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Vues moyennes</h3>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {analytics.totalSubmissions > 0 
                      ? formatNumber(Math.round(analytics.totalViews / analytics.totalSubmissions))
                      : 0
                    }
                  </p>
                  <p className="text-sm text-gray-600">Par soumission</p>
                </div>
              </div>
            </div>

            {/* Alertes et actions */}
            {analytics.pendingSubmissions > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <IconAlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-900">
                      {analytics.pendingSubmissions} validation(s) en attente
                    </h3>
                    <p className="text-red-700">
                      Des clippeurs attendent la validation de leurs paliers pour recevoir leurs gains.
                    </p>
                  </div>
                  <a 
                    href="/admin/paliers"
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Traiter maintenant
                  </a>
                </div>
              </div>
            )}

            {/* Top performers et activité récente */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Top créateurs */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Top créateurs</h3>
                <div className="space-y-4">
                  {analytics.topCreators.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Aucune donnée disponible</p>
                  ) : (
                    analytics.topCreators.map((creator, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{creator.pseudo}</p>
                            <p className="text-xs text-gray-500">{creator.missions_count} missions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(creator.total_budget)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Top clippeurs */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Top clippeurs</h3>
                <div className="space-y-4">
                  {analytics.topClippers.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Aucune donnée disponible</p>
                  ) : (
                    analytics.topClippers.map((clipper, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{clipper.pseudo}</p>
                            <p className="text-xs text-gray-500">{clipper.submissions_count} clips</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(clipper.total_earnings)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Activité récente */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Activité récente</h3>
                <div className="space-y-4">
                  {analytics.recentActivity.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
                  ) : (
                    analytics.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-1">
                          {activity.type === 'new_user' && <IconUsers className="w-4 h-4 text-gray-600" />}
                          {activity.type === 'new_mission' && <IconTarget className="w-4 h-4 text-gray-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RoleProtectionOptimized>
  )
} 