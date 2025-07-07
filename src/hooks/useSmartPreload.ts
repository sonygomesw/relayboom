import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { supabase } from '@/lib/supabase'

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const STORAGE_KEY = 'cliptokk_cache'

interface CacheData {
  [key: string]: {
    data: any
    timestamp: number
  }
}

// Fonction utilitaire pour lire le cache local
const getLocalCache = (): CacheData => {
  try {
    const cache = localStorage.getItem(STORAGE_KEY)
    return cache ? JSON.parse(cache) : {}
  } catch {
    return {}
  }
}

// Fonction utilitaire pour écrire dans le cache local
const setLocalCache = (key: string, data: any) => {
  try {
    const cache = getLocalCache()
    cache[key] = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch (error) {
    console.error('Erreur cache:', error)
  }
}

// Fonction utilitaire pour vérifier si les données en cache sont valides
const isValidCache = (key: string): boolean => {
  const cache = getLocalCache()
  const item = cache[key]
  return item && Date.now() - item.timestamp < CACHE_TTL
}

// Fetcher optimisé pour Supabase
const fetcher = async (key: string, query: any) => {
  // Vérifier le cache local d'abord
  if (isValidCache(key)) {
    return getLocalCache()[key].data
  }

  const { data, error } = await query
  if (error) throw error

  // Mettre en cache les nouvelles données
  setLocalCache(key, data)
  return data
}

export const useSmartPreload = (userId?: string) => {
  const [isLoading, setIsLoading] = useState(true)

  // Requêtes optimisées avec sélection minimale des colonnes
  const { data: userProfile } = useSWR(
    userId ? ['profile', userId] : null,
    () => fetcher('profile', supabase
      .from('profiles')
      .select('id, pseudo, role, email')
      .eq('id', userId)
      .single()
    )
  )

  const { data: missions } = useSWR(
    'missions',
    () => fetcher('missions', supabase
      .from('missions')
      .select('id, title, description, status, creator_id, price_per_1k_views, total_budget')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    )
  )

  const { data: submissions } = useSWR(
    userId ? ['submissions', userId] : null,
    () => fetcher('submissions', supabase
      .from('submissions')
      .select('id, mission_id, status, views_count, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    )
  )

  useEffect(() => {
    // Précharger en parallèle
    Promise.all([
      userProfile,
      missions,
      submissions
    ]).then(() => {
      setIsLoading(false)
    })
  }, [userProfile, missions, submissions])

  return {
    isLoading,
    data: {
      profile: userProfile,
      missions,
      submissions
    }
  }
}

// Hook pour optimiser les requêtes spécifiques
export const useOptimizedQuery = (key: string, query: any) => {
  return useSWR(key, () => fetcher(key, query))
} 