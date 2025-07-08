import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types ultra-simples
export interface User {
  id: string
  email: string
}

export interface Profile {
  id: string
  email: string
  pseudo: string
  role: 'creator' | 'clipper' | null
}

export interface Mission {
  id: string
  title: string
  description: string
  creator_name: string
  creator_image: string
  price_per_1k_views: number
  status: string
}

export interface Submission {
  id: string
  user_id: string
  mission_id: string
  tiktok_url: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

// API ultra-simple qui fonctionne
export const api = {
  // Connexion
  async signIn(email: string, password: string) {
    console.log('🔐 Tentative de connexion:', email)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.error('❌ Erreur connexion:', error.message)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Connexion réussie:', data.user?.email)
    return { success: true, user: data.user }
  },

  // Récupérer session
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  // Déconnexion
  async signOut() {
    await supabase.auth.signOut()
  },

  // Récupérer profil
  async getProfile(userId: string): Promise<Profile | null> {
    console.log('👤 Récupération profil:', userId)
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('❌ Erreur profil:', error.message)
      return null
    }
    
    console.log('✅ Profil récupéré:', data.email)
    return data
  },

  // Récupérer missions
  async getMissions(): Promise<Mission[]> {
    console.log('🎯 Récupération missions')
    
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Erreur missions:', error.message)
      return []
    }
    
    console.log('✅ Missions récupérées:', data?.length || 0)
    return data || []
  },

  // Récupérer une mission
  async getMission(id: string): Promise<Mission | null> {
    console.log('🎯 Récupération mission:', id)
    
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('❌ Erreur mission:', error.message)
      return null
    }
    
    console.log('✅ Mission récupérée:', data.title)
    return data
  },

  // Créer soumission - ULTRA SIMPLE
  async createSubmission(userId: string, missionId: string, tiktokUrl: string, description: string = ''): Promise<boolean> {
    console.log('📤 Création soumission:', { userId, missionId, tiktokUrl })
    
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert({
          user_id: userId,
          mission_id: missionId,
          tiktok_url: tiktokUrl,
          description: description,
          status: 'pending',
          views_count: 0,
          earnings: 0
        })
        .select()
        .single()
      
      if (error) {
        console.error('❌ Erreur création soumission:', error.message)
        return false
      }
      
      console.log('✅ Soumission créée:', data.id)
      return true
    } catch (err) {
      console.error('❌ Erreur création soumission:', err)
      return false
    }
  },

  // Récupérer soumissions utilisateur
  async getUserSubmissions(userId: string): Promise<Submission[]> {
    console.log('📋 Récupération soumissions:', userId)
    
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Erreur soumissions:', error.message)
      return []
    }
    
    console.log('✅ Soumissions récupérées:', data?.length || 0)
    return data || []
  }
} 