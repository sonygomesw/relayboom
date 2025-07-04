'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconDashboard, IconVideo, IconTrendingUp, IconCoin, IconPlus, IconWallet, IconLogout, IconLanguage } from '@tabler/icons-react'
import { useLanguage } from '@/components/LanguageContext'
import { translations } from '@/lib/translations'
import { Language } from '@/lib/translations'
import { useState } from 'react'

interface SidebarLink {
  href: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

export default function CreatorNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = translations[language].dashboard.creator.navigation
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'it', label: 'Italiano' }
  ]

  const handleLogout = async () => {
    // Logique de déconnexion
    router.push('/')
  }

  const links: SidebarLink[] = [
    {
      href: '/dashboard/creator',
      icon: <IconDashboard className="w-5 h-5" />,
      label: t.dashboard
    },
    {
      href: '/dashboard/creator/missions',
      icon: <IconVideo className="w-5 h-5" />,
      label: t.missions
    },
    {
      href: '/dashboard/creator/nouvelle-mission',
      icon: <IconPlus className="w-5 h-5" />,
      label: t.newMission
    },
    {
      href: '/dashboard/creator/analytics',
      icon: <IconTrendingUp className="w-5 h-5" />,
      label: t.analytics
    },
    {
      href: '/dashboard/creator/wallet',
      icon: <IconWallet className="w-5 h-5" />,
      label: t.wallet
    },
    {
      href: '/dashboard/creator/revenus',
      icon: <IconCoin className="w-5 h-5" />,
      label: t.payments
    },
    {
      href: '#',
      icon: <IconLogout className="w-5 h-5" />,
      label: t.logout,
      onClick: handleLogout
    }
  ]

  return (
    <nav className="fixed top-0 left-0 h-screen w-80 bg-white border-r border-gray-200 p-6">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <div className="mb-8">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-8" />
            </Link>
          </div>

          <div className="space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={link.onClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Language Selector */}
        <div className="relative mt-4 border-t border-gray-200 pt-4">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <IconLanguage className="w-5 h-5" />
            <span className="font-medium">{translations[language].nav.language}</span>
          </button>
          
          {showLanguageDropdown && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-lg border border-gray-200 shadow-lg">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code)
                    setShowLanguageDropdown(false)
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    language === lang.code ? 'text-green-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
} 