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
      setMissions(data || [])
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
        <div className="flex-1 ml-96">
          <main className="p-8">
            {/* Hero Section adapté */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-8 text-white">
              <h1 className="text-3xl font-bold mb-4">Missions Disponibles</h1>
              <p className="text-green-100 mb-6">
                Découvrez les missions de clipping les plus rentables. Choisissez votre créateur favori et commencez à gagner de l'argent !
              </p>
              <div className="flex flex-wrap gap-6 text-green-100 text-sm">
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

            {/* Missions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMissions.map((mission, index) => {
                // Alterner entre style clair et sombre comme dans le dashboard
                const isDarkStyle = index % 2 === 1
                
                return (
                  <div 
                    key={mission.id} 
                    className={`
                      ${isDarkStyle 
                        ? 'bg-gray-900 border-gray-800' 
                        : 'bg-white border-gray-200'
                      } 
                      rounded-2xl border-2 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden
                    `}
                  >
                    {/* Badge Featured */}
                    {mission.featured && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ⭐ Featured
                      </div>
                    )}

                    {/* Header avec titre et créateur */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {/* Avatar du créateur */}
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {mission.creator_name?.charAt(0).toUpperCase() || 'C'}
                            </span>
                          </div>
                          <div>
                            <h3 className={`font-bold text-lg ${isDarkStyle ? 'text-white' : 'text-gray-900'}`}>
                              {mission.title}
                            </h3>
                            <p className={`text-sm ${isDarkStyle ? 'text-gray-400' : 'text-gray-500'}`}>
                              {mission.creator_name}
                            </p>
                          </div>
                        </div>
                        
                        <p className={`text-sm leading-relaxed ${isDarkStyle ? 'text-gray-300' : 'text-gray-600'}`}>
                          {mission.description}
                        </p>
                      </div>
                    </div>

                    {/* Prix et budget - Style carte référence */}
                    <div className={`
                      ${isDarkStyle 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-gray-50 border-gray-200'
                      } 
                      rounded-xl border p-4 mb-6
                    `}>
                      <div className="text-center">
                        <div className={`text-2xl font-bold mb-1 ${isDarkStyle ? 'text-white' : 'text-gray-900'}`}>
                          {formatCurrency(mission.price_per_1k_views)}/1K
                        </div>
                        <div className={`text-sm ${isDarkStyle ? 'text-gray-400' : 'text-gray-600'}`}>
                          Budget: {formatCurrency(mission.total_budget)}
                        </div>
                      </div>
                    </div>

                    {/* Statistiques - Style CPI pour les cartes sombres */}
                    {isDarkStyle && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">ClipTokk Mission</span>
                          <span className="text-gray-400 text-sm">
                            {formatCurrency(mission.price_per_1k_views * 0.8)}/1K
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white text-lg font-bold">
                            {formatCurrency(mission.total_budget * 0.7)} of
                          </span>
                          <span className="text-gray-400 text-lg">
                            70%
                          </span>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {formatCurrency(mission.total_budget)}
                        </span>
                        
                        {/* Barre de progression */}
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" 
                            style={{ width: '70%' }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Détails - Type et plateformes */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className={`text-xs font-medium mb-1 ${isDarkStyle ? 'text-gray-400' : 'text-gray-500'}`}>
                          Type
                        </div>
                        <div className={`text-sm font-medium ${isDarkStyle ? 'text-white' : 'text-gray-900'}`}>
                          {mission.category || 'Other'}
                        </div>
                      </div>
                      
                      <div>
                        <div className={`text-xs font-medium mb-1 ${isDarkStyle ? 'text-gray-400' : 'text-gray-500'}`}>
                          Plateformes
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Icônes des plateformes */}
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
                            <span className="text-white text-xs font-bold">IG</span>
                          </div>
                          <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
                            <span className="text-white text-xs font-bold">TT</span>
                          </div>
                          <div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center">
                            <span className="text-white text-xs font-bold">YT</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className={`text-xs font-medium mb-1 ${isDarkStyle ? 'text-gray-400' : 'text-gray-500'}`}>
                          Budget max
                        </div>
                        <div className={`text-sm font-bold ${isDarkStyle ? 'text-white' : 'text-gray-900'}`}>
                          {Math.round(mission.total_budget / mission.price_per_1k_views)}K
                        </div>
                      </div>
                    </div>

                    {/* Bouton d'action */}
                    <Link
                      href={`/mission/${mission.id}`}
                      className={`
                        w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] block text-center
                        ${isDarkStyle 
                          ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25' 
                          : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25'
                        }
                      `}
                    >
                      Voir la mission
                    </Link>

                    {/* Effet de brillance pour les cartes sombres */}
                    {isDarkStyle && (
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                    )}
                  </div>
                )
              })}
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
          <div className="flex justify-between items-center h-16">
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Missions Disponibles
          </h1>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Découvrez les missions de clipping les plus rentables. Choisissez votre créateur favori et commencez à gagner de l'argent !
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-green-100">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredMissions.map((mission) => (
              <div 
                key={mission.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group flex flex-col min-h-[180px] w-full"
              >
                {mission.featured && (
                  <div className="absolute top-1 right-1 z-10">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                      ⭐
                    </div>
                  </div>
                )}

                {/* Header ultra-mini avec plus d'espace */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-2.5 flex items-center gap-2 border-b border-gray-100 relative">
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
                    <p className="text-xs text-gray-500 truncate font-normal">
                      {mission.creator_name}
                    </p>
                    <p className="text-xs text-gray-600 truncate font-normal mt-1">
                      {mission.description}
                    </p>
                  </div>
                </div>

                {/* Content mini avec plus d'espace */}
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Prix en priorité */}
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded p-1.5 text-center border border-emerald-100">
                      <div className="text-xs font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        {formatCurrency(mission.price_per_1k_views)}/1K
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Budget: {formatCurrency(mission.total_budget)}
                      </div>
                    </div>

                    {/* Badge catégorie très petit */}
                    <div className="flex items-center justify-center">
                      <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">
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