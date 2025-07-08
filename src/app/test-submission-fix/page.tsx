'use client'

import { useState, useEffect } from 'react'
import { cliptokkAPI } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

export default function TestSubmissionFix() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const testMissionLoading = async () => {
    setLoading(true)
    const testResults: any = {}

    try {
      // Test 1: Timeout avec cliptokkAPI
      console.log('🧪 Test 1: Timeout avec cliptokkAPI...')
      const startTime = Date.now()
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout test')), 2000)
      })
      
      try {
        const missions = await Promise.race([
          cliptokkAPI.getActiveMissions(),
          timeoutPromise
        ])
        testResults.cliptokkAPI = {
          success: true,
          time: Date.now() - startTime,
          count: missions?.length || 0
        }
      } catch (error) {
        testResults.cliptokkAPI = {
          success: false,
          error: (error as Error).message,
          time: Date.now() - startTime
        }
      }

      // Test 2: Fallback direct Supabase
      console.log('🧪 Test 2: Fallback direct Supabase...')
      const startTime2 = Date.now()
      
      try {
        const { data, error } = await supabase
          .from('missions')
          .select('id, title, description, creator_name, creator_image, price_per_1k_views, total_budget, status, category')
          .eq('status', 'active')
          .limit(5)
        
        testResults.directSupabase = {
          success: !error,
          time: Date.now() - startTime2,
          count: data?.length || 0,
          error: error?.message
        }
      } catch (error) {
        testResults.directSupabase = {
          success: false,
          error: (error as Error).message,
          time: Date.now() - startTime2
        }
      }

      // Test 3: Mission spécifique par ID
      console.log('🧪 Test 3: Mission spécifique par ID...')
      const testMissionId = 'test-mission-id'
      const startTime3 = Date.now()
      
      try {
        const { data, error } = await supabase
          .from('missions')
          .select('id, title, description, creator_name, creator_image, price_per_1k_views, total_budget, status, category')
          .eq('id', testMissionId)
          .single()
        
        testResults.specificMission = {
          success: !error,
          time: Date.now() - startTime3,
          found: !!data,
          error: error?.message
        }
      } catch (error) {
        testResults.specificMission = {
          success: false,
          error: (error as Error).message,
          time: Date.now() - startTime3
        }
      }

      setResults(testResults)
      
    } catch (error) {
      console.error('Erreur tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const createFallbackMission = (id: string) => {
    const fallbacks = [
      {
        creator_name: 'Créateur Viral',
        title: 'Mission Viral Content',
        description: 'Créer du contenu viral et engageant',
        price_per_1k_views: 11
      },
      {
        creator_name: 'Gaming Creator',
        title: 'Gaming Challenge',
        description: 'Clips gaming créatifs et divertissants',
        price_per_1k_views: 10
      },
      {
        creator_name: 'Stream Creator',
        title: 'Streaming Moments',
        description: 'Moments forts de stream et réactions',
        price_per_1k_views: 9
      }
    ]

    const index = id.length % fallbacks.length
    const fallback = fallbacks[index]

    return {
      id,
      title: fallback.title,
      description: fallback.description,
      creator_name: fallback.creator_name,
      creator_image: '/mrbeast.jpg',
      price_per_1k_views: fallback.price_per_1k_views,
      total_budget: 2000,
      status: 'active'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">🧪 Test Correctif Soumission</h1>
          
          <div className="mb-6">
            <button
              onClick={testMissionLoading}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '⏳ Tests en cours...' : '🚀 Lancer les tests'}
            </button>
          </div>

          {Object.keys(results).length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">📊 Résultats des tests</h2>
              
              {/* Test cliptokkAPI */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Test 1: cliptokkAPI.getActiveMissions()</h3>
                <div className={`text-sm ${results.cliptokkAPI?.success ? 'text-green-600' : 'text-red-600'}`}>
                  {results.cliptokkAPI?.success ? '✅' : '❌'} 
                  {results.cliptokkAPI?.success 
                    ? `Succès - ${results.cliptokkAPI.count} missions en ${results.cliptokkAPI.time}ms`
                    : `Échec - ${results.cliptokkAPI?.error} (${results.cliptokkAPI?.time}ms)`
                  }
                </div>
              </div>

              {/* Test Supabase direct */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Test 2: Fallback Supabase direct</h3>
                <div className={`text-sm ${results.directSupabase?.success ? 'text-green-600' : 'text-red-600'}`}>
                  {results.directSupabase?.success ? '✅' : '❌'} 
                  {results.directSupabase?.success 
                    ? `Succès - ${results.directSupabase.count} missions en ${results.directSupabase.time}ms`
                    : `Échec - ${results.directSupabase?.error} (${results.directSupabase?.time}ms)`
                  }
                </div>
              </div>

              {/* Test mission spécifique */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Test 3: Mission spécifique par ID</h3>
                <div className={`text-sm ${results.specificMission?.success ? 'text-green-600' : 'text-red-600'}`}>
                  {results.specificMission?.success ? '✅' : '❌'} 
                  {results.specificMission?.found 
                    ? `Mission trouvée en ${results.specificMission.time}ms`
                    : `Mission non trouvée - ${results.specificMission?.error} (${results.specificMission?.time}ms)`
                  }
                </div>
              </div>
            </div>
          )}

          {/* Exemple de mission fallback */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">🔄 Exemple Mission Fallback</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(createFallbackMission('example-mission-id'), null, 2)}
              </pre>
            </div>
          </div>

          {/* Conseils */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Améliorations apportées</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Timeout agressif de 2 secondes pour cliptokkAPI</li>
              <li>• Fallback automatique vers Supabase direct</li>
              <li>• Missions fallback dynamiques et variées</li>
              <li>• Timeout global de sécurité de 5 secondes</li>
              <li>• Gestion d'erreurs améliorée avec messages clairs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 