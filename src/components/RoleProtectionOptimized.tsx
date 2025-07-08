'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthNew'
import { QuickSkeleton } from '@/components/SkeletonLoader'

interface RoleProtectionOptimizedProps {
  allowedRoles: string[]
  children: React.ReactNode
  redirectTo?: string
  fallback?: React.ReactNode
}

// Cache des rôles pour éviter les requêtes répétées
const roleCache = new Map<string, { role: string; timestamp: number }>()

export default function RoleProtectionOptimized({
  allowedRoles,
  children,
  redirectTo,
  fallback = <QuickSkeleton />
}: RoleProtectionOptimizedProps) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const checkAccess = async () => {
      try {
        if (!user) {
          router.push('/')
          return
        }

        // Vérifier le cache
        const cached = roleCache.get(user.id)
        const now = Date.now()
        
        if (cached && (now - cached.timestamp) < 5 * 60 * 1000) { // 5 minutes
          if (allowedRoles.includes(cached.role)) {
            setIsAuthorized(true)
            setIsLoading(false)
            return
          }
          handleUnauthorized(cached.role)
          return
        }

        // Récupérer le profil si pas en cache
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Erreur récupération profil:', error)
          router.push('/onboarding/role')
          return
        }

        // Mettre en cache
        roleCache.set(user.id, { 
          role: profile.role,
          timestamp: now
        })

        if (!profile?.role || !allowedRoles.includes(profile.role)) {
          handleUnauthorized(profile?.role)
          return
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error('Erreur vérification accès:', error)
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    const handleUnauthorized = (role?: string) => {
      if (redirectTo) {
        router.push(redirectTo)
      } else if (role === 'creator') {
        router.push('/dashboard/creator')
      } else if (role === 'clipper') {
        router.push('/dashboard/clipper')
      } else if (role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/onboarding/role')
      }
    }

    checkAccess()
  }, [allowedRoles, redirectTo, router, user])

  if (isLoading) {
    return fallback
  }

  return isAuthorized ? children : null
} 