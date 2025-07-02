'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Début du callback auth...')
        console.log('Hash:', window.location.hash)
        console.log('Search params:', window.location.search)
        
        // Laisser Supabase gérer automatiquement les tokens depuis l'URL
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Erreur session:', error)
          setError('Erreur lors de la récupération de la session')
          return
        }
        
        console.log('📋 Session data:', data)
        
        if (data.session?.user) {
          const user = data.session.user
          console.log('👤 Utilisateur connecté:', user.email)
          
          // Attendre un peu pour que l'AuthContext se mette à jour
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Vérifier si l'utilisateur a un profil
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
          
          console.log('📝 Profil:', profile, 'Erreur:', profileError)
          
          if (profileError && profileError.code === 'PGRST116') {
            // Nouveau utilisateur, pas de profil encore
            console.log('🆕 Nouveau utilisateur, redirection vers onboarding')
            router.replace('/onboarding/role')
          } else if (profile?.role) {
            // Utilisateur existant avec rôle
            console.log('✅ Utilisateur existant, rôle:', profile.role)
            switch (profile.role) {
              case 'admin':
                router.replace('/admin')
                break
              case 'creator':
                router.replace('/dashboard/creator')
                break
              case 'clipper':
                router.replace('/dashboard/clipper')
                break
              default:
                router.replace('/')
            }
          } else {
            // Utilisateur sans rôle défini
            console.log('❓ Utilisateur sans rôle, redirection vers onboarding')
            router.replace('/onboarding/role')
          }
        } else {
          console.log('❌ Pas de session utilisateur')
          setError('Aucune session utilisateur trouvée')
        }
      } catch (err) {
        console.error('💥 Erreur callback auth:', err)
        setError('Erreur inattendue: ' + (err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    // Attendre un peu pour que l'URL soit complètement chargée
    const timer = setTimeout(handleAuthCallback, 100)
    return () => clearTimeout(timer)
  }, [router, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Finalisation de votre connexion...
          </h1>
          <p className="text-gray-600">
            Veuillez patienter pendant que nous configurons votre compte.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Erreur de connexion
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Chargement...
          </h1>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
} 