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
  const router = useRouter()

  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true)

      // Récupérer la session active
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Erreur session:', sessionError)
        setUser(null)
        setProfile(null)
        return
      }

      if (!session) {
        setUser(null)
        setProfile(null)
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
        return
      }

      setProfile(userProfile)
      
      // Précharger les données du dashboard
      if (userProfile?.role === 'creator' || userProfile?.role === 'clipper') {
        preloadDashboardData(session.user.id)
      }
      
      // REDIRECTION AUTOMATIQUE après récupération du profil
      if (userProfile?.role && typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        console.log('📍 Page actuelle:', currentPath)
        
        // Ne rediriger que si on est sur la page d'accueil ou d'auth
        if (currentPath === '/' || currentPath.includes('/auth') || currentPath.includes('/onboarding')) {
          let redirectUrl = ''
          
          if (userProfile.role === 'creator') {
            redirectUrl = '/dashboard/creator'
          } else if (userProfile.role === 'clipper') {
            redirectUrl = '/dashboard/clipper'
          } else if (userProfile.role === 'admin') {
            redirectUrl = '/admin'
          }
          
          if (redirectUrl) {
            console.log('🔄 AuthContext: Redirection automatique vers', redirectUrl)
            router.push(redirectUrl)
          }
        } else {
          console.log('📍 Déjà sur une page appropriée, pas de redirection')
        }
      }
    } catch (error) {
      console.error('Erreur chargement données:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initialisation et écoute des changements d'authentification
  useEffect(() => {
    loadUserData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Événement auth:', event)
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await loadUserData()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          router.push('/')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [loadUserData, router])

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