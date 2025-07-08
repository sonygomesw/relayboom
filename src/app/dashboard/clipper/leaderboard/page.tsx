'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthNew'
import ClipperSidebar from '@/components/ClipperSidebar'
import { IconEye, IconTrendingUp, IconTrophy, IconMedal, IconCrown, IconCalendar, IconUsers, IconGift, IconFlame } from '@tabler/icons-react'

interface LeaderboardEntry {
  id: string
  pseudo: string
  avatar?: string
  totalEarnings: number
  totalViews: number
  totalClips: number
  monthlyEarnings: number
  rank: number
  badge?: string
  isCurrentUser?: boolean
}

interface Competition {
  id: string
  title: string
  description: string
  prize: number
  endDate: string
  participants: number
  status: 'active' | 'ended'
  userRank?: number
}

interface UserStats {
  totalViews: number
  totalEarnings: number
  totalClips: number
  monthlyEarnings: number
}

export default function LeaderboardPage() {
  const { user, profile } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [userStats, setUserStats] = useState<UserStats>({ totalViews: 0, totalEarnings: 0, totalClips: 0, monthlyEarnings: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [activeTab, setActiveTab] = useState('ranking')

  useEffect(() => {
    if (user && profile) {
      loadLeaderboardData()
    }
  }, [user, profile, selectedPeriod])

  const calculateUserStats = async (userId: string) => {
    try {
      // Récupérer toutes les submissions de cet utilisateur avec les missions
      const { data: submissions } = await supabase
        .from('submissions')
        .select(`
          views,
          created_at,
          mission_id,
          missions!inner(price_per_1k_views)
        `)
        .eq('user_id', userId)

      if (!submissions || submissions.length === 0) {
        return { totalViews: 0, totalEarnings: 0, totalClips: 0, monthlyEarnings: 0 }
      }

      // Calculer les statistiques
      let totalViews = 0
      let totalEarnings = 0
      let monthlyEarnings = 0
      const totalClips = submissions.length

      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      submissions.forEach((submission: any) => {
        const views = submission.views_count || 0
        totalViews += views

        // Calculer les gains basés sur le price_per_1k_views de la mission
        if (submission.missions && submission.missions.price_per_1k_views) {
          const earnings = (views / 1000) * submission.missions.price_per_1k_views
          totalEarnings += earnings

          // Vérifier si c'est ce mois-ci
          const submissionDate = new Date(submission.created_at)
          if (submissionDate.getMonth() === currentMonth && submissionDate.getFullYear() === currentYear) {
            monthlyEarnings += earnings
          }
        }
      })

      return { totalViews, totalEarnings, totalClips, monthlyEarnings }
    } catch (error) {
      console.error('Erreur calcul stats:', error)
      return { totalViews: 0, totalEarnings: 0, totalClips: 0, monthlyEarnings: 0 }
    }
  }

  const loadLeaderboardData = async () => {
    if (!user?.id) return
    
    try {
      // Récupérer tous les utilisateurs clippeurs
      const { data: allClippers } = await supabase
        .from('profiles')
        .select('id, pseudo')
        .eq('role', 'clipper')

      if (!allClippers || allClippers.length === 0) {
        setLeaderboard([])
        return
      }

      // Calculer les stats pour chaque clippeur
      const leaderboardData: LeaderboardEntry[] = []

      for (const clipper of allClippers) {
        const stats = await calculateUserStats(clipper.id)
        
        // Déterminer si c'est l'utilisateur actuel
        const isCurrentUser = clipper.id === user?.id

        // Calculer les stats selon la période sélectionnée
        let periodEarnings = stats.monthlyEarnings
        if (selectedPeriod === 'alltime') {
          periodEarnings = stats.totalEarnings
        } else if (selectedPeriod === 'weekly') {
          // Pour simplifier, on utilise les gains mensuels divisés par 4
          periodEarnings = stats.monthlyEarnings / 4
        }

        leaderboardData.push({
          id: clipper.id,
          pseudo: clipper.pseudo || 'Utilisateur',
          totalEarnings: stats.totalEarnings,
          totalViews: stats.totalViews,
          totalClips: stats.totalClips,
          monthlyEarnings: periodEarnings,
          rank: 0, // sera calculé après le tri
          isCurrentUser
        })
      }

      // Trier par gains de la période sélectionnée
      leaderboardData.sort((a, b) => b.monthlyEarnings - a.monthlyEarnings)

      // Assigner les rangs et badges
      leaderboardData.forEach((entry, index) => {
        entry.rank = index + 1
        
        // Assigner des badges aux top performers
        if (index === 0 && entry.monthlyEarnings > 100) {
          entry.badge = '👑 Roi du Clip'
        } else if (index === 1 && entry.monthlyEarnings > 50) {
          entry.badge = '🔥 Machine à Viral'
        } else if (index === 2 && entry.monthlyEarnings > 25) {
          entry.badge = '⚡ Vitesse Éclair'
        } else if (entry.totalViews > 1000000) {
          entry.badge = '🚀 Millions de vues'
        } else if (entry.totalClips > 50) {
          entry.badge = '🎬 Producteur'
        }
      })

      setLeaderboard(leaderboardData)

      // Mettre à jour les stats de l'utilisateur actuel
      const currentUserEntry = leaderboardData.find(entry => entry.isCurrentUser)
      if (currentUserEntry) {
        setUserStats({
          totalViews: currentUserEntry.totalViews,
          totalEarnings: currentUserEntry.totalEarnings,
          totalClips: currentUserEntry.totalClips,
          monthlyEarnings: currentUserEntry.monthlyEarnings
        })
      }

      // Charger les compétitions (gardées mockées pour l'instant)
      const mockCompetitions: Competition[] = [
        {
          id: '1',
          title: '🏆 Challenge Janvier 2025',
          description: 'Le clippeur avec le plus de vues ce mois gagne 500€ bonus !',
          prize: 500,
          endDate: '2025-01-31',
          participants: allClippers.length,
          status: 'active',
          userRank: currentUserEntry?.rank || 999
        },
        {
          id: '2',
          title: '🎯 Week-end Viral',
          description: 'Défi spécial week-end : 100€ pour le clip le plus viral !',
          prize: 100,
          endDate: '2025-01-19',
          participants: Math.floor(allClippers.length * 0.6),
          status: 'active',
          userRank: Math.min(currentUserEntry?.rank || 999, Math.floor(allClippers.length * 0.8))
        },
        {
          id: '3',
          title: '🔥 Défi MrBeast',
          description: 'Competition terminée - Clips exclusifs MrBeast',
          prize: 300,
          endDate: '2025-01-10',
          participants: Math.floor(allClippers.length * 0.7),
          status: 'ended',
          userRank: Math.min(currentUserEntry?.rank || 999, Math.floor(allClippers.length * 0.9))
        }
      ]

      setCompetitions(mockCompetitions)

    } catch (error) {
      console.error('Erreur chargement leaderboard:', error)
      
      // Fallback avec des données d'exemple si erreur
      const fallbackData: LeaderboardEntry[] = [
        {
          id: profile?.id || 'current',
          pseudo: profile?.pseudo || 'Toi',
          totalEarnings: 0,
          totalViews: 0,
          totalClips: 0,
          monthlyEarnings: 0,
          rank: 1,
          isCurrentUser: true
        }
      ]
      
      setLeaderboard(fallbackData)
      setUserStats({ totalViews: 0, totalEarnings: 0, totalClips: 0, monthlyEarnings: 0 })
    } finally {
      setIsLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <IconCrown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <IconMedal className="w-6 h-6 text-gray-400" />
      case 3:
        return <IconMedal className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du leaderboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  const userEntry = leaderboard.find(entry => entry.isCurrentUser)

  return (
    <RoleProtectionOptimized allowedRoles={['clipper']}>
      <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <ClipperSidebar 
        userStats={{
          totalEarnings: userStats.totalEarnings,
          totalViews: userStats.totalViews,
          nextMilestone: 75
        }}
        profile={profile} 
      />

      {/* Main Content */}
      <div className="flex-1 ml-96">
        <main className="min-h-screen bg-gray-50" style={{backgroundColor: '#FAFAFA'}}>
          <div className="max-w-full mx-auto px-16 py-16">
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <IconTrophy className="w-12 h-12 text-yellow-500" />
                <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
              </div>
              <p className="text-xl text-gray-600">Découvre le classement des meilleurs clippeurs et participe aux compétitions</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => setActiveTab('ranking')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'ranking' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                🏆 Classement
              </button>
              <button
                onClick={() => setActiveTab('competitions')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'competitions' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                🎯 Compétitions
              </button>
            </div>

            {activeTab === 'ranking' && (
              <>
                {/* Period Filter */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Classement des clippeurs</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Période :</span>
                      <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="weekly">Cette semaine</option>
                        <option value="monthly">Ce mois</option>
                        <option value="alltime">Tout temps</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Top 3 Podium */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {leaderboard.slice(0, 3).map((entry, index) => (
                    <div key={entry.id} className={`bg-white rounded-2xl border-2 p-8 text-center ${
                      index === 0 ? 'border-yellow-300 bg-gradient-to-b from-yellow-50 to-white' :
                      index === 1 ? 'border-gray-300 bg-gradient-to-b from-gray-50 to-white' :
                      'border-amber-300 bg-gradient-to-b from-amber-50 to-white'
                    }`}>
                      <div className="mb-4">
                        {getRankIcon(entry.rank)}
                      </div>
                      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-600">
                          {entry.pseudo.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{entry.pseudo}</h3>
                      {entry.badge && (
                        <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
                          {entry.badge}
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-green-600">{entry.monthlyEarnings.toFixed(0)}€</div>
                        <div className="text-sm text-gray-500">{formatNumber(entry.totalViews)} vues</div>
                        <div className="text-sm text-gray-500">{entry.totalClips} clips</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Full Leaderboard */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">Classement complet</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-6 py-4 font-semibold text-gray-900">Rang</th>
                          <th className="text-left px-6 py-4 font-semibold text-gray-900">Clippeur</th>
                          <th className="text-left px-6 py-4 font-semibold text-gray-900">Gains (mois)</th>
                          <th className="text-left px-6 py-4 font-semibold text-gray-900">Total vues</th>
                          <th className="text-left px-6 py-4 font-semibold text-gray-900">Clips</th>
                          <th className="text-left px-6 py-4 font-semibold text-gray-900">Total gains</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {leaderboard.map((entry) => (
                          <tr key={entry.id} className={`transition-colors ${
                            entry.isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                          }`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {getRankIcon(entry.rank)}
                                {entry.isCurrentUser && (
                                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-bold">TOI</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-semibold text-gray-600">
                                    {entry.pseudo.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">{entry.pseudo}</div>
                                  {entry.badge && (
                                    <div className="text-xs text-blue-600">{entry.badge}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-lg font-bold text-green-600">{entry.monthlyEarnings.toFixed(0)}€</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <IconEye className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold text-gray-900">{formatNumber(entry.totalViews)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-900 font-semibold">{entry.totalClips}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-600">{entry.totalEarnings.toFixed(0)}€</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'competitions' && (
              <>
                {/* Active Competitions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {competitions.filter(comp => comp.status === 'active').map((competition) => (
                    <div key={competition.id} className="bg-white rounded-2xl border border-gray-200 p-8 relative overflow-hidden">
                      <div className="absolute top-4 right-4">
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <IconFlame className="w-3 h-3" />
                          ACTIF
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{competition.title}</h3>
                      <p className="text-gray-600 mb-6">{competition.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-yellow-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-600">{competition.prize}€</div>
                          <div className="text-sm text-yellow-700">Prix à gagner</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">#{competition.userRank || 'N/A'}</div>
                          <div className="text-sm text-blue-700">Ta position</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <IconUsers className="w-4 h-4" />
                          {competition.participants} participants
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <IconCalendar className="w-4 h-4" />
                          {getDaysLeft(competition.endDate)} jours restants
                        </div>
                      </div>
                      
                      <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-200">
                        🚀 Participer maintenant
                      </button>
                    </div>
                  ))}
                </div>

                {/* Ended Competitions */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">🏁 Compétitions terminées</h3>
                  <div className="space-y-4">
                    {competitions.filter(comp => comp.status === 'ended').map((competition) => (
                      <div key={competition.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-900">{competition.title}</h4>
                          <p className="text-sm text-gray-600">Prix : {competition.prize}€ • Ta position : #{competition.userRank}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          Terminée le {new Date(competition.endDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      </div>
    </RoleProtectionOptimized>
  )
} 