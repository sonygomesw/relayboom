'use client'

import { usePathname } from 'next/navigation'
import { IconDashboard, IconUsers, IconVideo, IconShield, IconEye, IconLogout } from '@tabler/icons-react'

interface AdminSidebarProps {
  pendingSubmissions?: number
}

export default function AdminSidebar({ pendingSubmissions = 0 }: AdminSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      href: '/admin',
      icon: IconDashboard,
      label: 'Dashboard',
      isActive: pathname === '/admin'
    },
    {
      href: '/admin/users',
      icon: IconUsers,
      label: 'Utilisateurs',
      isActive: pathname === '/admin/users'
    },
    {
      href: '/admin/missions',
      icon: IconVideo,
      label: 'Missions',
      isActive: pathname === '/admin/missions'
    },
    {
      href: '/admin/paliers',
      icon: IconShield,
      label: 'Validation Paliers',
      isActive: pathname === '/admin/paliers',
      badge: pendingSubmissions > 0 ? pendingSubmissions : undefined
    },
    {
      href: '/admin/analytics',
      icon: IconEye,
      label: 'Analytics',
      isActive: pathname === '/admin/analytics'
    }
  ]

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col fixed h-full z-50">
      {/* Logo */}
      <div className="p-8 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <span className="font-bold text-2xl text-gray-900">Admin</span>
            <p className="text-sm text-gray-500">ClipTokk</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-8 py-8">
        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-base transition-colors ${
                  item.isActive
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold ml-auto">
                    {item.badge}
                  </span>
                )}
              </a>
            )
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-8 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-semibold text-lg">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-900 truncate">Admin</p>
            <p className="text-sm text-gray-500 truncate">Administrateur</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <IconLogout className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
} 