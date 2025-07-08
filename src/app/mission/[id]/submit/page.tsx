'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase, cliptokkAPI } from '@/lib/supabase'
import { useAuth } from '@/components/AuthContext'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import { IconDashboard, IconVideo, IconCoin, IconStar, IconChartBar, IconLogout, IconArrowLeft, IconUpload, IconCheck, IconX, IconEye } from '@tabler/icons-react'

interface Mission {
  id: string
  title: string
  description: string
  creator_name: string
  creator_image: string
  price_per_1k_views: number
  total_budget: number
  rules: string[]
  examples: string[]
  status: string
  submissions_count: number
  budget_remaining: number
}

export default function SubmitClipPage() {
  const { user, profile } = useAuth() // 🚀 Utiliser le contexte optimisé
  const [mission, setMission] = useState<Mission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    tiktok_url: '',
    description: '',
    submission_type: 'url' // 'url' ou 'upload'
  })
  const [errors, setErrors] = useState<any>({})
  const router = useRouter()
  const params = useParams()
  const missionId = params.id as string

  useEffect(() => {
    console.log('🔄 USEEFFECT TRIGGER:', { 
      missionId,
      hasMission: !!mission,
      isLoading 
    })
    
    // ✅ Déclencher le chargement seulement si nécessaire
    if (missionId && !mission && isLoading) {
      console.log('🚀 DÉCLENCHEMENT loadMission()')
      loadMission()
    }

    // ✅ Timeout de sécurité global : débloquer après 5 secondes maximum
    const globalSafetyTimeout = setTimeout(() => {
      if (isLoading && missionId) {
        console.log('⏰ TIMEOUT DE SÉCURITÉ GLOBAL - Déblocage forcé')
        if (!mission) {
          const fallbackMission = createFallbackMissionForSubmission(missionId)
          setMission(fallbackMission)
        }
        setIsLoading(false)
      }
    }, 5000)

    return () => clearTimeout(globalSafetyTimeout)
  }, [missionId])

  const loadMission = async () => {
    console.log('🔍 DÉBUT CHARGEMENT MISSION')
    console.log('============================')
    
    console.log('📋 Paramètres:', {
      missionId: missionId
    })
    
    try {
      // ✅ Créer un timeout plus agressif pour éviter le blocage
      const MISSION_LOAD_TIMEOUT = 2000 // 2 secondes max
      
      console.log('🔍 ÉTAPE 1: Chargement missions via cliptokkAPI avec timeout...')
      
      // Promesse de timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Timeout de chargement des missions'))
        }, MISSION_LOAD_TIMEOUT)
      })
      
      // Promesse de chargement
      const loadPromise = cliptokkAPI.getActiveMissions()
      
      // Course entre timeout et chargement
      let missions: any[] = []
      
      try {
        missions = await Promise.race([loadPromise, timeoutPromise]) as any[]
        console.log('📋 Missions reçues (rapide):', missions?.length || 0)
      } catch (timeoutError) {
        console.log('⏰ Timeout atteint, tentative de chargement direct...')
        
        // Fallback: chargement direct depuis Supabase
        try {
          const { data: directMissions, error: directError } = await supabase
            .from('missions')
            .select('id, title, description, creator_name, creator_image, price_per_1k_views, total_budget, status, category')
            .eq('id', missionId)
            .single()
          
          if (directError || !directMissions) {
            console.log('❌ Mission non trouvée directement, création de fallback')
            throw new Error('Mission non trouvée')
          }
          
          missions = [directMissions]
          console.log('✅ Mission chargée directement:', directMissions)
          
        } catch (directError) {
          console.log('❌ Échec chargement direct, utilisation fallback ultime')
          missions = []
        }
      }
      
      const foundMission = missions.find((m: any) => m.id === missionId)

      if (!foundMission) {
        console.log('❌ Mission non trouvée dans les missions, création de fallback')
        // Créer une mission de fallback
        const fallbackMission = createFallbackMissionForSubmission(missionId)
        setMission(fallbackMission)
        console.log('✅ Mission fallback créée pour soumission')
        return
      }

      console.log('✅ Mission trouvée:', {
        id: foundMission.id,
        title: foundMission.title,
        status: foundMission.status,
        creator: foundMission.creator_name,
        budget: foundMission.total_budget
      })

      // 2. ✅ Adapter les données pour l'interface (simplifiée)
      console.log('🔍 ÉTAPE 2: Adaptation données interface...')
      const adaptedMission: Mission = {
        id: foundMission.id,
        title: foundMission.title || 'Mission sans titre',
        description: foundMission.description || 'Description non disponible',
        creator_name: foundMission.creator_name || 'Créateur',
        creator_image: foundMission.creator_image || '/mrbeast.jpg',
        price_per_1k_views: foundMission.price_per_1k_views || 0.1,
        total_budget: foundMission.total_budget || 1000,
        rules: foundMission.rules || [
          'Créer un clip de 30-60 secondes',
          'Contenu original et engageant',
          'Respecter les guidelines'
        ],
        examples: foundMission.examples || [
          'Moments forts du contenu',
          'Réactions authentiques'
        ],
        status: foundMission.status || 'active',
        submissions_count: foundMission.submissions_count || 0,
        budget_remaining: foundMission.budget_remaining || foundMission.total_budget || 1000
      }

      setMission(adaptedMission)
      console.log('✅ Mission adaptée:', adaptedMission)

    } catch (error) {
      console.error('❌ ERREUR CHARGEMENT MISSION:', error)
      
      // Fallback ultime: créer une mission basique pour permettre la soumission
      console.log('🆘 Création mission fallback ultime...')
      const fallbackMission = createFallbackMissionForSubmission(missionId)
      setMission(fallbackMission)
      console.log('✅ Mission fallback ultime créée')
      
    } finally {
      setIsLoading(false)
      console.log('🏁 FIN CHARGEMENT MISSION')
    }
  }

  // Fonction pour créer une mission de fallback pour la soumission
  const createFallbackMissionForSubmission = (id: string): Mission => {
    console.log('🔄 Création mission fallback pour ID:', id)
    
    // Fallbacks spécifiques pour les IDs connus
    const specificFallbacks = {
      'fallback-mrbeast': {
        creator_name: 'MrBeast',
        creator_image: '/mrbeast.jpg',
        title: 'MrBeast Challenge',
        description: 'Crée des clips divertissants et engageants dans l\'esprit MrBeast',
        price_per_1k_views: 12
      },
      'fallback-speed': {
        creator_name: 'Speed',
        creator_image: '/speedfan.jpg',
        title: 'Speed Gaming',
        description: 'Clips gaming avec Speed, réactions et moments drôles',
        price_per_1k_views: 10
      },
      'fallback-kaicenat': {
        creator_name: 'Kai Cenat',
        creator_image: '/kaicenatfan.jpg',
        title: 'Kai Cenat Streaming',
        description: 'Moments forts de stream, réactions et lifestyle',
        price_per_1k_views: 9
      }
    }

    // Fallbacks génériques basés sur l'ID
    const genericFallbacks = [
      {
        creator_name: 'Créateur Viral',
        creator_image: '/mrbeast.jpg',
        title: 'Mission Viral Content',
        description: 'Créer du contenu viral et engageant',
        price_per_1k_views: 11
      },
      {
        creator_name: 'Gaming Creator',
        creator_image: '/speedfan.jpg',
        title: 'Gaming Challenge',
        description: 'Clips gaming créatifs et divertissants',
        price_per_1k_views: 10
      },
      {
        creator_name: 'Stream Creator',
        creator_image: '/kaicenatfan.jpg',
        title: 'Streaming Moments',
        description: 'Moments forts de stream et réactions',
        price_per_1k_views: 9
      }
    ]

    // Choisir le fallback approprié
    let fallbackData = specificFallbacks[id as keyof typeof specificFallbacks]
    
    if (!fallbackData) {
      // Utiliser un fallback générique basé sur la longueur de l'ID
      const index = id.length % genericFallbacks.length
      fallbackData = genericFallbacks[index]
    }

    console.log('✅ Fallback sélectionné:', fallbackData.title)

    return {
      id,
      title: fallbackData.title,
      description: fallbackData.description,
      creator_name: fallbackData.creator_name,
      creator_image: fallbackData.creator_image,
      price_per_1k_views: fallbackData.price_per_1k_views,
      total_budget: 2000,
      status: 'active',
      rules: [
        'Créer un clip de 30-60 secondes',
        'Contenu original et engageant',
        'Respecter les guidelines de la plateforme',
        'Pas de contenu inapproprié',
        'Sous-titres recommandés pour l\'accessibilité'
      ],
      examples: [
        'Moments forts du contenu',
        'Réactions authentiques',
        'Séquences engageantes',
        'Interactions naturelles'
      ],
      submissions_count: 3,
      budget_remaining: 1500
    }
  }

  const validateForm = () => {
    console.log('🔍 VALIDATION FORMULAIRE')
    console.log('========================')
    console.log('📋 Données à valider:', formData)
    
    const newErrors: any = {}

    if (!formData.tiktok_url) {
      console.log('❌ URL TikTok manquante')
      newErrors.tiktok_url = 'L\'URL TikTok est obligatoire'
    } else if (!formData.tiktok_url.includes('tiktok.com')) {
      console.log('❌ URL TikTok invalide:', formData.tiktok_url)
      newErrors.tiktok_url = 'L\'URL doit être un lien TikTok valide'
    } else {
      console.log('✅ URL TikTok valide:', formData.tiktok_url)
    }

    console.log('📋 Erreurs trouvées:', newErrors)
    console.log('✅ Validation réussie:', Object.keys(newErrors).length === 0)

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🚀 DÉBUT SOUMISSION CLIP')
    console.log('========================')
    
    if (!validateForm() || !mission) {
      console.log('❌ VALIDATION ÉCHOUÉE')
      console.log('  - validateForm():', validateForm())
      console.log('  - mission exists:', !!mission)
      console.log('  - errors:', errors)
      return
    }

    setIsSubmitting(true)
    setErrors({}) // Reset des erreurs

    // Timeout de sécurité pour débloquer l'interface
    const safetyTimeout = setTimeout(() => {
      console.log('⏰ TIMEOUT DE SÉCURITÉ - Déblocage de l\'interface')
      setIsSubmitting(false)
      setErrors({ submit: 'La soumission prend trop de temps. Vérifiez votre dashboard ou réessayez.' })
    }, 8000) // 8 secondes

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
        setErrors({ submit: 'Erreur d\'authentification. Veuillez vous reconnecter.' })
        return
      }

      if (!userData.user) {
        console.error('❌ Aucun utilisateur connecté')
        setErrors({ submit: 'Vous devez être connecté pour soumettre un clip.' })
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
        setErrors({ submit: 'Session expirée. Veuillez vous reconnecter.' })
        return
      }

      // 3. ✅ Validation des données
      console.log('🔍 ÉTAPE 3: Validation données...')
      console.log('📋 Mission actuelle:', { 
        id: missionId, 
        title: mission.title,
        exists: !!mission 
      })
      console.log('📋 User actuel:', { 
        id: user?.id, 
        pseudo: profile?.pseudo,
        role: profile?.role 
      })
      console.log('📋 Données du formulaire:', formData)

      // 4. ✅ Vérifier/créer la mission dans la base de données
      console.log('🔍 ÉTAPE 4: Vérification/création mission...')
      let missionCheck = null
      
      // D'abord, essayer de récupérer la mission existante
      const { data: existingMission, error: missionError } = await supabase
        .from('missions')
        .select('id, status, title, creator_name, price_per_1k_views, total_budget')
        .eq('id', missionId)
        .single()

      if (existingMission && !missionError) {
        // Mission existe déjà
        console.log('✅ Mission existante trouvée:', existingMission)
        missionCheck = existingMission
        
        if (missionCheck.status !== 'active') {
          console.error('❌ Mission inactive:', missionCheck.status)
          setErrors({ submit: 'Cette mission n\'est plus active.' })
          return
        }
      } else {
        // Mission n'existe pas, la créer basée sur les données de fallback/mission actuelle
        console.log('🔄 Mission inexistante, création automatique...')
        
        try {
          const newMissionData = {
            id: missionId,
            title: mission?.title || 'Mission Automatique',
            description: mission?.description || 'Mission créée automatiquement lors de la soumission',
            creator_name: mission?.creator_name || 'Créateur',
            creator_image: mission?.creator_image || '/mrbeast.jpg',
            price_per_1k_views: mission?.price_per_1k_views || 0.1,
            total_budget: mission?.total_budget || 2000,
            status: 'active',
            category: 'Divertissement',
            content_type: 'UGC',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          const { data: createdMission, error: createError } = await supabase
            .from('missions')
            .insert(newMissionData)
            .select()
            .single()

          if (createError) {
            console.error('❌ Impossible de créer la mission:', createError)
            setErrors({ submit: 'Erreur lors de la création de la mission. Contactez le support.' })
            return
          }

          console.log('✅ Mission créée automatiquement:', createdMission)
          missionCheck = createdMission
          
        } catch (createMissionError) {
          console.error('❌ Erreur création mission:', createMissionError)
          setErrors({ submit: 'Mission introuvable et impossible à créer. Réessayez plus tard.' })
          return
        }
      }

      console.log('✅ Mission validée/créée:', missionCheck)

      // 5. ✅ Préparer les données avec validation complète
      console.log('🔍 ÉTAPE 5: Préparation données...')
      const insertData = {
        mission_id: missionId,
        user_id: userData.user.id,
        tiktok_url: formData.tiktok_url.trim(),
        description: formData.description?.trim() || null,
        status: 'pending',
        views_count: 0,
        submission_type: 'url',
        created_at: new Date().toISOString()
      }
      
      console.log('📤 Données à insérer:', insertData)
      console.log('🔍 Validation données:')
      console.log('  - mission_id valide:', !!insertData.mission_id)
      console.log('  - user_id valide:', !!insertData.user_id)
      console.log('  - tiktok_url valide:', !!insertData.tiktok_url && insertData.tiktok_url.includes('tiktok.com'))
      console.log('  - user_id === auth.uid() ?', insertData.user_id === userData.user.id)

      // Vérifier que tous les champs requis sont présents
      if (!insertData.mission_id || !insertData.user_id || !insertData.tiktok_url) {
        console.error('❌ Données manquantes:', {
          mission_id: !!insertData.mission_id,
          user_id: !!insertData.user_id,
          tiktok_url: !!insertData.tiktok_url
        })
        throw new Error('Données manquantes pour la soumission')
      }

      // 6. ✅ Vérification de doublon (réactivée)
      console.log('🔍 ÉTAPE 6: Vérification doublon...')
      const { data: existingSubmission, error: checkError } = await supabase
        .from('submissions')
        .select('id, status, created_at')
        .eq('user_id', userData.user.id)
        .eq('mission_id', missionId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Erreur lors de la vérification doublon:', checkError)
        setErrors({ submit: 'Erreur lors de la vérification. Réessayez.' })
        return
      }

      if (existingSubmission) {
        console.log('⚠️ Clip déjà soumis:', existingSubmission)
        setErrors({ submit: 'Vous avez déjà soumis un clip pour cette mission.' })
        router.push('/dashboard/clipper/clips?info=already_submitted')
        return
      }

      console.log('✅ Aucun doublon trouvé')

      // 7. ✅ Insertion avec gestion d'erreur détaillée
      console.log('🔍 ÉTAPE 7: Insertion Supabase...')
      console.log('⏱️ Début requête à', new Date().toISOString())
      
      const startTime = Date.now()
      const { data, error } = await supabase
        .from('submissions')
        .insert(insertData)
        .select()

      const endTime = Date.now()
      console.log(`⏱️ Temps de réponse: ${endTime - startTime}ms`)

      if (error) {
        console.error('❌ ERREUR SUPABASE DÉTAILLÉE:')
        console.error('   Code:', error.code)
        console.error('   Message:', error.message)
        console.error('   Détails:', error.details)
        console.error('   Hint:', error.hint)
        console.error('   Objet complet:', error)
        
        // Gestion des erreurs spécifiques
        if (error.code === '23505') {
          console.log('🔄 Doublon détecté (constraint unique)')
          setErrors({ submit: 'Vous avez déjà soumis un clip pour cette mission.' })
          router.push('/dashboard/clipper/clips?info=already_submitted')
          return
        }
        
        if (error.code === '23503') {
          console.log('❌ Clé étrangère invalide - mission ou user inexistant')
          setErrors({ submit: 'Mission ou utilisateur introuvable. Veuillez réessayer.' })
          return
        }
        
        if (error.code === '42703') {
          console.log('❌ Colonne inexistante dans la table submissions')
          setErrors({ submit: 'Erreur de structure de données. Contactez le support.' })
          return
        }
        
        // Erreur générique
        setErrors({ submit: `Erreur de soumission: ${error.message}` })
        return
      }

      console.log('✅ SOUMISSION RÉUSSIE!')
      console.log('📋 Données insérées:', data)
      console.log('🎉 Redirection vers dashboard clipper...')
      
      // Force le retour à l'état normal AVANT la redirection
      setIsSubmitting(false)
      
      // Redirection avec gestion d'erreur
      try {
        console.log('🔄 Tentative de redirection...')
        router.push('/dashboard/clipper/clips?success=submission')
        console.log('✅ Redirection lancée')
      } catch (redirectError) {
        console.error('❌ Erreur redirection:', redirectError)
        // En cas d'erreur de redirection, afficher une alerte
        alert('Clip soumis avec succès ! Retournez au dashboard manuellement.')
      }
      
    } catch (error) {
      console.error('❌ ERREUR CATCH GLOBALE:', error)
      console.error('   Type:', typeof error)
      console.error('   Stack:', (error as Error).stack)
      
      // Gestion d'erreur spécifique
      const errorMessage = (error as any)?.message || 'Erreur inconnue'
      
      if (errorMessage.includes('Données manquantes')) {
        setErrors({ submit: 'Données manquantes. Vérifiez que tous les champs sont remplis.' })
      } else if (errorMessage.includes('relation "submissions" does not exist')) {
        console.log('📝 Table submissions manquante - problème de DB')
        setErrors({ submit: 'Table de données manquante. Contactez le support technique.' })
      } else if (errorMessage.includes('network')) {
        setErrors({ submit: 'Problème de connexion. Vérifiez votre internet et réessayez.' })
      } else {
        setErrors({ submit: `Erreur de soumission: ${errorMessage}` })
      }
    } finally {
      console.log('🏁 FIN handleSubmit - isSubmitting: false')
      clearTimeout(safetyTimeout) // Annuler le timeout de sécurité
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la mission...</p>
        </div>
      </div>
    )
  }

  if (!mission || !user || !profile) {
    return null
  }

  return (
    <RoleProtectionOptimized allowedRoles={['clipper']}>
      <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col fixed h-full z-50">
        {/* Logo */}
        <div className="p-12 border-b border-gray-200">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">R</span>
            </div>
            <span className="font-bold text-4xl text-gray-900">ClipTokk</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-12 py-12">
          <div className="space-y-6 mb-12">
            <a href="/dashboard/clipper" className="flex items-center gap-6 px-8 py-4 rounded-xl text-gray-600 hover:bg-gray-50 font-semibold text-xl">
              <IconDashboard className="w-7 h-7" />
              <span>Dashboard</span>
            </a>
            <a href="/dashboard/clipper/clips" className="flex items-center gap-6 px-8 py-4 rounded-xl text-gray-600 hover:bg-gray-50 font-semibold text-xl">
              <IconVideo className="w-7 h-7" />
              <span>Mes Clips</span>
            </a>
            <a href="/dashboard/clipper/revenus" className="flex items-center gap-6 px-8 py-4 rounded-xl text-gray-600 hover:bg-gray-50 font-semibold text-xl">
              <IconCoin className="w-7 h-7" />
              <span>Revenus</span>
            </a>
            <a href="/dashboard/clipper/leaderboard" className="flex items-center gap-6 px-8 py-4 rounded-xl text-gray-600 hover:bg-gray-50 font-semibold text-xl">
              <IconStar className="w-7 h-7" />
              <span>Leaderboard</span>
            </a>
          </div>

          {/* Stats mission */}
          <div className="border-t border-gray-100 pt-10">
            <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wide mb-8 flex items-center gap-3">
              <IconChartBar className="w-5 h-5" />
              Cette mission
            </h3>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg text-gray-600 font-semibold mb-2">Budget restant</p>
                    <p className="text-3xl font-bold text-gray-900">{mission.budget_remaining}€</p>
                  </div>
                  <IconCoin className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg text-gray-600 font-semibold mb-2">Clips soumis</p>
                    <p className="text-3xl font-bold text-gray-900">{mission.submissions_count}</p>
                  </div>
                  <IconVideo className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-12 border-t border-gray-200">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-2xl">
                {profile.pseudo?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold text-gray-900 truncate">{profile.pseudo}</p>
              <p className="text-xl text-gray-500 truncate">Clippeur</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-600 transition-colors p-4"
              title="Déconnexion"
            >
              <IconLogout className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-96">
        <main className="min-h-screen bg-gray-50" style={{backgroundColor: '#FAFAFA'}}>
          <div className="max-w-6xl mx-auto px-8 py-12">
            {/* Header avec retour */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <IconArrowLeft className="w-5 h-5" />
                Retour
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <h1 className="text-3xl font-bold text-gray-900">Soumettre un clip</h1>
            </div>

            {/* Info mission */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
              <div className="flex items-start gap-6">
                <img 
                  src={mission.creator_image} 
                  alt={mission.creator_name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{mission.title}</h2>
                  <p className="text-gray-600 mb-4">{mission.description}</p>
                  
                  {/* Paliers de paiement */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="bg-yellow-100 text-yellow-800 text-sm font-bold px-3 py-2 rounded-md w-fit mb-3">
                      💰 Paiement fixe par vues
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-800">📈 10K vues = 1€</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-800">📈 100K vues = 10€</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-800">📈 1M vues = 100€</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats rapides */}
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <IconCoin className="w-4 h-4" />
                      <span>Budget restant : <strong>{mission.budget_remaining}€</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconEye className="w-4 h-4" />
                      <span><strong>{mission.submissions_count}</strong> clips soumis</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Règles et exemples */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Règles */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <IconCheck className="w-6 h-6 text-green-500" />
                  Règles à respecter
                </h3>
                <ul className="space-y-3">
                  {mission.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exemples */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <IconStar className="w-6 h-6 text-yellow-500" />
                  Exemples de clips réussis
                </h3>
                <ul className="space-y-3">
                  {mission.examples.map((example, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Formulaire de soumission */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <IconUpload className="w-6 h-6 text-blue-500" />
                Soumettre ton clip
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* URL TikTok - Simplifié */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Lien de ton clip TikTok *
                  </label>
                  <input
                    type="url"
                    value={formData.tiktok_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, tiktok_url: e.target.value }))}
                    placeholder="https://tiktok.com/@username/video/..."
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.tiktok_url ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.tiktok_url && (
                    <p className="text-red-600 text-sm mt-1">{errors.tiktok_url}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Ajoute une description de ton clip, des détails sur le moment choisi..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Erreur générale */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <IconX className="w-5 h-5 text-red-500" />
                      <p className="text-red-700">{errors.submit}</p>
                    </div>
                  </div>
                )}

                {/* Boutons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Soumission...
                      </>
                    ) : (
                      <>
                        <IconCheck className="w-5 h-5" />
                        Soumettre ce clip
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
    </RoleProtectionOptimized>
  )
}