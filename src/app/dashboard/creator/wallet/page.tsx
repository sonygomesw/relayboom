'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthContext'
import { IconWallet, IconArrowUp, IconArrowDown, IconClock, IconCreditCard, IconCheck } from '@tabler/icons-react'
import StripePaymentForm from '@/components/StripePaymentForm'
import { useRouter } from 'next/navigation'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useLanguage } from '@/components/LanguageContext'
import { translations } from '@/lib/translations'
import useSWR from 'swr'
import {
  IconCoin,
  IconBuildingBank,
  IconReceipt,
  IconPlus,
  IconDownload
} from '@tabler/icons-react'

interface WalletStats {
  totalDeposited: number
  availableCredits: number
  reservedCredits: number
  spentCredits: number
  lastRechargeAt: string | null
}

interface Transaction {
  id: string
  type: 'recharge' | 'payment' | 'reserve'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

const fetcher = async (userId: string) => {
  try {
    const { data: wallet, error: walletError } = await supabase
      .from('creator_wallets')
      .select('*')
      .eq('creator_id', userId)
      .single()

    if (walletError) {
      console.error('Erreur wallet:', walletError)
      return null
    }

    const { data: transactions, error: transactionsError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (transactionsError) {
      console.error('Erreur transactions:', transactionsError)
      return null
    }

    return {
      wallet,
      transactions
    }
  } catch (error) {
    console.error('Erreur fetcher wallet:', error)
    return null
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export default function CreatorWallet() {
  const router = useRouter()
  const { user } = useAuth()
  const { language } = useLanguage()
  const t = translations[language].dashboard

  const { data, error, isLoading } = useSWR(
    user?.id ? user.id : null,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true
    }
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t.common.loadingDashboard}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>{t.common.error}</strong> {error}
        </div>
      </div>
    )
  }

  const { wallet, transactions } = data || { 
    wallet: {
      available_credits: 0,
      total_deposited: 0,
      reserved_credits: 0,
      spent_credits: 0
    },
    transactions: []
  }

  return (
    <RoleProtectionOptimized allowedRoles={['creator']}>
      <div className="min-h-screen bg-gray-50">
        <main className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.creator.wallet.title}</h1>
            <p className="text-gray-600">{t.creator.wallet.description}</p>
          </div>

          {/* KPIs Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{t.creator.wallet.stats.availableCredits}</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(wallet.available_credits)}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <IconArrowUp className="w-3 h-3" />
                    {t.creator.wallet.stats.available}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <IconWallet className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{t.creator.wallet.stats.totalDeposited}</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(wallet.total_deposited)}</p>
                  <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                    <IconArrowUp className="w-3 h-3" />
                    {t.creator.wallet.stats.total}
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
                  <p className="text-sm text-gray-600 font-medium">{t.creator.wallet.stats.reservedCredits}</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(wallet.reserved_credits)}</p>
                  <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                    <IconClock className="w-3 h-3" />
                    {t.creator.wallet.stats.reserved}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <IconClock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{t.creator.wallet.stats.spentCredits}</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(wallet.spent_credits)}</p>
                  <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                    <IconArrowDown className="w-3 h-3" />
                    {t.creator.wallet.stats.spent}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <IconReceipt className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.creator.wallet.actions.addFunds}</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/dashboard/creator/wallet/add-funds')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <IconPlus className="w-5 h-5" />
                  {t.creator.wallet.actions.addFundsButton}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.creator.wallet.actions.bankAccount}</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/dashboard/creator/wallet/bank-account')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <IconBuildingBank className="w-5 h-5" />
                  {t.creator.wallet.actions.bankAccountButton}
                </button>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t.creator.wallet.transactions.title}</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <IconDownload className="w-5 h-5" />
              </button>
            </div>

            {transactions && transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction: any) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'deposit'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'deposit' ? (
                          <IconArrowUp className="w-5 h-5" />
                        ) : (
                          <IconArrowDown className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`font-medium ${
                      transaction.type === 'deposit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconReceipt className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t.creator.wallet.transactions.empty.title}
                </h3>
                <p className="text-gray-500">
                  {t.creator.wallet.transactions.empty.description}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </RoleProtectionOptimized>
  )
} 