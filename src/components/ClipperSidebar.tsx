'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  IconDashboard,
  IconVideo,
  IconTrendingUp,
  IconCoin,
  IconWallet,
  IconSettings,
  IconLogout,
  IconPlus
} from '@tabler/icons-react'

interface SidebarLink {
  href: string
  icon: React.ReactNode
  label: string
}

interface ClipperSidebarProps {
  userStats?: {
    totalEarnings: number
    totalViews: number
    nextMilestone: number
  }
  profile?: {
    pseudo: string
    email: string
  }
}

export default function ClipperSidebar({ userStats, profile }: ClipperSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const links: SidebarLink[] = [
    {
      href: '/dashboard/clipper',
      icon: <IconDashboard className="w-5 h-5" />,
      label: 'Dashboard'
    },
    {
      href: '/missions',
      icon: <IconPlus className="w-5 h-5" />,
      label: 'Missions'
    },
    {
      href: '/dashboard/clipper/clips',
      icon: <IconVideo className="w-5 h-5" />,
      label: 'Mes Clips'
    },
    {
      href: '/dashboard/clipper/leaderboard',
      icon: <IconTrendingUp className="w-5 h-5" />,
      label: 'Leaderboard'
    },
    {
      href: '/dashboard/clipper/revenus',
      icon: <IconCoin className="w-5 h-5" />,
      label: 'Revenus'
    }
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-96 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex flex-col h-full">
        {/* Header avec profil */}
        <div className="p-8 border-b border-gray-100">
          <Link href="/" className="flex items-center mb-6">
            <img src="/logo.png" alt="ClipTokk" className="h-24" />
          </Link>
          
          {/* Stats utilisateur */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Revenus totaux</span>
              <span className="font-semibold text-lg">{userStats?.totalEarnings?.toFixed(2) || '0.00'}€</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vues générées</span>
              <span className="font-semibold text-lg">{userStats?.totalViews?.toLocaleString() || '0'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" 
                style={{width: `${Math.min(100, (userStats?.totalViews || 0) / 1000)}%`}}
              ></div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-4">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                    pathname === link.href
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Profil utilisateur */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {profile?.pseudo?.substring(0, 2).toUpperCase() || 'CL'}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{profile?.pseudo || 'Clipper'}</p>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Link
              href="/dashboard/clipper/settings"
              className="flex items-center gap-3 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors w-full"
            >
              <IconSettings className="w-5 h-5" />
              <span>Paramètres</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <IconLogout className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
} 