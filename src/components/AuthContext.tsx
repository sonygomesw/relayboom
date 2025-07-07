'use client'

import { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react'
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
  const timeoutRef = useRef<NodeJS.Timeout>()
  const isRedirectingRef = useRef(false)

  const loadUserData = useCallback(async () => {
    try {
      console.error('DEBUG - Chargement données utilisateur')
      setIsLoading(true)

      // Récupérer la session active
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('DEBUG - Erreur session:', sessionError)
        setUser(null)
        setProfile(null)
        return
      }

      if (!session) {
        console.error('DEBUG - Pas de session')
        setUser(null)
        setProfile(null)
        return
      }

      console.error('DEBUG - Session OK:', session.user.id)

      // Mettre à jour l'utilisateur
      setUser(session.user)

      // Récupérer le profil
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        console.error('DEBUG - Erreur profil:', profileError)
        return
      }

      if (!userProfile) {
        console.error('DEBUG - Profil non trouvé')
        return
      }

      console.error('DEBUG - Profil OK:', userProfile.role)
      setProfile(userProfile)
      
      // REDIRECTION AUTOMATIQUE après récupération du profil
      if (userProfile?.role && typeof window !== 'undefined' && !isRedirectingRef.current) {
        console.error('DEBUG - Vérification redirection')
        console.error('DEBUG - Page actuelle:', pathname)
        
        // Ne pas rediriger si déjà sur un chemin valide
        if (pathname?.includes('/dashboard') || pathname?.includes('/admin')) {
          console.error('DEBUG - Déjà sur un chemin valide')
          return
        }

        let redirectUrl = ''
        switch (userProfile.role) {
          case 'creator':
            redirectUrl = '/dashboard/creator'
            break
          case 'clipper':
            redirectUrl = '/dashboard/clipper'
            break
          case 'admin':
            redirectUrl = '/admin'
            break
        }
        
        if (redirectUrl) {
          console.error('DEBUG - Redirection vers:', redirectUrl)
          isRedirectingRef.current = true
          
          // Nettoyer l'ancien timeout si existant
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          
          // Redirection avec délai pour permettre le chargement des données
          timeoutRef.current = setTimeout(() => {
            console.error('DEBUG - Exécution redirection')
            router.push(redirectUrl)
            isRedirectingRef.current = false
          }, 1000) // Augmenté à 1 seconde
        }
      }
    } catch (error) {
      console.error('DEBUG - Erreur chargement:', error)
    } finally {
      console.error('DEBUG - Fin chargement')
      setIsLoading(false)
    }
  }, [router, pathname])

  // Initialisation et écoute des changements d'authentification
  useEffect(() => {
    if (typeof window === 'undefined') return

    console.error('DEBUG - Initialisation AuthContext')
    loadUserData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.error('DEBUG - Événement auth:', event)
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.error('DEBUG - Connexion détectée')
          await loadUserData()
        } else if (event === 'SIGNED_OUT') {
          console.error('DEBUG - Déconnexion détectée')
          setUser(null)
          setProfile(null)
          router.push('/')
        }
      }
    )

    return () => {
      console.error('DEBUG - Nettoyage AuthContext')
      subscription.unsubscribe()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [loadUserData, router])

  const refreshProfile = useCallback(async () => {
    console.error('DEBUG - Rafraîchissement profil')
    if (!user) {
      console.error('DEBUG - Pas d\'utilisateur')
      return
    }
    await loadUserData()
    console.error('DEBUG - Profil rafraîchi')
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