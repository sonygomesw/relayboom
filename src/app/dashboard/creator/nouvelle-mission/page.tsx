'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { supabase } from '@/lib/supabase'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { useLanguage } from '@/components/LanguageContext'
import { translations } from '@/lib/translations.new'
import {
  IconArrowLeft,
  IconVideo,
  IconCoin,
  IconTarget,
  IconUpload,
  IconBrandTiktok,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandX,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconInfoCircle,
  IconTrash,
  IconPlus,
  IconMinus
} from '@tabler/icons-react'

export default function NouvelleMission() {
  const { user, profile } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const router = useRouter()
  const { language } = useLanguage()
  const t = translations[language] || translations.en

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
    duration_max: '',
    status: 'draft'
  })

  useEffect(() => {
    if (user && profile) {
      setIsLoading(false)
    }
  }, [user, profile])

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
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('mission-images')
        .upload(fileName, file)

      if (error) {
        console.error('Erreur upload:', error)
        alert('Erreur lors de l\'upload de l\'image')
        return
      }

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

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      
      if (userError || !userData.user) {
        alert('Erreur d\'authentification. Veuillez vous reconnecter.')
        return
      }

      if (!formData.title || !formData.description || !formData.total_budget || !formData.reward) {
        alert('Veuillez remplir tous les champs obligatoires')
        return
      }

      if (formData.platforms.length === 0) {
        alert('Veuillez sélectionner au moins une plateforme')
        return
      }

      const missionData: any = {
        creator_id: userData.user.id,
        title: formData.title,
        description: formData.description,
        content_type: formData.content_type,
        category: formData.category,
        budget_type: formData.budget_type,
        total_budget: parseFloat(formData.total_budget),
        budget_per_view: formData.budget_per_view ? parseFloat(formData.budget_per_view) : null,
        reward: formData.reward,
        platforms: formData.platforms,
        creator_image: formData.creator_image,
        logo_url: formData.logo_url,
        brand_guidelines: formData.brand_guidelines,
        video_url: formData.video_url,
        duration_min: formData.duration_min ? parseInt(formData.duration_min) : null,
        duration_max: formData.duration_max ? parseInt(formData.duration_max) : null,
        status: formData.status,
        price_per_1k_views: parseFloat(formData.reward),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data: insertData, error: insertError } = await supabase
        .from('missions')
        .insert([missionData])
        .select()

      if (insertError) {
        console.error('Erreur insertion:', insertError)
        alert(`Erreur lors de la création de la mission: ${insertError.message}`)
        return
      }

      alert('Mission créée avec succès!')
      router.push('/dashboard/creator/missions')

    } catch (error) {
      console.error('Erreur générale:', error)
      alert('Une erreur est survenue lors de la création de la mission.')
    } finally {
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

  return (
    <RoleProtectionOptimized allowedRoles={['creator']}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <IconArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Créer une nouvelle mission</h1>
            <p className="text-gray-600 mt-2">Configurez votre mission pour attirer les meilleurs clippeurs</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations de base</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la mission *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Clip gaming viral pour ma chaîne"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Marque">Marque</option>
                    <option value="Divertissement">Divertissement</option>
                    <option value="Musique">Musique</option>
                    <option value="Produits">Produits</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Décrivez votre mission, le style de contenu souhaité..."
                  required
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget et récompenses</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget total *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="total_budget"
                      value={formData.total_budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="500"
                      required
                    />
                    <span className="absolute right-3 top-2 text-gray-500">€</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Récompense par 1000 vues *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      name="reward"
                      value={formData.reward}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.12"
                      required
                    />
                    <span className="absolute right-3 top-2 text-gray-500">€</span>
                  </div>
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium mb-1">Exemple de calcul</div>
                    <div className="text-sm text-gray-600">
                      Un clip avec 10,000 vues = 10 × 0.12€ = 1.20€
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Plateformes cibles</h2>
              <p className="text-sm text-gray-600 mb-4">
                Sélectionnez les plateformes où vous souhaitez voir vos clips *
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'TikTok', icon: IconBrandTiktok, color: 'text-pink-600' },
                  { name: 'Instagram', icon: IconBrandInstagram, color: 'text-purple-600' },
                  { name: 'YouTube', icon: IconBrandYoutube, color: 'text-red-600' },
                  { name: 'X (Twitter)', icon: IconBrandX, color: 'text-gray-900' }
                ].map(platform => (
                  <button
                    key={platform.name}
                    type="button"
                    onClick={() => handlePlatformToggle(platform.name)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.platforms.includes(platform.name)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <platform.icon className={`w-6 h-6 mx-auto mb-2 ${platform.color}`} />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contenu de référence</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de la vidéo source
                  </label>
                  <input
                    type="url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image du créateur
                  </label>
                  <div className="flex items-center gap-4">
                    {formData.creator_image && (
                      <img
                        src={formData.creator_image}
                        alt="Aperçu"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                    )}
                    
                    <div>
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                          <IconUpload className="w-4 h-4" />
                          {isUploadingImage ? 'Upload...' : 'Choisir une image'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Directives de marque / Style
                  </label>
                  <textarea
                    name="brand_guidelines"
                    value={formData.brand_guidelines}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Décrivez le style, le ton, les éléments à inclure..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée minimale (secondes)
                    </label>
                    <input
                      type="number"
                      name="duration_min"
                      value={formData.duration_min}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="30"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="60"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Chargement...' : 'Publier la mission'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </RoleProtectionOptimized>
  )
}
export const dynamic = "force-dynamic"
