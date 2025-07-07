import { supabase } from './supabase'
import type { UserStats, MissionWithStats, WalletStats } from './supabase-optimized'

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
    const { data, error } = await supabase
      .from('missions')
      .select(`
        id,
        title,
        description,
        video_url,
        price_per_1k_views,
        total_budget,
        status,
        is_featured,
        created_at,
        creator_id,
        category,
        creator (
          id,
          pseudo,
          avatar_url
        ),
        submissions (
          id,
          status,
          views_count,
          earnings
        )
      `)
      .order('created_at', { ascending: false })

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
      const remainingBudget = mission.total_budget - totalEarnings

      return {
        id: mission.id,
        title: mission.title,
        description: mission.description,
        creator_name: mission.creator?.pseudo || '',
        creator_thumbnail: mission.creator?.avatar_url || '',
        video_url: mission.video_url,
        price_per_1k_views: Number(mission.price_per_1k_views || 0),
        total_budget: Number(mission.total_budget || 0),
        remaining_budget: Math.max(0, remainingBudget),
        status: mission.status,
        is_featured: Boolean(mission.is_featured),
        created_at: mission.created_at,
        creator_id: mission.creator_id,
        category: mission.category || 'Divertissement',
        total_submissions: totalSubmissions,
        pending_validations: pendingValidations,
        total_views: totalViews,
        total_earnings: totalEarnings,
        creator: {
          pseudo: mission.creator?.pseudo || '',
          avatar_url: mission.creator?.avatar_url || ''
        }
      }
    })
  } catch (error) {
    console.error('Erreur getMissionsWithStatsOptimized:', error)
    return []
  }
}

/**
 * Récupère les statistiques du portefeuille utilisateur
 */
export const getUserWalletStats = async (userId: string): Promise<WalletStats> => {
  try {
    const { data, error } = await supabase
      .rpc('get_wallet_stats', { p_user_id: userId })

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