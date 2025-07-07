import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import useSWR from 'swr'
import type { UserStats, MissionWithStats, WalletStats } from '@/lib/supabase-optimized'
import { getUserStatsOptimized, getMissionsWithStatsOptimized, getUserWalletStats } from '@/lib/api-functions'

// Cache global pour éviter les requêtes répétées
const globalCache = new Map<string, { data: any; timestamp: number }>()

export const getCachedData = async (key: string, fetcher: () => Promise<any>, ttlMinutes = 5) => {
  const cached = globalCache.get(key)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < (ttlMinutes * 60 * 1000)) {
    console.log(`📦 Cache hit pour: ${key}`)
    return cached.data
  }
  
  console.log(`🔄 Requête pour: ${key}`)
  const data = await fetcher()
  globalCache.set(key, { data, timestamp: now })
  return data
}

// Hook pour vider le cache quand nécessaire
export const useCacheManager = () => {
  const clearCache = (pattern?: string) => {
    if (pattern) {
      // Vider seulement les clés qui correspondent au pattern
      Array.from(globalCache.keys()).forEach(key => {
        if (key.includes(pattern)) {
          globalCache.delete(key)
        }
      })
    } else {
      // Vider tout le cache
      globalCache.clear()
    }
  }

  const getCacheInfo = () => {
    return {
      size: globalCache.size,
      keys: Array.from(globalCache.keys())
    }
  }

  return { clearCache, getCacheInfo }
}

// Configuration SWR optimisée
const SWR_CONFIG = {
  revalidateOnFocus: false, // Ne pas revalidr au focus
  revalidateOnReconnect: true, // Revalider à la reconnexion
  refreshInterval: 0, // Pas de refresh automatique
  dedupingInterval: 60000, // 1 minute de déduplication
  errorRetryCount: 2,
  errorRetryInterval: 1000
}

// Hook optimisé pour les données utilisateur
export const useUserData = (userId: string | null) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const loadUserData = async () => {
      try {
        setLoading(true)
        
        // Charger profil et stats en parallèle avec cache
        const [profile, stats] = await Promise.all([
          getCachedData(
            `profile_${userId}`,
            async () => {
              const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()
              
              if (error) throw error
              return data
            },
            10 // Cache 10 minutes pour le profil
          ),
          getCachedData(
            `user_stats_${userId}`,
            async () => {
              // Requête optimisée avec seulement les champs nécessaires
              const { data, error } = await supabase
                .from('submissions')
                .select('views_count, earnings, status, created_at')
                .eq('user_id', userId)
                .eq('status', 'approved')
              
              if (error) throw error
              
              const totalViews = data?.reduce((sum, s) => sum + (s.views_count || 0), 0) || 0
              const totalEarnings = data?.reduce((sum, s) => sum + (s.earnings || 0), 0) || 0
              const totalSubmissions = data?.length || 0
              
              return {
                total_views: totalViews,
                total_earnings: totalEarnings,
                total_submissions: totalSubmissions,
                lastActivity: data?.[0]?.created_at || null
              }
            },
            2 // Cache 2 minutes pour les stats
          )
        ])

        setData({ profile, stats })
        setError(null)
      } catch (err) {
        console.error('Erreur chargement données utilisateur:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [userId])

  return { data, loading, error }
}

// Hook optimisé pour les missions
export const useMissions = () => {
  const [missions, setMissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMissions = async () => {
      try {
        setLoading(true)
        
        const data = await getCachedData(
          'missions_active',
          async () => {
            const { data, error } = await supabase
              .from('missions')
              .select('id, title, description, creator_name, creator_image, price_per_1k_views, total_budget, status, category, created_at')
              .eq('status', 'active')
              .order('created_at', { ascending: false })
              .limit(50)
            
            if (error) throw error
            return data || []
          },
          5 // Cache 5 minutes
        )

        setMissions(data)
        setError(null)
      } catch (err) {
        console.error('Erreur chargement missions:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    loadMissions()
  }, [])

  return { missions, loading, error }
}

// Hook pour les clips d'un utilisateur
export const useUserClips = (userId: string | null) => {
  const [clips, setClips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const loadClips = async () => {
      try {
        setLoading(true)
        
        const data = await getCachedData(
          `user_clips_${userId}`,
          async () => {
            const { data, error } = await supabase
              .from('submissions')
              .select(`
                id,
                status,
                views_count,
                created_at,
                tiktok_url,
                mission_id,
                missions!submissions_mission_id_fkey (
                  id,
                  title,
                  price_per_1k_views
                )
              `)
              .eq('user_id', userId)
              .order('created_at', { ascending: false })
              .limit(50)
            
            if (error) throw error
            return data || []
          },
          3 // Cache 3 minutes
        )

        setClips(data)
        setError(null)
      } catch (err) {
        console.error('Erreur chargement clips:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    loadClips()
  }, [userId])

  return { clips, loading, error }
}

// 🚀 Hook pour les statistiques admin optimisées
export const useAdminStats = () => {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAdminStats = async () => {
      try {
        setLoading(true)
        
        // Utiliser des requêtes COUNT optimisées au lieu de récupérer toutes les données
        const [
          { count: totalUsers },
          { count: totalMissions },
          { count: totalSubmissions },
          { count: pendingValidations }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('missions').select('*', { count: 'exact', head: true }),
          supabase.from('submissions').select('*', { count: 'exact', head: true }),
          supabase.from('clip_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending')
        ])

        setStats({
          totalUsers: totalUsers || 0,
          totalMissions: totalMissions || 0,
          totalSubmissions: totalSubmissions || 0,
          pendingValidations: pendingValidations || 0
        })
      } catch (err) {
        console.error('Erreur stats admin:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAdminStats()
  }, [])

  return { stats, loading }
}

// 🚀 Hook pour débouncer les recherches
export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * 🚀 Hook ultra-optimisé pour les stats utilisateur avec cache SWR
 */
export function useUserStatsCache(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? [`user-stats`, userId] : null,
    async ([, id]) => {
      console.log('🔥 Chargement stats pour:', id)
      return await getUserStatsOptimized(id)
    },
    {
      ...SWR_CONFIG,
      revalidateOnMount: true, // Charger au montage
    }
  )

  return {
    stats: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch: mutate
  }
}

/**
 * 🚀 Hook ultra-optimisé pour les missions avec cache SWR
 */
export function useMissionsCache(userId?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    [`missions-with-stats`, userId || 'all'],
    async ([, id]) => {
      console.log('🔥 Chargement missions pour:', id)
      return await getMissionsWithStatsOptimized(id === 'all' ? undefined : id)
    },
    {
      ...SWR_CONFIG,
      revalidateOnMount: true,
    }
  )

  return {
    missions: data || [],
    loading: isLoading,
    error: error?.message || null,
    refetch: mutate
  }
}

/**
 * 🚀 Hook ultra-optimisé pour le wallet avec cache SWR
 */
export function useWalletCache(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? [`wallet-stats`, userId] : null,
    async ([, id]) => {
      console.log('🔥 Chargement wallet pour:', id)
      return await getUserWalletStats(id)
    },
    {
      ...SWR_CONFIG,
      revalidateOnMount: true,
    }
  )

  return {
    walletStats: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch: mutate
  }
}

/**
 * 🔥 Hook MEGA-OPTIMISÉ qui charge TOUT en parallèle d'un coup
 */
export function useDashboardDataParallel(userId: string | null) {
  // Charger toutes les données en parallèle avec SWR
  const userStats = useUserStatsCache(userId)
  const missions = useMissionsCache(userId || undefined)
  const wallet = useWalletCache(userId)

  // Loading global - true si AU MOINS un est en train de charger
  const isLoading = userStats.loading || missions.loading || wallet.loading
  
  // Erreur globale - retourner la première erreur trouvée
  const error = userStats.error || missions.error || wallet.error

  // Données globales
  const data = {
    userStats: userStats.stats,
    missions: missions.missions,
    walletStats: wallet.walletStats
  }

  // Fonction pour recharger toutes les données
  const refetchAll = async () => {
    await Promise.all([
      userStats.refetch(),
      missions.refetch(),
      wallet.refetch()
    ])
  }

  return {
    ...data,
    isLoading,
    error,
    refetchAll
  }
}

/**
 * 🚀 Pré-charger les données au login pour une navigation ultra-rapide
 */
export function preloadDashboardData(userId: string) {
  // Pré-charger en arrière-plan
  Promise.all([
    getUserStatsOptimized(userId),
    getMissionsWithStatsOptimized(userId),
    getUserWalletStats(userId)
  ]).then(() => {
    console.log('✅ Données pré-chargées pour:', userId)
  }).catch(error => {
    console.warn('⚠️ Erreur pré-chargement:', error)
  })
} 