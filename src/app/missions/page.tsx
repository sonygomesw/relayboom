'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useAuth } from '@/components/AuthContext'
import ClipperSidebar from '@/components/ClipperSidebar'
import { IconEye, IconCoin, IconTrendingUp, IconVideo, IconStar, IconArrowRight, IconClock, IconTarget, IconUser, IconDashboard } from '@tabler/icons-react'

interface Mission {
  id: string
  title: string
  description: string
  creator_name: string
  creator_image: string
  price_per_1k_views: number
  total_budget: number
  budget_used: number
  total_views: number
  status: string
  featured: boolean
  content_type: string
  category: string
}

export default function MissionsPage() {
  const { user, profile } = useAuth()
  const [missions, setMissions] = useState<Mission[]>([])
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [userStats, setUserStats] = useState({
    totalEarnings: 0,
    totalViews: 0,
    nextMilestone: 75
  })

  // Debug des données utilisateur
  useEffect(() => {
    console.log('🔍 AuthContext Debug:', { user: !!user, profile: !!profile, role: profile?.role })
  }, [user, profile])

  // Charger les stats utilisateur pour les clippeurs
  useEffect(() => {
    if (user && profile?.role === 'clipper') {
      loadUserStats()
    }
  }, [user, profile])

  const loadUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('earnings, views_count')
        .eq('user_id', user!.id)
        .in('status', ['approved', 'paid'])

      if (error) throw error

      const totalEarnings = data?.reduce((sum, sub) => sum + (sub.earnings || 0), 0) || 0
      const totalViews = data?.reduce((sum, sub) => sum + (sub.views_count || 0), 0) || 0

      setUserStats({
        totalEarnings: totalEarnings / 100, // Convertir centimes en euros
        totalViews,
        nextMilestone: 75
      })
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    }
  }

  useEffect(() => {
    loadMissions()
  }, [])

  useEffect(() => {
    filterMissions()
  }, [missions, selectedCategory, selectedType])

  const loadMissions = async () => {
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('status', 'active')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Ajouter des données par défaut si les champs n'existent pas
      const missionsWithDefaults = (data || []).map(mission => ({
        ...mission,
        budget_used: mission.budget_used || Math.round(mission.total_budget * 0.3), // 30% par défaut
        total_views: mission.total_views || Math.round((mission.total_budget * 0.3) / mission.price_per_1k_views * 1000)
      }))
      
      setMissions(missionsWithDefaults)
    } catch (error) {
      console.error('Erreur chargement missions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterMissions = () => {
    let filtered = missions

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(mission => mission.category === selectedCategory)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(mission => mission.content_type === selectedType)
    }

    setFilteredMissions(filtered)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1).replace('.0', '')}M vues`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K vues`;
    } else {
      return `${views} vues`;
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Musique': return '🎵'
      case 'Divertissement': return '🎮'
      case 'Marque': return '🏢'
      default: return '🎯'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des missions...</p>
        </div>
      </div>
    )
  }

  // Layout avec sidebar pour les clippeurs
  if (user && profile?.role === 'clipper') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <ClipperSidebar userStats={userStats} profile={profile} />
        <div className="flex-1 ml-96 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
          {/* Effet de texture de fond */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/10 via-indigo-800/10 to-slate-800/10"></div>
          <main className="p-8 relative z-10">
            {/* Hero Section adapté - Fond blanc */}
            <div className="relative bg-white rounded-2xl p-8 mb-8 text-gray-800 overflow-hidden shadow-lg border border-gray-100">
              {/* Contenu */}
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 flex items-center gap-3 justify-center">
                  <IconTarget className="w-8 h-8 text-blue-600" />
                  Missions Disponibles
                </h1>
                <p className="text-gray-600 mb-6">
                  Découvrez les missions de clipping les plus rentables. Choisissez votre créateur favori et commencez à gagner de l'argent !
                </p>
                <div className="flex flex-wrap gap-6 text-gray-700 text-sm">
                  <div className="flex items-center gap-2">
                    <IconTarget className="w-4 h-4" />
                    <span>{missions.length} missions actives</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCoin className="w-4 h-4" />
                    <span>0,08€ - 0,15€ par 1K vues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconTrendingUp className="w-4 h-4" />
                    <span>Paiement garanti</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">Toutes les catégories</option>
                      <option value="Divertissement">Divertissement</option>
                      <option value="Musique">Musique</option>
                      <option value="Marque">Marque</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de contenu</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">Tous les types</option>
                      <option value="UGC">UGC</option>
                      <option value="Découpage de vidéos">Découpage de vidéos</option>
                    </select>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {filteredMissions.length} mission{filteredMissions.length > 1 ? 's' : ''} trouvée{filteredMissions.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Missions Grid - Cartes style noir comme l'exemple */}
            <div className="rounded-2xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                              {filteredMissions.map((mission) => {
                // Utiliser les vraies données de la base de données
                const budgetUsed = mission.budget_used || 0;
                const budgetPercentage = mission.total_budget > 0 ? Math.round((budgetUsed / mission.total_budget) * 100) : 0;
                const totalViews = mission.total_views || 0;
                
                                 return (
                   <div 
                     key={mission.id}
                     className="bg-white rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-2xl transition-all duration-200 ease-in-out group flex flex-col h-[28rem] relative shadow-lg border-0"
                   >

                                         {/* Header avec photo et prix */}
                     <div className="flex items-start justify-between p-8 gap-4">
                       {/* Photo créateur en carré avec marge */}
                       <div className="flex-shrink-0">
                         <img 
                           src={mission.creator_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(mission.creator_name || 'User')}&background=0066CC&color=fff&size=64`}
                           alt={mission.creator_name}
                           className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                         />
                       </div>
                       
                       {/* Prix par 1K vues en haut à droite */}
                       <div className="text-right flex-shrink-0 min-w-0">
                         <div className="text-gray-900 font-bold text-lg whitespace-nowrap">
                           {formatCurrency(mission.price_per_1k_views)} / 1K
                         </div>
                         {mission.featured && (
                           <div className="text-yellow-400 text-base mt-1">⭐</div>
                         )}
                       </div>
                     </div>

                                         {/* Titre */}
                     <div className="px-8">
                       <h3 className="text-gray-900 font-bold text-lg mb-6 line-clamp-2 leading-tight break-words">
                         {mission.title || 'Mission sans titre'}
                       </h3>
                     </div>

                                         {/* Jauge de budget au milieu */}
                     <div className="px-8 mb-6 flex-1 flex flex-col justify-center">
                       <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                         <span className="text-3xl font-bold text-gray-900 flex-shrink-0">{formatCurrency(budgetUsed)}</span>
                         <span className="text-gray-500 font-medium text-lg flex-shrink-0">sur</span>
                         <span className="text-xl font-semibold text-gray-600 flex-shrink-0">{formatCurrency(mission.total_budget)}</span>
                       </div>
                       
                       {/* Pourcentage et vues - ligne au-dessus de la barre */}
                       <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
                         <span>{budgetPercentage}%</span>
                         <span>{formatViews(totalViews)}</span>
                       </div>
                       
                       {/* Barre de progression */}
                       <div className="w-full bg-gray-100 rounded-full h-5 mb-3">
                         <div 
                           className="bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] h-5 rounded-full transition-all duration-300 shadow-sm"
                           style={{ width: `${budgetPercentage}%` }}
                         ></div>
                       </div>
                     </div>

                     {/* Section bottom - bien structurée */}
                     <div className="px-8 pb-6 space-y-3">
                       {/* Ligne 1: Type de contenu */}
                       <div className="flex justify-center">
                         <span className="text-gray-600 text-base font-medium bg-gray-100 px-3 py-1 rounded-full">
                           {mission.content_type || 'Other'}
                         </span>
                       </div>
                       
                       {/* Ligne 2: Plateformes centrées */}
                       <div className="flex items-center justify-center gap-4">
                         {/* TikTok */}
                         <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black shadow-md hover:scale-110 transition-transform cursor-pointer group/tiktok relative">
                           <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                             <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                           </svg>
                           <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/tiktok:opacity-100 transition-opacity whitespace-nowrap">
                             Disponible sur TikTok
                           </div>
                         </div>
                         {/* Instagram */}
                         <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] shadow-md hover:scale-110 transition-transform cursor-pointer group/instagram relative">
                           <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                             <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                           </svg>
                           <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/instagram:opacity-100 transition-opacity whitespace-nowrap">
                             Disponible sur Instagram
                           </div>
                         </div>
                         {/* YouTube */}
                         <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#FF0000] shadow-md hover:scale-110 transition-transform cursor-pointer group/youtube relative">
                           <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                             <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                           </svg>
                           <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/youtube:opacity-100 transition-opacity whitespace-nowrap">
                             Disponible sur YouTube
                           </div>
                         </div>
                       </div>
                     </div>

                    {/* Lien invisible pour navigation */}
                    <Link
                      href={`/mission/${mission.id}`}
                      className="absolute inset-0 z-10"
                    >
                      <span className="sr-only">Voir la mission {mission.title}</span>
                    </Link>
                  </div>
                );
              })}
                </div>
            </div>

            {filteredMissions.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IconTarget className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune mission trouvée</h3>
                <p className="text-gray-600">Ajustez vos filtres pour voir plus de missions</p>
              </div>
            )}
          </main>
        </div>
      </div>
    )
  }

  // Layout public par défaut
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                      <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-xl text-gray-900">ClipTokk</span>
            </Link>
            
            {/* Navigation */}
            <div className="flex items-center gap-6">
              {/* Onglet Missions (toujours visible) */}
              <Link
                href="/missions"
                className="flex items-center gap-2 text-green-600 font-medium border-b-2 border-green-600 pb-1"
              >
                <IconTarget className="w-4 h-4" />
                Missions
              </Link>
              
              {user && profile ? (
                <>
                  {/* Navigation basée sur le rôle */}
                  {profile.role === 'clipper' && (
                    <Link
                      href="/dashboard/clipper"
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                      <IconDashboard className="w-4 h-4" />
                      Mon Dashboard
                    </Link>
                  )}
                  {profile.role === 'creator' && (
                    <Link
                      href="/dashboard/creator"
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                      <IconDashboard className="w-4 h-4" />
                      Mon Dashboard
                    </Link>
                  )}
                  {profile.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                      <IconDashboard className="w-4 h-4" />
                      Admin
                    </Link>
                  )}
                  
                  {/* Profil utilisateur */}
                  <div className="flex items-center gap-3 ml-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-sm">
                        {profile.pseudo?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-gray-700 font-medium">{profile.pseudo}</span>
                  </div>
                </>
              ) : (
                <Link 
                  href="/"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Commencer
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Fond blanc */}
      <section className="relative bg-white py-16 overflow-hidden shadow-sm">
        {/* Contenu */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 flex items-center gap-4 justify-center">
            <IconTarget className="w-12 h-12 text-blue-600" />
            Missions Disponibles
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Découvrez les missions de clipping les plus rentables. Choisissez votre créateur favori et commencez à gagner de l'argent !
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-gray-700">
            <div className="flex items-center gap-2">
              <IconTarget className="w-5 h-5" />
              <span>{missions.length} missions actives</span>
            </div>
            <div className="flex items-center gap-2">
              <IconCoin className="w-5 h-5" />
              <span>0,08€ - 0,15€ par 1K vues</span>
            </div>
            <div className="flex items-center gap-2">
              <IconTrendingUp className="w-5 h-5" />
              <span>Paiement garanti</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Toutes les catégories</option>
                  <option value="Divertissement">Divertissement</option>
                  <option value="Musique">Musique</option>
                  <option value="Marque">Marque</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de contenu</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Tous les types</option>
                  <option value="UGC">UGC</option>
                  <option value="Découpage de vidéos">Découpage de vidéos</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {filteredMissions.length} mission{filteredMissions.length > 1 ? 's' : ''} trouvée{filteredMissions.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </section>

      {/* Missions Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 rounded-2xl p-6 relative overflow-hidden">
            {/* Effet de texture de fond */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
            <div className="relative z-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredMissions.map((mission) => (
              <div 
                key={mission.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:bg-gray-50 transition-all duration-200 group flex flex-col min-h-[180px] w-full shadow-lg"
              >
                {mission.featured && (
                  <div className="absolute top-1 right-1 z-10">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                      ⭐
                    </div>
                  </div>
                )}

                {/* Header ultra-mini avec plus d'espace */}
                                  <div className="bg-gray-50 p-2.5 flex items-center gap-2 border-b border-gray-200 relative">
                  {/* Avatar très petit */}
                  <div className="relative">
                    <img 
                      src={mission.creator_image} 
                      alt={mission.creator_name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-white shadow-sm"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                                                                <h3 className="font-bold text-sm text-gray-900 truncate group-hover:text-emerald-600 transition-colors leading-tight">
                        {mission.title || 'Mission sans titre'}
                      </h3>
                      <p className="text-xs text-gray-600 truncate font-normal">
                        {mission.creator_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate font-normal mt-1">
                        {mission.description}
                      </p>
                  </div>
                </div>

                {/* Content mini avec plus d'espace */}
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Prix en priorité */}
                                          <div className="bg-gray-50 rounded p-1.5 text-center border border-gray-200">
                      <div className="text-xs font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        {formatCurrency(mission.price_per_1k_views)}/1K
                      </div>
                                                                      <div className="text-xs text-gray-600 mt-0.5">
                          Budget: {formatCurrency(mission.total_budget)}
                        </div>
                    </div>

                    {/* Badge catégorie très petit */}
                    <div className="flex items-center justify-center">
                                              <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs border border-gray-200">
                        {getCategoryIcon(mission.category)}
                      </span>
                    </div>
                  </div>

                  {/* Bouton mini avec plus d'espace */}
                  <Link
                    href={`/mission/${mission.id}`}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-1.5 rounded text-xs font-medium text-center hover:from-emerald-700 hover:to-green-700 transition-all duration-200 mt-2"
                  >
                    Voir
                  </Link>
                </div>
              </div>
            ))}
              </div>
            </div>
          </div>

          {filteredMissions.length === 0 && (
            <div className="text-center py-12">
              <IconTarget className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune mission trouvée</h3>
              <p className="text-gray-600">Essayez de modifier vos filtres pour voir plus de missions.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Prêt à commencer ?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez des milliers de clippeurs qui gagnent de l'argent avec leurs TikToks
          </p>
          <Link
            href="/"
            className="bg-green-600 text-white px-12 py-4 rounded-lg font-bold hover:bg-green-700 transition-colors inline-flex items-center gap-3 text-xl"
          >
            <IconVideo className="w-6 h-6" />
            Devenir clippeur
          </Link>
        </div>
      </section>
    </div>
  )
}