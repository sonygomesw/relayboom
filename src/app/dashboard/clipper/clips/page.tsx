'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/components/AuthContext'
import { usePreloadedData, useSmartPreload, useCacheOptimization } from '@/hooks/usePreloadedData'
import { ClipsSkeleton } from '@/components/SkeletonLoader'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import ClipperSidebar from '@/components/ClipperSidebar'
import { 
  IconEye,
  IconCoin,
  IconClock,
  IconCheck,
  IconX,
  IconVideo,
  IconCalendar,
  IconTrendingUp,
  IconSearch,
  IconFilter,
  IconBolt
} from '@tabler/icons-react'

interface ClipSubmission {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  views_count: number
  created_at: string
  tiktok_url: string
  mission_id: string
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
}

export default function ClipperClips() {
  const { user, profile } = useAuth()
  
  // Hook de préchargement ultra-performant
  const { userStats, clips, isLoading, error } = usePreloadedData(user?.id)
  
  // Préchargement intelligent
  useSmartPreload(user?.id)
  
  // Optimisation du cache
  useCacheOptimization()
  
  // États pour les filtres
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Calcul des stats optimisé
  const clipperStats = useMemo((): ClipperStats => {
    if (!clips || clips.length === 0) {
      return {
        totalSubmissions: 0,
        totalViews: 0,
        totalEarnings: 0,
        pendingSubmissions: 0,
        approvedSubmissions: 0,
        rejectedSubmissions: 0,
        activeMissions: 0,
        avgViewsPerClip: 0
      }
    }

    return {
      totalSubmissions: clips.length,
      totalViews: userStats?.total_views || 0,
      totalEarnings: userStats?.total_earnings || 0,
      pendingSubmissions: clips.filter((c: ClipSubmission) => c.status === 'pending').length,
      approvedSubmissions: clips.filter((c: ClipSubmission) => c.status === 'approved').length,
      rejectedSubmissions: clips.filter((c: ClipSubmission) => c.status === 'rejected').length,
      activeMissions: 0,
      avgViewsPerClip: clips.length > 0 ? Math.round((userStats?.total_views || 0) / clips.length) : 0
    }
  }, [clips, userStats])

  // Filtrage des clips optimisé
  const filteredClips = useMemo(() => {
    if (!clips) return []
    
    let filtered = clips

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((clip: ClipSubmission) => clip.status === selectedStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter((clip: ClipSubmission) =>
        clip.mission_id?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [clips, selectedStatus, searchTerm])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toString()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <IconCheck className="w-4 h-4 text-green-600" />
      case 'rejected':
        return <IconX className="w-4 h-4 text-red-600" />
      default:
        return <IconClock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé'
      case 'rejected':
        return 'Rejeté'
      default:
        return 'En attente'
    }
  }

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return (
      <RoleProtectionOptimized allowedRoles={['clipper']}>
        <ClipsSkeleton />
      </RoleProtectionOptimized>
    )
  }

  // Afficher l'erreur si nécessaire
  if (error) {
    return (
      <RoleProtectionOptimized allowedRoles={['clipper']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconBolt className="w-8 h-8 text-red-600" />
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
          userStats={{...clipperStats, nextMilestone: 1000}} 
          profile={profile || { pseudo: '', email: '', role: '' }} 
        />

        <div className="flex-1 ml-96">
          <main className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Clips</p>
                    <p className="text-2xl font-bold text-gray-900">{clipperStats.totalSubmissions}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <IconVideo className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Vues</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(clipperStats.totalViews)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <IconEye className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Revenus</p>
                    <p className="text-2xl font-bold text-gray-900">{clipperStats.totalEarnings.toFixed(2)}€</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <IconCoin className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">En attente</p>
                    <p className="text-2xl font-bold text-gray-900">{clipperStats.pendingSubmissions}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <IconClock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <IconSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Rechercher par mission..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="approved">Approuvés</option>
                    <option value="rejected">Rejetés</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Clips List */}
            <div className="bg-white rounded-xl border border-gray-200">
              {filteredClips.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredClips.map((clip: ClipSubmission) => (
                    <div key={clip.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">Mission {clip.mission_id.slice(0, 8)}...</h3>
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
                              <IconCalendar className="w-4 h-4" />
                              {new Date(clip.created_at).toLocaleDateString('fr-FR')}
                            </div>
                            {clip.tiktok_url && (
                              <a 
                                href={clip.tiktok_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                Voir le clip
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconVideo className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun clip trouvé</h3>
                  <p className="text-gray-600">Commencez par soumettre votre premier clip !</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </RoleProtectionOptimized>
  )
} 