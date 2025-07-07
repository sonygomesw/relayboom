'use client'

import { useRouter as useNextRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Hook sécurisé pour useRouter qui évite les erreurs côté serveur
 */
export function useSafeRouter() {
  const [isClient, setIsClient] = useState(false)
  const router = useNextRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Retourner un router mock côté serveur, le vrai router côté client
  if (!isClient) {
    return {
      push: () => {},
      replace: () => {},
      back: () => {},
      forward: () => {},
      refresh: () => {},
      prefetch: () => {}
    }
  }

  return router
}

/**
 * Composant wrapper pour éviter les erreurs de router côté serveur
 */
export function ClientOnlyRouter({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 