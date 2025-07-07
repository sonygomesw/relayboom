'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugAuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'
    setLogs(prev => [...prev, `${timestamp} ${emoji} ${message}`])
  }

  const testSupabaseConnection = async () => {
    addLog('Test de connexion Supabase...')
    
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        addLog(`Erreur getSession: ${error.message}`, 'error')
      } else {
        addLog('Connexion Supabase OK', 'success')
        addLog(`Session actuelle: ${data.session ? 'Active' : 'Aucune'}`)
      }
    } catch (err) {
      addLog(`Erreur connexion: ${(err as Error).message}`, 'error')
    }
  }

  const testLogin = async () => {
    if (!email || !password) {
      addLog('Email et mot de passe requis', 'error')
      return
    }

    setLoading(true)
    addLog(`Tentative de connexion avec ${email}...`)

    try {
      // Test 1: SignIn
      addLog('ÉTAPE 1: signInWithPassword...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      })

      if (error) {
        addLog(`Erreur signIn: ${error.message}`, 'error')
        return
      }

      addLog('SignIn réussi!', 'success')
      addLog(`Utilisateur: ${data.user?.email}`)
      addLog(`ID: ${data.user?.id}`)
      addLog(`Email confirmé: ${data.user?.email_confirmed_at ? 'Oui' : 'Non'}`)

      // Test 2: Récupérer le profil
      addLog('ÉTAPE 2: Récupération du profil...')
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        addLog(`Erreur profil: ${profileError.message}`, 'error')
        addLog(`Code erreur: ${profileError.code}`)
      } else {
        addLog('Profil récupéré!', 'success')
        addLog(`Rôle: ${profile.role || 'Aucun'}`)
        addLog(`Pseudo: ${profile.pseudo || 'Aucun'}`)
        addLog(`Données complètes: ${JSON.stringify(profile, null, 2)}`)
      }

      // Test 3: Vérifier la session après connexion
      addLog('ÉTAPE 3: Vérification session...')
      const { data: sessionData } = await supabase.auth.getSession()
      addLog(`Session après connexion: ${sessionData.session ? 'Active' : 'Inactive'}`)

    } catch (err) {
      addLog(`Erreur générale: ${(err as Error).message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const testVariablesEnv = () => {
    addLog('VÉRIFICATION VARIABLES ENVIRONNEMENT:')
    addLog(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Définie' : '❌ Manquante'}`)
    addLog(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Définie' : '❌ Manquante'}`)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      addLog(`URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Debug Authentification</h1>
        
        {/* Tests rapides */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Tests rapides</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={testSupabaseConnection}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Test Connexion Supabase
            </button>
            <button
              onClick={testVariablesEnv}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            >
              Vérifier Variables ENV
            </button>
            <button
              onClick={clearLogs}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Effacer logs
            </button>
          </div>
        </div>

        {/* Test de connexion */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Test de connexion</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre-email@exemple.com"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="votre-mot-de-passe"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            
            <button
              onClick={testLogin}
              disabled={loading}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Test en cours...' : 'Tester la connexion'}
            </button>
          </div>
        </div>
        
        {/* Logs */}
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg">
          <h3 className="text-white text-lg font-semibold mb-4">📋 Logs de debug</h3>
          <div className="font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">Aucun log pour le moment...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 