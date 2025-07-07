'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TestNavigation() {
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testNavigations = [
    {
      label: "🎯 Dashboard Clipper",
      path: "/dashboard/clipper",
      description: "Navigation vers le dashboard"
    },
    {
      label: "📋 Missions",
      path: "/missions",
      description: "Page des missions"
    },
    {
      label: "🎬 Submit Mission 1",
      path: "/mission/1/submit",
      description: "Page de soumission de clip (mission 1)"
    },
    {
      label: "🎬 Submit Mission 2",
      path: "/mission/2/submit",
      description: "Page de soumission de clip (mission 2)"
    },
    {
      label: "🔧 Debug Ultimate",
      path: "/debug-ultimate",
      description: "Page de diagnostic"
    }
  ];

  const testNavigation = async (path: string, label: string) => {
    addLog(`🔄 Test navigation vers: ${path}`);
    
    try {
      // Test 1: Voir si la route existe
      addLog(`📋 ${label} - Tentative de navigation...`);
      
      // Simulation du comportement du bouton
      const startTime = Date.now();
      
      router.push(path);
      
      addLog(`✅ router.push() exécuté en ${Date.now() - startTime}ms`);
      addLog(`🎯 Navigation programmée vers: ${path}`);
      
      // Attendre un peu pour voir si ça fonctionne
      setTimeout(() => {
        addLog(`⏰ 2s après navigation - vérifiez si la page a changé`);
      }, 2000);
      
    } catch (error) {
      addLog(`❌ Erreur navigation: ${error}`);
      console.error('Erreur navigation:', error);
    }
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">🧪 Test Navigation ClipTokk</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Boutons de test */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">🎯 Tests de navigation</h2>
              
              {testNavigations.map((test, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-2">{test.label}</h3>
                  <p className="text-gray-600 text-sm mb-3">{test.description}</p>
                  <button
                    onClick={() => testNavigation(test.path, test.label)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                  >
                    Tester {test.label}
                  </button>
                </div>
              ))}
              
              <button
                onClick={clearLogs}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-gray-600 transition-colors mt-4"
              >
                🗑️ Effacer les logs
              </button>
            </div>

            {/* Logs */}
            <div>
              <h2 className="text-xl font-bold mb-4">📋 Logs de navigation</h2>
              <div className="bg-black text-green-400 rounded-lg p-4 h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-500">En attente de tests...</p>
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
          
          {/* Instructions */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">🔍 Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Cliquez sur "🎬 Submit Mission 1" pour tester la navigation problématique</li>
              <li>Regardez les logs pour voir si router.push() s'exécute</li>
              <li>Vérifiez si la page change réellement après 2 secondes</li>
              <li>Si ça ne fonctionne pas, le problème est dans le routage Next.js</li>
              <li>Si ça fonctionne ici mais pas sur la vraie page, le problème est ailleurs</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 