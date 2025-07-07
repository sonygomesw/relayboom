'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestAuthDirect() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testLogin = async () => {
    setLoading(true);
    addLog('🚀 Début du test de connexion...');

    try {
      // Test 1: Configuration Supabase
      addLog('📋 Test 1: Variables d\'environnement');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      addLog(`URL Supabase: ${supabaseUrl ? '✅ Définie' : '❌ Manquante'}`);
      addLog(`Clé Supabase: ${supabaseKey ? '✅ Définie' : '❌ Manquante'}`);
      
      // Test 2: Connexion réseau de base
      addLog('🌐 Test 2: Connexion réseau');
      try {
        const response = await fetch('https://httpbin.org/get');
        addLog(`Connexion internet: ${response.ok ? '✅ OK' : '❌ Échec'}`);
      } catch (error) {
        addLog('❌ Pas de connexion internet');
      }
      
      // Test 3: Client Supabase
      addLog('🔌 Test 3: Client Supabase');
      try {
        const { data: healthCheck } = await supabase.auth.getSession();
        addLog('✅ Client Supabase initialisé');
        addLog(`Session actuelle: ${healthCheck.session ? 'Oui' : 'Non'}`);
      } catch (error: any) {
        addLog(`❌ Erreur client Supabase: ${error.message}`);
      }
      
      // Test 4: Tentative de connexion
      addLog('🔑 Test 4: Tentative de connexion');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'geoviomgmt@gmail.com',
        password: 'Le210898'
      });

      if (error) {
        addLog(`❌ Erreur de connexion: ${error.message}`);
        throw error;
      }

      addLog('✅ Connexion réussie!');
      addLog(`👤 Utilisateur: ${data.user?.email}`);
      addLog(`🎫 Session: ${data.session ? 'Active' : 'Inactive'}`);

      // Test 5: Vérification du profil
      addLog('👥 Test 5: Vérification du profil');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single();

      if (profileError) {
        addLog(`❌ Erreur profil: ${profileError.message}`);
      } else {
        addLog(`✅ Profil trouvé: ${profile.pseudo}`);
        addLog(`🎭 Rôle: ${profile.role}`);
      }

    } catch (error: any) {
      addLog(`💥 ERREUR: ${error.message}`);
      console.error('Erreur complète:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Test de Connexion Direct</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <button
            onClick={testLogin}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Test en cours...' : 'Tester la connexion'}
          </button>
        </div>

        <div className="bg-black/90 text-green-400 p-6 rounded-lg font-mono text-sm">
          {logs.map((log, i) => (
            <div key={i} className="mb-1">{log}</div>
          ))}
          {logs.length === 0 && (
            <div className="text-gray-500">Les logs apparaîtront ici...</div>
          )}
        </div>
      </div>
    </div>
  );
} 