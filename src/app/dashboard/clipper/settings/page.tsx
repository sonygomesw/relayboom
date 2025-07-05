'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import ClipperSidebar from '@/components/ClipperSidebar'
import IbanSetup from '@/components/IbanSetup'
import { supabase } from '@/lib/supabase'
import { IconSettings, IconCreditCard, IconUser, IconLock } from '@tabler/icons-react'

export default function ClipperSettings() {
  const { user, profile } = useAuth()
  const [userStats, setUserStats] = useState({
    totalEarnings: 0,
    totalViews: 0,
    totalSubmissions: 0,
    nextMilestone: 75,
    activeMissions: [],
    missionCount: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      loadUserStats()
    }
  }, [user?.id])

  const loadUserStats = async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      
      // Requête simple pour les stats utilisateur
      const { data: submissions } = await supabase
        .from('submissions')
        .select('views_count, earnings')
        .eq('user_id', user.id)
        .eq('status', 'approved')

      if (submissions) {
        const totalEarnings = submissions.reduce((sum, sub) => sum + (sub.earnings || 0), 0)
        const totalViews = submissions.reduce((sum, sub) => sum + (sub.views_count || 0), 0)
        const totalSubmissions = submissions.length
        
        setUserStats({
          totalEarnings,
          totalViews,
          totalSubmissions,
          nextMilestone: 75,
          activeMissions: [],
          missionCount: 0
        })
      }
    } catch (error) {
      console.error('Erreur chargement stats settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <RoleProtectionOptimized allowedRoles={['clipper']}>
      <div className="min-h-screen bg-gray-50 flex">
        <ClipperSidebar userStats={userStats} profile={profile} />
        
        <div className="flex-1 ml-96">
          <main className="p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <IconSettings className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
                  <p className="text-gray-600">Gérez votre compte et vos préférences</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Informations du profil */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <IconUser className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Profil</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={profile.email || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pseudo</label>
                      <input
                        type="text"
                        value={profile.pseudo || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                      <input
                        type="text"
                        value="Clippeur"
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuration IBAN */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <IconCreditCard className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Informations bancaires</h2>
                  </div>
                  
                                     <IbanSetup userId={user.id} />
                </div>
              </div>
            </div>

            {/* Sécurité */}
            <div className="mt-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <IconLock className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Sécurité</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Mot de passe</h3>
                      <p className="text-sm text-gray-600">Dernière modification il y a plus de 30 jours</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Modifier
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Authentification à deux facteurs</h3>
                      <p className="text-sm text-gray-600">Sécurisez votre compte avec 2FA</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Configurer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RoleProtectionOptimized>
  )
} 