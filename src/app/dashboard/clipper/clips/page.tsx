'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthContext'
import { useUltraFastDashboard } from '@/hooks/useOptimizedData'
import ClipperSidebar from '@/components/ClipperSidebar'
import { 
  IconVideo,
  IconEye,
  IconCoin,
  IconCalendar,
  IconSearch,
  IconFilter,
  IconCheck,
  IconX,
  IconClock
} from '@tabler/icons-react'

interface ClipSubmission {
  id: string
  mission_id: string
  status: 'pending' | 'approved' | 'rejected'
  views_count: number
  created_at: string
  tiktok_url?: string
  missions?: {
    title: string
    price_per_1k_views: number
    creator_name: string
  }
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

export default function ClipperClips() {
  const { user, profile } = useAuth()
  const router = useRouter()
  
  // 🚀 NAVIGATION ULTRA-RAPIDE avec cache
  const { userStats, clips, isLoading, error } = useUltraFastDashboard(user?.id || null)
  
  // États pour les filtres
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Calcul des stats ultra-optimisé
  const clipperStats = useMemo((): ClipperStats => {
    const clipsArray = clips || []
    
    if (clipsArray.length === 0) {
      return {
        totalSubmissions: 0,
        totalViews: 0,
        totalEarnings: 0,
        pendingSubmissions: 0,
        approvedSubmissions: 0,
        rejectedSubmissions: 0,
        activeMissions: 0,
        avgViewsPerClip: 0,
        nextMilestone: 1000
      }
    }

    return {
      totalSubmissions: clipsArray.length,
      totalViews: userStats?.total_views || 0,
      totalEarnings: userStats?.total_earnings || 0,
      pendingSubmissions: clipsArray.filter((c: ClipSubmission) => c.status === 'pending').length,
      approvedSubmissions: clipsArray.filter((c: ClipSubmission) => c.status === 'approved').length,
      rejectedSubmissions: clipsArray.filter((c: ClipSubmission) => c.status === 'rejected').length,
      activeMissions: 0,
      avgViewsPerClip: clipsArray.length > 0 ? Math.round((userStats?.total_views || 0) / clipsArray.length) : 0,
      nextMilestone: 1000
    }
  }, [clips, userStats])

  // Filtrage des clips ultra-optimisé
  const filteredClips = useMemo(() => {
    const clipsArray = clips || []
    let filtered = clipsArray

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((clip: ClipSubmission) => clip.status === selectedStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter((clip: ClipSubmission) =>
        clip.mission_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clip.missions?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clip.missions?.creator_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [clips, selectedStatus, searchTerm])

  // Fonctions utilitaires
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <IconCheck className="w-4 h-4" />
      case 'pending': return <IconClock className="w-4 h-4" />
      case 'rejected': return <IconX className="w-4 h-4" />
      default: return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé'
      case 'pending': return 'En attente'
      case 'rejected': return 'Rejeté'
      default: return status
    }
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-FR')
  }

  // Loading ultra-court
  if (isLoading) {
    return (
      <RoleProtectionOptimized allowedRoles={['clipper']}>
        <div className="min-h-screen bg-gray-50 flex">
          <ClipperSidebar 
            userStats={{ ...clipperStats, nextMilestone: 1000 }} 
            profile={profile || undefined} 
          />
          <div className="flex-1 ml-96 p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </RoleProtectionOptimized>
    )
  }

  // Affichage de l'erreur
  if (error && !clips?.length) {
    return (
      <RoleProtectionOptimized allowedRoles={['clipper']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconVideo className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </RoleProtectionOptimized>
    )
  }

  return (
    <RoleProtectionOptimized allowedRoles={['clipper']}>
      <div className="min-h-screen bg-gray-50 flex">
        <ClipperSidebar 
          userStats={{ ...clipperStats, nextMilestone: 1000 }} 
          profile={profile || undefined} 
        />

        <div className="flex-1 ml-96">
          <main className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <IconVideo className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Mes Clips</h1>
                  <p className="text-gray-600">Suivez vos soumissions et leurs performances</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <IconVideo className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {clipperStats.totalSubmissions}
                    </div>
                    <div className="text-sm text-gray-600">Total clips</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <IconCheck className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {clipperStats.approvedSubmissions}
                    </div>
                    <div className="text-sm text-gray-600">Approuvés</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <IconClock className="w-8 h-8 text-yellow-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {clipperStats.pendingSubmissions}
                    </div>
                    <div className="text-sm text-gray-600">En attente</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <IconEye className="w-8 h-8 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(clipperStats.avgViewsPerClip)}
                    </div>
                    <div className="text-sm text-gray-600">Vues/clip moyen</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Recherche */}
                <div className="flex-1">
                  <div className="relative">
                    <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par mission ou créateur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filtre de statut */}
                <div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="approved">Approuvés</option>
                    <option value="rejected">Rejetés</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Liste des clips */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {filteredClips.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredClips.map((clip: ClipSubmission) => (
                    <div key={clip.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {clip.missions?.title || `Mission ${clip.mission_id.slice(0, 8)}...`}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(clip.status)}`}>
                              {getStatusIcon(clip.status)}
                              {getStatusText(clip.status)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <IconEye className="w-4 h-4" />
                              {formatNumber(clip.views_count)} vues
                            </div>
                            <div className="flex items-center gap-1">
                              <IconCoin className="w-4 h-4" />
                              {((clip.views_count / 1000) * (clip.missions?.price_per_1k_views || 0)).toFixed(2)}€
                            </div>
                            <div className="flex items-center gap-1">
                              <IconCalendar className="w-4 h-4" />
                              {new Date(clip.created_at).toLocaleDateString('fr-FR')}
                            </div>
                            {clip.tiktok_url && (
                              <a 
                                href={clip.tiktok_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline font-medium"
                              >
                                Voir le clip
                              </a>
                            )}
                          </div>
                          
                          {clip.missions?.creator_name && (
                            <div className="mt-2 text-sm text-gray-500">
                              Créateur: <span className="font-medium">{clip.missions.creator_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconVideo className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun clip trouvé</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || selectedStatus !== 'all' 
                      ? 'Aucun clip ne correspond à vos critères de recherche.'
                      : 'Vous n\'avez pas encore soumis de clips.'}
                  </p>
                  {(searchTerm || selectedStatus !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedStatus('all')
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </RoleProtectionOptimized>
  )
} 