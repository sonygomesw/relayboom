'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabaseDirect() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testDirectLogin = async () => {
    setLoading(true);
    setResult('🔄 Test en cours...\n');

    try {
      // Test 1: Configuration Supabase
      setResult(prev => prev + '1️⃣ Test configuration Supabase...\n');
      console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('SUPABASE_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      setResult(prev => prev + `   URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);
      setResult(prev => prev + `   Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Définie' : 'MANQUANTE'}\n`);

      // Test 2: Client Supabase
      setResult(prev => prev + '2️⃣ Test client Supabase...\n');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      setResult(prev => prev + `   Session: ${sessionData.session ? 'Active' : 'Aucune'}\n`);
      if (sessionError) setResult(prev => prev + `   Erreur session: ${sessionError.message}\n`);

      // Test 3: Connexion directe
      setResult(prev => prev + '3️⃣ Test connexion...\n');
      const email = 'geoviomgmt@gmail.com';
      const password = 'Le210898';
      
      setResult(prev => prev + `   Email: ${email}\n`);
      setResult(prev => prev + `   Password: ${password.length} caractères\n`);

      console.log('=== TENTATIVE DE CONNEXION DIRECTE ===');
      console.log('Email:', email);
      console.log('Password length:', password.length);

      const startTime = Date.now();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      const endTime = Date.now();

      setResult(prev => prev + `   Temps de réponse: ${endTime - startTime}ms\n`);

      console.log('RÉPONSE COMPLÈTE:', { data, error });

      if (error) {
        setResult(prev => prev + `❌ ERREUR: ${error.message}\n`);
        setResult(prev => prev + `   Code erreur: ${error.status || 'N/A'}\n`);
        console.error('ERREUR DÉTAILLÉE:', error);
      } else if (data.user) {
        setResult(prev => prev + `✅ CONNEXION RÉUSSIE!\n`);
        setResult(prev => prev + `   User ID: ${data.user.id}\n`);
        setResult(prev => prev + `   Email: ${data.user.email}\n`);
        setResult(prev => prev + `   Confirmé: ${data.user.email_confirmed_at ? 'Oui' : 'Non'}\n`);
        
        // Test 4: Vérification session après connexion
        setResult(prev => prev + '4️⃣ Vérification session...\n');
        const { data: newSession } = await supabase.auth.getSession();
        setResult(prev => prev + `   Nouvelle session: ${newSession.session ? 'Active' : 'Aucune'}\n`);
        
        console.log('CONNEXION RÉUSSIE, SESSION:', newSession);
      } else {
        setResult(prev => prev + `⚠️ Pas d'erreur mais pas d'utilisateur non plus\n`);
      }

    } catch (err) {
      console.error('ERREUR CATCH:', err);
      setResult(prev => prev + `💥 ERREUR CATCH: ${err}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testSupabaseConnection = async () => {
    setLoading(true);
    setResult('🔌 Test connexion basique...\n');

    try {
      // Test simple de la connexion
      const response = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/', {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        }
      });

      setResult(prev => prev + `Status: ${response.status}\n`);
      setResult(prev => prev + `OK: ${response.ok ? 'Oui' : 'Non'}\n`);
      
      if (response.ok) {
        setResult(prev => prev + '✅ Connexion Supabase OK\n');
      } else {
        setResult(prev => prev + '❌ Problème de connexion Supabase\n');
      }

    } catch (err) {
      setResult(prev => prev + `❌ Erreur: ${err}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">🔍 Test Supabase Direct</h1>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={testSupabaseConnection}
              disabled={loading}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Test...' : '🔌 Test Connexion Basique'}
            </button>
            
            <button
              onClick={testDirectLogin}
              disabled={loading}
              className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Test...' : '🔐 Test Connexion Directe'}
            </button>
          </div>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap min-h-96">
            {result || 'Cliquez sur un bouton pour commencer les tests...'}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Ouvrez la console développeur (F12)</li>
              <li>Cliquez sur "Test Connexion Basique" d'abord</li>
              <li>Puis "Test Connexion Directe"</li>
              <li>Regardez les logs dans la console ET dans cette fenêtre</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 