'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { supabase } from '@/lib/supabase'
import { IconWallet, IconBell, IconLogout, IconPlus } from '@tabler/icons-react'
import { useState, useEffect } from 'react'
import useSWR from 'swr'

interface WalletStats {
  availableCredits: number
  pendingValidations: number
}

const fetcher = async (userId: string) => {
  console.log('Fetching wallet stats for user:', userId)
  try {
    // Récupérer les stats du wallet depuis Supabase
    const { data: wallet, error } = await supabase
      .from('creator_wallets')
      .select('available_credits, total_deposited, reserved_credits, spent_credits')
      .eq('creator_id', userId)
      .single()

    if (error && error.code === 'PGRST116') {
      // Aucun wallet trouvé, créer un nouveau wallet pour ce créateur
      console.log('Creating new wallet for user:', userId)
      const { data: newWallet, error: createError } = await supabase
        .from('creator_wallets')
        .insert({
          creator_id: userId,
          available_credits: 0,
          total_deposited: 0,
          reserved_credits: 0,
          spent_credits: 0
        })
        .select()
        .single()

      if (createError) {
        console.error('Erreur création wallet:', createError)
        return { availableCredits: 0, pendingValidations: 0 }
      }

      return {
        availableCredits: 0,
        pendingValidations: 0
      }
    } else if (error) {
      console.error('Erreur wallet:', error)
      return { availableCredits: 0, pendingValidations: 0 }
    }

    // Récupérer les missions du créateur pour les validations en attente
    const { data: creatorMissions, error: missionsError } = await supabase
      .from('missions')
      .select('id')
      .eq('creator_id', userId)

    if (missionsError) {
      console.error('Erreur missions:', missionsError)
    }

    let pendingValidationsCount = 0
    if (creatorMissions && creatorMissions.length > 0) {
      const missionIds = creatorMissions.map(m => m.id)
      
      // Récupérer les submissions en attente pour ces missions
      const { data: pendingSubmissions, error: submissionsError } = await supabase
        .from('submissions')
        .select('id')
        .eq('status', 'pending')
        .in('mission_id', missionIds)

      if (submissionsError) {
        console.error('Erreur submissions:', submissionsError)
      } else {
        pendingValidationsCount = pendingSubmissions?.length || 0
      }
    }

    return {
      availableCredits: (wallet?.available_credits || 0) / 100, // Convertir en euros
      pendingValidations: pendingValidationsCount
    }
  } catch (error) {
    console.error('Erreur chargement wallet navbar:', error)
    return {
      availableCredits: 0,
      pendingValidations: 0
    }
  }
}

export default function CreatorNavbar() {
  const { user, profile } = useAuth()
  const pathname = usePathname()
  // Utiliser SWR pour la gestion du cache et des requêtes
  const { data: walletStats, error, mutate } = useSWR(
    user?.id ? user.id : null,
    fetcher,
    {
      refreshInterval: 30000, // Rafraîchir toutes les 30 secondes
      revalidateOnFocus: true,
      dedupingInterval: 5000 // Éviter les requêtes en double dans un intervalle de 5 secondes
    }
  )

  // Écouter les événements de mise à jour du wallet
  useEffect(() => {
    const handleWalletUpdate = () => {
      console.log('Wallet updated, refreshing data...')
      // Forcer SWR à rafraîchir
      mutate()
    }

    window.addEventListener('walletUpdated', handleWalletUpdate as EventListener)
    
    return () => {
      window.removeEventListener('walletUpdated', handleWalletUpdate as EventListener)
    }
  }, [mutate])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Erreur déconnexion:', error)
    }
  }

  const formatCurrency = (amount: number | undefined) => {
    if (!amount && amount !== 0) return '0,00 €'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard/creator':
        return 'Dashboard Créateur'
      case '/dashboard/creator/missions':
        return 'Mes Missions'
      case '/dashboard/creator/nouvelle-mission':
        return 'Créer une nouvelle mission'
      case '/dashboard/creator/analytics':
        return 'Analytics'
      case '/dashboard/creator/wallet':
        return 'Mon Wallet'
      case '/dashboard/creator/revenus':
        return 'Mes Paiements'
      default:
        return 'Dashboard Créateur'
    }
  }

  if (error) {
    console.error('Erreur chargement wallet:', error)
  }

  // Utiliser les crédits depuis SWR
  const displayCredits = walletStats?.availableCredits

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-40">
      <div className="px-6 h-16 flex items-center justify-between">
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-sm text-gray-600">Bienvenue {profile?.pseudo || user?.email}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Nouvelle Mission */}
          <Link
            href="/dashboard/creator/nouvelle-mission"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <IconPlus className="w-4 h-4" />
            Nouvelle mission
          </Link>

          {/* Wallet */}
          <Link
            href="/dashboard/creator/wallet"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              pathname === '/dashboard/creator/wallet'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <IconWallet className="w-5 h-5" />
            <span className="font-medium">
              {displayCredits !== undefined ? formatCurrency(displayCredits) : '...'}
            </span>
          </Link>

          {/* Notifications */}
          {walletStats?.pendingValidations && walletStats.pendingValidations > 0 && (
            <div className="bg-orange-50 text-orange-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <IconBell className="w-5 h-5" />
              {walletStats.pendingValidations} validation(s)
            </div>
          )}

          {/* Profile Menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">
                {profile?.pseudo || user?.email}
              </span>
              <span className="text-xs text-gray-500">Créateur</span>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {profile?.pseudo?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Déconnexion"
            >
              <IconLogout className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 