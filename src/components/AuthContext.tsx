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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()

  // Fonction pour nettoyer la session
  const clearSession = useCallback(async () => {
    try {
      // Nettoyer le localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase.auth')) {
          localStorage.removeItem(key)
        }
      })
      
      // Déconnexion complète
      await supabase.auth.signOut()
      
      // Reset des états
      setUser(null)
      setProfile(null)
      
      // Redirection
      router.push('/')
    } catch (error) {
      console.error('Erreur nettoyage session:', error)
    }
  }, [router])

  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true)

      // Récupérer la session active
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        await clearSession()
        return
      }

      // Mettre à jour l'utilisateur
      setUser(session.user)

      // Récupérer le profil
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        console.error('Erreur profil:', profileError)
        await clearSession()
        return
      }

      setProfile(userProfile)
      
      // Précharger les données du dashboard
      if (userProfile?.role === 'creator' || userProfile?.role === 'clipper') {
        preloadDashboardData(session.user.id)
      }
    } catch (error) {
      console.error('Erreur chargement données:', error)
      await clearSession()
    } finally {
      setIsLoading(false)
      setInitialized(true)
    }
  }, [clearSession])

  // Initialisation
  useEffect(() => {
    if (initialized) return

    loadUserData()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Événement auth:', event)
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await loadUserData()
        } else if (event === 'SIGNED_OUT') {
          await clearSession()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [initialized, loadUserData, clearSession])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    await loadUserData()
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