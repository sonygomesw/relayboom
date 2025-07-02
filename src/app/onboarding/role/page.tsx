'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<'creator' | 'clipper' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/')
          return
        }
        setUser(user)

        // Vérifier si l'utilisateur a déjà un rôle
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) {
          console.log('📭 Pas de profil trouvé ou erreur:', error.message)
          // Pas de profil = première visite, on reste sur la page de sélection
          return
        }

        if (profile?.role) {
          console.log('✅ Utilisateur avec rôle trouvé:', profile.role)
          // Rediriger vers le bon dashboard
          router.push(profile.role === 'creator' ? '/dashboard/creator' : '/dashboard/clipper')
        } else {
          console.log('📝 Profil trouvé mais sans rôle, rester sur sélection')
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification auth:', error)
      }
    }

    checkAuth()
  }, [router])

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) {
      console.log('❌ Pas de rôle sélectionné ou pas d\'utilisateur:', { selectedRole, user: !!user })
      return
    }

    console.log('🚀 Début sélection rôle:', selectedRole)
    setIsLoading(true)

    try {
      // Créer ou mettre à jour le profil avec le rôle sélectionné (UPSERT)
      console.log('📝 UPSERT du profil pour user:', user.id)
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          role: selectedRole,
          pseudo: user.email?.split('@')[0] || 'Utilisateur',
          email: user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) {
        console.error('❌ Erreur lors de l\'upsert du rôle:', error)
        alert('Erreur lors de la sélection du rôle: ' + error.message)
        return
      }

      console.log('✅ Profil créé/mis à jour:', data)
      console.log('🔄 Redirection vers:', selectedRole === 'creator' ? '/dashboard/creator' : '/dashboard/clipper')

      // Attendre un peu pour que la base soit à jour
      await new Promise(resolve => setTimeout(resolve, 500))

      // Rediriger vers le bon dashboard
      router.push(selectedRole === 'creator' ? '/dashboard/creator' : '/dashboard/clipper')
    } catch (error) {
      console.error('❌ Exception lors de la sélection du rôle:', error)
      alert('Erreur lors de la sélection du rôle: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-white pt-20">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-2xl p-8 mx-4 mt-8">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">R</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue sur ClipTokk !</h1>
          <p className="text-gray-600">Quel est ton objectif ?</p>
        </div>

        {/* Options de rôle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Créateur */}
          <div 
            onClick={() => setSelectedRole('creator')}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selectedRole === 'creator' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎥</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Je suis créateur / influenceur</h3>
              <p className="text-sm text-gray-600 mb-4">Je veux être payé pour mes vues et faire clipper mon contenu</p>
              <div className={`w-6 h-6 rounded-full border-2 mx-auto ${
                selectedRole === 'creator' 
                  ? 'border-green-500 bg-green-500' 
                  : 'border-gray-300'
              }`}>
                {selectedRole === 'creator' && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </div>

          {/* Clippeur */}
          <div 
            onClick={() => setSelectedRole('clipper')}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selectedRole === 'clipper' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✂️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Je suis clippeur</h3>
              <p className="text-sm text-gray-600 mb-4">Je veux faire des clips pour les créateurs et gagner de l'argent</p>
              <div className={`w-6 h-6 rounded-full border-2 mx-auto ${
                selectedRole === 'clipper' 
                  ? 'border-green-500 bg-green-500' 
                  : 'border-gray-300'
              }`}>
                {selectedRole === 'clipper' && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bouton continuer */}
        <button
          onClick={handleRoleSelection}
          disabled={!selectedRole || isLoading}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
            selectedRole && !isLoading
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Configuration...</span>
            </div>
          ) : (
            'Continuer'
          )}
        </button>

        {/* Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Tu pourras modifier ce choix plus tard dans tes paramètres
        </p>
      </div>
    </div>
  )
} 