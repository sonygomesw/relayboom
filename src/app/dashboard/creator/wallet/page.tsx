'use client'

import { useAuth } from '@/components/AuthContext'
import { useLanguage } from '@/components/LanguageContext'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'

export default function CreatorWallet() {
  const { user } = useAuth()
  const { t } = useLanguage()

  return (
    <RoleProtectionOptimized allowedRoles={['creator']}>
      <div className="min-h-screen bg-gray-50">
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet</h1>
            <p className="text-gray-600">Manage your credits and transactions</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Wallet functionality coming soon...</p>
          </div>
        </main>
      </div>
    </RoleProtectionOptimized>
  )
}
