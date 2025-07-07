'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DiagnosticConnexion() {
  const [email, setEmail] = useState('geoviomgmt@gmail.com')
  const [password, setPassword] = useState('Le210898')
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const clearLogs = () => setLogs([])

  const testConnexion = async () => {
    setLoading(true)
    clearLogs()
    
    addLog('🚀 DIAGNOSTIC DE CONNEXION CLIPTOKK')
    addLog('=====================================')
    
    try {
      // Test 1: Variables d'environnement
      addLog('1️⃣ Vérification des variables d\'environnement...')
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        addLog('❌ Variables d\'environnement manquantes!')
        addLog(`   URL: ${supabaseUrl ? 'OK' : 'MANQUANTE'}`)
        addLog(`   Key: ${supabaseKey ? 'OK' : 'MANQUANTE'}`)
        return
      }
      addLog('✅ Variables d\'environnement OK')
      
      // Test 2: Connexion Supabase
      addLog('2️⃣ Test connexion Supabase...')
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        addLog(`❌ Erreur session: ${sessionError.message}`)
        return
      }
      
      addLog(`✅ Client Supabase OK`)
      addLog(`   Session actuelle: ${sessionData.session ? 'Active' : 'Aucune'}`)
      
      // Test 3: Tentative de connexion
      addLog('3️⃣ Tentative de connexion...')
      addLog(`   Email: ${email}`)
      addLog(`   Password: ${password.length} caractères`)
      
      const startTime = Date.now()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      const endTime = Date.now()
      
      addLog(`   Temps de réponse: ${endTime - startTime}ms`)
      
      if (error) {
        addLog(`❌ ERREUR DE CONNEXION: ${error.message}`)
        addLog(`   Code: ${error.status || 'N/A'}`)
        
        // Messages d'erreur spécifiques
        if (error.message.includes('Invalid login credentials')) {
          addLog('💡 SOLUTION: Vérifiez vos identifiants')
        } else if (error.message.includes('Email not confirmed')) {
          addLog('💡 SOLUTION: Confirmez votre email')
        } else if (error.message.includes('Too many requests')) {
          addLog('💡 SOLUTION: Attendez quelques minutes')
        }
        return
      }
      
      if (!data.user) {
        addLog('❌ Pas d\'utilisateur retourné')
        return
      }
      
      addLog('✅ CONNEXION RÉUSSIE!')
      addLog(`   User ID: ${data.user.id}`)
      addLog(`   Email: ${data.user.email}`)
      addLog(`   Confirmé: ${data.user.email_confirmed_at ? 'Oui' : 'Non'}`)
      
      // Test 4: Vérification du profil
      addLog('4️⃣ Vérification du profil utilisateur...')
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      
      if (profileError) {
        addLog(`❌ Erreur profil: ${profileError.message}`)
        if (profileError.message.includes('Row not found')) {
          addLog('💡 SOLUTION: Le profil n\'existe pas, création nécessaire')
        }
        return
      }
      
      addLog('✅ Profil trouvé!')
      addLog(`   Pseudo: ${profile.pseudo || 'Non défini'}`)
      addLog(`   Rôle: ${profile.role || 'Non défini'}`)
      addLog(`   Avatar: ${profile.avatar_url ? 'Défini' : 'Non défini'}`)
      
      // Test 5: Test de redirection dashboard
      addLog('5️⃣ Test de redirection vers le dashboard...')
      
      if (!profile.role) {
        addLog('⚠️ Aucun rôle défini - redirection vers onboarding')
        addLog('💡 URL: /onboarding/role')
      } else if (profile.role === 'creator') {
        addLog('✅ Rôle créateur - redirection dashboard créateur')
        addLog('💡 URL: /dashboard/creator')
      } else if (profile.role === 'clipper') {
        addLog('✅ Rôle clippeur - redirection dashboard clippeur')
        addLog('💡 URL: /dashboard/clipper')
      }
      
      addLog('🎉 DIAGNOSTIC TERMINÉ - CONNEXION FONCTIONNELLE!')
      
    } catch (error: any) {
      addLog(`💥 ERREUR CRITIQUE: ${error.message}`)
      console.error('Erreur complète:', error)
    } finally {
      setLoading(false)
    }
  }

  const testConnexionRapide = async () => {
    setLoading(true)
    clearLogs()
    
    addLog('⚡ TEST DE CONNEXION RAPIDE')
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        addLog(`❌ ${error.message}`)
      } else {
        addLog('✅ Connexion réussie!')
        addLog(`Utilisateur: ${data.user?.email}`)
        
        // Redirection automatique
        if (typeof window !== 'undefined') {
          addLog('🔄 Redirection vers dashboard...')
          window.location.href = '/dashboard'
        }
      }
    } catch (error: any) {
      addLog(`❌ ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          🔍 Diagnostic de Connexion ClipTokk
        </h1>
        
        {/* Formulaire de connexion */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Identifiants de test</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="votre@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre mot de passe"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={testConnexion}
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Diagnostic en cours...' : '🔍 Diagnostic complet'}
            </button>
            
            <button
              onClick={testConnexionRapide}
              disabled={loading}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : '⚡ Connexion rapide'}
            </button>
          </div>
        </div>
        
        {/* Console de logs */}
        <div className="bg-black rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-green-400 font-mono text-sm">Console de diagnostic</h3>
            <button
              onClick={clearLogs}
              className="text-gray-400 hover:text-white text-sm"
            >
              Effacer
            </button>
          </div>
          
          <div className="font-mono text-sm text-green-400 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">
                Cliquez sur "Diagnostic complet" pour commencer...
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Liens utiles */}
        <div className="mt-6 text-center">
          <div className="flex justify-center gap-4">
            <a 
              href="/dashboard" 
              className="text-blue-500 hover:underline"
            >
              → Dashboard
            </a>
            <a 
              href="/onboarding/role" 
              className="text-blue-500 hover:underline"
            >
              → Onboarding
            </a>
            <a 
              href="/" 
              className="text-blue-500 hover:underline"
            >
              → Accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 