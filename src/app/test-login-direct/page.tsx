'use client';

import { useState } from 'react';
import AuthModalUltraSimple from '@/components/AuthModalUltraSimple';

export default function TestLoginDirect() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">🔧 Test Login Direct</h1>
        
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-bold text-red-800 mb-2">🚨 Mode Urgence</h3>
            <p className="text-red-700 text-sm">
              Modal de connexion ultra-simple pour résoudre le problème d'authentification
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-bold hover:bg-red-700 transition-all"
          >
            🚀 OUVRIR MODAL ULTRA SIMPLE
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-800 mb-2">📋 Instructions</h3>
            <ol className="text-blue-700 text-sm space-y-1">
              <li>1. Cliquez sur le bouton rouge</li>
              <li>2. Vos identifiants sont pré-remplis</li>
              <li>3. Cliquez sur "Se connecter"</li>
              <li>4. Ouvrez la console (F12) pour voir les logs</li>
            </ol>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 mb-2">🔑 Identifiants</h3>
            <p className="text-gray-700 text-sm font-mono">
              Email: geoviomgmt@gmail.com<br/>
              Mot de passe: Le210898
            </p>
          </div>
        </div>
      </div>

      <AuthModalUltraSimple
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
} 