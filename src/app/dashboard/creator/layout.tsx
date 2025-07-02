'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconDashboard, IconVideo, IconTrendingUp, IconCoin, IconPlus, IconWallet, IconLogout } from '@tabler/icons-react'
import CreatorNavbar from '@/components/CreatorNavbar'

interface SidebarLink {
  href: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      console.log('🔄 Début de la déconnexion...')
      
      const { supabase } = await import('@/lib/supabase')
      console.log('✅ Supabase importé')
      
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('❌ Erreur Supabase signOut:', error)
        throw error
      }
      
      console.log('✅ Déconnexion Supabase réussie')
      
      // Nettoyer le localStorage
      try {
        localStorage.clear()
        console.log('✅ localStorage nettoyé')
      } catch (e) {
        console.log('⚠️ Erreur nettoyage localStorage:', e)
      }
      
      console.log('🔄 Redirection vers /')
      router.push('/')
      
      // Forcer le rechargement de la page après un délai
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
      
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error)
      // Même en cas d'erreur, essayer de rediriger
      router.push('/')
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    }
  }

  const links: SidebarLink[] = [
    {
      href: '/dashboard/creator',
      icon: <IconDashboard className="w-5 h-5" />,
      label: 'Dashboard'
    },
    {
      href: '/dashboard/creator/missions',
      icon: <IconVideo className="w-5 h-5" />,
      label: 'Missions'
    },
    {
      href: '/dashboard/creator/nouvelle-mission',
      icon: <IconPlus className="w-5 h-5" />,
      label: 'Nouvelle Mission'
    },
    {
      href: '/dashboard/creator/analytics',
      icon: <IconTrendingUp className="w-5 h-5" />,
      label: 'Analytics'
    },
    {
      href: '/dashboard/creator/wallet',
      icon: <IconWallet className="w-5 h-5" />,
      label: 'Wallet'
    },
    {
      href: '/dashboard/creator/revenus',
      icon: <IconCoin className="w-5 h-5" />,
      label: 'Paiements'
    },
    {
      href: '#',
      icon: <IconLogout className="w-5 h-5" />,
      label: 'Déconnexion',
      onClick: handleLogout
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="ClipTokk" className="h-28" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  {link.onClick ? (
                    <button
                      onClick={link.onClick}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 w-full text-left"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        pathname === link.href
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Navbar */}
      <CreatorNavbar />

      {/* Main Content */}
      <main className="pl-64 pt-16">
        {children}
      </main>
    </div>
  )
} 