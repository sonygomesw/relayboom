'use client'

import { useAuth } from '@/components/AuthContext'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useDashboardDataParallel } from '@/hooks/useOptimizedData'
import { useMemo } from 'react'
import { useLanguage } from '@/components/LanguageContext'
import { translations } from '@/lib/translations'

export default function CreatorDashboard() {
  // Récupérer l'utilisateur connecté
  const { user, profile } = useAuth()
  const { language } = useLanguage()
  const t = translations[language].dashboard
  
  // Pas de fallback - utiliser uniquement l'ID de l'utilisateur connecté
  const userId = user?.id || null
  
  // 🚀 NOUVEAU : Utiliser le hook mega-optimisé qui charge tout en parallèle avec cache
  const { userStats, missions, isLoading, error } = useDashboardDataParallel(userId)

  // 🚀 Mémoïser les calculs pour éviter les re-calculs
  const stats = useMemo(() => {
    const totalViews = userStats?.total_views || 0
    const totalEarnings = userStats?.total_earnings || 0
    const totalMissions = missions?.length || 0
    const pendingValidations = userStats?.pending_submissions || 0
    
    return {
      totalViews,
      totalEarnings,
      totalMissions,
      pendingValidations
    }
  }, [userStats, missions])

  // Debug logs - seulement si nécessaire
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Dashboard Debug (optimisé):', {
      userId,
      userLoaded: !!user,
      profileLoaded: !!profile,
      statsLoaded: !!userStats,
      missionsCount: missions?.length || 0,
      isLoading,
      error
    })
  }

  // Si pas d'utilisateur connecté, afficher un message
  if (!user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.common.loginRequired}</h2>
        <p className="text-gray-600">{t.common.loginMessage}</p>
      </div>
    )
  }

  // Si utilisateur connecté mais pas de profil, rediriger vers l'onboarding
  if (user && !profile) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.common.profileSetup}</h2>
        <p className="text-gray-600 mb-4">{t.common.profileMessage}</p>
        <a 
          href="/onboarding/role" 
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          {t.common.setupProfile}
        </a>
      </div>
    )
  }

  // 🚀 Loading optimisé avec skeleton plus rapide
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
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

  return (
    <RoleProtectionOptimized allowedRoles={['creator']}>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.creator.title}
          </h1>
          <p className="text-gray-600">
            {t.creator.welcome} {profile?.pseudo || 'Créateur'} ! {t.creator.overview}
          </p>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{t.creator.stats.totalViews}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">
              +{userStats?.avg_views?.toFixed(0) || 0} {t.creator.stats.avgViews}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{t.creator.stats.totalRevenue}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalEarnings.toFixed(2)}€
                </p>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">
              +{userStats?.approved_submissions || 0} {t.creator.stats.paidMissions}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{t.creator.stats.activeMissions}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMissions}</p>
              </div>
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              {t.creator.stats.createdMissions}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{t.creator.stats.pending}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingValidations}</p>
              </div>
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-orange-600 mt-2">
              {t.creator.stats.pendingValidations}
            </p>
          </div>
        </div>

        {/* Missions récentes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Vos missions récentes</h2>
          </div>
          <div className="overflow-hidden">
            {missions && missions.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {missions.slice(0, 5).map((mission) => (
                  <div key={mission.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <img 
                            src={mission.creator_thumbnail} 
                            alt={mission.creator_name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {mission.title}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {mission.creator_name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {mission.price_per_1k_views}€/1k vues
                        </p>
                        <p className="text-xs text-gray-500">
                          {mission.total_submissions} soumissions
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune mission</h3>
                <p className="mt-1 text-sm text-gray-500">Commencez par créer votre première mission.</p>
                <div className="mt-6">
                  <a
                    href="/dashboard/creator/nouvelle-mission"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Créer une mission
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleProtectionOptimized>
  )
} 