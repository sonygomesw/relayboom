'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useAuth } from '@/components/AuthNew'
import { useLanguage } from '@/components/LanguageContext'
import { clipperTranslations } from '@/lib/clipper-translations'
import { 
  IconShield, 
  IconCheck, 
  IconX, 
  IconEye, 
  IconCoin,
  IconClock,
  IconTarget,
  IconTrendingUp,
  IconAlertCircle,
  IconVideo,
  IconExternalLink
} from '@tabler/icons-react'
import AdminSidebar from '@/components/AdminSidebar'

interface ClipSubmission {
  id: string
  user_id: string
  mission_id: string
  submission_id: string
  tiktok_link: string  // Nom réel dans la DB
  views_declared: number  // Nom réel dans la DB
  palier: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  profiles?: {
    pseudo: string
    email: string
    tiktok_username?: string
  }
  missions?: {
    title: string
    price_per_1k_views: number
    profiles?: {
      pseudo: string
    }
  }
}

export default function AdminPaliers() {
  const { profile } = useAuth() // 🚀 Utiliser le contexte optimisé
  const [submissions, setSubmissions] = useState<ClipSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const { language } = useLanguage()
  const t = clipperTranslations[language]

  useEffect(() => {
    if (profile) {
      loadSubmissions()
    }
  }, [profile])

  const loadSubmissions = async () => {
    try {
      console.log('🔄 Chargement des soumissions de paliers...')
      
      // Test 1: Vérifier si la table existe et afficher des infos détaillées
      const { data: testData, error: testError } = await supabase
        .from('clip_submissions')
        .select('id, status, palier, created_at, user_id, mission_id')
        .limit(5)
      
      if (testError) {
        console.error('❌ Erreur accès table clip_submissions:', testError)
        console.error('❌ Code:', testError.code)
        console.error('❌ Message:', testError.message)
        console.error('❌ Détails:', testError.details)
        console.error('❌ Hint:', testError.hint)
        
        // Message d'erreur détaillé pour l'utilisateur
        if (testError.code === '42P01') {
          alert('❌ La table clip_submissions n\'existe pas. Veuillez exécuter le script SQL de création.')
        } else if (testError.code === '42501') {
          alert('❌ Permissions insuffisantes pour accéder à clip_submissions. Vérifiez les politiques RLS.')
        } else {
          alert('❌ Erreur d\'accès à la table clip_submissions: ' + testError.message)
        }
        throw testError
      }
      
      console.log('✅ Table clip_submissions accessible')
      console.log('📊 Aperçu des données:', testData)
      console.log('📊 Nombre d\'entrées trouvées:', testData?.length || 0)
      
      // Test 2: Requête simple sans jointures
      const { data: simpleData, error: simpleError } = await supabase
        .from('clip_submissions')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (simpleError) {
        console.error('❌ Erreur requête simple:', simpleError)
        throw simpleError
      }
      
      console.log('📊 Données simples récupérées:', simpleData?.length || 0, 'soumissions')
      
      // Si pas de données, afficher un message d'aide
      if (!simpleData || simpleData.length === 0) {
        console.log('ℹ️ Aucune soumission de palier trouvée. Vérifiez que des utilisateurs ont soumis des paliers.')
        setSubmissions([])
        return
      }
      
      // Test 3: Requête avec jointures
      try {
        const { data: complexData, error: complexError } = await supabase
          .from('clip_submissions')
          .select(`
            *,
            profiles:user_id (
              pseudo,
              email,
              tiktok_username
            ),
            missions:mission_id (
              title,
              price_per_1k_views
            )
          `)
          .order('created_at', { ascending: false })
        
        if (complexError) {
          console.error('❌ Erreur requête avec jointures:', complexError)
          console.log('⚠️ Utilisation des données simples sans jointures')
          
          // Enrichir les données simples avec des requêtes séparées
          const enrichedData = await Promise.all(
            (simpleData || []).map(async (submission: any) => {
              try {
                // Récupérer le profil du clippeur
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('pseudo, email, tiktok_username')
                  .eq('id', submission.user_id)
                  .single()
                
                // Récupérer la mission
                const { data: mission } = await supabase
                  .from('missions')
                  .select('title, price_per_1k_views, creator_id')
                  .eq('id', submission.mission_id)
                  .single()
                
                // Récupérer le profil du créateur si on a la mission
                let creatorProfile = null
                if (mission?.creator_id) {
                  const { data: creator } = await supabase
                    .from('profiles')
                    .select('pseudo')
                    .eq('id', mission.creator_id)
                    .single()
                  creatorProfile = creator
                }
                
                return {
                  ...submission,
                  profiles: profile,
                  missions: mission ? {
                    ...mission,
                    profiles: creatorProfile
                  } : null
                }
              } catch (enrichError) {
                console.warn('Erreur enrichissement soumission:', enrichError)
                return {
                  ...submission,
                  profiles: null,
                  missions: null
                }
              }
            })
          )
          
          console.log('✅ Données enrichies manuellement:', enrichedData.length)
          setSubmissions(enrichedData)
        } else {
          console.log('✅ Données complètes récupérées:', complexData?.length || 0, 'soumissions')
          setSubmissions(complexData || [])
        }
      } catch (joinError) {
        console.error('❌ Erreur jointures, fallback sur données simples:', joinError)
        setSubmissions(simpleData || [])
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des soumissions:', error)
      // En cas d'erreur totale, initialiser avec un tableau vide
      setSubmissions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleValidation = async (submissionId: string, action: 'approve' | 'reject') => {
    setIsProcessing(submissionId)
    
    try {
      // 1. Récupérer les infos de la soumission
      const { data: submission, error: fetchError } = await supabase
        .from('clip_submissions')
        .select('submission_id, views_declared')
        .eq('id', submissionId)
        .single()

      if (fetchError) throw fetchError

      // 2. Mettre à jour le status de la soumission de palier
      const { error: updateSubmissionError } = await supabase
        .from('clip_submissions')
        .update({ 
          status: action === 'approve' ? 'approved' : 'rejected' 
        })
        .eq('id', submissionId)

      if (updateSubmissionError) throw updateSubmissionError

      // 3. Si approuvé, mettre à jour le clip original
      if (action === 'approve' && submission) {
        const { error: updateClipError } = await supabase
          .from('submissions')
          .update({ 
            status: 'approved',
            views_count: submission.views_declared
          })
          .eq('id', submission.submission_id)

        if (updateClipError) throw updateClipError
        console.log(`✅ Clip ${submission.submission_id} mis à jour avec ${submission.views_declared} vues`)
      }

      // Recharger les données
      await loadSubmissions()
      
      console.log(`✅ Soumission ${action === 'approve' ? 'approuvée' : 'rejetée'}`)
    } catch (error) {
      console.error('Erreur validation:', error)
      alert('Erreur lors de la validation: ' + (error as any).message)
    } finally {
      setIsProcessing(null)
    }
  }

  const handleExamine = (submission: ClipSubmission) => {
    // Vérifier et valider le lien TikTok
    const isValidTikTokLink = submission.tiktok_link && 
      submission.tiktok_link.trim() !== '' &&
      submission.tiktok_link !== 'about:blank' &&
      (submission.tiktok_link.includes('tiktok.com') || submission.tiktok_link.includes('vm.tiktok.com'))
    
    // Afficher des informations détaillées dans la console pour debug
    console.log('🔍 Examen de la soumission:', {
      id: submission.id,
      clippeur: submission.profiles?.pseudo || 'Inconnu',
      mission: submission.missions?.title || 'Inconnue',
      palier: `${submission.palier} vues`,
      vues_declarees: submission.views_declared,
      prix_par_1k: submission.missions?.price_per_1k_views || 0,
      gains_potentiels: calculateEarnings(submission.palier, submission.missions?.price_per_1k_views || 0),
      lien: submission.tiktok_link,
      lien_valide: isValidTikTokLink,
      date: submission.created_at
    })
    
    // Préparer les détails pour l'alert
    const details = [
      `📊 Palier: ${formatNumber(submission.palier)} vues`,
      `👤 Clippeur: ${submission.profiles?.pseudo || 'Inconnu'}`,
      `🎯 Mission: ${submission.missions?.title || 'Inconnue'}`,
      `💰 Gains: ${calculateEarnings(submission.palier, submission.missions?.price_per_1k_views || 0)}€`,
      `📅 Date: ${formatDate(submission.created_at)}`,
      `🔗 Lien: ${submission.tiktok_link || 'Aucun lien'}`
    ].join('\n')
    
    if (isValidTikTokLink) {
      // Ouvrir le lien TikTok dans une nouvelle fenêtre
      window.open(submission.tiktok_link, '_blank', 'noopener,noreferrer')
      alert(`🔍 Détails de la soumission:\n\n${details}\n\n🎬 Le clip TikTok s'ouvre dans un nouvel onglet.`)
    } else {
      // Afficher une erreur si le lien est invalide
      alert(`🔍 Détails de la soumission:\n\n${details}\n\n❌ Lien TikTok invalide ou manquant!\n\nLien actuel: "${submission.tiktok_link || 'vide'}"\n\n💡 Vérifiez que le clippeur a bien fourni un lien TikTok valide.`)
    }
  }

  const calculateEarnings = (palier: number, pricePerK: number) => {
    return Math.round((palier / 1000) * pricePerK * 100) / 100
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

  const getFilteredSubmissions = () => {
    return submissions.filter(sub => sub.status === activeTab)
  }

  const getTabCounts = () => {
    return {
      pending: submissions.filter(s => s.status === 'pending').length,
      approved: submissions.filter(s => s.status === 'approved').length,
      rejected: submissions.filter(s => s.status === 'rejected').length
    }
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
          <p className="text-gray-600">Chargement des validations...</p>
        </div>
      </div>
    )
  }

  const tabCounts = getTabCounts()
  const filteredSubmissions = getFilteredSubmissions()

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
                <h1 className="text-2xl font-bold text-gray-900">Validation des paliers</h1>
                <p className="text-gray-600">Validez ou rejetez les paliers déclarés par les clippeurs</p>
              </div>
              {tabCounts.pending > 0 && (
                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-medium">
                  🔥 {tabCounts.pending} validation(s) en attente
                </div>
              )}
            </div>
          </header>

          <main className="p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">En attente</p>
                    <p className="text-2xl font-bold text-gray-900">{tabCounts.pending}</p>
                    <p className="text-xs text-orange-600">À traiter</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <IconClock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Approuvées</p>
                    <p className="text-2xl font-bold text-gray-900">{tabCounts.approved}</p>
                    <p className="text-xs text-green-600">Validées</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <IconCheck className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Rejetées</p>
                    <p className="text-2xl font-bold text-gray-900">{tabCounts.rejected}</p>
                    <p className="text-xs text-red-600">Refusées</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <IconX className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Alert si validations en attente */}
            {tabCounts.pending > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <IconAlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-900">
                      {tabCounts.pending} validation(s) en attente
                    </h3>
                    <p className="text-red-700">
                      Des clippeurs attendent la validation de leurs paliers pour recevoir leurs gains.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'pending'
                        ? 'border-orange-500 text-orange-600 bg-orange-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    En attente ({tabCounts.pending})
                  </button>
                  <button
                    onClick={() => setActiveTab('approved')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'approved'
                        ? 'border-green-500 text-green-600 bg-green-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Approuvées ({tabCounts.approved})
                  </button>
                  <button
                    onClick={() => setActiveTab('rejected')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'rejected'
                        ? 'border-red-500 text-red-600 bg-red-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Rejetées ({tabCounts.rejected})
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {filteredSubmissions.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconShield className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Aucune soumission {activeTab === 'pending' ? 'en attente' : activeTab === 'approved' ? 'approuvée' : 'rejetée'}
                    </h3>
                    <p className="text-gray-600">
                      {activeTab === 'pending' 
                        ? 'Toutes les validations sont à jour !'
                        : `Aucune soumission ${activeTab === 'approved' ? 'approuvée' : 'rejetée'} pour le moment.`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredSubmissions.map((submission) => (
                      <div key={submission.id} className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <IconVideo className="w-6 h-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Palier {formatNumber(submission.palier)} vues
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Mission: {submission.missions?.title || 'Mission inconnue'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-600">
                                  {calculateEarnings(submission.palier, submission.missions?.price_per_1k_views || 0)}€
                                </p>
                                <p className="text-xs text-gray-500">Gains potentiels</p>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Clippeur</h4>
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <IconTarget className="w-4 h-4 text-purple-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {submission.profiles?.pseudo || 'Clippeur inconnu'}
                                    </p>
                                    {submission.profiles?.tiktok_username && (
                                      <p className="text-sm text-gray-500">
                                        @{submission.profiles.tiktok_username}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Créateur original</h4>
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <IconTrendingUp className="w-4 h-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {submission.missions?.profiles?.pseudo || 'Créateur inconnu'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {submission.missions?.price_per_1k_views || 0}€/1K vues
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Soumission</h4>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    {formatDate(submission.created_at)}
                                  </p>
                                  {submission.views_declared && (
                                    <p className="text-sm text-gray-500">
                                      {formatNumber(submission.views_declared)} vues déclarées
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Clip Link */}
                            {submission.tiktok_link ? (
                              <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                                  Lien du clip
                                  {submission.tiktok_link && 
                                   submission.tiktok_link.trim() !== '' &&
                                   submission.tiktok_link !== 'about:blank' &&
                                   (submission.tiktok_link.includes('tiktok.com') || submission.tiktok_link.includes('vm.tiktok.com')) ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      ✅ Valide
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      ❌ Invalide
                                    </span>
                                  )}
                                </h4>
                                <a
                                  href={submission.tiktok_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                                >
                                  <IconExternalLink className="w-4 h-4" />
                                  Voir le clip TikTok
                                </a>
                                <p className="text-xs text-gray-500 mt-1 break-all">
                                  {submission.tiktok_link}
                                </p>
                              </div>
                            ) : (
                              <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                                  Lien du clip
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    ❌ Manquant
                                  </span>
                                </h4>
                                <p className="text-sm text-gray-500">
                                  Aucun lien TikTok fourni par le clippeur
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        {activeTab === 'pending' && (
                          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => handleValidation(submission.id, 'approve')}
                              disabled={isProcessing === submission.id}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              <IconCheck className="w-4 h-4" />
                              {isProcessing === submission.id ? 'Validation...' : 'Approuver'}
                            </button>
                            <button
                              onClick={() => handleValidation(submission.id, 'reject')}
                              disabled={isProcessing === submission.id}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              <IconX className="w-4 h-4" />
                              {isProcessing === submission.id ? 'Rejet...' : 'Rejeter'}
                            </button>
                            <button
                              onClick={() => handleExamine(submission)}
                              className="text-gray-600 hover:text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                            >
                              <IconEye className="w-4 h-4" />
                              Examiner
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </RoleProtectionOptimized>
  )
} 