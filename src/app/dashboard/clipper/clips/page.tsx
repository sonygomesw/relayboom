'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthContext'
import ClipperSidebar from '@/components/ClipperSidebar'
import { useLanguage } from '@/components/LanguageContext'
import { clipperTranslations } from '@/lib/clipper-translations'
import { 
  IconVideo,
  IconEye,
  IconCoin,
  IconClock,
  IconCheck,
  IconX,
  IconExternalLink,
  IconFilter,
  IconSearch,
  IconPlus,
  IconTarget,
  IconTrendingUp
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
  } | null
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
  const { user, profile } = useAuth() // 🚀 Utiliser le contexte optimisé
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
  const [showPalierModal, setShowPalierModal] = useState(false)
  const [selectedClip, setSelectedClip] = useState<ClipSubmission | null>(null)
  const [palierForm, setPalierForm] = useState({
    palier: '',
    views_declared: ''
  })
  const { language } = useLanguage()
  const t = clipperTranslations[language]

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
      console.log('❌ Pas d\'utilisateur connecté')
      setIsLoading(false)
      return
    }

    console.log('🔄 Début chargement données clippeur pour user:', user.id)
    
    try {
      await Promise.all([
        loadClips(),
        loadUserStats()
      ])
      console.log('✅ Chargement terminé avec succès')
    } catch (error) {
      console.error('❌ Erreur chargement données clippeur:', error)
    } finally {
      setIsLoading(false)
      console.log('🏁 setIsLoading(false) appelé')
    }
  }

  const loadClips = async () => {
    if (!user?.id) {
      console.log('⚠️ loadClips: pas d\'user.id')
      return
    }
    
    console.log('🔄 Chargement des clips pour user:', user.id)
    
    try {
      // D'abord récupérer les soumissions avec les missions
      const { data: submissions, error } = await supabase
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
            price_per_1k_views,
            creator_id
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erreur requête submissions:', error)
        throw error
      }

      console.log('✅ Submissions récupérées:', submissions?.length || 0)

      // Ensuite récupérer les profils des créateurs
      const submissionsWithProfiles = await Promise.all(
        (submissions || []).map(async (submission: any) => {
          if (submission.missions?.creator_id) {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('pseudo')
                .eq('id', submission.missions.creator_id)
                .single()
              
              return {
                ...submission,
                missions: {
                  ...submission.missions,
                  profiles: profile
                }
              }
            } catch (profileError) {
              console.error('⚠️ Erreur récupération profil pour submission:', submission.id, profileError)
              return submission // Retourner la submission sans le profil
            }
          }
          return submission
        })
      )

      console.log('✅ Clips avec profils traités:', submissionsWithProfiles.length)
      setClips(submissionsWithProfiles)
    } catch (error) {
      console.error('❌ Erreur chargement clips:', error)
      console.error('📋 Détails de l\'erreur:', JSON.stringify(error, null, 2))
      // En cas d'erreur, définir clips vide pour éviter le chargement infini
      setClips([])
    }
  }

  const loadUserStats = async () => {
    if (!user?.id) {
      console.log('⚠️ loadUserStats: pas d\'user.id')
      return
    }
    
    console.log('🔄 Chargement des stats pour user:', user.id)
    
    try {
      // Charger les soumissions pour calculer les stats
      const { data: submissions, error } = await supabase
        .from('submissions')
        .select(`
          views_count,
          status,
          missions!submissions_mission_id_fkey (
            price_per_1k_views
          )
        `)
        .eq('user_id', user.id)

      if (error) {
        console.error('❌ Erreur requête stats submissions:', error)
        throw error
      }

      // Charger les missions actives
      const { data: activeMissions, error: missionsError } = await supabase
        .from('missions')
        .select('id')
        .eq('status', 'active')

      if (missionsError) {
        console.error('❌ Erreur requête missions actives:', missionsError)
        throw missionsError
      }

      const totalSubmissions = submissions?.length || 0
      const totalViews = submissions?.reduce((sum, s) => sum + (s.views_count || 0), 0) || 0
      const pendingSubmissions = submissions?.filter(s => s.status === 'pending').length || 0
      const approvedSubmissions = submissions?.filter(s => s.status === 'approved').length || 0
      const rejectedSubmissions = submissions?.filter(s => s.status === 'rejected').length || 0
      const avgViewsPerClip = totalSubmissions > 0 ? Math.round(totalViews / totalSubmissions) : 0

      const totalEarnings = submissions
        ?.filter(s => s.status === 'approved')
        .reduce((sum, s) => {
          const price = (s.missions as any)?.price_per_1k_views || 0
          const earnings = (s.views_count || 0) / 1000 * price
          return sum + earnings
        }, 0) || 0

      const stats = {
        totalSubmissions,
        totalViews,
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        pendingSubmissions,
        approvedSubmissions,
        rejectedSubmissions,
        activeMissions: activeMissions?.length || 0,
        avgViewsPerClip
      }

      console.log('✅ Stats calculées:', stats)
      setUserStats(stats)
    } catch (error) {
      console.error('❌ Erreur chargement stats:', error)
      console.error('📋 Détails de l\'erreur:', JSON.stringify(error, null, 2))
      // En cas d'erreur, définir des stats par défaut
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
    }
  }

  const filterClips = () => {
    let filtered = clips

    // Filtrer par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(clip => clip.status === selectedStatus)
    }

    // Filtrer par recherche
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">En attente</span>
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approuvé</span>
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejeté</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inconnu</span>
    }
  }

  const calculateEarnings = (views: number, pricePerK: number) => {
    return (views / 1000) * pricePerK
  }

  const getFilterCounts = () => {
    return {
      all: clips.length,
      pending: clips.filter(c => c.status === 'pending').length,
      approved: clips.filter(c => c.status === 'approved').length,
      rejected: clips.filter(c => c.status === 'rejected').length
    }
  }

  const handlePalierSubmit = async () => {
    if (!selectedClip || !user?.id || !palierForm.palier) {
      alert('Erreur: informations manquantes')
      return
    }

    // Utiliser views_declared ou palier comme fallback
    const viewsToUse = palierForm.views_declared || palierForm.palier
    
    try {
      console.log('🚀 Soumission palier:', {
        clip: selectedClip.id,
        palier: palierForm.palier,
        views: viewsToUse
      })

      const insertData = {
        user_id: user.id,
        mission_id: selectedClip.missions?.id,
        submission_id: selectedClip.id,
        tiktok_link: selectedClip.tiktok_url || '',
        views_declared: parseInt(viewsToUse),
        palier: parseInt(palierForm.palier),
        status: 'pending'
      }

      console.log('📋 Données à insérer:', insertData)

      const { data, error } = await supabase
        .from('clip_submissions')
        .insert(insertData)

      if (error) {
        console.error('❌ Erreur soumission palier complète:', error)
        console.error('❌ Code erreur:', error.code)
        console.error('❌ Message:', error.message)
        console.error('❌ Détails:', error.details)
        alert('Erreur lors de la soumission du palier: ' + error.message)
        return
      }

      console.log('✅ Données insérées:', data)

      console.log('✅ Palier soumis avec succès')
      alert('Palier soumis avec succès ! Il sera validé par un administrateur.')
      
      // Reset et fermer le modal
      setShowPalierModal(false)
      setSelectedClip(null)
      setPalierForm({ palier: '', views_declared: '' })
      
    } catch (error) {
      console.error('❌ Erreur catch palier:', error)
      alert('Erreur lors de la soumission du palier')
    }
  }

  const openPalierModal = (clip: ClipSubmission, palierValue?: number) => {
    setSelectedClip(clip)
    setShowPalierModal(true)
    setPalierForm({ 
      palier: palierValue ? palierValue.toString() : '', 
      views_declared: palierValue ? palierValue.toString() : ''
    })
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

  const filterCounts = getFilterCounts()

  return (
    <RoleProtectionOptimized allowedRoles={['clipper']}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar Clippeur */}
        <ClipperSidebar userStats={{...userStats, nextMilestone: 1000}} profile={profile || undefined} />

        {/* Main Content */}
        <div className="flex-1 ml-96">
          <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mes clips</h1>
                <p className="text-gray-600">Gérez tous vos clips et suivez leur statut</p>
              </div>
              <a
                href="/missions"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <IconPlus className="w-4 h-4" />
                Nouvelles missions
              </a>
            </div>
          </header>

          <main className="p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total clips</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.totalSubmissions}</p>
                    <p className="text-xs text-blue-600">Soumis</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <IconVideo className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Gains totaux</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(userStats.totalEarnings)}</p>
                    <p className="text-xs text-orange-600">Revenus</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <IconCoin className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <IconSearch className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher une mission..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <IconFilter className="w-5 h-5 text-gray-400" />
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">Tous les statuts ({filterCounts.all})</option>
                      <option value="pending">En attente ({filterCounts.pending})</option>
                      <option value="approved">Approuvés ({filterCounts.approved})</option>
                      <option value="rejected">Rejetés ({filterCounts.rejected})</option>
                    </select>
                  </div>
                </div>
                
                <span className="text-sm text-gray-600">
                  {filteredClips.length} clip{filteredClips.length > 1 ? 's' : ''} trouvé{filteredClips.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Clips List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {filteredClips.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconVideo className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {clips.length === 0 ? 'Aucun clip soumis' : 'Aucun clip trouvé'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {clips.length === 0 
                      ? 'Commencez à créer du contenu viral en participant aux missions'
                      : 'Modifiez vos filtres pour voir plus de clips'
                    }
                  </p>
                  {clips.length === 0 ? (
                    <a
                      href="/missions"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Découvrir les missions
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedStatus('all')
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredClips.map((clip) => (
                    <div key={clip.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Header */}
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                              <IconVideo className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {clip.missions?.title || 'Mission inconnue'}
                                </h3>
                                {getStatusBadge(clip.status)}
                              </div>
                              <p className="text-sm text-gray-600">
                                Par {clip.missions?.profiles?.pseudo || 'Créateur inconnu'}
                              </p>
                            </div>
                          </div>

                          {/* Metrics */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Vues générées</p>
                              <p className="text-lg font-bold text-gray-900">
                                {formatNumber(clip.views_count || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Prix par 1K vues</p>
                              <p className="text-lg font-bold text-gray-900">
                                {clip.missions?.price_per_1k_views || 0}€
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Gains potentiels</p>
                              <p className="text-lg font-bold text-green-600">
                                {formatCurrency(calculateEarnings(clip.views_count || 0, clip.missions?.price_per_1k_views || 0))}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Date de soumission</p>
                              <p className="text-lg font-bold text-gray-900">
                                {formatDate(clip.created_at)}
                              </p>
                            </div>
                          </div>

                          {/* Status specific content */}
                          {clip.status === 'approved' && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                              <div className="flex items-center gap-2">
                                <IconCheck className="w-5 h-5 text-green-600" />
                                <p className="text-sm font-medium text-green-800">
                                  Clip approuvé ! Gains confirmés: {formatCurrency(calculateEarnings(clip.views_count || 0, clip.missions?.price_per_1k_views || 0))}
                                </p>
                              </div>
                            </div>
                          )}

                          {clip.status === 'rejected' && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                              <div className="flex items-center gap-2">
                                <IconX className="w-5 h-5 text-red-600" />
                                <p className="text-sm font-medium text-red-800">
                                  Clip rejeté. Vous pouvez tenter une nouvelle soumission.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Section Paliers pour clips pending */}
                          {clip.status === 'pending' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-4">
                              <div className="text-center mb-6">
                                <h4 className="text-lg font-bold text-blue-900 mb-2">
                                  🎯 Déclarez vos paliers de vues atteints
                                </h4>
                                <p className="text-sm text-blue-700">
                                  Cochez les paliers que votre clip a dépassés pour recevoir vos gains
                                </p>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                  { value: 1000, label: '1K', color: 'bg-green-100 border-green-300 text-green-800' },
                                  { value: 5000, label: '5K', color: 'bg-green-200 border-green-400 text-green-900' },
                                  { value: 10000, label: '10K', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
                                  { value: 100000, label: '100K', color: 'bg-orange-100 border-orange-300 text-orange-800' },
                                  { value: 500000, label: '500K', color: 'bg-purple-100 border-purple-300 text-purple-800' },
                                  { value: 1000000, label: '1M', color: 'bg-pink-100 border-pink-300 text-pink-800' },
                                ].map((palier) => (
                                  <button
                                    key={palier.value}
                                    onClick={() => openPalierModal(clip, palier.value)}
                                    className={`${palier.color} border-2 rounded-xl p-4 hover:scale-105 transition-all duration-200 cursor-pointer group`}
                                  >
                                    <div className="text-center">
                                      <div className="text-2xl font-bold mb-1">
                                        {palier.label}
                                      </div>
                                      <div className="text-xs mb-2">vues</div>
                                      <div className="text-sm font-medium">
                                        {formatCurrency(palier.value / 1000 * (clip.missions?.price_per_1k_views || 0))}
                                      </div>
                                      <div className="mt-2 opacity-70 group-hover:opacity-100">
                                        <IconTrendingUp className="w-4 h-4 mx-auto" />
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>

                              <div className="mt-4 text-center">
                                <p className="text-xs text-blue-600">
                                  💡 Cliquez sur un palier dès que votre clip l'atteint
                                </p>
                              </div>
                            </div>
                          )}


                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-6">
                          {clip.tiktok_url && (
                            <a
                              href={clip.tiktok_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50"
                              title="Voir le clip"
                            >
                              <IconExternalLink className="w-5 h-5" />
                            </a>
                          )}
                          <a
                            href={`/mission/${clip.missions?.id}`}
                            className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50"
                            title="Voir la mission"
                          >
                            <IconTarget className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal de déclaration de palier */}
      {showPalierModal && selectedClip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconTrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🎯 Confirmer le palier atteint
              </h2>
              <p className="text-gray-600">
                Vous êtes sur le point de déclarer un palier pour votre clip
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-1">
                {selectedClip.missions?.title}
              </h3>
              <p className="text-sm text-gray-600">
                Prix: {selectedClip.missions?.price_per_1k_views}€ par 1K vues
              </p>
            </div>

            {palierForm.palier && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-center">
                <div className="text-3xl font-bold text-green-800 mb-2">
                  {parseInt(palierForm.palier).toLocaleString()} vues
                </div>
                <div className="text-lg font-semibold text-green-600">
                  Gains: {formatCurrency(parseInt(palierForm.palier) / 1000 * (selectedClip.missions?.price_per_1k_views || 0))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.clipper.views.exact}
              </label>
              <input
                type="number"
                value={palierForm.views_declared}
                onChange={(e) => setPalierForm(prev => ({ ...prev, views_declared: e.target.value }))}
                placeholder={t.clipper.views.placeholder.replace('{count}', parseInt(palierForm.palier || '0').toLocaleString())}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t.clipper.views.default.replace('{count}', parseInt(palierForm.palier || '0').toLocaleString())}
              </p>
            </div>

            <div className="flex gap-3">
                              <button
                  onClick={() => {
                    setShowPalierModal(false)
                    setSelectedClip(null)
                    setPalierForm({ palier: '', views_declared: '' })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  {t.clipper.actions.cancel}
                </button>
                <button
                  onClick={handlePalierSubmit}
                  disabled={!palierForm.palier}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <IconCheck className="w-4 h-4" />
                  {t.clipper.actions.confirmPalier}
                </button>
            </div>
          </div>
        </div>
      )}
    </RoleProtectionOptimized>
  )
} 