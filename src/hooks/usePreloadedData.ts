import { useState, useEffect, useCallback } from 'react'
import { cliptokkAPI, fastCache } from '@/lib/supabase'

interface PreloadedData {
  profile: any
  userStats: any
  missions: any[]
  clips: any[]
  isLoading: boolean
  error: string | null
}

// Hook de préchargement ultra-performant
export const usePreloadedData = (userId: string | undefined) => {
  const [data, setData] = useState<PreloadedData>({
    profile: null,
    userStats: null,
    missions: [],
    clips: [],
    isLoading: true,
    error: null
  })

  // Précharger toutes les données en parallèle
  const preloadAllData = useCallback(async () => {
    if (!userId) return

    try {
      console.log('⚡ Préchargement ultra-rapide...')
      
      // Charger d'abord les données essentielles (stats et profil)
      const essentialData = await Promise.all([
        cliptokkAPI.getUserProfile(userId),
        cliptokkAPI.getUserStats(userId)
      ])

      // Mettre à jour immédiatement avec les données essentielles
      setData(prev => ({
        ...prev,
        profile: essentialData[0],
        userStats: essentialData[1],
        isLoading: false
      }))

      // Charger le reste en arrière-plan
      Promise.all([
        cliptokkAPI.getActiveMissions(),
        cliptokkAPI.getUserClips(userId)
      ]).then(([missions, clips]) => {
        setData(prev => ({
          ...prev,
          missions,
          clips
        }))
      })

      console.log('✅ Préchargement terminé')

    } catch (error) {
      console.error('❌ Erreur préchargement:', error)
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erreur de chargement'
      }))
    }
  }, [userId])

  // Démarrer le préchargement
  useEffect(() => {
    if (userId) {
      preloadAllData()
    }
  }, [userId, preloadAllData])

  return data
}

// Hook pour navigation instantanée
export const useInstantNavigation = () => {
  const [isNavigating, setIsNavigating] = useState(false)

  const navigateInstantly = useCallback((callback: () => void) => {
    setIsNavigating(true)
    callback()
    requestAnimationFrame(() => {
      setIsNavigating(false)
    })
  }, [])

  return { isNavigating, navigateInstantly }
}

// Hook pour données spécifiques avec fallback instantané
export const useDataWithFallback = <T>(
  key: string,
  fetcher: () => Promise<T>,
  fallbackData: T
) => {
  const [data, setData] = useState<T>(fallbackData)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Vérifier le cache d'abord
    const cached = fastCache.get(key)
    if (cached) {
      setData(cached)
      return
    }

    // Sinon charger en arrière-plan
    setIsLoading(true)
    fetcher()
      .then(result => {
        setData(result)
        fastCache.set(key, result, 5 * 60 * 1000) // 5 minutes
      })
      .catch(error => {
        console.error(`Erreur ${key}:`, error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [key, fetcher, fallbackData])

  return { data, isLoading }
}

// Hook pour préchargement intelligent basé sur la navigation
export const useSmartPreload = (userId: string | undefined) => {
  useEffect(() => {
    if (!userId) return

    // Charger immédiatement les données essentielles
    const loadEssentialData = async () => {
      const cachedStats = fastCache.get(`stats_${userId}`)
      if (!cachedStats) {
        await cliptokkAPI.getUserStats(userId)
      }
    }
    loadEssentialData()

    // Précharger le reste en arrière-plan
    const preloadTimeout = setTimeout(() => {
      Promise.all([
        cliptokkAPI.getActiveMissions(),
        cliptokkAPI.getUserClips(userId)
      ])
    }, 200) // Réduit à 200ms

    return () => clearTimeout(preloadTimeout)
  }, [userId])
}

// Hook pour optimisation du cache
export const useCacheOptimization = () => {
  useEffect(() => {
    // Nettoyer le cache moins fréquemment
    const cleanupInterval = setInterval(() => {
      fastCache.cleanup()
    }, 30 * 60 * 1000) // Toutes les 30 minutes

    return () => clearInterval(cleanupInterval)
  }, [])

  const clearCache = useCallback((pattern?: string) => {
    fastCache.clear(pattern)
  }, [])

  return { clearCache }
} 