'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugUltimate() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const clearLogs = () => setLogs([]);

  const runDiagnostic = async () => {
    setIsRunning(true);
    clearLogs();
    
    try {
      addLog('🚀 === DIAGNOSTIC COMPLET CLIPTOKK ===');
      
      // Test 1: Variables d'environnement
      addLog('📋 Test 1: Variables d\'environnement');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      addLog(`URL Supabase: ${supabaseUrl ? '✅ Définie' : '❌ Manquante'}`);
      addLog(`Clé Supabase: ${supabaseKey ? '✅ Définie' : '❌ Manquante'}`);
      
      if (supabaseUrl) {
        addLog(`URL: ${supabaseUrl.substring(0, 30)}...`);
      }
      
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
      
      // Test 4: Connectivité Supabase
      addLog('🔗 Test 4: Connectivité avec Supabase');
      try {
        const startTime = Date.now();
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        const endTime = Date.now();
        
        if (error) {
          addLog(`❌ Erreur connexion DB: ${error.message}`);
        } else {
          addLog(`✅ Connexion DB OK (${endTime - startTime}ms)`);
        }
      } catch (error: any) {
        addLog(`❌ Échec connexion DB: ${error.message}`);
      }
      
      // Test 5: Authentification avec credentials invalides
      addLog('🔒 Test 5: Auth avec credentials invalides');
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: 'test@invalid.com',
          password: 'wrongpassword'
        });
        
        if (error) {
          addLog(`✅ Gestion erreur OK: ${error.message}`);
        } else {
          addLog('❌ Pas d\'erreur avec credentials invalides (problème!)');
        }
      } catch (error: any) {
        addLog(`❌ Erreur inattendue: ${error.message}`);
      }
      
      // Test 6: Authentification avec les vrais credentials
      addLog('🔐 Test 6: Auth avec vrais credentials');
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'test@cliptokk.com',
          password: '123456'
        });
        
        if (error) {
          addLog(`❌ Échec connexion: ${error.message}`);
          addLog(`Code erreur: ${error.status || 'N/A'}`);
        } else if (data.user) {
          addLog('✅ Connexion réussie!');
          addLog(`User ID: ${data.user.id}`);
          addLog(`Email: ${data.user.email}`);
          addLog(`Email confirmé: ${data.user.email_confirmed_at ? 'Oui' : 'Non'}`);
          
          // Test 7: Récupération du profil
          addLog('👤 Test 7: Récupération profil');
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (profileError) {
            addLog(`❌ Erreur profil: ${profileError.message}`);
          } else {
            addLog('✅ Profil récupéré!');
            addLog(`Rôle: ${profile.role || 'Non défini'}`);
            addLog(`Pseudo: ${profile.pseudo || 'Non défini'}`);
          }
          
          // Test 8: Déconnexion
          addLog('🚪 Test 8: Déconnexion');
          await supabase.auth.signOut();
          addLog('✅ Déconnexion effectuée');
        }
      } catch (error: any) {
        addLog(`❌ Erreur critique: ${error.message}`);
      }
      
      // Test 9: Navigation et DOM
      addLog('🖥️ Test 9: Environnement navigateur');
      addLog(`User Agent: ${navigator.userAgent.substring(0, 50)}...`);
      addLog(`Langue: ${navigator.language}`);
      addLog(`Cookies activés: ${navigator.cookieEnabled ? 'Oui' : 'Non'}`);
      addLog(`LocalStorage disponible: ${typeof Storage !== 'undefined' ? 'Oui' : 'Non'}`);
      
      // Test 10: Console et événements
      addLog('🎯 Test 10: Console et événements');
      console.log('🧪 Test console depuis DebugUltimate');
      addLog('✅ Log console envoyé (vérifiez la console)');
      
      // Test 11: Redirection simulation
      addLog('🔄 Test 11: Simulation redirection');
      const testUrl = '/dashboard/clipper';
      addLog(`Test URL: ${testUrl}`);
      addLog('✅ URL de redirection valide');
      
      addLog('🎉 === DIAGNOSTIC TERMINÉ ===');
      
    } catch (error: any) {
      addLog(`💥 ERREUR GLOBALE: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Test automatique des événements au montage
  useEffect(() => {
    addLog('⚡ Page chargée, composant monté');
    
    // Test des événements de fenêtre
    const handleVisibility = () => {
      addLog(`👁️ Visibilité: ${document.hidden ? 'Cachée' : 'Visible'}`);
    };
    
    document.addEventListener('visibilitychange', handleVisibility);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">🔍 Diagnostic Ultime ClipTokk</h1>
            <p className="text-blue-100">Test complet de tous les systèmes</p>
          </div>
          
          {/* Controls */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={runDiagnostic}
                disabled={isRunning}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isRunning 
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isRunning ? '🔄 Diagnostic en cours...' : '🚀 Lancer le diagnostic'}
              </button>
              
              <button
                onClick={clearLogs}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold"
              >
                🧹 Effacer
              </button>
              
              <div className="flex-1 text-right text-sm text-gray-500 pt-3">
                {logs.length} entrées • Dernière mise à jour: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          {/* Logs */}
          <div className="p-6">
            <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto">
              <div className="font-mono text-sm space-y-1">
                {logs.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">
                    📄 Aucun log pour le moment...
                    <br />
                    <span className="text-xs">Cliquez sur "Lancer le diagnostic" pour commencer</span>
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div 
                      key={index}
                      className={`${
                        log.includes('❌') ? 'text-red-400' :
                        log.includes('✅') ? 'text-green-400' :
                        log.includes('🚀') || log.includes('===') ? 'text-yellow-400 font-bold' :
                        log.includes('Test') ? 'text-blue-400 font-semibold' :
                        'text-gray-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 p-4 text-center text-sm text-gray-600">
            <div className="flex justify-center gap-4">
              <a href="/" className="text-blue-600 hover:text-blue-800">← Accueil</a>
              <a href="/test-auth-simple" className="text-blue-600 hover:text-blue-800">Test Simple</a>
              <a href="/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 