import { useState, useEffect } from 'react'
import { supabase } from './supabase'

// Cache TTL en millisecondes
const CACHE_TTL = {
  SHORT: 1000 * 60 * 5, // 5 minutes
  MEDIUM: 1000 * 60 * 30, // 30 minutes
  LONG: 1000 * 60 * 60 * 24, // 24 heures
}

// Cache en mémoire avec TTL
const memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>()

// Fonction utilitaire pour le cache
const withCache = async (key: string, ttl: number, fetcher: () => Promise<any>) => {
  const now = Date.now()
  const cached = memoryCache.get(key)

  if (cached && now - cached.timestamp < cached.ttl) {
    return cached.data
  }

  const data = await fetcher()
  memoryCache.set(key, { data, timestamp: now, ttl })
  return data
}

// Nettoyage périodique du cache
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of memoryCache.entries()) {
    if (now - value.timestamp > value.ttl) {
      memoryCache.delete(key)
    }
  }
}, CACHE_TTL.SHORT)

// Optimisation des requêtes utilisateur
export const getUserStatsOptimized = async (userId: string) => {
  return withCache(`user_stats_${userId}`, CACHE_TTL.SHORT, async () => {
    const { data, error } = await supabase
      .rpc('get_user_stats_optimized', { user_id: userId })
    
    if (error) throw error
    return data
  })
}

// Optimisation des requêtes de missions
export const getMissionsWithStatsOptimized = async (creatorId?: string) => {
  const cacheKey = `missions_${creatorId || 'all'}`
  
  return withCache(cacheKey, CACHE_TTL.SHORT, async () => {
    let query = supabase
      .from('missions')
      .select(`
        *,
        submissions:clip_submissions(count),
        total_views:clip_submissions(sum(views_count)),
        creator:profiles!missions_creator_id_fkey(pseudo, avatar_url)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (creatorId) {
      query = query.eq('creator_id', creatorId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  })
}

// Optimisation des requêtes de wallet
export const getUserWalletStats = async (userId: string) => {
  return withCache(`wallet_${userId}`, CACHE_TTL.SHORT, async () => {
    const { data, error } = await supabase
      .rpc('get_wallet_stats_optimized', { user_id: userId })
    
    if (error) throw error
    return data
  })
}

// Types optimisés
export interface UserStats {
  total_views: number
  total_earnings: number
  total_submissions: number
  average_views: number
  best_performing_clip: {
    id: string
    views: number
    url: string
  } | null
}

export interface MissionWithStats {
  id: string
  title: string
  description: string
  price_per_1k_views: number
  total_budget: number
  remaining_budget: number
  submissions_count: number
  total_views: number
  creator: {
    pseudo: string
    avatar_url: string | null
  }
}

export interface WalletStats {
  balance: number
  total_deposits: number
  total_withdrawals: number
  pending_earnings: number
  last_transaction?: {
    amount: number
    type: 'deposit' | 'withdrawal'
    date: string
  }
}

/**
 * Récupère les statistiques utilisateur optimisées
 */
export const getUserStatsOptimized = async (userId: string): Promise<UserStats> => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_stats', { p_user_id: userId })

    if (error) {
      console.error('Erreur getUserStatsOptimized:', error)
      return {
        total_views: 0,
        total_submissions: 0,
        total_earnings: 0,
        avg_views: 0,
        pending_submissions: 0,
        approved_submissions: 0
      }
    }
    
    // La fonction retourne un tableau, on prend le premier élément
    const stats = Array.isArray(data) && data.length > 0 ? data[0] : null
    
    return {
      total_views: Number(stats?.total_views || 0),
      total_submissions: Number(stats?.total_submissions || 0),
      total_earnings: Number(stats?.total_earnings || 0),
      avg_views: Number(stats?.avg_views || 0),
      pending_submissions: Number(stats?.pending_submissions || 0),
      approved_submissions: Number(stats?.approved_submissions || 0)
    }
  } catch (error) {
    console.error('Erreur getUserStatsOptimized:', error)
    return {
      total_views: 0,
      total_submissions: 0,
      total_earnings: 0,
      avg_views: 0,
      pending_submissions: 0,
      approved_submissions: 0
    }
  }
}

/**
 * Récupère les missions avec leurs statistiques
 */
export const getMissionsWithStatsOptimized = async (userId?: string): Promise<MissionWithStats[]> => {
  try {
    // Récupérer directement depuis la table missions avec category
    const { data, error } = await supabase
      .from('missions')
      .select(`
        id,
        title,
        description,
        creator_name,
        creator_thumbnail,
        video_url,
        price_per_1k_views,
        status,
        is_featured,
        created_at,
        creator_id,
        category,
        submissions(
          id,
          status,
          views_count,
          earnings
        )
      `)

    if (error) {
      console.error('Erreur getMissionsWithStatsOptimized:', error)
      return []
    }
    
    let missions = data || []
    
    // Si un userId est fourni, filtrer les missions de ce créateur
    if (userId) {
      missions = missions.filter((mission: any) => mission.creator_id === userId)
    }
    
    return missions.map((mission: any) => {
      const submissions = mission.submissions || []
      const totalSubmissions = submissions.length
      const pendingValidations = submissions.filter((s: any) => s.status === 'pending').length
      const totalViews = submissions.reduce((sum: number, s: any) => sum + (s.views_count || 0), 0)
      const totalEarnings = submissions.reduce((sum: number, s: any) => sum + (s.earnings || 0), 0)

      return {
        id: mission.id,
        title: mission.title,
        description: mission.description,
        creator_name: mission.creator_name,
        creator_thumbnail: mission.creator_thumbnail,
        video_url: mission.video_url,
        price_per_1k_views: Number(mission.price_per_1k_views || 0),
        status: mission.status,
        is_featured: Boolean(mission.is_featured),
        created_at: mission.created_at,
        creator_id: mission.creator_id,
        category: mission.category || 'Divertissement',
        total_submissions: totalSubmissions,
        pending_validations: pendingValidations,
        total_views: totalViews,
        total_earnings: totalEarnings
      }
    })
  } catch (error) {
    console.error('Erreur getMissionsWithStatsOptimized:', error)
    return []
  }
}

/**
 * Récupère les statistiques admin complètes
 */
export const getAdminStatsOptimized = async (): Promise<AdminStats> => {
  try {
    const { data, error } = await supabase
      .rpc('get_admin_dashboard_stats')

    if (error) {
      console.error('Erreur getAdminStatsOptimized:', error)
      return {
        total_users: 0,
        total_creators: 0,
        total_clippers: 0,
        total_missions: 0,
        active_missions: 0,
        total_submissions: 0,
        pending_validations: 0,
        total_views: 0,
        total_earnings: 0
      }
    }
    
    const stats = Array.isArray(data) && data.length > 0 ? data[0] : null
    
    return {
      total_users: Number(stats?.total_users || 0),
      total_creators: Number(stats?.total_creators || 0),
      total_clippers: Number(stats?.total_clippers || 0),
      total_missions: Number(stats?.total_missions || 0),
      active_missions: Number(stats?.active_missions || 0),
      total_submissions: Number(stats?.total_submissions || 0),
      pending_validations: Number(stats?.pending_validations || 0),
      total_views: Number(stats?.total_views || 0),
      total_earnings: Number(stats?.total_earnings || 0)
    }
  } catch (error) {
    console.error('Erreur getAdminStatsOptimized:', error)
    return {
      total_users: 0,
      total_creators: 0,
      total_clippers: 0,
      total_missions: 0,
      active_missions: 0,
      total_submissions: 0,
      pending_validations: 0,
      total_views: 0,
      total_earnings: 0
    }
  }
}

/**
 * Récupère les statistiques du wallet utilisateur
 */
export const getUserWalletStats = async (userId: string): Promise<WalletStats> => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_wallet_stats', { p_user_id: userId })

    if (error) {
      console.error('Erreur getUserWalletStats:', error)
      return {
        balance: 0,
        total_earned: 0,
        pending_earnings: 0,
        total_submissions: 0,
        recent_transactions: []
      }
    }
    
    const stats = Array.isArray(data) && data.length > 0 ? data[0] : null
    
    return {
      balance: Number(stats?.balance || 0),
      total_earned: Number(stats?.total_earned || 0),
      pending_earnings: Number(stats?.pending_earnings || 0),
      total_submissions: Number(stats?.total_submissions || 0),
      recent_transactions: stats?.recent_transactions || []
    }
  } catch (error) {
    console.error('Erreur getUserWalletStats:', error)
    return {
      balance: 0,
      total_earned: 0,
      pending_earnings: 0,
      total_submissions: 0,
      recent_transactions: []
    }
  }
}

/**
 * Nettoie les données obsolètes (à exécuter mensuellement)
 */
export const cleanupOldData = async () => {
  try {
    const { error } = await supabase
      .rpc('cleanup_old_data')

    if (error) throw error
    
    console.log('✅ Nettoyage des données terminé')
    return true
  } catch (error) {
    console.error('Erreur cleanupOldData:', error)
    return false
  }
}

/**
 * Hook optimisé pour les stats utilisateur avec gestion d'erreur améliorée
 */
export const useUserStatsOptimized = (userId: string | null) => {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setStats(null)
      setLoading(false)
      setError(null)
      return
    }

    const loadStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getUserStatsOptimized(userId)
        setStats(data)
      } catch (err) {
        console.error('Erreur useUserStatsOptimized:', err)
        setError('Erreur lors du chargement des statistiques')
        setStats(null)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [userId])

  return { stats, loading, error }
}

/**
 * Hook pour les missions avec stats
 */
export const useMissionsWithStats = (userId?: string) => {
  const [missions, setMissions] = useState<MissionWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMissions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMissionsWithStatsOptimized(userId)
      setMissions(data)
    } catch (err) {
      console.error('Erreur useMissionsWithStats:', err)
      setError('Erreur lors du chargement des missions')
      setMissions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMissions()
  }, [userId])

  return { missions, loading, error, refetch: loadMissions }
}

/**
 * Hook pour les stats wallet
 */
export const useWalletStats = (userId: string | null) => {
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadWalletStats = async () => {
    if (!userId) {
      setWalletStats(null)
      setLoading(false)
      setError(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getUserWalletStats(userId)
      setWalletStats(data)
    } catch (err) {
      console.error('Erreur useWalletStats:', err)
      setError('Erreur lors du chargement du wallet')
      setWalletStats(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWalletStats()
  }, [userId])

  return { walletStats, loading, error, refetch: loadWalletStats }
} 