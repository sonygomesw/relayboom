'use client'

import { useEffect, useMemo, memo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthContext'

interface RoleProtectionProps {
  allowedRoles: string[]
  children: React.ReactNode
  redirectTo?: string
}

function RoleProtectionOptimized({ allowedRoles, children, redirectTo }: RoleProtectionProps) {
  const { user, profile, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [gracePeriod, setGracePeriod] = useState(true)

  // 🚀 Période de grâce pour éviter les redirections prématurées
  useEffect(() => {
    const timer = setTimeout(() => {
      setGracePeriod(false)
    }, 2000) // 2 secondes de grâce pour laisser l'AuthContext se charger

    return () => clearTimeout(timer)
  }, [])

  // 🚀 Mémoïser les calculs d'autorisation
  const authStatus = useMemo(() => {
    if (isLoading || gracePeriod) return 'loading'
    if (!isAuthenticated || !user) return 'unauthenticated'
    if (!profile) return 'no-profile'
    if (!profile.role || !allowedRoles.includes(profile.role)) return 'unauthorized'
    return 'authorized'
  }, [isLoading, isAuthenticated, user, profile, allowedRoles, gracePeriod])

  // Debug seulement en dev et lors de changements importants
  if (process.env.NODE_ENV === 'development' && authStatus !== 'loading') {
    console.log('🔒 RoleProtection:', {
      status: authStatus,
      userRole: profile?.role,
      allowedRoles,
      gracePeriod
    })
  }

  useEffect(() => {
    // 🚀 Optimisation : sortir tôt si autorisé ou en chargement
    if (authStatus === 'loading' || authStatus === 'authorized') return

    // Rediriger selon le statut
    switch (authStatus) {
      case 'unauthenticated':
        router.push('/')
        break
      case 'no-profile':
        router.push('/onboarding/role')
        break
      case 'unauthorized':
        if (redirectTo) {
          router.push(redirectTo)
        } else {
          // Rediriger vers le dashboard approprié
          const dashboardMap = {
            creator: '/dashboard/creator',
            clipper: '/dashboard/clipper',
            admin: '/admin'
          }
          const defaultPath = dashboardMap[profile?.role as keyof typeof dashboardMap] || '/onboarding/role'
          router.push(defaultPath)
        }
        break
    }
  }, [authStatus, redirectTo, router, profile?.role])

  // Afficher le spinner seulement lors du premier chargement
  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  // Ne rien afficher si pas autorisé (redirection en cours)
  if (authStatus !== 'authorized') {
    return null
  }

  return <>{children}</>
}

// 🚀 Mémoïser le composant pour éviter les re-rendus inutiles
export default memo(RoleProtectionOptimized) 