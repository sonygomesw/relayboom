'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthContext'
import { supabase } from '@/lib/supabase'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useLanguage } from '@/components/LanguageContext'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { Language } from '@/lib/types/translations'
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
    // Récupérer les statistiques globales
    const { data: stats, error: statsError } = await supabase
      .from('creator_stats')
      .select('*')
      .eq('creator_id', userId)
      .single()

    if (statsError) {
      console.error('Erreur stats:', statsError)
      return null
    }

    // Récupérer les performances des missions
    const { data: performances, error: perfError } = await supabase
      .from('mission_performances')
      .select('*')
      .eq('creator_id', userId)
      .order('total_views', { ascending: false })
      .limit(5)

    if (perfError) {
      console.error('Erreur performances:', perfError)
      return null
    }

    return {
      stats,
      performances
    }
  } catch (error) {
    console.error('Erreur analytics:', error)
    return null
  }
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('fr-FR').format(num)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const { t } = useLanguage()

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
          <p className="text-gray-600">{t('dashboard.common.loadingAnalytics', 'dashboard')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>{t('dashboard.common.error', 'dashboard')}</strong> {error}
        </div>
      </div>
    )
  }

  const { stats, performances } = data || getMockAnalyticsData()

  return (
    <RoleProtectionOptimized allowedRoles={['creator']}>
      <div className="min-h-screen bg-gray-50">
        <main className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">"Texte par défaut"</h1>
            <p className="text-gray-600">
              "Texte par défaut"
            </p>
          </div>

          {/* KPIs Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <IconEye className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Views</p>
                  <p className="text-lg font-semibold text-gray-900">{formatNumber(stats.totalViews)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <IconCoin className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <IconTarget className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Missions</p>
                  <p className="text-lg font-semibold text-gray-900">{formatNumber(stats.totalMissions)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <IconUsers className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Clippers</p>
                  <p className="text-lg font-semibold text-gray-900">{formatNumber(stats.totalClippers)}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RoleProtectionOptimized>
  )
} 