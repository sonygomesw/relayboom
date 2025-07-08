'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthNew'
import ClipperSidebar from '@/components/ClipperSidebar'
import IbanSetup from '@/components/IbanSetup'
import { 
  IconCoin,
  IconTrendingUp,
  IconEye,
  IconCalendar,
  IconCheck,
  IconClock,
  IconTarget,
  IconVideo,
  IconChartBar
} from '@tabler/icons-react'

interface Revenue {
  id: string
  amount: number
  views_count: number
  created_at: string
  status: 'pending' | 'approved' | 'paid'
  missions: {
    title: string
    price_per_1k_views: number
    profiles: {
      pseudo: string
    }
  }
}

interface RevenueStats {
  totalEarnings: number
  pendingEarnings: number
  paidEarnings: number
  totalViews: number
  totalClips: number
  avgEarningsPerClip: number
  monthlyEarnings: number
  lastMonthEarnings: number
}

interface ClipperStats {
  totalSubmissions: number
  totalViews: number
  totalEarnings: number
  pendingSubmissions: number
  approvedSubmissions: number
  rejectedSubmissions: number
  activeMissions: number
  avgViewsPerClip: number
  nextMilestone: number
}

export default function ClipperRevenus() {
  const { user, profile } = useAuth() // 🚀 Utiliser le contexte optimisé
  const [revenues, setRevenues] = useState<Revenue[]>([])
  const [stats, setStats] = useState<RevenueStats>({
    totalEarnings: 0,
    pendingEarnings: 0,
    paidEarnings: 0,
    totalViews: 0,
    totalClips: 0,
    avgEarningsPerClip: 0,
    monthlyEarnings: 0,
    lastMonthEarnings: 0
  })
  const [userStats, setUserStats] = useState<ClipperStats>({
    totalSubmissions: 0,
    totalViews: 0,
    totalEarnings: 0,
    pendingSubmissions: 0,
    approvedSubmissions: 0,
    rejectedSubmissions: 0,
    activeMissions: 0,
    avgViewsPerClip: 0,
    nextMilestone: 1000
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all')

  useEffect(() => {
    if (user && profile) {
      loadRevenusData()
    }
  }, [user, profile])

  const loadRevenusData = async () => {
    if (!user?.id) {
      console.log('❌ Pas d\'utilisateur connecté pour les revenus')
      setIsLoading(false)
      return
    }

    console.log('🔄 Début chargement données revenus pour user:', user.id)
    
    try {
      await Promise.all([
        loadRevenues(),
        loadStats(),
        loadUserStats()
      ])
      console.log('✅ Chargement revenus terminé avec succès')
    } catch (error) {
      console.error('❌ Erreur chargement données revenus:', error)
      console.error('📋 Détails de l\'erreur:', JSON.stringify(error, null, 2))
    } finally {
      setIsLoading(false)
      console.log('🏁 setIsLoading(false) appelé pour revenus')
    }
  }

  const loadRevenues = async () => {
    if (!user?.id) {
      console.log('⚠️ loadRevenues: pas d\'user.id')
      return
    }
    
    console.log('🔄 Chargement des revenus pour user:', user.id)
    
    try {
      // D'abord récupérer les soumissions avec les missions
      const { data: submissions, error } = await supabase
        .from('submissions')
        .select(`
          id,
          views_count,
          created_at,
          status,
          missions!submissions_mission_id_fkey (
            title,
            price_per_1k_views,
            creator_id
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erreur requête submissions revenus:', error)
        throw error
      }

      console.log('✅ Submissions revenus récupérées:', submissions?.length || 0)

      // Ensuite récupérer les profils des créateurs
      const revenuesData = await Promise.all(
        (submissions || []).map(async (submission: any) => {
          const mission = submission.missions || {}
          let creatorProfile = { pseudo: 'Créateur inconnu' }

          if (mission.creator_id) {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('pseudo')
                .eq('id', mission.creator_id)
                .single()
              
              if (profile) {
                creatorProfile = profile
              }
            } catch (profileError) {
              console.error('⚠️ Erreur récupération profil créateur:', profileError)
            }
          }

          return {
            id: submission.id,
            amount: (submission.views_count || 0) / 1000 * (mission?.price_per_1k_views || 0),
            views_count: submission.views_count || 0,
            created_at: submission.created_at,
            status: submission.status, // Utiliser le vrai statut de la soumission
            missions: {
              title: mission?.title || 'Mission inconnue',
              price_per_1k_views: mission?.price_per_1k_views || 0,
              profiles: creatorProfile
            }
          }
        })
      )

      console.log('✅ Revenus avec profils traités:', revenuesData.length)
      setRevenues(revenuesData)
    } catch (error) {
      console.error('❌ Erreur chargement revenus:', error)
      console.error('📋 Détails de l\'erreur:', JSON.stringify(error, null, 2))
      // En cas d'erreur, définir revenus vide
      setRevenues([])
    }
  }

  const loadStats = async () => {
    if (!user?.id) {
      console.log('⚠️ loadStats: pas d\'user.id')
      return
    }
    
    console.log('🔄 Chargement des stats revenus pour user:', user.id)
    
    try {
      const { data: submissions, error } = await supabase
        .from('submissions')
        .select(`
          views_count,
          created_at,
          status,
          missions!submissions_mission_id_fkey (
            price_per_1k_views
          )
        `)
        .eq('user_id', user.id)

      if (error) {
        console.error('❌ Erreur requête stats revenus:', error)
        throw error
      }

      const approvedSubmissions = submissions?.filter(s => s.status === 'approved') || []
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

      const totalEarnings = approvedSubmissions.reduce((sum, s) => {
        const mission = s.missions as any;
        const earnings = (s.views_count || 0) / 1000 * (mission?.price_per_1k_views || 0)
        return sum + earnings
      }, 0)

      const monthlyEarnings = approvedSubmissions
        .filter(s => {
          const date = new Date(s.created_at)
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear
        })
        .reduce((sum, s) => {
          const mission = s.missions as any;
          const earnings = (s.views_count || 0) / 1000 * (mission?.price_per_1k_views || 0)
          return sum + earnings
        }, 0)

      const lastMonthEarnings = approvedSubmissions
        .filter(s => {
          const date = new Date(s.created_at)
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
        })
        .reduce((sum, s) => {
          const mission = s.missions as any;
          const earnings = (s.views_count || 0) / 1000 * (mission?.price_per_1k_views || 0)
          return sum + earnings
        }, 0)

      const totalViews = approvedSubmissions.reduce((sum, s) => sum + (s.views_count || 0), 0)
      const totalClips = approvedSubmissions.length
      const avgEarningsPerClip = totalClips > 0 ? totalEarnings / totalClips : 0

      setStats({
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        pendingEarnings: 0, // À implémenter si nécessaire
        paidEarnings: Math.round(totalEarnings * 100) / 100, // Assumé payé pour l'instant
        totalViews,
        totalClips,
        avgEarningsPerClip: Math.round(avgEarningsPerClip * 100) / 100,
        monthlyEarnings: Math.round(monthlyEarnings * 100) / 100,
        lastMonthEarnings: Math.round(lastMonthEarnings * 100) / 100
      })

      console.log('✅ Stats revenus calculées:', {
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        monthlyEarnings: Math.round(monthlyEarnings * 100) / 100,
        totalViews: approvedSubmissions.reduce((sum, s) => sum + (s.views_count || 0), 0),
        totalClips: approvedSubmissions.length
      })
    } catch (error) {
      console.error('❌ Erreur chargement stats:', error)
      console.error('📋 Détails de l\'erreur:', JSON.stringify(error, null, 2))
      // En cas d'erreur, définir des stats par défaut
      setStats({
        totalEarnings: 0,
        pendingEarnings: 0,
        paidEarnings: 0,
        totalViews: 0,
        totalClips: 0,
        avgEarningsPerClip: 0,
        monthlyEarnings: 0,
        lastMonthEarnings: 0
      })
    }
  }

  const loadUserStats = async () => {
    if (!user?.id) {
      console.log('⚠️ loadUserStats revenus: pas d\'user.id')
      return
    }
    
    console.log('🔄 Chargement des user stats revenus pour user:', user.id)
    
    try {
      const { data: submissions, error } = await supabase
        .from('submissions')
        .select(`
          views_count,
          status,
          missions!submissions_mission_id_fkey (
            price_per_1k_views
          )
        `)
        .eq('user_id', user.id)

      if (error) throw error

      const totalSubmissions = submissions?.length || 0
      const totalViews = submissions?.reduce((sum, s) => sum + (s.views_count || 0), 0) || 0
      const pendingSubmissions = submissions?.filter(s => s.status === 'pending').length || 0
      const approvedSubmissions = submissions?.filter(s => s.status === 'approved').length || 0
      const rejectedSubmissions = submissions?.filter(s => s.status === 'rejected').length || 0

      const totalEarnings = submissions
        ?.filter(s => s.status === 'approved')
        .reduce((sum, s) => {
          const price = (s.missions as any)?.price_per_1k_views || 0
          const earnings = (s.views_count || 0) / 1000 * price
          return sum + earnings
        }, 0) || 0

      setUserStats({
        totalSubmissions,
        totalViews,
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        pendingSubmissions,
        approvedSubmissions,
        rejectedSubmissions,
        activeMissions: 0, // À implémenter si nécessaire
        avgViewsPerClip: totalSubmissions > 0 ? Math.round(totalViews / totalSubmissions) : 0,
        nextMilestone: 1000
      })

      console.log('✅ User stats revenus calculées:', {
        totalSubmissions,
        totalViews,
        totalEarnings: Math.round(totalEarnings * 100) / 100
      })
    } catch (error) {
      console.error('❌ Erreur chargement user stats:', error)
      console.error('📋 Détails de l\'erreur:', JSON.stringify(error, null, 2))
      // En cas d'erreur, définir des stats par défaut
      setUserStats({
        totalSubmissions: 0,
        totalViews: 0,
        totalEarnings: 0,
        pendingSubmissions: 0,
        approvedSubmissions: 0,
        rejectedSubmissions: 0,
        activeMissions: 0,
        avgViewsPerClip: 0,
        nextMilestone: 1000
      })
    }
  }

  const getFilteredRevenues = () => {
    if (selectedPeriod === 'all') return revenues

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return revenues.filter(revenue => {
      const date = new Date(revenue.created_at)
      
      switch (selectedPeriod) {
        case 'month':
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear
        case 'lastMonth':
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
        case 'year':
          return date.getFullYear() === currentYear
        default:
          return true
      }
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getGrowthPercentage = () => {
    if (stats.lastMonthEarnings === 0) return 0
    return Math.round(((stats.monthlyEarnings - stats.lastMonthEarnings) / stats.lastMonthEarnings) * 100)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos revenus...</p>
        </div>
      </div>
    )
  }

  const filteredRevenues = getFilteredRevenues()
  const growthPercentage = getGrowthPercentage()

  return (
    <RoleProtectionOptimized allowedRoles={['clipper']}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar Clippeur */}
        <ClipperSidebar userStats={userStats} profile={profile || undefined} />

        {/* Main Content */}
        <div className="flex-1 ml-96">
          <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mes revenus</h1>
                <p className="text-gray-600">Suivez vos gains et performances financières</p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Toute la période</option>
                  <option value="month">Ce mois-ci</option>
                  <option value="lastMonth">Mois dernier</option>
                  <option value="year">Cette année</option>
                </select>
              </div>
            </div>
          </header>

          <main className="p-8">
            {/* Configuration Bancaire IBAN */}
            <div className="mb-8">
              {user && <IbanSetup userId={user.id} />}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Gains totaux</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
                    <p className="text-xs text-green-600">Tous les temps</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <IconCoin className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Ce mois-ci</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyEarnings)}</p>
                    <div className="flex items-center gap-1">
                      {growthPercentage >= 0 ? (
                        <IconTrendingUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <IconTrendingUp className="w-3 h-3 text-red-600 rotate-180" />
                      )}
                      <p className={`text-xs ${growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growthPercentage >= 0 ? '+' : ''}{growthPercentage}%
                      </p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <IconCalendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Vues monétisées</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
                    <p className="text-xs text-purple-600">{stats.totalClips} clips</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <IconEye className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Moyenne par clip</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.avgEarningsPerClip)}</p>
                    <p className="text-xs text-orange-600">Performance</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <IconChartBar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Évolution des revenus</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <IconCoin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Revenus totaux</p>
                        <p className="text-sm text-gray-600">{stats.totalClips} clips approuvés</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(stats.totalEarnings)}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconCalendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Ce mois-ci</p>
                        <p className="text-sm text-gray-600">Progression mensuelle</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">{formatCurrency(stats.monthlyEarnings)}</p>
                      <p className={`text-sm ${growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growthPercentage >= 0 ? '+' : ''}{growthPercentage}% vs mois dernier
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <IconEye className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Performance</p>
                        <p className="text-sm text-gray-600">Moyenne par clip</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-purple-600">{formatCurrency(stats.avgEarningsPerClip)}</p>
                      <p className="text-sm text-gray-600">{formatNumber(Math.round(stats.totalViews / stats.totalClips))} vues/clip</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Conseils</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">Ciblez les missions avec un bon ratio prix/effort</p>
                </div>
                <div className="flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">Créez du contenu viral pour maximiser les vues</p>
                </div>
                <div className="flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">Soumettez régulièrement pour maintenir vos revenus</p>
                </div>
              </div>
            </div>

            {/* Revenus List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Historique des revenus ({filteredRevenues.length})
                </h3>
              </div>

              {filteredRevenues.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconCoin className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun revenu trouvé</h3>
                  <p className="text-gray-600">
                    {selectedPeriod === 'all' 
                      ? 'Aucun revenu disponible'
                      : 'Aucun revenu pour cette période'
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredRevenues.map((revenue) => (
                    <div key={revenue.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <IconCoin className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{revenue.missions.title}</h4>
                            <p className="text-sm text-gray-600">
                              Par {revenue.missions.profiles.pseudo} • {formatDate(revenue.created_at)}
                            </p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <IconEye className="w-4 h-4" />
                                {formatNumber(revenue.views_count)} vues
                              </span>
                              <span className="text-sm text-gray-500">
                                {revenue.missions.price_per_1k_views}€/1K vues
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrency(revenue.amount)}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <IconCheck className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600">Approuvé</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </RoleProtectionOptimized>
  )
} 