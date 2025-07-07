import { createClient } from '@supabase/supabase-js'

// Configuration Supabase optimisée
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client Supabase optimisé avec configuration avancée
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
    multiTab: true
  },
  global: {
    headers: {
      'x-application-name': 'cliptokk',
      'x-client-info': 'web'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Optimisation des requêtes avec retry et timeout
export const optimizedQuery = async <T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  options: {
    retries?: number;
    timeout?: number;
    fallback?: T;
  } = {}
) => {
  const { retries = 3, timeout = 5000, fallback = null } = options

  let attempt = 0
  while (attempt < retries) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const { data, error } = await queryFn()
      clearTimeout(timeoutId)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      attempt++
      if (attempt === retries) {
        console.error('Supabase query failed after retries:', error)
        return { data: fallback, error }
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }

  return { data: fallback, error: new Error('Query failed') }
}

// Optimisation des requêtes en lot
export const batchQuery = async <T>(
  queries: (() => Promise<{ data: T | null; error: any }>)[],
  options: {
    parallel?: boolean;
    stopOnError?: boolean;
  } = {}
) => {
  const { parallel = true, stopOnError = false } = options

  if (parallel) {
    try {
      const results = await Promise.all(
        queries.map(query => 
          optimizedQuery(query)
            .catch(error => ({ data: null, error }))
        )
      )
      return results
    } catch (error) {
      console.error('Batch query failed:', error)
      return queries.map(() => ({ data: null, error }))
    }
  }

  const results = []
  for (const query of queries) {
    const result = await optimizedQuery(query)
    results.push(result)
    if (stopOnError && result.error) break
  }
  return results
}

// Optimisation des requêtes avec mise en cache
const queryCache = new Map<string, { data: any; timestamp: number }>()

export const cachedQuery = async <T>(
  key: string,
  queryFn: () => Promise<{ data: T | null; error: any }>,
  ttlSeconds = 300 // 5 minutes par défaut
) => {
  const cached = queryCache.get(key)
  const now = Date.now()

  if (cached && (now - cached.timestamp) < ttlSeconds * 1000) {
    return { data: cached.data, error: null }
  }

  const { data, error } = await optimizedQuery(queryFn)
  
  if (!error && data) {
    queryCache.set(key, { data, timestamp: now })
  }

  return { data, error }
}

// Nettoyage périodique du cache
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of queryCache.entries()) {
    if (now - value.timestamp > 300000) { // 5 minutes
      queryCache.delete(key)
    }
  }
}, 60000) // Vérifier toutes les minutes

// Optimisation des requêtes en temps réel
export const optimizedSubscription = (
  channel: string,
  callback: (payload: any) => void,
  errorCallback?: (error: any) => void
) => {
  const subscription = supabase
    .channel(channel)
    .on('presence', { event: '*' }, payload => {
      try {
        callback(payload)
      } catch (error) {
        console.error('Subscription callback error:', error)
        errorCallback?.(error)
      }
    })
    .subscribe(status => {
      if (status === 'SUBSCRIBED') {
        console.log(`✅ Subscribed to ${channel}`)
      } else if (status === 'CLOSED') {
        console.log(`❌ Subscription to ${channel} closed`)
        // Tentative de reconnexion après 5 secondes
        setTimeout(() => {
          subscription.subscribe()
        }, 5000)
      }
    })

  return () => {
    subscription.unsubscribe()
  }
}

// Cache ultra-rapide avec localStorage
const CACHE_PREFIX = 'cliptokk_'
const CACHE_DURATION = {
  PROFILE: 30 * 60 * 1000, // 30 minutes
  MISSIONS: 5 * 60 * 1000,  // 5 minutes
  USER_STATS: 2 * 60 * 1000, // 2 minutes
  CLIPS: 3 * 60 * 1000      // 3 minutes
}

interface CacheItem {
  data: any
  timestamp: number
  ttl: number
}

// Cache localStorage ultra-rapide
export const fastCache = {
  set: (key: string, data: any, ttl: number) => {
    if (typeof window === 'undefined') return
    
    const item: CacheItem = {
      data,
      timestamp: Date.now(),
      ttl
    }
    
    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item))
    } catch (error) {
      console.warn('Cache localStorage plein, nettoyage...')
      fastCache.cleanup()
    }
  },

  get: (key: string) => {
    if (typeof window === 'undefined') return null
    
    try {
      const stored = localStorage.getItem(CACHE_PREFIX + key)
      if (!stored) return null
      
      const item: CacheItem = JSON.parse(stored)
      const now = Date.now()
      
      if (now - item.timestamp > item.ttl) {
        localStorage.removeItem(CACHE_PREFIX + key)
        return null
      }
      
      return item.data
    } catch {
      return null
    }
  },

  clear: (pattern?: string) => {
    if (typeof window === 'undefined') return
    
    if (pattern) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_PREFIX) && key.includes(pattern)) {
          localStorage.removeItem(key)
        }
      })
    } else {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    }
  },

  cleanup: () => {
    if (typeof window === 'undefined') return
    
    const now = Date.now()
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const item: CacheItem = JSON.parse(localStorage.getItem(key) || '{}')
          if (now - item.timestamp > item.ttl) {
            localStorage.removeItem(key)
          }
        } catch {
          localStorage.removeItem(key)
        }
      }
    })
  }
}

// Fonction ultra-optimisée pour les données
export const getDataUltraFast = async (key: string, fetcher: () => Promise<any>, ttl: number) => {
  // 1. Vérifier le cache localStorage d'abord (ultra-rapide)
  const cached = fastCache.get(key)
  if (cached) {
    console.log(`⚡ Cache localStorage hit: ${key}`)
    return cached
  }

  // 2. Si pas en cache, faire la requête
  console.log(`🔄 Requête réseau: ${key}`)
  try {
    const data = await fetcher()
    
    // 3. Mettre en cache immédiatement
    fastCache.set(key, data, ttl)
    
    return data
  } catch (error) {
    console.error(`❌ Erreur requête ${key}:`, error)
    throw error
  }
}

// Fonction de fallback pour les missions
const getFallbackMissions = () => [
  {
    id: 'fallback-mrbeast',
    title: 'MrBeast Challenge',
    description: 'Crée des clips divertissants et engageants dans l\'esprit MrBeast',
    creator_name: 'MrBeast',
    creator_image: '/mrbeast.jpg',
    price_per_1k_views: 12,
    total_budget: 5000,
    status: 'active',
    category: 'Divertissement'
  },
  {
    id: 'fallback-speed',
    title: 'Speed Gaming',
    description: 'Clips gaming avec Speed, réactions et moments drôles',
    creator_name: 'Speed',
    creator_image: '/speedfan.jpg',
    price_per_1k_views: 10,
    total_budget: 3000,
    status: 'active',
    category: 'Gaming'
  },
  {
    id: 'fallback-kaicenat',
    title: 'Kai Cenat Streaming',
    description: 'Moments forts de stream, réactions et lifestyle',
    creator_name: 'Kai Cenat',
    creator_image: '/kaicenatfan.jpg',
    price_per_1k_views: 9,
    total_budget: 2500,
    status: 'active',
    category: 'Streaming'
  }
]

// API ultra-optimisée pour les données fréquentes avec fallbacks robustes
export const cliptokkAPI = {
  // Diagnostic de santé des tables
  diagnoseTables: async () => {
    const results = {
      profiles: false,
      missions: false,
      submissions: false,
      errors: [] as string[]
    }

    try {
      // Test table profiles
      const { error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
      
      if (profilesError) {
        results.errors.push(`Profiles: ${profilesError.message}`)
      } else {
        results.profiles = true
      }
    } catch (e) {
      results.errors.push(`Profiles exception: ${e}`)
    }

    try {
      // Test table missions
      const { error: missionsError } = await supabase
        .from('missions')
        .select('id')
        .limit(1)
      
      if (missionsError) {
        results.errors.push(`Missions: ${missionsError.message}`)
      } else {
        results.missions = true
      }
    } catch (e) {
      results.errors.push(`Missions exception: ${e}`)
    }

    try {
      // Test table submissions
      const { error: submissionsError } = await supabase
        .from('submissions')
        .select('id')
        .limit(1)
      
      if (submissionsError) {
        results.errors.push(`Submissions: ${submissionsError.message}`)
      } else {
        results.submissions = true
      }
    } catch (e) {
      results.errors.push(`Submissions exception: ${e}`)
    }

    return results
  },

  // Profil utilisateur (cache 30min) avec fallback robuste
  getUserProfile: async (userId: string) => {
    return getDataUltraFast(
      `profile_${userId}`,
      async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, pseudo, email, role, created_at')
            .eq('id', userId)
            .single()
          
          if (error) {
            console.warn('⚠️ Erreur profiles, fallback utilisé:', error.message)
            // Fallback robuste
            return {
              id: userId,
              pseudo: 'Utilisateur',
              email: 'email@example.com',
              role: 'clipper',
              created_at: new Date().toISOString()
            }
          }
          
          return data || {
            id: userId,
            pseudo: 'Utilisateur',
            email: 'email@example.com',
            role: 'clipper',
            created_at: new Date().toISOString()
          }
        } catch (e) {
          console.warn('⚠️ Exception profiles, fallback utilisé:', e)
          return {
            id: userId,
            pseudo: 'Utilisateur',
            email: 'email@example.com',
            role: 'clipper',
            created_at: new Date().toISOString()
          }
        }
      },
      CACHE_DURATION.PROFILE
    )
  },

  // Stats utilisateur (cache 2min) avec fallback robuste
  getUserStats: async (userId: string) => {
    return getDataUltraFast(
      `stats_${userId}`,
      async () => {
        try {
          const { data, error } = await supabase
            .from('submissions')
            .select('views_count, earnings, status')
            .eq('user_id', userId)
            .eq('status', 'approved')
          
          if (error) {
            console.warn('⚠️ Erreur submissions stats, fallback utilisé:', error.message)
            return {
              total_views: 0,
              total_earnings: 0,
              total_submissions: 0
            }
          }
          
          const totalViews = data?.reduce((sum, s) => sum + (s.views_count || 0), 0) || 0
          const totalEarnings = data?.reduce((sum, s) => sum + (s.earnings || 0), 0) || 0
          const totalSubmissions = data?.length || 0
          
          return {
            total_views: totalViews,
            total_earnings: totalEarnings,
            total_submissions: totalSubmissions
          }
        } catch (e) {
          console.warn('⚠️ Exception submissions stats, fallback utilisé:', e)
          return {
            total_views: 0,
            total_earnings: 0,
            total_submissions: 0
          }
        }
      },
      CACHE_DURATION.USER_STATS
    )
  },

  // Missions actives (cache 5min) avec fallback robuste
  getActiveMissions: async () => {
    return getDataUltraFast(
      'missions_active',
      async () => {
        try {
          const { data, error } = await supabase
            .from('missions')
            .select('id, title, description, creator_name, creator_image, price_per_1k_views, total_budget, status, category')
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(20)
          
          if (error) {
            console.warn('⚠️ Erreur missions, fallback utilisé:', error.message)
            return getFallbackMissions()
          }
          
          return data && data.length > 0 ? data : getFallbackMissions()
        } catch (e) {
          console.warn('⚠️ Exception missions, fallback utilisé:', e)
          return getFallbackMissions()
        }
      },
      CACHE_DURATION.MISSIONS
    )
  },

  // Clips utilisateur (cache 3min) avec fallback robuste
  getUserClips: async (userId: string) => {
    return getDataUltraFast(
      `clips_${userId}`,
      async () => {
        try {
          const { data, error } = await supabase
            .from('submissions')
            .select(`
              id,
              status,
              views_count,
              created_at,
              tiktok_url,
              mission_id
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(30)
          
          if (error) {
            console.warn('⚠️ Erreur clips, fallback utilisé:', error.message)
            return []
          }
          
          return data || []
        } catch (e) {
          console.warn('⚠️ Exception clips, fallback utilisé:', e)
          return []
        }
      },
      CACHE_DURATION.CLIPS
    )
  },

  createMission: async (missionData: {
    title: string
    description: string
    price_per_1k_views: number
    total_budget: number
    category: string
    video_url: string
    brand_guidelines?: string
    creator_id: string
    creator_name: string
    status: string
  }) => {
    const { data, error } = await supabase
      .from('missions')
      .insert([{
        ...missionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()

    if (error) {
      throw new Error(`Erreur lors de la création de la mission: ${error.message}`)
    }

    return data[0]
  }
}

// Nettoyage automatique du cache au démarrage
if (typeof window !== 'undefined') {
  fastCache.cleanup()
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