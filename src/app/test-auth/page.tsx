'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestAuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('🔄 Test de connexion...')
    
    try {
      // Test 1: Vérifier la connexion Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      setResult(prev => prev + '\n✅ Connexion Supabase OK')
      
      // Test 2: Tester la connexion avec les identifiants
      if (email && password) {
        setResult(prev => prev + '\n🔐 Test de connexion avec email/password...')
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        })
        
        if (error) {
          setResult(prev => prev + '\n❌ Erreur de connexion: ' + error.message)
        } else {
          setResult(prev => prev + '\n✅ Connexion réussie!')
          setResult(prev => prev + '\n👤 Utilisateur: ' + JSON.stringify(data.user?.email))
          
          // Test 3: Récupérer le profil
          if (data.user) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single()
            
            if (profileError) {
              setResult(prev => prev + '\n❌ Erreur profil: ' + profileError.message)
            } else {
              setResult(prev => prev + '\n✅ Profil récupéré: ' + JSON.stringify(profile))
            }
          }
        }
      }
      
    } catch (error: any) {
      setResult(prev => prev + '\n💥 Erreur: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test d'authentification</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email de test</label>
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
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Tester la connexion'}
          </button>
        </div>
        
        {result && (
          <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
            {result}
          </div>
        )}
      </div>
    </div>
  )
} 