"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthContext';
import { IconX, IconMail, IconUser, IconBrandTiktok, IconVideo, IconLock } from '@tabler/icons-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup' | 'clipper-signup';
  onModeChange: (mode: 'login' | 'signup' | 'clipper-signup') => void;
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [tiktokUsername, setTiktokUsername] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const router = useRouter();
  const { refreshProfile } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('🔄 Début de l\'authentification, mode:', mode);
      console.log('📧 Email:', email);
      console.log('🔑 Password présent:', !!password);
      
      if (mode === 'login') {
        console.log('🔐 === DÉBUT PROCESSUS DE CONNEXION ===');
        
        // Test 1: Vérifier la connexion Supabase
        console.log('ÉTAPE 1: Test de base Supabase...');
        const { data: testSession, error: testError } = await supabase.auth.getSession();
        console.log('✅ Supabase répond, session actuelle:', testSession.session ? 'Oui' : 'Non');
        if (testError) {
          console.error('❌ Erreur test Supabase:', testError);
        }
        
        // Test 2: Tentative de connexion
        console.log('ÉTAPE 2: signInWithPassword...');
        console.log('Paramètres:', { email: email.trim(), passwordLength: password.length });
        
        const authResult = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });
        
        console.log('ÉTAPE 3: Résultat de signInWithPassword...');
        console.log('✅ Résultat reçu:', {
          hasData: !!authResult.data,
          hasUser: !!authResult.data?.user,
          hasSession: !!authResult.data?.session,
          hasError: !!authResult.error,
          errorMessage: authResult.error?.message
        });
        
        if (authResult.error) {
          console.error('❌ Erreur Supabase complète:', authResult.error);
          throw authResult.error;
        }
        
        if (!authResult.data?.user) {
          console.error('❌ Pas d\'utilisateur dans la réponse');
          throw new Error('Aucun utilisateur retourné par Supabase');
        }
        
        console.log('✅ Connexion Supabase réussie!');
        console.log('👤 Utilisateur:', {
          id: authResult.data.user.id,
          email: authResult.data.user.email,
          confirmed: !!authResult.data.user.email_confirmed_at
        });
        
        // Test 3: Vérifier la session après connexion
        console.log('ÉTAPE 4: Vérification session après connexion...');
        const { data: newSession } = await supabase.auth.getSession();
        console.log('📱 Session après connexion:', {
          exists: !!newSession.session,
          userId: newSession.session?.user?.id,
          accessToken: !!newSession.session?.access_token
        });
        
        // Test 4: Rafraîchir le profil
        console.log('ÉTAPE 5: Rafraîchissement du profil...');
        await refreshProfile();
        console.log('✅ refreshProfile() terminé');
        
        // Test 5: Récupérer le profil directement
        console.log('ÉTAPE 6: Récupération directe du profil...');
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, pseudo, email')
          .eq('id', authResult.data.user.id)
          .single();
        
        console.log('📋 Résultat profil:', {
          hasData: !!profileData,
          hasError: !!profileError,
          errorMessage: profileError?.message,
          errorCode: profileError?.code,
          profileData: profileData
        });
        
        if (profileError) {
          console.error('❌ Erreur récupération profil:', profileError);
          console.log('➡️ Redirection vers onboarding (erreur profil)');
          router.push('/onboarding/role');
        } else if (profileData?.role) {
          console.log('✅ Profil récupéré avec succès:', profileData);
          
          // Redirection selon le rôle
          let redirectUrl = '/';
          if (profileData.role === 'creator') {
            redirectUrl = '/dashboard/creator';
            console.log('➡️ Redirection vers dashboard creator');
          } else if (profileData.role === 'clipper') {
            redirectUrl = '/dashboard/clipper';
            console.log('➡️ Redirection vers dashboard clipper');
          } else if (profileData.role === 'admin') {
            redirectUrl = '/admin';
            console.log('➡️ Redirection vers admin');
          } else {
            redirectUrl = '/onboarding/role';
            console.log('➡️ Redirection vers onboarding (rôle inconnu)');
          }
          
          console.log('ÉTAPE 7: Exécution router.push vers:', redirectUrl);
          router.push(redirectUrl);
          console.log('✅ router.push() exécuté');
        } else {
          console.log('➡️ Redirection vers onboarding (pas de rôle)');
          router.push('/onboarding/role');
        }
        
        console.log('ÉTAPE 8: Fermeture du modal...');
        onClose();
        console.log('✅ Modal fermé');
        
        console.log('🎉 === PROCESSUS DE CONNEXION TERMINÉ ===');
        
      } else {
        // Code d'inscription inchangé
        console.log('📝 Tentative d\'inscription pour:', email);
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://cliptokk.com'}/auth/callback`
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          const profileData = {
            email,
            pseudo: pseudo || email.split('@')[0],
            tiktok_username: tiktokUsername || '',
            total_earnings: 0,
            role: mode === 'clipper-signup' ? 'clipper' : 'creator'
          };
          localStorage.setItem('pendingProfile', JSON.stringify(profileData));
          
          setMessage('Compte créé ! Vérifie ton email pour confirmer ton inscription.');
        }
      }
    } catch (error: any) {
      console.error('💥 === ERREUR DANS handleAuth ===');
      console.error('💥 Erreur complète:', error);
      console.error('💥 Type:', typeof error);
      console.error('💥 Message:', error.message);
      console.error('💥 Code:', error.code);
      console.error('💥 Stack:', error.stack);
      
      let errorMessage = 'Une erreur est survenue';
      
      // Gestion des erreurs spécifiques Supabase
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = '❌ Email ou mot de passe incorrect. Vérifie tes informations.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = '📧 Email non confirmé. Vérifie ta boîte mail et clique sur le lien de confirmation.';
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = '⏰ Trop de tentatives. Attends quelques minutes avant de réessayer.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = '🌐 Problème de connexion. Vérifie ta connexion internet.';
      } else if (error.code) {
        errorMessage = `🐛 Erreur Supabase (${error.code}): ${error.message}`;
      } else {
        errorMessage = `🚨 Erreur inconnue: ${error.message}`;
      }
      
      setMessage(`Erreur: ${errorMessage}`);
      console.log('🚨 Message d\'erreur affiché à l\'utilisateur:', errorMessage);
    } finally {
      console.log('🏁 Fin handleAuth - Arrêt du loading');
      setLoading(false);
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setEmail('');
    setPassword('');
    setPseudo('');
    setTiktokUsername('');
    setVideoUrl('');
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col justify-center items-center z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative mx-4">
        <button 
          onClick={handleClose}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <IconMail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton-email@exemple.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <IconLock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'login' ? 'Ton mot de passe' : 'Choisis un mot de passe sécurisé'}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>
            {mode !== 'login' && (
              <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
            )}
          </div>

          {mode !== 'login' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pseudo
                </label>
                <div className="relative">
                  <IconUser className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    placeholder="Ton pseudo public"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {mode === 'clipper-signup' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom d'utilisateur TikTok
                    </label>
                    <div className="relative">
                      <IconBrandTiktok className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        value={tiktokUsername}
                        onChange={(e) => setTiktokUsername(e.target.value)}
                        placeholder="@ton-compte-tiktok"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lien d'une vidéo TikTok
                    </label>
                    <div className="relative">
                      <IconVideo className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input 
                        type="url" 
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://tiktok.com/@user/video/..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {message && (
            <div className={`p-3 rounded-lg ${message.includes('Erreur') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
            `}
          >
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>

          <div className="text-center text-sm text-gray-600">
            {mode === 'login' ? (
              <>
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={() => onModeChange('signup')}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Créer un compte
                </button>
              </>
            ) : (
              <>
                Déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => onModeChange('login')}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Se connecter
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 