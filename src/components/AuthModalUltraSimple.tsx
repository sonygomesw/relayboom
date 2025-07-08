"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthModalUltraSimpleProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModalUltraSimple({ isOpen, onClose }: AuthModalUltraSimpleProps) {
  const [email, setEmail] = useState('geoviomgmt@gmail.com');
  const [password, setPassword] = useState('Le210898');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const router = useRouter();

  // CORRECTION CRITIQUE : Réinitialiser l'état quand le modal s'ouvre/ferme
  useEffect(() => {
    if (isOpen) {
      // Reset de tous les états quand le modal s'ouvre
      setLoading(false);
      setStatus('');
      console.log('🔄 Modal ouvert - États réinitialisés');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    // Réinitialiser tous les états avant de fermer
    setLoading(false);
    setStatus('');
    console.log('🔄 Modal fermé - États réinitialisés');
    onClose();
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setLoading(true);
    setStatus('Connexion...');
    console.log('🚀 === DÉBUT CONNEXION ULTRA SIMPLE ===');

    try {
      // Connexion Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        console.error('❌ Erreur:', error.message);
        setStatus(`Erreur: ${error.message}`);
        setLoading(false);
        return;
      }

      if (data?.session) {
        console.log('✅ CONNEXION RÉUSSIE !');
        setStatus('✅ Connexion réussie ! Redirection...');
        
        // Attendre un petit délai pour que l'utilisateur voie le message
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Fermer le modal
        handleClose();
        
        // Redirection DIRECTE vers le dashboard
        console.log('🔄 Redirection directe vers dashboard...');
        router.push('/dashboard/clipper');
        
        console.log('✅ === CONNEXION TERMINÉE ===');
      } else {
        console.log('⚠️ Pas de session créée');
        setStatus('Erreur: Session non créée');
        setLoading(false);
      }

    } catch (err) {
      console.error('💥 Erreur catch:', err);
      setStatus(`Erreur système: ${err}`);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6 text-center">🔐 Connexion Ultra Simple</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
            />
          </div>

          {status && (
            <div className={`p-3 rounded-lg text-sm ${
              status.includes('Erreur') 
                ? 'bg-red-50 text-red-700' 
                : status.includes('✅') 
                ? 'bg-green-50 text-green-700'
                : 'bg-blue-50 text-blue-700'
            }`}>
              {status}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Connexion...' : '🚀 Se connecter'}
            </button>
            
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Fermer
            </button>
          </div>
        </form>

        <div className="mt-6 text-xs text-gray-500 text-center">
          Version ultra-simple avec redirection directe
        </div>
      </div>
    </div>
  );
} 