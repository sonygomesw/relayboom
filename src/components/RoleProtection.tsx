'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface RoleProtectionProps {
  allowedRoles: string[]
  children: React.ReactNode
  redirectTo?: string
}

export default function RoleProtection({ allowedRoles, children, redirectTo }: RoleProtectionProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Vérifier l'authentification
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/')
          return
        }

        // Récupérer le profil utilisateur
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

        // Vérifier si le rôle est autorisé
        if (!profile?.role || !allowedRoles.includes(profile.role)) {
          // Rediriger vers le dashboard approprié ou vers une page d'erreur
          if (redirectTo) {
            router.push(redirectTo)
          } else if (profile?.role === 'creator') {
            router.push('/dashboard/creator')
          } else if (profile?.role === 'clipper') {
            router.push('/dashboard/clipper')
          } else if (profile?.role === 'admin') {
            router.push('/admin')
          } else {
            router.push('/onboarding/role')
          }
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

    checkAccess()
  }, [allowedRoles, redirectTo, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
} 