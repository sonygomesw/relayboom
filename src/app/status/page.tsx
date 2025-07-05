'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthContext'
import Link from 'next/link'
import { IconDatabase, IconCheck, IconX, IconEye, IconTarget, IconUser, IconVideo } from '@tabler/icons-react'

export default function StatusPage() {
  const { user, profile } = useAuth()
  const [status, setStatus] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = async () => {
    try {
      console.log('🔍 Vérification du statut système...')
      
      // 1. Vérifier les missions
      const { data: missions, error: missionsError } = await supabase
        .from('missions')
        .select('*')
        .limit(10)

      // 2. Vérifier les soumissions
      const { data: submissions, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .limit(10)

      // 3. Vérifier les profils
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(10)

      // 4. Vérifier les paliers (clip_submissions)
      const { data: clipSubmissions, error: clipSubmissionsError } = await supabase
        .from('clip_submissions')
        .select('*')
        .limit(10)

      // 5. Statistiques
      const stats = {
        missions: {
          total: missions?.length || 0,
          active: missions?.filter(m => m.status === 'active').length || 0,
          error: missionsError?.message
        },
        submissions: {
          total: submissions?.length || 0,
          pending: submissions?.filter(s => s.status === 'pending').length || 0,
          approved: submissions?.filter(s => s.status === 'approved').length || 0,
          error: submissionsError?.message
        },
        profiles: {
          total: profiles?.length || 0,
          clippers: profiles?.filter(p => p.role === 'clipper').length || 0,
          creators: profiles?.filter(p => p.role === 'creator').length || 0,
          error: profilesError?.message
        },
        clipSubmissions: {
          total: clipSubmissions?.length || 0,
          pending: clipSubmissions?.filter(cs => cs.status === 'pending').length || 0,
          error: clipSubmissionsError?.message
        }
      }

      setStatus({
        missions: missions || [],
        submissions: submissions || [],
        profiles: profiles || [],
        clipSubmissions: clipSubmissions || [],
        stats,
        lastCheck: new Date().toISOString()
      })

      console.log('✅ Statut système récupéré:', stats)

    } catch (error) {
      console.error('❌ Erreur vérification statut:', error)
      setStatus({ error: (error as Error).message })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification du statut système...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">📊 Statut Système ClipTokk</h1>
          <p className="text-xl text-gray-600">État actuel de la base de données et des fonctionnalités</p>
          {status.lastCheck && (
            <p className="text-sm text-gray-500 mt-2">
              Dernière vérification : {new Date(status.lastCheck).toLocaleString('fr-FR')}
            </p>
          )}
        </div>

        {/* Utilisateur connecté */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <IconUser className="w-6 h-6 text-blue-500" />
            Utilisateur Connecté
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-bold text-gray-900">
                {user?.email || '❌ Non connecté'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Profil</p>
              <p className="text-lg font-bold text-gray-900">
                {profile ? `${profile.pseudo} (${profile.role})` : '❌ Pas de profil'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">ID</p>
              <p className="text-lg font-bold text-gray-900 truncate">
                {user?.id ? `${user.id.substring(0, 8)}...` : '❌ Pas d\'ID'}
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Missions</h3>
              <IconTarget className="w-6 h-6 text-purple-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold">{status.stats?.missions?.total || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Actives:</span>
                <span className="font-bold text-green-600">{status.stats?.missions?.active || 0}</span>
              </div>
              {status.stats?.missions?.error && (
                <p className="text-red-600 text-sm">❌ {status.stats.missions.error}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Soumissions</h3>
              <IconVideo className="w-6 h-6 text-blue-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold">{status.stats?.submissions?.total || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">En attente:</span>
                <span className="font-bold text-yellow-600">{status.stats?.submissions?.pending || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Approuvées:</span>
                <span className="font-bold text-green-600">{status.stats?.submissions?.approved || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Utilisateurs</h3>
              <IconUser className="w-6 h-6 text-green-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold">{status.stats?.profiles?.total || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Clippers:</span>
                <span className="font-bold text-blue-600">{status.stats?.profiles?.clippers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Créateurs:</span>
                <span className="font-bold text-purple-600">{status.stats?.profiles?.creators || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Paliers</h3>
              <IconEye className="w-6 h-6 text-orange-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold">{status.stats?.clipSubmissions?.total || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">En attente:</span>
                <span className="font-bold text-yellow-600">{status.stats?.clipSubmissions?.pending || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Missions existantes */}
        {status.missions && status.missions.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <IconTarget className="w-6 h-6 text-purple-500" />
              Missions Existantes ({status.missions.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {status.missions.slice(0, 6).map((mission: any) => (
                <div key={mission.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {mission.creator_image && (
                      <img 
                        src={mission.creator_image} 
                        alt={mission.creator_name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{mission.title}</h3>
                      <p className="text-xs text-gray-600">{mission.creator_name}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Budget:</span>
                      <span className="font-bold">{mission.total_budget || 0}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prix/1K:</span>
                      <span className="font-bold">{mission.price_per_1k_views || 0}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Statut:</span>
                      <span className={`font-bold ${mission.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                        {mission.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/mission/${mission.id}`}
                      className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-xs text-center hover:bg-blue-700"
                    >
                      Voir
                    </Link>
                    <Link
                      href={`/mission/${mission.id}/submit`}
                      className="flex-1 bg-green-600 text-white py-1 px-2 rounded text-xs text-center hover:bg-green-700"
                    >
                      Soumettre
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {status.missions.length > 6 && (
              <p className="text-center text-gray-500 mt-4">
                ... et {status.missions.length - 6} autres missions
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <IconDatabase className="w-6 h-6 text-blue-500" />
            Actions Disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dashboard/clipper"
              className="bg-blue-600 text-white py-3 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
            >
              Dashboard Clipper
            </Link>
            <Link
              href="/missions"
              className="bg-purple-600 text-white py-3 px-4 rounded-lg text-center hover:bg-purple-700 transition-colors"
            >
              Voir toutes les missions
            </Link>
            <Link
              href="/admin"
              className="bg-red-600 text-white py-3 px-4 rounded-lg text-center hover:bg-red-700 transition-colors"
            >
              Admin Dashboard
            </Link>
            <button
              onClick={checkSystemStatus}
              className="bg-gray-600 text-white py-3 px-4 rounded-lg text-center hover:bg-gray-700 transition-colors"
            >
              Actualiser
            </button>
          </div>
        </div>

        {/* Erreur globale */}
        {status.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-8">
            <div className="flex items-center gap-3">
              <IconX className="w-5 h-5 text-red-500" />
              <p className="text-red-700 font-bold">Erreur système :</p>
            </div>
            <p className="text-red-600 mt-2">{status.error}</p>
          </div>
        )}
      </div>
    </div>
  )
} 