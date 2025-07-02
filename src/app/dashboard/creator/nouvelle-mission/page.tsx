'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { supabase } from '@/lib/supabase'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import {
  IconArrowLeft,
  IconVideo,
  IconCoin,
  IconTarget,
  IconUpload,
  IconBrandTiktok,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandX
} from '@tabler/icons-react'

export default function NouvelleMission() {
  const { user, profile } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const router = useRouter()

  // États pour le formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: 'UGC',
    category: 'Divertissement',
    budget_type: 'Budget total',
    total_budget: '',
    budget_per_view: '',
    reward: '',
    platforms: [] as string[],
    creator_image: '',
    logo_url: '',
    brand_guidelines: '',
    video_url: '',
    duration_min: '',
    duration_max: ''
  })

  useEffect(() => {
    if (user && profile) {
      setIsLoading(false)
    }
  }, [user, profile])

  // Debug pour comprendre le problème d'authentification
  useEffect(() => {
    console.log('🔍 Mission Creation Debug:', {
      user: user ? { id: user.id, email: user.email } : null,
      profile: profile ? { id: profile.id, email: profile.email, role: profile.role } : null,
      isLoading,
      isAuthenticated: !!user,
      canCreateMission: !!user && !!profile && profile.role === 'creator'
    })
  }, [user, profile, isLoading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsUploadingImage(true)

    try {
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      // Upload vers Supabase Storage
      const { data, error } = await supabase.storage
        .from('mission-images')
        .upload(fileName, file)

      if (error) {
        console.error('Erreur upload:', error)
        alert('Erreur lors de l\'upload de l\'image')
        return
      }

      // Obtenir l'URL publique de l'image
      const { data: urlData } = supabase.storage
        .from('mission-images')
        .getPublicUrl(fileName)

      setFormData(prev => ({
        ...prev,
        creator_image: urlData.publicUrl
      }))

    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'upload de l\'image')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log('🚀 DÉBUT CRÉATION MISSION')
    console.log('========================')

    try {
      // 1. ✅ Vérifier l'authentification active
      console.log('🔍 ÉTAPE 1: Vérification authentification...')
      const { data: userData, error: userError } = await supabase.auth.getUser()
      console.log('👤 User connecté:', userData.user ? {
        id: userData.user.id,
        email: userData.user.email,
        confirmed: userData.user.email_confirmed_at ? 'Oui' : 'Non'
      } : 'NULL')
      
      if (userError) {
        console.error('❌ Erreur auth.getUser():', userError.message)
        alert('Erreur d\'authentification. Veuillez vous reconnecter.')
        return
      }

      if (!userData.user) {
        console.error('❌ Aucun utilisateur connecté')
        alert('Vous devez être connecté pour créer une mission.')
        return
      }

      // 2. ✅ Vérifier la session active
      console.log('🔍 ÉTAPE 2: Vérification session...')
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      console.log('🔐 Session:', {
        active: sessionData.session ? 'Active' : 'Inactive',
        access_token: sessionData.session?.access_token ? 'Présent' : 'Absent',
        expires_at: sessionData.session?.expires_at
      })

      if (!sessionData.session) {
        console.error('❌ Pas de session active')
        alert('Session expirée. Veuillez vous reconnecter.')
        return
      }

      // 3. ✅ Validation des champs requis
      console.log('🔍 ÉTAPE 3: Validation formulaire...')
      if (!formData.title || !formData.description || !formData.total_budget || !formData.reward) {
        console.log('❌ VALIDATION ÉCHOUÉE - Champs manquants:', {
          title: !!formData.title,
          description: !!formData.description,
          total_budget: !!formData.total_budget,
          reward: !!formData.reward
        })
        alert('Veuillez remplir tous les champs obligatoires')
        return
      }

      if (formData.platforms.length === 0) {
        console.log('❌ VALIDATION ÉCHOUÉE - Aucune plateforme sélectionnée')
        alert('Veuillez sélectionner au moins une plateforme')
        return
      }

      console.log('✅ VALIDATION RÉUSSIE')

      // 4. ✅ Préparer les données avec creator_id = auth.uid()
      console.log('🔍 ÉTAPE 4: Préparation données...')
      const missionData: any = {
        creator_id: userData.user.id, // ✅ Utiliser l'ID de l'utilisateur authentifié
        creator_name: profile?.pseudo || userData.user.email?.split('@')[0] || 'Créateur',
        title: formData.title,
        description: formData.description,
        content_type: formData.content_type,
        category: formData.category,
        budget_type: 'Budget total',
        total_budget: parseInt(formData.total_budget),
        budget_per_view: 0.00,
        price_per_1k_views: parseFloat(formData.reward),
        platforms: formData.platforms.join(','),
        creator_image: formData.creator_image || '/logo.png',
        creator_thumbnail: formData.creator_image || '/logo.png',
        logo_url: formData.logo_url || '',
        brand_guidelines: formData.brand_guidelines || '',
        video_url: formData.video_url || '',
        duration_min: formData.duration_min ? parseInt(formData.duration_min) : 15,
        duration_max: formData.duration_max ? parseInt(formData.duration_max) : 60,
        status: 'active',
        featured: false
      }

      console.log('📝 DONNÉES À ENVOYER:', missionData)
      console.log('🔍 creator_id === auth.uid() ?', missionData.creator_id === userData.user.id)

      // 5. ✅ Test sans .select() pour isoler le problème
      console.log('🔍 ÉTAPE 5: Insertion Supabase (SANS .select())...')
      console.log('⏱️ Début requête à', new Date().toISOString())
      
      const startTime = Date.now()
      const { error } = await supabase
        .from('missions')
        .insert([missionData])
        // PAS de .select() pour éviter les problèmes de lecture RLS

      const endTime = Date.now()
      console.log(`⏱️ Temps de réponse: ${endTime - startTime}ms`)

      if (error) {
        console.error('❌ ERREUR SUPABASE DÉTAILLÉE:')
        console.error('   Code:', error.code)
        console.error('   Message:', error.message)
        console.error('   Détails:', error.details)
        console.error('   Hint:', error.hint)
        console.error('   Objet complet:', error)
        alert(`Erreur Supabase: ${error.message}`)
        return
      }

      console.log('✅ MISSION INSÉRÉE AVEC SUCCÈS!')
      console.log('🎉 Redirection vers dashboard...')
      
      alert('Mission créée avec succès!')
      router.push('/dashboard/creator')

    } catch (error) {
      console.error('❌ ERREUR CATCH GLOBALE:', error)
      console.error('   Type:', typeof error)
      console.error('   Stack:', (error as Error).stack)
      alert(`Erreur inattendue: ${(error as Error).message}`)
    } finally {
      console.log('🏁 FIN handleSubmit - isSubmitting: false')
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <RoleProtectionOptimized allowedRoles={['creator']}>
      <div className="min-h-screen bg-gray-50">
        <main className="p-8 max-w-6xl mx-auto">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            {/* Informations générales */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <IconVideo className="w-6 h-6" />
                Informations générales
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la mission *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Ex: Clip mes meilleurs moments gaming"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description détaillée *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Décrivez ce que vous attendez des clippeurs, le style souhaité, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de contenu souhaité *
                  </label>
                  <select
                    name="content_type"
                    value={formData.content_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="UGC">UGC (User Generated Content)</option>
                    <option value="Découpage de vidéos">Découpage de vidéos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="Marque">Marque</option>
                    <option value="Divertissement">Divertissement</option>
                    <option value="Produits">Produits</option>
                    <option value="Musique">Musique</option>
                    <option value="Logo">Logo</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Configuration du budget */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <IconCoin className="w-6 h-6" />
                Configuration du budget
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget total ($US) *
                  </label>
                  <input
                    type="number"
                    name="total_budget"
                    value={formData.total_budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="10000"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Récompense par 1000 vues ($US) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="reward"
                    value={formData.reward}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Ex: 5.00"
                    min="0.01"
                    required
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    <div className="font-medium mb-1">Exemple avec 1$ par 1000 vues :</div>
                    <div className="space-y-1">
                      <div>• 10 000 vues = 10$</div>
                      <div>• 100 000 vues = 100$</div>
                      <div>• 1 000 000 vues = 1000$</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plateformes et contenu */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <IconTarget className="w-6 h-6" />
                Plateformes et contenu
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Plateformes cibles *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'TikTok', icon: IconBrandTiktok, color: 'bg-black' },
                    { name: 'Instagram', icon: IconBrandInstagram, color: 'bg-pink-500' },
                    { name: 'YouTube', icon: IconBrandYoutube, color: 'bg-red-500' },
                    { name: 'X (Twitter)', icon: IconBrandX, color: 'bg-black' }
                  ].map((platform) => (
                    <button
                      key={platform.name}
                      type="button"
                      onClick={() => handlePlatformToggle(platform.name)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.platforms.includes(platform.name)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                        <platform.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de la vidéo source
                  </label>
                  <input
                    type="url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo/image du créateur
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                      id="creator-image-upload"
                    />
                    <label
                      htmlFor="creator-image-upload"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <IconUpload className="w-5 h-5" />
                      {isUploadingImage ? 'Upload...' : 'Uploader une photo ou une image'}
                    </label>
                  </div>
                  {formData.creator_image && (
                    <div className="mt-2">
                      <img 
                        src={formData.creator_image} 
                        alt="Aperçu" 
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Directives de marque et instructions spécifiques
                  </label>
                  <textarea
                    name="brand_guidelines"
                    value={formData.brand_guidelines}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Instructions spéciales, ton de la marque, éléments à éviter, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée minimale (secondes)
                  </label>
                  <input
                    type="number"
                    name="duration_min"
                    value={formData.duration_min}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="15"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée maximale (secondes)
                  </label>
                  <input
                    type="number"
                    name="duration_max"
                    value={formData.duration_max}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="60"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Création...' : 'Créer la mission'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </RoleProtectionOptimized>
  )
} 