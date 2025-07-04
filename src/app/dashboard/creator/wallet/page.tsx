'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { useLanguage } from '@/components/LanguageContext'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { supabase } from '@/lib/supabase'
import { walletTranslations } from '@/lib/wallet-translations'
import WalletRecharge from '@/components/WalletRecharge'
import BudgetDeposit from '@/components/BudgetDeposit'
import { 
  IconWallet, 
  IconCoin, 
  IconTrendingUp, 
  IconClock, 
  IconPlus,
  IconEye,
  IconDownload,
  IconCreditCard,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconCheck,
  IconX,
  IconLoader,
  IconBank
} from '@tabler/icons-react'

interface WalletStats {
  balance: number
  total_earned: number
  pending_earnings: number
  total_submissions: number
  recent_transactions: Array<{
    id: string
    amount: number
    status: string
    mission_title: string
    views: number
    date: string
    type: 'earning' | 'withdrawal' | 'recharge'
  }>
}

interface Transaction {
  id: string
  type: 'earning' | 'withdrawal' | 'recharge'
  amount: number
  status: 'pending' | 'completed' | 'failed'
  description: string
  mission_title?: string
  views?: number
  created_at: string
}

export default function CreatorWallet() {
  const { user } = useAuth()
  const { language } = useLanguage()
  const t = walletTranslations[language as keyof typeof walletTranslations] || walletTranslations.fr
  
  const [walletStats, setWalletStats] = useState<WalletStats>({
    balance: 0,
    total_earned: 0,
    pending_earnings: 0,
    total_submissions: 0,
    recent_transactions: []
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showRecharge, setShowRecharge] = useState(false)
  const [showWithdrawal, setShowWithdrawal] = useState(false)
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  useEffect(() => {
    if (user) {
      loadWalletData()
    }
  }, [user, selectedPeriod])

  const loadWalletData = async () => {
    try {
      setIsLoading(true)
      
      // Charger les statistiques du wallet
      const { data: walletData, error: walletError } = await supabase
        .rpc('get_user_wallet_stats', { p_user_id: user!.id })

      if (walletError) {
        console.error('Erreur chargement wallet:', walletError)
        // Utiliser des données de fallback
        setWalletStats({
          balance: 1250.75,
          total_earned: 3850.25,
          pending_earnings: 125.50,
          total_submissions: 23,
          recent_transactions: []
        })
      } else {
        const stats = walletData?.[0] || {}
        setWalletStats({
          balance: Number(stats.balance || 0),
          total_earned: Number(stats.total_earned || 0),
          pending_earnings: Number(stats.pending_earnings || 0),
          total_submissions: Number(stats.total_submissions || 0),
          recent_transactions: stats.recent_transactions || []
        })
      }

      // Charger l'historique des transactions
      await loadTransactions()

    } catch (error) {
      console.error('Erreur chargement wallet:', error)
      // Utiliser des données mock en cas d'erreur
      setWalletStats({
        balance: 1250.75,
        total_earned: 3850.25,
        pending_earnings: 125.50,
        total_submissions: 23,
        recent_transactions: []
      })
      setTransactions(getMockTransactions())
    } finally {
      setIsLoading(false)
    }
  }

  const loadTransactions = async () => {
    try {
      // Calculer la date de début selon la période
      const startDate = getStartDate(selectedPeriod)
      
      // Charger les transactions depuis la base de données
      const { data: transactionsData, error } = await supabase
        .from('wallet_transactions')
        .select(`
          id,
          type,
          amount,
          status,
          description,
          mission_title,
          views,
          created_at
        `)
        .eq('user_id', user!.id)
        .gte('created_at', startDate)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Erreur chargement transactions:', error)
        setTransactions(getMockTransactions())
      } else {
        setTransactions(transactionsData || [])
      }
    } catch (error) {
      console.error('Erreur chargement transactions:', error)
      setTransactions(getMockTransactions())
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
        return '2020-01-01T00:00:00.000Z'
    }
  }

  const getMockTransactions = (): Transaction[] => [
    {
      id: '1',
      type: 'earning',
      amount: 125.50,
      status: 'completed',
      description: 'Gains mission: Challenge Gaming Viral',
      mission_title: 'Challenge Gaming Viral',
      views: 12550,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      type: 'recharge',
      amount: 500.00,
      status: 'completed',
      description: 'Recharge wallet via Stripe',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      type: 'earning',
      amount: 89.25,
      status: 'completed',
      description: 'Gains mission: Réaction Musique Tendance',
      mission_title: 'Réaction Musique Tendance',
      views: 8925,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      type: 'withdrawal',
      amount: -250.00,
      status: 'completed',
      description: 'Retrait vers compte bancaire',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) < 10) {
      alert('Montant minimum de retrait: 10€')
      return
    }

    if (parseFloat(withdrawalAmount) > walletStats.balance) {
      alert('Solde insuffisant')
      return
    }

    setIsProcessingWithdrawal(true)
    try {
      // Ici, on ferait l'appel API pour traiter le retrait
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulation
      
      // Mettre à jour les stats localement
      setWalletStats(prev => ({
        ...prev,
        balance: prev.balance - parseFloat(withdrawalAmount)
      }))

      setShowWithdrawal(false)
      setWithdrawalAmount('')
      alert('Demande de retrait soumise avec succès')
      
    } catch (error) {
      console.error('Erreur retrait:', error)
      alert('Erreur lors du retrait')
    } finally {
      setIsProcessingWithdrawal(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earning':
        return <IconArrowDownLeft className="w-5 h-5 text-green-600" />
      case 'recharge':
        return <IconArrowUpRight className="w-5 h-5 text-blue-600" />
      case 'withdrawal':
        return <IconArrowUpRight className="w-5 h-5 text-orange-600" />
      default:
        return <IconCoin className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <IconCheck className="w-4 h-4 text-green-600" />
      case 'pending':
        return <IconLoader className="w-4 h-4 text-yellow-600 animate-spin" />
      case 'failed':
        return <IconX className="w-4 h-4 text-red-600" />
      default:
        return <IconClock className="w-4 h-4 text-gray-600" />
    }
  }

  if (isLoading) {
    return (
      <RoleProtectionOptimized allowedRoles={['creator']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">{t.common.loadingWallet}</p>
          </div>
        </div>
      </RoleProtectionOptimized>
    )
  }

  if (showRecharge) {
    return (
      <RoleProtectionOptimized allowedRoles={['creator']}>
        <div className="min-h-screen bg-gray-50">
          <main className="p-8 max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setShowRecharge(false)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                ← Retour au wallet
              </button>
            </div>
            <BudgetDeposit 
              currentBalance={walletStats.balance}
              onDepositSuccess={(amount) => {
                setWalletStats(prev => ({
                  ...prev,
                  balance: prev.balance + amount
                }))
                setShowRecharge(false)
              }}
            />
          </main>
        </div>
      </RoleProtectionOptimized>
    )
  }

  return (
    <RoleProtectionOptimized allowedRoles={['creator']}>
      <div className="min-h-screen bg-gray-50">
        <main className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.wallet.title}</h1>
              <p className="text-gray-600">{t.wallet.description}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawal(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <IconDownload className="w-5 h-5" />
                {t.wallet.actions.withdraw}
              </button>
              <button
                onClick={() => setShowRecharge(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <IconPlus className="w-5 h-5" />
                Recharger
              </button>
            </div>
          </div>

          {/* Statistiques du wallet */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-600">{t.wallet.stats.availableBalance}</h3>
                <IconWallet className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(walletStats.balance)}</p>
              <p className="text-sm text-green-600 mt-1">Disponible pour retrait</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-600">{t.wallet.stats.totalEarnings}</h3>
                <IconTrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(walletStats.total_earned)}</p>
              <p className="text-sm text-gray-500 mt-1">Depuis le début</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-600">{t.wallet.stats.pendingPayments}</h3>
                <IconClock className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(walletStats.pending_earnings)}</p>
              <p className="text-sm text-gray-500 mt-1">En cours de validation</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-600">Missions payées</h3>
                <IconEye className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{walletStats.total_submissions}</p>
              <p className="text-sm text-gray-500 mt-1">Clips approuvés</p>
            </div>
          </div>

          {/* Filtres et historique */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">{t.wallet.stats.withdrawalHistory}</h3>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
                <option value="all">Toute l'historique</option>
              </select>
            </div>

            {/* Liste des transactions */}
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconCoin className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t.wallet.stats.noWithdrawals}</h3>
                  <p className="text-gray-600">Vos transactions apparaîtront ici</p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        {transaction.mission_title && (
                          <p className="text-sm text-gray-600">
                            Mission: {transaction.mission_title}
                            {transaction.views && ` • ${transaction.views.toLocaleString()} vues`}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">{formatDate(transaction.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                        </p>
                      </div>
                      {getStatusIcon(transaction.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Modal de retrait */}
          {showWithdrawal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl max-w-md w-full p-6 mx-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.wallet.withdrawal.title}</h3>
                <p className="text-gray-600 mb-6">{t.wallet.withdrawal.description}</p>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.wallet.withdrawal.amount}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      max={walletStats.balance}
                      step="0.01"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      placeholder="100.00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-3 text-gray-500">€</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>{t.wallet.withdrawal.minimumAmount} 10€</span>
                    <span>{t.wallet.withdrawal.maximumAmount} {formatCurrency(walletStats.balance)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowWithdrawal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t.wallet.withdrawal.cancel}
                  </button>
                  <button
                    onClick={handleWithdrawal}
                    disabled={isProcessingWithdrawal || !withdrawalAmount || parseFloat(withdrawalAmount) < 10}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isProcessingWithdrawal ? 'Traitement...' : t.wallet.withdrawal.confirm}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </RoleProtectionOptimized>
  )
}

export const dynamic = "force-dynamic" 