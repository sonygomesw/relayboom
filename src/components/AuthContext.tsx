'use client'

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
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
  const pathname = usePathname()

  const loadUserData = useCallback(async () => {
    try {
      console.log('Chargement des données utilisateur...')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Erreur session:', sessionError)
        throw sessionError
      }

      if (!session) {
        console.log('Pas de session active')
        setUser(null)
        setProfile(null)
        return
      }

      console.log('Session trouvée, utilisateur:', session.user.email)
      setUser(session.user)

      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        console.error('Erreur profil:', profileError)
        throw profileError
      }

      if (!userProfile) {
        console.error('Profil non trouvé pour l\'utilisateur:', session.user.id)
        return
      }

      console.log('Profil chargé:', userProfile.pseudo)
      setProfile(userProfile)
      
      // Redirection uniquement si sur la page d'accueil et après un délai
      if (userProfile?.role && pathname === '/') {
        const redirectMap: Record<Profile['role'], string> = {
          creator: '/dashboard/creator',
          clipper: '/dashboard/clipper',
          admin: '/admin'
        }
        
        const redirectUrl = redirectMap[userProfile.role]
        if (redirectUrl) {
          console.log('Redirection vers:', redirectUrl)
          setTimeout(() => {
            router.push(redirectUrl)
          }, 500) // Petit délai pour éviter les redirections trop rapides
        }
      }
    } catch (error) {
      console.error('Erreur chargement:', error)
      // En cas d'erreur, on réinitialise l'état
      setUser(null)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }, [router, pathname])

  useEffect(() => {
    if (typeof window === 'undefined') return

    console.log('Initialisation de l\'authentification...')
    loadUserData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Événement auth:', event)
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await loadUserData()
        } else if (event === 'SIGNED_OUT') {
          console.log('Déconnexion, réinitialisation...')
          setUser(null)
          setProfile(null)
          router.push('/')
        }
      }
    )

    return () => {
      console.log('Nettoyage de l\'authentification')
      subscription.unsubscribe()
    }
  }, [loadUserData, router])

  const refreshProfile = useCallback(async () => {
    if (!user) {
      console.log('Pas d\'utilisateur à rafraîchir')
      return
    }
    console.log('Rafraîchissement du profil...')
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