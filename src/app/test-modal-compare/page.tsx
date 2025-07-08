'use client';

import { useState } from 'react';
import AuthModal from '@/components/AuthModal';
import AuthModalSimple from '@/components/AuthModalSimple';

export default function TestModalCompare() {
  const [showOriginal, setShowOriginal] = useState(false);
  const [showSimple, setShowSimple] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'clipper-signup'>('login');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">🔬 Comparaison des Modals d'Auth</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Modal Original */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Modal Original (Complexe)</h2>
              <p className="text-gray-700 mb-4">
                Le modal avec tous les logs et fonctionnalités complètes
              </p>
              <button
                onClick={() => setShowOriginal(true)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700"
              >
                🚀 Tester Modal Original
              </button>
            </div>
            
            {/* Modal Simple */}
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-green-900 mb-4">Modal Simple</h2>
              <p className="text-gray-700 mb-4">
                Version épurée sans logs complexes, juste l'essentiel
              </p>
              <button
                onClick={() => setShowSimple(true)}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700"
              >
                ⚡ Tester Modal Simple
              </button>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">📋 Instructions de test</h3>
            <ul className="text-yellow-800 space-y-2">
              <li>• Testez les deux versions avec les mêmes credentials</li>
              <li>• Ouvrez la console pour voir les logs</li>
              <li>• Notez les différences de comportement</li>
              <li>• Email test: <code className="bg-yellow-200 px-1 rounded">test@cliptokk.com</code></li>
              <li>• Mot de passe: <code className="bg-yellow-200 px-1 rounded">123456</code></li>
            </ul>
          </div>
          
          {/* Navigation */}
          <div className="mt-8 text-center space-x-4">
            <a href="/" className="text-blue-600 hover:text-blue-800 underline">← Accueil</a>
            <a href="/debug-ultimate" className="text-blue-600 hover:text-blue-800 underline">Debug Ultime</a>
            <a href="/test-auth-simple" className="text-blue-600 hover:text-blue-800 underline">Test Simple</a>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showOriginal}
        onClose={() => setShowOriginal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
      
      <AuthModalSimple
        isOpen={showSimple}
        onClose={() => setShowSimple(false)}
      />
    </div>
  );
} 