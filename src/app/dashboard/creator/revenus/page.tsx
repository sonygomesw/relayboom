'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthContext'
import {
  IconCoin,
  IconTarget,
  IconUsers,
  IconCalendar,
  IconTrendingUp,
  IconChartLine,
  IconSettings,
  IconLogout,
  IconDashboard,
  IconDownload,
  IconCreditCard,
  IconClock,
  IconCheck,
  IconAlertCircle,
  IconFilter
} from '@tabler/icons-react'

interface PaymentRecord {
  id: string
  missionTitle: string
  clipperId: string
  clipperPseudo: string
  views: number
  amount: number
  status: 'pending' | 'processing' | 'paid' | 'cancelled'
  createdAt: string
  paidAt?: string
}

interface RevenueStats {
  totalCost: number
  monthlySpend: number
  pendingPayments: number
  totalClippers: number
  averageCostPerView: number
  thisMonthSpend: number
  lastMonthSpend: number
  growthRate: number
}

export default function CreatorPaiements() {
  const { user, profile } = useAuth()
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    totalCost: 0,
    monthlySpend: 0,
    pendingPayments: 0,
    totalClippers: 0,
    averageCostPerView: 0,
    thisMonthSpend: 0,
    lastMonthSpend: 0,
    growthRate: 0
  })
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user && profile) {
      loadRevenueData()
    }
  }, [user, profile])

  const loadMockRevenueData = async () => {
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Mock payments data
    const mockPayments: PaymentRecord[] = [
      {
        id: 'payment_1',
        missionTitle: 'Challenge Gaming Viral',
        clipperId: 'clipper_1',
        clipperPseudo: 'GameMaster23',
        views: 35000,
        amount: 875.00,
        status: 'paid',
        createdAt: '2024-01-15T10:30:00Z',
        paidAt: '2024-01-22T15:45:00Z'
      },
      {
        id: 'payment_2',
        missionTitle: 'Réaction Musique Tendance',
        clipperId: 'clipper_2',
        clipperPseudo: 'MusicLover',
        views: 28000,
        amount: 700.00,
        status: 'paid',
        createdAt: '2024-01-12T14:20:00Z',
        paidAt: '2024-01-19T09:30:00Z'
      },
      {
        id: 'payment_3',
        missionTitle: 'Test Produit Tech',
        clipperId: 'clipper_3',
        clipperPseudo: 'TechReviewer',
        views: 22000,
        amount: 550.00,
        status: 'processing',
        createdAt: '2024-01-18T09:15:00Z'
      },
      {
        id: 'payment_4',
        missionTitle: 'Challenge Gaming Viral',
        clipperId: 'clipper_4',
        clipperPseudo: 'ProGamer',
        views: 18500,
        amount: 462.50,
        status: 'pending',
        createdAt: '2024-01-20T16:45:00Z'
      },
      {
        id: 'payment_5',
        missionTitle: 'Lifestyle Morning Routine',
        clipperId: 'clipper_5',
        clipperPseudo: 'LifestyleGuru',
        views: 15000,
        amount: 375.00,
        status: 'paid',
        createdAt: '2024-01-08T11:45:00Z',
        paidAt: '2024-01-15T14:20:00Z'
      },
      {
        id: 'payment_6',
        missionTitle: 'Défi Culinaire Original',
        clipperId: 'clipper_6',
        clipperPseudo: 'ChefCreatif',
        views: 12000,
        amount: 300.00,
        status: 'paid',
        createdAt: '2024-01-05T16:30:00Z',
        paidAt: '2024-01-12T10:15:00Z'
      },
      {
        id: 'payment_7',
        missionTitle: 'Test Produit Tech',
        clipperId: 'clipper_7',
        clipperPseudo: 'GadgetFan',
        views: 9500,
        amount: 237.50,
        status: 'processing',
        createdAt: '2024-01-19T13:20:00Z'
      }
    ]
    
    // Mock revenue stats
    const mockStats: RevenueStats = {
      totalCost: 3500.00,
      monthlySpend: 1875.00,
      pendingPayments: 700.00,
      totalClippers: 15,
      averageCostPerView: 0.025,
      thisMonthSpend: 1875.00,
      lastMonthSpend: 1625.00,
      growthRate: 15.4
    }
    
    setPayments(mockPayments)
    setRevenueStats(mockStats)
    setIsLoading(false)
  }

  const loadRevenueData = async () => {
    if (!user?.id) return
    
    try {
      // Utiliser la fonction RPC pour récupérer les statistiques wallet
      const { data: walletStats, error: walletError } = await supabase
        .rpc('get_user_wallet_stats', { p_user_id: user.id })

      if (walletError) {
        console.error('Erreur chargement wallet stats:', walletError)
      }

      // Charger les missions du créateur avec leurs submissions
      const { data: missions, error } = await supabase
        .from('missions')
        .select(`
          *,
          submissions(
            id,
            views,
            user_id,
            created_at,
            profiles!inner(pseudo)
          )
        `)
        .eq('creator_id', user.id)

      if (error) {
        console.error('Erreur chargement données paiements:', error)
        return
      }

      if (missions) {
        calculatePayments(missions)
        calculateRevenueStats(missions, walletStats?.[0])
      }
    } catch (error) {
      console.error('Erreur chargement données paiements:', error)
      // En cas d'erreur, utiliser les données mock
      await loadMockRevenueData()
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePayments = (missions: any[]) => {
    const paymentsList: PaymentRecord[] = []

    missions.forEach(mission => {
      if (mission.submissions && mission.submissions.length > 0) {
        mission.submissions.forEach((submission: any) => {
          const views = submission.views || 0
          const amount = (views / 1000) * mission.price_per_1k_views
          const submissionDate = new Date(submission.created_at)
          
          // Simuler différents statuts de paiement
          let status: 'pending' | 'processing' | 'paid' | 'cancelled' = 'paid'
          let paidAt = undefined

          const daysSinceSubmission = Math.floor((Date.now() - submissionDate.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysSinceSubmission <= 3) {
            status = 'pending'
          } else if (daysSinceSubmission <= 7) {
            status = 'processing'
          } else {
            status = 'paid'
            paidAt = new Date(submissionDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }

          paymentsList.push({
            id: `payment_${submission.id}`,
            missionTitle: mission.title,
            clipperId: submission.user_id,
            clipperPseudo: submission.profiles?.pseudo || 'Clippeur',
            views,
            amount,
            status,
            createdAt: submission.created_at,
            paidAt
          })
        })
      }
    })

    // Trier par date de création décroissante
    paymentsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setPayments(paymentsList)
  }

  const calculateRevenueStats = (missions: any[], walletData?: any) => {
    let totalCost = 0
    let thisMonthSpend = 0
    let lastMonthSpend = 0
    let pendingPayments = 0
    let totalViews = 0

    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear

    const uniqueClippers = new Set()

    missions.forEach(mission => {
      if (mission.submissions && mission.submissions.length > 0) {
        mission.submissions.forEach((submission: any) => {
          const views = submission.views || 0
          const amount = (views / 1000) * mission.price_per_1k_views
          const submissionDate = new Date(submission.created_at)

          totalCost += amount
          totalViews += views
          uniqueClippers.add(submission.user_id)

          // Calculer les dépenses par mois
          if (submissionDate.getMonth() === thisMonth && submissionDate.getFullYear() === thisYear) {
            thisMonthSpend += amount
          }

          if (submissionDate.getMonth() === lastMonth && submissionDate.getFullYear() === lastMonthYear) {
            lastMonthSpend += amount
          }

          // Compter les paiements en attente (soumissions récentes)
          const daysSinceSubmission = Math.floor((Date.now() - submissionDate.getTime()) / (1000 * 60 * 60 * 24))
          if (daysSinceSubmission <= 7) {
            pendingPayments += amount
          }
        })
      }
    })

    const growthRate = lastMonthSpend > 0 ? ((thisMonthSpend - lastMonthSpend) / lastMonthSpend) * 100 : 0
    const averageCostPerView = totalViews > 0 ? totalCost / totalViews : 0

    setRevenueStats({
      totalCost,
      monthlySpend: thisMonthSpend,
      pendingPayments,
      totalClippers: uniqueClippers.size,
      averageCostPerView,
      thisMonthSpend,
      lastMonthSpend,
      growthRate
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-600'
      case 'processing':
        return 'bg-blue-100 text-blue-600'
      case 'pending':
        return 'bg-yellow-100 text-yellow-600'
      case 'cancelled':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <IconCheck className="w-4 h-4" />
      case 'processing':
        return <IconClock className="w-4 h-4" />
      case 'pending':
        return <IconAlertCircle className="w-4 h-4" />
      case 'cancelled':
        return <IconAlertCircle className="w-4 h-4" />
      default:
        return <IconClock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payé'
      case 'processing':
        return 'En cours'
      case 'pending':
        return 'En attente'
      case 'cancelled':
        return 'Annulé'
      default:
        return status
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const filteredPayments = payments.filter(payment => {
    if (selectedFilter === 'all') return true
    return payment.status === selectedFilter
  })

  const handleLogout = async () => {
    // await supabase.auth.signOut()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des paiements...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    // <RoleProtectionOptimized allowedRoles={['creator']}>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
            <p className="text-gray-600">Suivez vos coûts et gérez vos paiements aux clippeurs</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <IconDownload className="w-4 h-4" />
              Exporter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
              <IconCreditCard className="w-4 h-4" />
              Paramètres de paiement
            </button>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Cost */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <IconCoin className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{revenueStats.totalCost.toFixed(0)}€</p>
              <p className="text-sm text-gray-600">Coût total</p>
            </div>
          </div>

          {/* Monthly Spend */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <IconCalendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1">
                {revenueStats.growthRate > 0 ? (
                  <IconTrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <IconTrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                )}
                <span className={`text-sm font-medium ${revenueStats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(revenueStats.growthRate).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{revenueStats.monthlySpend.toFixed(0)}€</p>
              <p className="text-sm text-gray-600">Ce mois-ci</p>
            </div>
          </div>

          {/* Pending Payments */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <IconClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{revenueStats.pendingPayments.toFixed(0)}€</p>
              <p className="text-sm text-gray-600">En attente</p>
            </div>
          </div>

          {/* Active Clippers */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <IconUsers className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{revenueStats.totalClippers}</p>
              <p className="text-sm text-gray-600">Clippeurs payés</p>
            </div>
          </div>
        </div>

        {/* Payment Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedFilter === 'all' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tous ({payments.length})
            </button>
            <button 
              onClick={() => setSelectedFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedFilter === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              En attente ({payments.filter(p => p.status === 'pending').length})
            </button>
            <button 
              onClick={() => setSelectedFilter('processing')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedFilter === 'processing' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              En cours ({payments.filter(p => p.status === 'processing').length})
            </button>
            <button 
              onClick={() => setSelectedFilter('paid')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedFilter === 'paid' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Payés ({payments.filter(p => p.status === 'paid').length})
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {filteredPayments.length} paiement{filteredPayments.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Clippeur</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Mission</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Vues</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Montant</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Date soumission</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Date paiement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {payment.clipperPseudo.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{payment.clipperPseudo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{payment.missionTitle}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{formatNumber(payment.views)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-green-600">{payment.amount.toFixed(0)}€</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {getStatusText(payment.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500">{formatDate(payment.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500">{payment.paidAt ? formatDate(payment.paidAt) : '-'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    // </RoleProtectionOptimized>
  )
} export const dynamic = "force-dynamic"
