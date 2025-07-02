'use client'

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { preloadDashboardData } from '@/hooks/useOptimizedData'
import type { User } from '@supabase/auth-js'

interface Profile {
  id: string
  email: string
  pseudo: string
  role: 'admin' | 'creator' | 'clipper'
  tiktok_username: string
  total_earnings: number
  created_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 🚀 Cache pour éviter les rechargements inutiles
let authCache: {
  user: User | null
  profile: Profile | null
  timestamp: number
} | null = null

const CACHE_DURATION = 30000 // 30 secondes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()

  // Fonction pour nettoyer les tokens corrompus
  const clearCorruptedTokens = useCallback(() => {
    try {
      localStorage.removeItem('supabase.auth.token')
      localStorage.removeItem('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1] + '-auth-token')
      // Nettoyer tous les items Supabase du localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') && key.includes('auth')) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      // Ignorer les erreurs de localStorage
    }
  }, [])

  const loadUserData = useCallback(async (useCache: boolean = true) => {
    try {
      // 🚀 Vérifier le cache d'abord (mais pas pendant la connexion)
      if (useCache && authCache && Date.now() - authCache.timestamp < CACHE_DURATION) {
        console.log('📦 Utilisation du cache AuthContext')
        setUser(authCache.user)
        setProfile(authCache.profile)
        setIsLoading(false)
        return
      }

      console.log('🔄 Rechargement AuthContext depuis Supabase')
      
      // Vérifier l'authentification
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      // Gérer silencieusement les erreurs de token invalide
      if (authError) {
        // Si c'est une erreur de refresh token, nettoyer silencieusement
        if (authError.message?.includes('refresh') || authError.message?.includes('token')) {
          clearCorruptedTokens()
          await supabase.auth.signOut()
        }
        authCache = { user: null, profile: null, timestamp: Date.now() }
        setUser(null)
        setProfile(null)
        setIsLoading(false)
        return
      }
      
      if (!authUser) {
        authCache = { user: null, profile: null, timestamp: Date.now() }
        setUser(null)
        setProfile(null)
        setIsLoading(false)
        return
      }

      // ✨ Mettre à jour l'utilisateur immédiatement
      setUser(authUser)

      // 🚀 Récupérer le profil en parallèle (ne pas bloquer l'UI)
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      const { data: userProfile, error } = await profilePromise

      if (error) {
        // Si c'est un nouvel utilisateur sans profil, c'est normal
        if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
          setProfile(null)
          authCache = { user: authUser, profile: null, timestamp: Date.now() }
        } else {
          console.error('Erreur récupération profil:', error)
          setProfile(null)
          authCache = { user: authUser, profile: null, timestamp: Date.now() }
        }
      } else {
        setProfile(userProfile)
        authCache = { user: authUser, profile: userProfile, timestamp: Date.now() }
        
        // 🚀 Pré-charger les données du dashboard en arrière-plan (non bloquant)
        if (userProfile?.role === 'creator' || userProfile?.role === 'clipper') {
          setTimeout(() => {
            preloadDashboardData(authUser.id)
          }, 100) // Délai minimal pour ne pas bloquer la redirection
        }
      }
    } catch (error) {
      // Gérer silencieusement les erreurs d'authentification sur les pages publiques
      const errorMessage = (error as Error).message?.toLowerCase() || ''
      if (errorMessage.includes('refresh') || errorMessage.includes('token')) {
        // Nettoyer silencieusement les tokens invalides
        clearCorruptedTokens()
        await supabase.auth.signOut()
      } else {
        console.error('Erreur chargement données utilisateur:', error)
      }
      authCache = { user: null, profile: null, timestamp: Date.now() }
      setUser(null)
      setProfile(null)
    } finally {
      setIsLoading(false)
      setInitialized(true)
    }
  }, [clearCorruptedTokens])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    
    const { data: userProfile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!error && userProfile) {
      setProfile(userProfile)
      // Mettre à jour le cache
      authCache = { user, profile: userProfile, timestamp: Date.now() }
    }
  }, [user])

  useEffect(() => {
    if (initialized) return // Éviter la double initialisation

    const initAuth = async () => {
      try {
        await loadUserData(false) // Force le chargement initial
      } catch (error) {
        setUser(null)
        setProfile(null)
        setIsLoading(false)
        setInitialized(true)
      }
    }
    
    initAuth()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Événement auth:', event, session?.user?.email)
        
        try {
          if (event === 'SIGNED_IN') {
            // Connexion réussie - charger immédiatement les données
            console.log('✅ SIGNED_IN détecté, chargement immédiat des données')
            setIsLoading(true) // Montrer qu'on charge
            await loadUserData(false) // Force rechargement lors des événements
          } else if (event === 'TOKEN_REFRESHED') {
            // Token rafraîchi - mettre à jour silencieusement
            await loadUserData(false)
          } else if (event === 'SIGNED_OUT') {
            console.log('🔓 SIGNED_OUT détecté')
            authCache = null // Vider le cache
            setUser(null)
            setProfile(null)
            setIsLoading(false)
            router.push('/')
          }
        } catch (error) {
          // Gérer silencieusement les erreurs d'événements d'auth
          console.debug('Événement d\'authentification ignoré:', event, error)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, loadUserData, initialized])

  // 🚀 Mémoïser la valeur du contexte pour éviter les re-rendus
  const value = useMemo(() => ({
    user,
    profile,
    isLoading,
    isAuthenticated: !!user, // Changé : seulement vérifier l'utilisateur, pas le profil
    refreshProfile
  }), [user, profile, isLoading, refreshProfile])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 