'use client'

import { useAuth } from '@/components/AuthContext'
import RoleProtectionOptimized from '@/components/RoleProtectionOptimized'
import ClipperSidebar from '@/components/ClipperSidebar'
import IbanSetup from '@/components/IbanSetup'
import { useDashboardDataParallel } from '@/hooks/useOptimizedData'
import { IconSettings, IconCreditCard, IconUser, IconLock } from '@tabler/icons-react'

export default function ClipperSettings() {
  const { user, profile } = useAuth()
  const { userStats, isLoading } = useDashboardDataParallel(user?.id || null)

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

  // Créer un objet compatible avec ClipperSidebar
  const dashboardData = {
    totalEarnings: userStats?.total_earnings || 0,
    totalViews: userStats?.total_views || 0,
    nextMilestone: 75,
    activeMissions: [],
    missionCount: 0
  }

  return (
    <RoleProtectionOptimized allowedRoles={['clipper']}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <ClipperSidebar userStats={dashboardData} profile={profile} />

        {/* Contenu principal */}
        <div className="flex-1 ml-96">
          <main className="p-12">
            <div className="max-w-4xl">
              {/* Header */}
              <div className="mb-12">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center">
                    <IconSettings className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-5xl font-bold text-gray-900 leading-tight">"Paramètres"</h1>
                    <p className="text-xl text-gray-600 mt-2">
                      Gérez vos informations personnelles et vos préférences de paiement.
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation des paramètres */}
              <div className="flex gap-6 mb-8 border-b border-gray-200">
                <button className="px-6 py-3 text-lg font-medium text-blue-600 border-b-2 border-blue-600">
                  "Méthode de paiement"
                </button>
                <button className="px-6 py-3 text-lg font-medium text-gray-500 hover:text-gray-700">
                  Profil
                </button>
                <button className="px-6 py-3 text-lg font-medium text-gray-500 hover:text-gray-700">
                  Sécurité
                </button>
                <button className="px-6 py-3 text-lg font-medium text-gray-500 hover:text-gray-700">
                  Notifications
                </button>
              </div>

              {/* Section Paiements */}
              <div className="space-y-8">
                {/* Informations bancaires */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <IconCreditCard className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">"Informations bancaires"</h2>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Configurez vos informations bancaires pour recevoir vos paiements par virement SEPA.
                  </p>
                  
                  {user && <IbanSetup userId={user.id} />}
                </div>

                {/* Historique des paiements */}
                <div className="border-t pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <IconUser className="w-6 h-6 text-green-600" />
                    <h2 className="text-2xl font-bold text-gray-900">"Historique des paiements"</h2>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconCreditCard className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">"Aucun paiement"</h3>
                      <p className="text-gray-600">
                        Vos paiements apparaîtront ici une fois que vos clips seront approuvés et payés.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informations importantes */}
                <div className="border-t pt-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <IconLock className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">
                          "Comment fonctionne le paiement ?"
                        </h3>
                        <div className="space-y-2 text-blue-800">
                          <p>• <strong>"Commission" :</strong> 10% prélevés lors de la recharge du créateur</p>
                          <p>• <strong>Votre part :</strong> 100% du montant calculé (commission déjà déduite)</p>
                          <p>• <strong>"Calcul" :</strong> (Nombre de vues ÷ 1000) × Prix par 1k vues</p>
                          <p>• <strong>Paiement :</strong> Virement SEPA sous 2-3 jours ouvrés</p>
                          <p>• <strong>"Seuil minimum" :</strong> Aucun seuil minimum</p>
                        </div>
                      </div>
                    </div>
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