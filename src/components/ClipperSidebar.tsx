'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { useInstantNavigation, useOptimizedTransitions } from '@/hooks/useOptimizedData'
import { 
  IconHome, 
  IconVideo, 
  IconCoin, 
  IconSettings,
  IconTrendingUp,
  IconLogout,
  IconChevronRight
} from '@tabler/icons-react'

interface ClipperSidebarProps {
  userStats?: {
    totalEarnings?: number
    totalViews?: number
    totalSubmissions?: number
    nextMilestone?: number
  }
  profile?: {
    pseudo?: string
    email?: string
    role?: string
  }
}

export default function ClipperSidebar({ userStats, profile }: ClipperSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const { preloadRoute } = useInstantNavigation()
  const { isTransitioning, startTransition } = useOptimizedTransitions()

  // Routes du dashboard avec préchargement
  const routes = [
    {
      name: 'Dashboard',
      href: '/dashboard/clipper',
      icon: IconHome,
      description: 'Vue d\'ensemble'
    },
    {
      name: 'Mes Clips',
      href: '/dashboard/clipper/clips',
      icon: IconVideo,
      description: 'Gérer mes soumissions'
    },
    {
      name: 'Revenus',
      href: '/dashboard/clipper/revenus',
      icon: IconCoin,
      description: 'Suivre mes gains'
    },
    {
      name: 'Leaderboard',
      href: '/dashboard/clipper/leaderboard',
      icon: IconTrendingUp,
      description: 'Classement des clippers'
    },
    {
      name: 'Paramètres',
      href: '/dashboard/clipper/settings',
      icon: IconSettings,
      description: 'Configuration du compte'
    }
  ]

  // Précharger toutes les routes au premier rendu
  useEffect(() => {
    routes.forEach(route => {
      if (route.href !== pathname) {
        preloadRoute(route.href)
      }
    })
  }, [pathname, preloadRoute, routes])

  const handleNavigation = (href: string) => {
    if (href === pathname) return
    
    startTransition()
    router.push(href)
  }

  const handleLogout = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Erreur déconnexion:', error)
    }
  }

  return (
    <div className="fixed left-0 top-0 h-full w-96 bg-white border-r border-gray-200 flex flex-col z-40">
      {/* Header utilisateur */}
      <div className="p-8 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            {profile?.pseudo?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              {profile?.pseudo || user?.email?.split('@')[0] || 'Utilisateur'}
            </h2>
            <p className="text-sm text-gray-600 capitalize">
              {profile?.role || 'Clipper'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {userStats?.totalEarnings?.toFixed(2) || '0.00'}€
            </div>
            <div className="text-xs text-gray-600">Revenus total</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {userStats?.totalViews?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-gray-600">Vues totales</div>
          </div>
        </div>
        
        {/* Progression vers prochain palier */}
        {userStats?.nextMilestone && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Prochain palier</span>
              <span>{userStats.nextMilestone}€</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(((userStats.totalEarnings || 0) / userStats.nextMilestone) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <div className="space-y-2">
          {routes.map((route) => {
            const Icon = route.icon
            const isActive = pathname === route.href
            
            return (
              <button
                key={route.href}
                onClick={() => handleNavigation(route.href)}
                onMouseEnter={() => preloadRoute(route.href)}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-150
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${isTransitioning ? 'opacity-75' : ''}
                `}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <div className="flex-1">
                  <div className="font-medium">{route.name}</div>
                  <div className="text-xs text-gray-500">{route.description}</div>
                </div>
                {isActive && (
                  <IconChevronRight className="w-5 h-5 text-blue-600" />
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Footer actions */}
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <IconLogout className="w-5 h-5" />
          <span className="font-medium">Se déconnecter</span>
        </button>
      </div>

      {/* Indicateur de transition */}
      {isTransitioning && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" />
      )}
    </div>
  )
} 