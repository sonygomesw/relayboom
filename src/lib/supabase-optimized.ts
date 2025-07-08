import { useState, useEffect } from 'react'
import { supabase, cliptokkAPI } from './supabase'

// Cache TTL en millisecondes
const CACHE_TTL = {
  SHORT: 1000 * 60 * 5, // 5 minutes
  MEDIUM: 1000 * 60 * 30, // 30 minutes
  LONG: 1000 * 60 * 60 * 24, // 24 heures
}

// Types optimisés
export interface UserStats {
  total_views: number
  total_earnings: number
  total_submissions: number
  avg_views: number
  pending_submissions: number
  approved_submissions: number
}

export interface MissionWithStats {
  id: string
  title: string
  description: string
  creator_name: string
  creator_thumbnail: string
  video_url: string
  price_per_1k_views: number
  total_budget: number
  remaining_budget: number
  status: string
  is_featured: boolean
  created_at: string
  creator_id: string
  category: string
  total_submissions: number
  pending_validations: number
  total_views: number
  total_earnings: number
  creator: {
    pseudo: string
    avatar_url: string | null
  }
}

export interface AdminStats {
  total_users: number
  total_creators: number
  total_clippers: number
  total_missions: number
  active_missions: number
  total_submissions: number
  pending_validations: number
  total_views: number
  total_earnings: number
}

export interface WalletStats {
  balance: number
  total_earned: number
  pending_earnings: number
  total_submissions: number
  recent_transactions: any[]
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

  useEffect(() => {
    const loadMissions = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await cliptokkAPI.getActiveMissions()
        setMissions(data)
      } catch (err) {
        console.error('Erreur useMissionsWithStats:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    loadMissions()
  }, [userId])

  return { missions, loading, error }
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