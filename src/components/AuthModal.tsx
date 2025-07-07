'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'
import { IconX, IconMail, IconLock } from '@tabler/icons-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { refreshProfile } = useAuth()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.error('DEBUG - Début connexion')

    if (loading) {
      console.error('DEBUG - Déjà en chargement')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Vérifier les champs
      if (!email.trim() || !password) {
        throw new Error('Veuillez remplir tous les champs')
      }

      console.error('DEBUG - Tentative connexion:', email)

      // Connexion
      const { data: authResult, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      })

      console.error('DEBUG - Résultat auth:', authError ? 'ERREUR' : 'OK')

      if (authError) {
        console.error('DEBUG - Erreur auth détaillée:', authError)
        throw authError
      }

      if (!authResult?.user) {
        console.error('DEBUG - Pas d\'utilisateur dans la réponse')
        throw new Error('Connexion échouée')
      }

      console.error('DEBUG - User ID:', authResult.user.id)

      // Vérifier la session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      console.error('DEBUG - Session:', session ? 'OK' : 'NON')

      if (sessionError) {
        console.error('DEBUG - Erreur session:', sessionError)
        throw sessionError
      }

      if (!session) {
        console.error('DEBUG - Pas de session')
        throw new Error('Session non créée')
      }

      // Récupérer le profil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authResult.user.id)
        .single()

      console.error('DEBUG - Profil:', profile ? 'OK' : 'NON')

      if (profileError) {
        console.error('DEBUG - Erreur profil:', profileError)
        throw profileError
      }

      if (!profile) {
        console.error('DEBUG - Profil non trouvé')
        throw new Error('Profil non trouvé')
      }

      // Fermer le modal et rafraîchir
      console.error('DEBUG - Rafraîchissement profil...')
      await refreshProfile()
      console.error('DEBUG - Profil rafraîchi')

      onClose()
      console.error('DEBUG - Modal fermé')

    } catch (err: any) {
      console.error('DEBUG - Erreur finale:', err)

      let errorMessage = 'Une erreur est survenue'

      if (err.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou mot de passe incorrect'
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage = 'Email non confirmé. Vérifie ta boîte mail'
      } else if (err.message?.includes('Too many requests')) {
        errorMessage = 'Trop de tentatives. Attends quelques minutes'
      } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
        errorMessage = 'Problème de connexion internet'
      } else if (err.message?.includes('fill')) {
        errorMessage = err.message
      } else if (err.code) {
        errorMessage = `Erreur (${err.code}): ${err.message}`
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <IconX className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <IconMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="ton@email.com"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <IconLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Chargement...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
} 