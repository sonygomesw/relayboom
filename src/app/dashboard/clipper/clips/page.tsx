'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthContext'
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
  IconFilter
} from '@tabler/icons-react'

interface ClipSubmission {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  views_count: number
  created_at: string
  tiktok_url: string
  missions: {
    id: string
    title: string
    price_per_1k_views: number
    profiles: {
      pseudo: string
    }
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
}

export default function ClipperClips() {
  const { user, profile } = useAuth()
  const [clips, setClips] = useState<ClipSubmission[]>([])
  const [filteredClips, setFilteredClips] = useState<ClipSubmission[]>([])
  const [userStats, setUserStats] = useState<ClipperStats>({
    totalSubmissions: 0,
    totalViews: 0,
    totalEarnings: 0,
    pendingSubmissions: 0,
    approvedSubmissions: 0,
    rejectedSubmissions: 0,
    activeMissions: 0,
    avgViewsPerClip: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (user && profile) {
      loadClipperData()
    }
  }, [user, profile])

  useEffect(() => {
    filterClips()
  }, [clips, selectedStatus, searchTerm])

  const loadClipperData = async () => {
    if (!user?.id) {
      setIsLoading(false)
      return
    }
    
    try {
      setIsLoading(true)
      
      // Charger seulement les données essentielles en parallèle
      const [clipsResult, statsResult] = await Promise.all([
        // Clips simplifiés
        supabase
          .from('submissions')
          .select(`
            id,
            status,
            views_count,
            created_at,
            tiktok_url,
            missions!submissions_mission_id_fkey (
              id,
              title,
              price_per_1k_views
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50),
        
        // Stats simplifiées
        supabase
          .from('submissions')
          .select('views_count, status, earnings')
          .eq('user_id', user.id)
      ])

      // Traiter les clips
      if (clipsResult.data) {
        const processedClips = clipsResult.data.map((clip: any) => ({
          ...clip,
          missions: {
            id: clip.missions?.id || '',
            title: clip.missions?.title || 'Mission',
            price_per_1k_views: clip.missions?.price_per_1k_views || 0,
            profiles: { pseudo: 'Créateur' }
          }
        }))
        setClips(processedClips)
      }

      // Traiter les stats
      if (statsResult.data) {
        const totalSubmissions = statsResult.data.length
        const totalViews = statsResult.data.reduce((sum, s) => sum + (s.views_count || 0), 0)
        const pendingSubmissions = statsResult.data.filter(s => s.status === 'pending').length
        const approvedSubmissions = statsResult.data.filter(s => s.status === 'approved').length
        const rejectedSubmissions = statsResult.data.filter(s => s.status === 'rejected').length
        const avgViewsPerClip = totalSubmissions > 0 ? Math.round(totalViews / totalSubmissions) : 0
        const totalEarnings = statsResult.data.reduce((sum, s) => sum + (s.earnings || 0), 0)

        setUserStats({
          totalSubmissions,
          totalViews,
          totalEarnings,
          pendingSubmissions,
          approvedSubmissions,
          rejectedSubmissions,
          activeMissions: 0,
          avgViewsPerClip
        })
      }
    } catch (error) {
      console.error('❌ Erreur chargement données clippeur:', error)
      setClips([])
      setUserStats({
        totalSubmissions: 0,
        totalViews: 0,
        totalEarnings: 0,
        pendingSubmissions: 0,
        approvedSubmissions: 0,
        rejectedSubmissions: 0,
        activeMissions: 0,
        avgViewsPerClip: 0
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterClips = () => {
    let filtered = clips

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(clip => clip.status === selectedStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter(clip =>
        clip.missions?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clip.missions?.profiles?.pseudo?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredClips(filtered)
  }

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos clips...</p>
        </div>
      </div>
    )
  }

  return (
    <RoleProtectionOptimized allowedRoles={['clipper']}>
      <div className="min-h-screen bg-gray-50 flex">
        <ClipperSidebar userStats={{...userStats, nextMilestone: 1000}} profile={profile || undefined} />

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Clips</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.totalSubmissions}</p>
                  </div>
                  <IconVideo className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Vues</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(userStats.totalViews)}</p>
                  </div>
                  <IconEye className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Revenus</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.totalEarnings.toFixed(2)}€</p>
                  </div>
                  <IconCoin className="w-8 h-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">En attente</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.pendingSubmissions}</p>
                  </div>
                  <IconClock className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <IconSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Rechercher par mission ou créateur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedStatus === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'all' ? 'Tous' : getStatusText(status)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Liste des clips */}
            <div className="bg-white rounded-xl border border-gray-200">
              {filteredClips.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredClips.map((clip) => (
                    <div key={clip.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{clip.missions.title}</h3>
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
                              {((clip.views_count / 1000) * clip.missions.price_per_1k_views).toFixed(2)}€
                            </div>
                            <div className="flex items-center gap-1">
                              <IconCalendar className="w-4 h-4" />
                              {new Date(clip.created_at).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {clip.tiktok_url && (
                            <a
                              href={clip.tiktok_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                            >
                              Voir le clip
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <IconVideo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun clip trouvé</h3>
                  <p className="text-gray-600">
                    {selectedStatus === 'all' 
                      ? "Vous n'avez pas encore soumis de clips."
                      : `Aucun clip ${getStatusText(selectedStatus).toLowerCase()} trouvé.`
                    }
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </RoleProtectionOptimized>
  )
} 