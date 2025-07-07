'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TestMissionsPage() {
  const router = useRouter()
  const [log, setLog] = useState<string[]>([])

  const addLog = (message: string) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // Missions de test
  const testMissions = [
    {
      id: 'mission-1',
      title: 'Test Mission 1',
      creator_name: 'Creator Test',
      price_per_1k_views: 10
    },
    {
      id: 'mission-2', 
      title: 'Test Mission 2',
      creator_name: 'Creator Test 2',
      price_per_1k_views: 15
    }
  ]

  const testNavigation = (missionId: string, method: string) => {
    addLog(`Tentative de navigation vers mission ${missionId} avec méthode: ${method}`)
    
    try {
      if (method === 'router.push') {
        router.push(`/mission/${missionId}`)
        addLog(`✅ router.push() exécuté pour mission ${missionId}`)
      } else if (method === 'window.location') {
        window.location.href = `/mission/${missionId}`
        addLog(`✅ window.location.href exécuté pour mission ${missionId}`)
      }
    } catch (error: any) {
      addLog(`❌ Erreur: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Navigation Missions</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tests de navigation */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Tests de Navigation</h2>
            
            <div className="space-y-4">
              {testMissions.map((mission) => (
                <div key={mission.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{mission.title}</h3>
                  <p className="text-gray-600">{mission.creator_name}</p>
                  <p className="text-green-600 font-medium">{mission.price_per_1k_views}€/1K vues</p>
                  
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => testNavigation(mission.id, 'router.push')}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Test avec router.push
                    </button>
                    
                    <button
                      onClick={() => testNavigation(mission.id, 'window.location')}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      Test avec window.location
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Test Navigation Dashboard</h3>
              <button
                onClick={() => {
                  addLog('Navigation vers dashboard clipper')
                  router.push('/dashboard/clipper')
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Aller au Dashboard Clipper
              </button>
            </div>
          </div>
          
          {/* Log des résultats */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Log des Tests</h2>
              <button
                onClick={() => setLog([])}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                Vider
              </button>
            </div>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
              {log.length === 0 ? (
                <div className="text-gray-500">Aucun test effectué...</div>
              ) : (
                log.map((entry, index) => (
                  <div key={index} className="mb-1">
                    {entry}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Instructions de test :</h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-1">
            <li>Cliquez sur les boutons de test pour tester la navigation</li>
            <li>Vérifiez si vous êtes redirigé vers la page de mission</li>
            <li>Regardez les logs pour voir si des erreurs apparaissent</li>
            <li>Testez aussi la navigation vers le dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 