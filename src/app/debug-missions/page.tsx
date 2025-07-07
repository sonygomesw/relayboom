'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { cliptokkAPI } from '@/lib/supabase'

export default function DebugMissionsPage() {
  const [missions, setMissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMissions()
  }, [])

  const loadMissions = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔍 Chargement des missions depuis la base de données...')

      // Méthode 1: Directement depuis Supabase
      const { data: directMissions, error: directError } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false })

      if (directError) {
        console.error('❌ Erreur requête directe:', directError)
      } else {
        console.log('✅ Missions directes:', directMissions)
      }

      // Méthode 2: Via notre API optimisée
      const apiMissions = await cliptokkAPI.getActiveMissions()
      console.log('✅ Missions API optimisée:', apiMissions)

      setMissions(directMissions || [])

    } catch (err) {
      console.error('❌ Erreur chargement missions:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Debug Missions</h1>
          <div className="bg-white rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Debug Missions</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold mb-2">Erreur</h2>
            <p className="text-red-700">{error}</p>
            <button 
              onClick={loadMissions}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Missions</h1>
        
        {/* Résumé */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Résumé</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <div className="text-2xl font-bold text-blue-600">{missions.length}</div>
              <div className="text-blue-800">Total missions</div>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <div className="text-2xl font-bold text-green-600">
                {missions.filter(m => m.status === 'active').length}
              </div>
              <div className="text-green-800">Missions actives</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold text-gray-600">
                {missions.filter(m => m.status !== 'active').length}
              </div>
              <div className="text-gray-800">Missions inactives</div>
            </div>
          </div>
        </div>

        {/* Liste des missions */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Toutes les missions</h2>
          
          {missions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg">Aucune mission trouvée</div>
              <p className="text-gray-400 mt-2">
                Il semble qu'il n'y ait aucune mission dans la base de données.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {missions.map((mission, index) => (
                <div key={mission.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {mission.creator_image ? (
                        <img 
                          src={mission.creator_image} 
                          alt={mission.creator_name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-gray-400 text-xs text-center">
                          No<br/>Image
                        </div>
                      )}
                    </div>
                    
                    {/* Contenu */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{mission.title || 'Titre manquant'}</h3>
                          <p className="text-gray-600 mb-2">{mission.creator_name || 'Créateur inconnu'}</p>
                          <p className="text-sm text-gray-500 mb-2">
                            {mission.description || 'Description manquante'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            mission.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {mission.status || 'Statut inconnu'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Détails techniques */}
                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div>
                            <span className="font-medium">ID:</span>
                            <div className="text-xs text-gray-600 break-all">{mission.id || 'N/A'}</div>
                          </div>
                          <div>
                            <span className="font-medium">Prix/1K:</span>
                            <div className="text-xs text-gray-600">
                              {mission.price_per_1k_views || mission.reward || 'N/A'}€
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Budget:</span>
                            <div className="text-xs text-gray-600">
                              {mission.total_budget || 'N/A'}€
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Catégorie:</span>
                            <div className="text-xs text-gray-600">
                              {mission.category || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* JSON Raw */}
        <div className="bg-white rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Données brutes (JSON)</h2>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
            {JSON.stringify(missions, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
} 