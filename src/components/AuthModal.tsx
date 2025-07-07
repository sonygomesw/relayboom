'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      console.error('DEBUG - Utilisateur authentifié, fermeture modal')
      onClose()
    }
  }, [isAuthenticated, onClose])

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.error('DEBUG - Début connexion')

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('DEBUG - Erreur connexion:', error.message)
        setError(error.message)
        return
      }

      if (!data) {
        console.error('DEBUG - Pas de données retournées')
        setError('Erreur de connexion')
        return
      }

      console.error('DEBUG - Connexion réussie')
    } catch (err) {
      console.error('DEBUG - Erreur inattendue:', err)
      setError('Une erreur inattendue est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Chargement...' : 'Continuer avec Google'}
        </button>

        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-600 hover:text-gray-800"
        >
          Annuler
        </button>
      </div>
    </div>
  )
} 