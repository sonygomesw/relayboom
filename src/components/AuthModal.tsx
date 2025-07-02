"use client";

import { useState, useEffect } from 'react';
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
  const [awaitingRedirect, setAwaitingRedirect] = useState(false);
  
  const router = useRouter();
  const { user, profile, isLoading: authLoading } = useAuth();

  // 🔄 Gérer la redirection automatique après connexion
  useEffect(() => {
    if (awaitingRedirect && user && !authLoading) {
      console.log('🎯 Redirection automatique après connexion pour:', user.email);
      
      if (profile?.role === 'creator') {
        router.push('/dashboard/creator');
      } else if (profile?.role === 'clipper') {
        router.push('/dashboard/clipper');
      } else if (profile?.role === 'admin') {
        router.push('/admin');
      } else {
        // Pas de rôle défini, rediriger vers l'onboarding
        router.push('/onboarding/role');
      }
      
      // Fermer le modal et reset l'état
      setAwaitingRedirect(false);
      onClose();
    }
  }, [awaitingRedirect, user, profile, authLoading, router, onClose]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'login') {
        // Login with email and password
        console.log('🔐 Tentative de connexion pour:', email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          console.error('❌ Erreur de connexion:', error);
          throw error;
        }
        
        console.log('✅ Connexion réussie:', data.user?.email);
        
        if (data.user) {
          setMessage('Connexion réussie ! Redirection...');
          setAwaitingRedirect(true);
          // La redirection sera gérée par l'useEffect une fois que l'AuthContext sera mis à jour
        }
      } else {
        // Sign up with email and password
        console.log('📝 Tentative d\'inscription pour:', email);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://cliptokk.com'}/auth/callback`
          }
        });
        
        if (error) {
          console.error('❌ Erreur d\'inscription:', error);
          throw error;
        }
        
        console.log('✅ Inscription réussie:', data.user?.email);
        
        if (data.user) {
          // Store profile data for creation after email confirmation
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
      console.error('💥 Erreur complète:', error);
      
      // Messages d'erreur plus explicites
      let errorMessage = error.message || 'Une erreur est survenue';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou mot de passe incorrect. Vérifie tes informations.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Email non confirmé. Vérifie ta boîte mail.';
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = 'Trop de tentatives. Attends quelques minutes.';
      }
      
      setMessage(errorMessage);
      setAwaitingRedirect(false);
    } finally {
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
    setAwaitingRedirect(false);
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
                    placeholder="TonPseudo"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

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
                    placeholder="@toncompte"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {mode === 'clipper-signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lien d'un de tes clips (optionnel)
                  </label>
                  <div className="relative">
                    <IconVideo className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                      type="url" 
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://tiktok.com/@toncompte/video/..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 
             mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes('erreur') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          {mode === 'login' ? (
            <>Pas encore de compte ? <button onClick={() => onModeChange('signup')} className="text-green-600 hover:underline">S'inscrire</button></>
          ) : (
            <>Déjà un compte ? <button onClick={() => onModeChange('login')} className="text-green-600 hover:underline">Se connecter</button></>
          )}
        </div>
      </div>
    </div>
  );
} 