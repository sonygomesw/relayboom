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

// API ultra-optimisée pour les données fréquentes
export const cliptokkAPI = {
  // Profil utilisateur (cache 30min)
  getUserProfile: async (userId: string) => {
    return getDataUltraFast(
      `profile_${userId}`,
      async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, pseudo, email, role, created_at')
          .eq('id', userId)
          .single()
        
        if (error) throw error
        return data
      },
      CACHE_DURATION.PROFILE
    )
  },

  // Stats utilisateur (cache 2min)
  getUserStats: async (userId: string) => {
    return getDataUltraFast(
      `stats_${userId}`,
      async () => {
        const { data, error } = await supabase
          .from('submissions')
          .select('views_count, earnings, status')
          .eq('user_id', userId)
          .eq('status', 'approved')
        
        if (error) throw error
        
        const totalViews = data?.reduce((sum, s) => sum + (s.views_count || 0), 0) || 0
        const totalEarnings = data?.reduce((sum, s) => sum + (s.earnings || 0), 0) || 0
        const totalSubmissions = data?.length || 0
        
        return {
          total_views: totalViews,
          total_earnings: totalEarnings,
          total_submissions: totalSubmissions
        }
      },
      CACHE_DURATION.USER_STATS
    )
  },

  // Missions actives (cache 5min)
  getActiveMissions: async () => {
    return getDataUltraFast(
      'missions_active',
      async () => {
        const { data, error } = await supabase
          .from('missions')
          .select('id, title, description, creator_name, creator_image, price_per_1k_views, total_budget, status, category')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(20) // Limiter à 20 pour la rapidité
        
        if (error) throw error
        return data || []
      },
      CACHE_DURATION.MISSIONS
    )
  },

  // Clips utilisateur (cache 3min)
  getUserClips: async (userId: string) => {
    return getDataUltraFast(
      `clips_${userId}`,
      async () => {
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
          .limit(30) // Limiter pour la rapidité
        
        if (error) throw error
        return data || []
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