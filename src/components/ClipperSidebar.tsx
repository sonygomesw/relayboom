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
  IconPlus,
  IconLanguage
} from '@tabler/icons-react'
import { useLanguage } from '@/components/LanguageContext'
import { translations } from '@/lib/translations.new'
import { Language } from '@/lib/translations.new'
import { useState, memo } from 'react'

interface SidebarLink {
  href: string
  icon: React.ReactNode
  label: string
}

interface UserStats {
  totalEarnings?: number
  totalViews?: number
  nextMilestone?: number
  total_earnings?: number
  total_views?: number
  total_submissions?: number
}

interface Profile {
  pseudo?: string
  email?: string
  role?: string
}

interface ClipperSidebarProps {
  userStats: UserStats
  profile: Profile
}

// Mémoriser le composant pour éviter les re-rendus inutiles
const ClipperSidebar = memo(({ userStats, profile }: ClipperSidebarProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  const t = translations[language as Language]

  // Normaliser les stats pour supporter les différents formats
  const normalizedStats = {
    totalEarnings: userStats?.totalEarnings || userStats?.total_earnings || 0,
    totalViews: userStats?.totalViews || userStats?.total_views || 0,
    totalSubmissions: userStats?.total_submissions || 0,
    nextMilestone: userStats?.nextMilestone || 1000
  }

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'it', label: 'Italiano' }
  ]

  const sidebarLinks: SidebarLink[] = [
    {
      href: '/dashboard/clipper',
      icon: <IconDashboard className="w-5 h-5" />,
      label: 'Dashboard'
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
    },
    {
      href: '/dashboard/clipper/settings',
      icon: <IconSettings className="w-5 h-5" />,
      label: 'Paramètres'
    }
  ]

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Erreur déconnexion:', error)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toString()
  }

  const progressPercentage = Math.min((normalizedStats.totalViews / normalizedStats.nextMilestone) * 100, 100)

  return (
    <aside className="fixed top-0 left-0 h-screen w-96 bg-white border-r border-gray-200 shadow-sm pt-8">
      <div className="flex flex-col h-full">
        {/* Header avec profil */}
        <div className="p-8 border-b border-gray-100">
          <Link href="/" className="flex items-center mb-6">
            <img src="/logo.png" alt="ClipTokk" className="h-32" />
          </Link>
          
          {/* Stats utilisateur */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Revenus totaux</span>
              <span className="font-semibold text-lg">{formatNumber(normalizedStats.totalEarnings)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vues générées</span>
              <span className="font-semibold text-lg">{formatNumber(normalizedStats.totalViews)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" 
                style={{width: `${progressPercentage}%`}}
              ></div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-4">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => (
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
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <IconLanguage className="w-5 h-5" />
                <span>{(translations as any)[language]?.nav?.language || 'Language'}</span>
              </button>
              
              {showLanguageDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-lg border border-gray-200 shadow-lg">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any)
                        setShowLanguageDropdown(false)
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        language === lang.code ? 'text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
})

export default ClipperSidebar 