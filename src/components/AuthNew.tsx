'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { api, User, Profile } from '@/lib/supabase-new'

interface AuthContextType {
  user: SupabaseUser | null
  profile: Profile | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🔄 Initialisation auth...')
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const session = await api.getSession()
      
      if (session && session.user) {
        console.log('✅ Session trouvée:', session.user.email)
        setUser(session.user)
        
        const profileData = await api.getProfile(session.user.id)
        setProfile(profileData)
      } else {
        console.log('❌ Aucune session')
      }
    } catch (error) {
      console.error('❌ Erreur chargement utilisateur:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await api.signIn(email, password)
      
      if (result.success && result.user) {
        setUser(result.user)
        
        const profileData = await api.getProfile(result.user.id)
        setProfile(profileData)
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('❌ Erreur connexion:', error)
      return false
    }
  }

  const signOut = async () => {
    try {
      await api.signOut()
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isLoading,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 