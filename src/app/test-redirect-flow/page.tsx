'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TestRedirectFlow() {
  const [logs, setLogs] = useState<string[]>([])
  const router = useRouter()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  useEffect(() => {
    addLog('🚀 Page TestRedirectFlow chargée')
    addLog(`📍 URL actuelle: ${window.location.pathname}`)
    addLog(`🔗 URL complète: ${window.location.href}`)
  }, [])

  const testRedirectionConflict = () => {
    addLog('🧪 === TEST CONFLIT DE REDIRECTION ===')
    
    // Simulation du conflit AuthContext vs AuthModal
    addLog('1️⃣ Simulation AuthContext: router.push()')
    
    setTimeout(() => {
      addLog('🔄 AuthContext exécute: router.push("/dashboard/clipper")')
      
      try {
        router.push('/dashboard/clipper')
        addLog('✅ router.push() exécuté')
      } catch (e) {
        addLog(`❌ Erreur router.push(): ${e}`)
      }
      
      // Conflit après 500ms
      setTimeout(() => {
        addLog('2️⃣ Simulation AuthModal: window.location.href')
        addLog('🔄 AuthModal exécute: window.location.href = "/dashboard/clipper"')
        
        try {
          // On ne va pas vraiment rediriger pour ne pas casser le test
          addLog('⚠️ window.location.href serait exécuté maintenant')
          addLog('🔥 CONFLIT DÉTECTÉ: Les deux redirections se battent!')
          addLog('📊 Résultat: La page peut rester bloquée ou charger 2 fois')
        } catch (e) {
          addLog(`❌ Erreur window.location.href: ${e}`)
        }
      }, 500)
      
    }, 1000)
  }

  const testMissionFlow = () => {
    addLog('🎯 === TEST FLOW MISSIONS ===')
    
    const missions = [
      'fallback-mrbeast',
      'fallback-speed', 
      'fallback-kaicenat'
    ]
    
    missions.forEach((missionId, index) => {
      setTimeout(() => {
        addLog(`${index + 1}️⃣ Test mission: ${missionId}`)
        addLog(`🔗 URL générée: /mission/${missionId}`)
        addLog(`🎬 Soumission: /mission/${missionId}/submit`)
        
        // Test si les URLs sont valides
        try {
          const missionUrl = new URL(`/mission/${missionId}`, window.location.origin)
          const submitUrl = new URL(`/mission/${missionId}/submit`, window.location.origin)
          
          addLog(`✅ URLs valides: ${missionUrl.pathname} et ${submitUrl.pathname}`)
        } catch (e) {
          addLog(`❌ URL invalide: ${e}`)
        }
      }, (index + 1) * 1000)
    })
  }

  const testActualNavigation = (url: string) => {
    addLog(`🧭 === TEST NAVIGATION RÉELLE ===`)
    addLog(`🎯 Destination: ${url}`)
    addLog(`⏰ Navigation en cours...`)
    
    try {
      router.push(url)
      addLog(`✅ router.push("${url}") exécuté`)
      
      // Vérifier après 2s si ça a marché
      setTimeout(() => {
        if (window.location.pathname === url) {
          addLog(`✅ Navigation réussie vers ${url}`)
        } else {
          addLog(`❌ Navigation échouée. Attendu: ${url}, Réel: ${window.location.pathname}`)
        }
      }, 2000)
      
    } catch (e) {
      addLog(`❌ Erreur navigation: ${e}`)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔍 Test Flow de Redirection</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tests */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">🧪 Tests de Redirection</h2>
            
            <div className="space-y-4">
              <button
                onClick={testRedirectionConflict}
                className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
              >
                🔥 Tester le Conflit AuthContext vs AuthModal
              </button>
              
              <button
                onClick={testMissionFlow}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                🎯 Tester le Flow des Missions
              </button>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">🧭 Navigations Réelles</h3>
                
                <div className="space-y-2">
                  <button
                    onClick={() => testActualNavigation('/dashboard/clipper')}
                    className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  >
                    → Dashboard Clipper
                  </button>
                  
                  <button
                    onClick={() => testActualNavigation('/mission/fallback-mrbeast')}
                    className="w-full px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                  >
                    → Mission MrBeast
                  </button>
                  
                  <button
                    onClick={() => testActualNavigation('/mission/fallback-mrbeast/submit')}
                    className="w-full px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
                  >
                    → Soumettre Clip MrBeast
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Console */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">📋 Console de Test</h2>
              <button
                onClick={() => setLogs([])}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                Vider
              </button>
            </div>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500">En attente de tests...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Diagnostic Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">🔍 Informations de Diagnostic</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">📍 URLs Détectées:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Page actuelle: <code>{typeof window !== 'undefined' ? window.location.pathname : 'N/A'}</code></li>
                <li>• Origin: <code>{typeof window !== 'undefined' ? window.location.origin : 'N/A'}</code></li>
                <li>• User Agent: <code>{typeof window !== 'undefined' ? window.navigator.userAgent.slice(0, 50) + '...' : 'N/A'}</code></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">🔧 Conflits Possibles:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• AuthContext + AuthModal = Double redirection</li>
                <li>• router.push() vs window.location.href</li>
                <li>• Timing de 500ms entre les deux</li>
                <li>• Possible rechargement de page inattendu</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 