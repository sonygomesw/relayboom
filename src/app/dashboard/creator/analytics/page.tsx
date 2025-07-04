'use client'

import { useAuth } from '@/components/AuthContext'
import { useLanguage } from '@/components/LanguageContext'
import { translations } from '@/lib/translations.new'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'

export default function CreatorAnalytics() {
  const { user } = useAuth()
  const { language } = useLanguage(); const t = translations[language] || translations.en

  return (
    <RoleProtectionOptimized allowedRoles={['creator']}>
      <div className="min-h-screen bg-gray-50">
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Track your performance and mission statistics</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Analytics functionality coming soon...</p>
          </div>
        </main>
      </div>
    </RoleProtectionOptimized>
  )
}
export const dynamic = "force-dynamic"
