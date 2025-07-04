'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getMissionsWithStatsOptimized } from '@/lib/supabase-optimized'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthContext'
import { useLanguage } from '@/components/LanguageContext'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { Language } from '@/lib/types/translations'
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
  try {
    const { data: missions, error } = await supabase
      .from('missions')
      .select('*')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur missions:', error)
      return null
    }

    return missions
  } catch (error) {
    console.error('Erreur fetcher missions:', error)
    return null
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export default function MissionsPage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  const { data: missions, error, isLoading } = useSWR(
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
          <p className="text-gray-600">{t('dashboard.common.loadingDashboard', 'dashboard')}</p>
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
        <main className="p-8">
          {/* KPIs Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{t.dashboard.creator.missions.stats.totalMissions}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMissions}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <IconTarget className="w-3 h-3" />
                    {stats.activeMissions} {t.dashboard.creator.missions.stats.active}
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
                  <p className="text-sm text-gray-600 font-medium">{t.dashboard.creator.missions.stats.totalBudget}</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBudget)}</p>
                  <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                    <IconCoin className="w-3 h-3" />
                    {t.dashboard.creator.missions.stats.investment}
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
                  <p className="text-sm text-gray-600 font-medium">{t.dashboard.creator.missions.stats.pending}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingValidations}</p>
                  <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                    <IconClock className="w-3 h-3" />
                    {t.dashboard.creator.missions.stats.pendingValidations}
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
                  <p className="text-sm text-gray-600 font-medium">{t.dashboard.creator.missions.stats.totalViews}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
                  <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                    <IconEye className="w-3 h-3" />
                    {t.dashboard.creator.missions.stats.avgViews}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <IconEye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Liste des missions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t.dashboard.creator.missions.title}</h2>
              <a
                href="/dashboard/creator/nouvelle-mission"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-green-700 transition-colors"
              >
                <IconPlus className="w-4 h-4" />
                {t.dashboard.creator.navigation.newMission}
              </a>
            </div>

            {missions && missions.length > 0 ? (
              <div className="space-y-4">
                {missions.map((mission: Mission) => (
                  <div
                    key={mission.id}
                    className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {mission.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{mission.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <IconCoin className="w-4 h-4" />
                            {mission.price_per_1k_views}{t.dashboard.creator.missions.missionCard.viewsRate}
                          </span>
                          <span className="flex items-center gap-1">
                            <IconEye className="w-4 h-4" />
                            {mission.total_views || 0} {t.dashboard.creator.missions.missionCard.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <IconVideo className="w-4 h-4" />
                            {mission.total_submissions || 0} {t.dashboard.creator.missions.missionCard.clips}
                          </span>
                          <span className="flex items-center gap-1">
                            <IconClock className="w-4 h-4" />
                            {mission.pending_validations || 0} {t.dashboard.creator.missions.missionCard.pending}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title={t.dashboard.creator.missions.missionCard.edit}
                        >
                          <IconEdit className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title={t.dashboard.creator.missions.missionCard.delete}
                        >
                          <IconTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <IconAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t.dashboard.creator.missions.noMissions.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t.dashboard.creator.missions.noMissions.description}
                </p>
                <a
                  href="/dashboard/creator/nouvelle-mission"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-green-700 transition-colors"
                >
                  <IconPlus className="w-5 h-5" />
                  {t.dashboard.creator.missions.noMissions.createButton}
                </a>
              </div>
            )}
          </div>
        </main>
      </div>
    </RoleProtectionOptimized>
  )
} 