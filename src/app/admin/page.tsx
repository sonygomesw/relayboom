'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthContext'
import { 
  IconUsers, 
  IconTarget, 
  IconCoin, 
  IconEye, 
  IconTrendingUp, 
  IconClock, 
  IconCheck, 
  IconX, 
  IconLogout,
  IconChartBar,
  IconVideo,
  IconAlertCircle,
  IconDashboard,
  IconShield,
  IconSettings
} from '@tabler/icons-react'
import AdminSidebar from '@/components/AdminSidebar'

interface AdminStats {
  totalUsers: number
  totalMissions: number
  totalSubmissions: number
  totalEarnings: number
  pendingValidations: number
  totalClippers: number
  totalCreators: number
  totalViews: number
}

export default function AdminDashboard() {
  const { user, profile } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalMissions: 0,
    totalSubmissions: 0,
    totalEarnings: 0,
    pendingValidations: 0,
    totalClippers: 0,
    totalCreators: 0,
    totalViews: 0
  })

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      // Charger les stats de base
      const [
        { data: profiles },
        { data: missions },
        { data: submissions },
        { data: clipSubmissions }
      ] = await Promise.all([
        supabase.from('profiles').select('role'),
        supabase.from('missions').select('id'),
        supabase.from('submissions').select('views_count'),
        supabase.from('clip_submissions').select('status, palier')
      ])

      const totalClippers = profiles?.filter((p: any) => p.role === 'clipper').length || 0
      const totalCreators = profiles?.filter((p: any) => p.role === 'creator').length || 0
      const totalUsers = profiles?.length || 0
      const totalMissions = missions?.length || 0
      const totalSubmissions = submissions?.length || 0
      const totalViews = submissions?.reduce((sum: number, s: any) => sum + (s.views_count || 0), 0) || 0
      const pendingValidations = clipSubmissions?.filter((cs: any) => cs.status === 'pending').length || 0
      const totalEarnings = (clipSubmissions?.filter((cs: any) => cs.status === 'approved') || []).length * 50

      setStats({
        totalUsers,
        totalMissions,
        totalSubmissions,
        totalEarnings,
        pendingValidations,
        totalClippers,
        totalCreators,
        totalViews
      })
    } catch (error) {
      console.error('Erreur chargement données admin:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toString()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard admin...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">🔧 Dashboard Admin (Debug)</h1>
                <p className="text-gray-600">Vue d'ensemble de votre plateforme ClipTokk</p>
                <div className="mt-2 text-sm space-y-1">
                  <p><strong>User:</strong> {user ? '✅ Connecté' : '❌ Non connecté'}</p>
                  <p><strong>Profile:</strong> {profile ? '✅ Existe' : '❌ Inexistant'}</p>
                  <p><strong>Role:</strong> <span className="font-bold">{profile?.role || 'N/A'}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Connecté en tant qu'admin (bypass)</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <IconLogout className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          </header>

          <main className="p-8">
            {/* KPIs Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Users */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Utilisateurs totaux</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                      <IconUsers className="w-3 h-3" />
                      {stats.totalCreators} créateurs • {stats.totalClippers} clippeurs
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <IconUsers className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Total Missions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Missions actives</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalMissions}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <IconTrendingUp className="w-3 h-3" />
                      {stats.totalSubmissions} soumissions
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <IconTarget className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Total Views */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Vues totales</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
                    <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                      <IconEye className="w-3 h-3" />
                      Toutes plateformes
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <IconEye className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Total Earnings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Gains validés</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalEarnings}€</p>
                    <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                      <IconCoin className="w-3 h-3" />
                      {stats.pendingValidations} en attente
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <IconCoin className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Alert pour validations en attente */}
            {stats.pendingValidations > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <IconShield className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-900">
                      🚨 {stats.pendingValidations} validation(s) en attente
                    </h3>
                    <p className="text-red-700">
                      Des clippeurs attendent la validation de leurs paliers. Cela impacte leurs revenus.
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

            {/* Actions rapides */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">🚀 Actions rapides</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a
                  href="/admin/users"
                  className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IconUsers className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Gérer utilisateurs</span>
                </a>

                <a
                  href="/admin/missions"
                  className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <IconTarget className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Gérer missions</span>
                </a>

                <a
                  href="/admin/paliers"
                  className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <IconShield className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Valider paliers</span>
                </a>

                <a
                  href="/admin/analytics"
                  className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <IconChartBar className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Analytics</span>
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RoleProtectionOptimized>
  )
} 