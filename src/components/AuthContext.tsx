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

// Durée du cache réduite pour plus de réactivité
const CACHE_DURATION = 10000 // 10 secondes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()

  // Fonction pour nettoyer les tokens corrompus
  const clearCorruptedTokens = useCallback(() => {
    try {
      // Nettoyer tous les items Supabase du localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase.auth')) {
          localStorage.removeItem(key)
        }
      })
      // Forcer un refresh de la session
      supabase.auth.refreshSession()
    } catch (error) {
      console.error('Erreur nettoyage tokens:', error)
    }
  }, [])

  const loadUserData = useCallback(async (useCache: boolean = true) => {
    try {
      // Forcer le rechargement lors de la connexion
      if (!useCache) {
        clearCorruptedTokens()
      }

      // Vérifier l'authentification
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        clearCorruptedTokens()
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
        setIsLoading(false)
        router.push('/')
        return
      }

      if (!authUser) {
        setUser(null)
        setProfile(null)
        setIsLoading(false)
        return
      }

      // Mettre à jour l'utilisateur immédiatement
      setUser(authUser)

      // Récupérer le profil
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          setProfile(null)
        } else {
          console.error('Erreur profil:', profileError)
          setProfile(null)
        }
      } else {
        setProfile(userProfile)
        
        // Précharger les données du dashboard
        if (userProfile?.role === 'creator' || userProfile?.role === 'clipper') {
          preloadDashboardData(authUser.id)
        }
      }
    } catch (error) {
      console.error('Erreur auth:', error)
      clearCorruptedTokens()
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      router.push('/')
    } finally {
      setIsLoading(false)
      setInitialized(true)
    }
  }, [clearCorruptedTokens, router])

  // Initialisation
  useEffect(() => {
    if (initialized) return

    const initAuth = async () => {
      await loadUserData(false)
    }
    
    initAuth()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)
        
        if (event === 'SIGNED_IN') {
          setIsLoading(true)
          await loadUserData(false)
        } else if (event === 'SIGNED_OUT') {
          clearCorruptedTokens()
          setUser(null)
          setProfile(null)
          router.push('/')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [initialized, loadUserData, clearCorruptedTokens, router])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    await loadUserData(false)
  }, [user, loadUserData])

  const value = useMemo(() => ({
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
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