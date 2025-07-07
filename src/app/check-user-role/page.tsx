'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CheckUserRole() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Vérifier la session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          setUserInfo({ error: 'Pas de session active' })
          return
        }

        // Récupérer le profil
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', 'geoviomgmt@gmail.com')
          .single()

        if (error) {
          setUserInfo({ error: error.message })
          return
        }

        setUserInfo({
          session: {
            user_id: session.user.id,
            email: session.user.email
          },
          profile: profile
        })

      } catch (error) {
        setUserInfo({ error: (error as Error).message })
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification du rôle utilisateur...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔍 Vérification du rôle utilisateur
          </h1>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold text-gray-700 mb-2">Informations utilisateur :</h2>
              <pre className="text-sm text-gray-600 overflow-auto">
                {JSON.stringify(userInfo, null, 2)}
              </pre>
            </div>

            {userInfo?.profile && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="font-semibold text-blue-700 mb-2">Résumé :</h2>
                <ul className="text-blue-600 space-y-1">
                  <li><strong>Email :</strong> {userInfo.profile.email}</li>
                  <li><strong>Pseudo :</strong> {userInfo.profile.pseudo}</li>
                  <li><strong>Rôle :</strong> <span className="font-bold text-lg">{userInfo.profile.role}</span></li>
                  <li><strong>Redirection attendue :</strong> 
                    {userInfo.profile.role === 'creator' && <span className="text-green-600 font-bold"> /dashboard/creator</span>}
                    {userInfo.profile.role === 'clipper' && <span className="text-green-600 font-bold"> /dashboard/clipper</span>}
                    {userInfo.profile.role === 'admin' && <span className="text-green-600 font-bold"> /admin</span>}
                  </li>
                </ul>
              </div>
            )}

            {userInfo?.error && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h2 className="font-semibold text-red-700 mb-2">Erreur :</h2>
                <p className="text-red-600">{userInfo.error}</p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 