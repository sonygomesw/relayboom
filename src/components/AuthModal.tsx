'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'
import { IconX, IconMail, IconLock, IconUser, IconBrandTiktok } from '@tabler/icons-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthMode = 'login' | 'signup' | 'clipper-signup'

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [tiktokUsername, setTiktokUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { refreshProfile } = useAuth()

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.error('DEBUG - Début auth:', mode)

    if (loading) {
      console.error('DEBUG - Déjà en chargement')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Vérifier les champs
      if (!email.trim() || !password || (mode !== 'login' && !pseudo) || (mode === 'clipper-signup' && !tiktokUsername)) {
        throw new Error('Veuillez remplir tous les champs obligatoires')
      }

      if (mode === 'login') {
        console.error('DEBUG - Tentative connexion:', email)
        
        // Connexion
        const { data: authResult, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        })

        if (authError) throw authError
        if (!authResult?.user) throw new Error('Connexion échouée')

        // Vérifier la session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        if (!session) throw new Error('Session non créée')

        // Récupérer le profil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authResult.user.id)
          .single()

        if (profileError) throw profileError
        if (!profile) throw new Error('Profil non trouvé')

        await refreshProfile()
        onClose()

      } else {
        // Inscription
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              pseudo: pseudo,
              tiktok_username: tiktokUsername || '',
              role: mode === 'clipper-signup' ? 'clipper' : 'creator'
            }
          }
        })

        if (error) throw error

        if (data?.user) {
          setError('Compte créé ! Vérifie ton email pour confirmer ton inscription.')
          // Ne pas fermer le modal, laisser le message visible
        }
      }

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

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setPseudo('')
    setTiktokUsername('')
    setError(null)
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <IconX className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Se connecter' : 
             mode === 'clipper-signup' ? 'Devenir clippeur' : 'Créer un compte'}
          </h3>
          <p className="text-gray-600">
            {mode === 'login' ? 'Accède à ton dashboard' : 
             mode === 'clipper-signup' ? 'Commence à gagner de l\'argent avec tes clips' : 
             'Rejoins la communauté ClipTokk'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
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
                minLength={6}
                disabled={loading}
              />
            </div>
          </div>

          {mode !== 'login' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pseudo
                </label>
                <div className="relative">
                  <IconUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ton pseudo"
                    disabled={loading}
                  />
                </div>
              </div>

              {mode === 'clipper-signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom d'utilisateur TikTok
                  </label>
                  <div className="relative">
                    <IconBrandTiktok className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={tiktokUsername}
                      onChange={(e) => setTiktokUsername(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      placeholder="@tiktok_username"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {error && (
            <div className={`p-3 rounded-lg ${error.includes('Erreur') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {mode === 'login' ? (
            <>
              Pas encore de compte ?{' '}
              <button
                onClick={() => switchMode('signup')}
                className="font-medium text-primary-600 hover:text-primary-500"
                disabled={loading}
              >
                Créer un compte
              </button>
              <div className="mt-2">
                <button
                  onClick={() => switchMode('clipper-signup')}
                  className="font-medium text-primary-600 hover:text-primary-500"
                  disabled={loading}
                >
                  Devenir clippeur
                </button>
              </div>
            </>
          ) : (
            <>
              Déjà un compte ?{' '}
              <button
                onClick={() => switchMode('login')}
                className="font-medium text-primary-600 hover:text-primary-500"
                disabled={loading}
              >
                Se connecter
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 