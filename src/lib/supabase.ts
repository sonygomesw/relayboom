import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

export const getCachedData = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMinutes: number = 5
): Promise<T> => {
  const cached = cache.get(key)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < (cached.ttl * 60 * 1000)) {
    return cached.data
  }
  
  const data = await fetcher()
  
  cache.set(key, {
    data,
    timestamp: now,
    ttl: ttlMinutes
  })
  
  return data
}

export const supabaseOptimized = {
  getMissions: () => getCachedData(
    'missions',
    async () => {
      const { data } = await supabase
        .from('missions')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
      return data
    },
    5
  ),
  
  getUserProfile: (userId: string) => getCachedData(
    `profile_${userId}`,
    async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      return data
    },
    2
  ),
  
  getUserStats: (userId: string) => getCachedData(
    `stats_${userId}`,
    async () => {
      const { data } = await supabase
        .from('submissions')
        .select(`
          views_count,
          created_at,
          missions!inner(price_per_1k_views)
        `)
        .eq('user_id', userId)
      
      return data || []
    },
    1
  )
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          pseudo: string
          tiktok_username: string
          role: 'creator' | 'clipper' | null
          created_at: string
          total_earnings: number
        }
        Insert: {
          id: string
          email: string
          pseudo: string
          tiktok_username: string
          role?: 'creator' | 'clipper' | null
          created_at?: string
          total_earnings?: number
        }
        Update: {
          id?: string
          email?: string
          pseudo?: string
          tiktok_username?: string
          role?: 'creator' | 'clipper' | null
          created_at?: string
          total_earnings?: number
        }
      }
      missions: {
        Row: {
          id: string
          title: string
          description: string
          creator_name: string
          creator_thumbnail: string
          video_url: string
          price_per_1k_views: number
          status: 'active' | 'paused' | 'completed'
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          creator_name: string
          creator_thumbnail: string
          video_url: string
          price_per_1k_views?: number
          status?: 'active' | 'paused' | 'completed'
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          creator_name?: string
          creator_thumbnail?: string
          video_url?: string
          price_per_1k_views?: number
          status?: 'active' | 'paused' | 'completed'
          is_featured?: boolean
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          user_id: string
          mission_id: string
          tiktok_url: string
          views_count: number
          earnings: number
          status: 'pending' | 'approved' | 'paid' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mission_id: string
          tiktok_url: string
          views_count?: number
          earnings?: number
          status?: 'pending' | 'approved' | 'paid' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mission_id?: string
          tiktok_url?: string
          views_count?: number
          earnings?: number
          status?: 'pending' | 'approved' | 'paid' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 