"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { IconX, IconMail, IconLock } from '@tabler/icons-react';

interface AuthModalSimpleProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModalSimple({ isOpen, onClose }: AuthModalSimpleProps) {
  const [email, setEmail] = useState('test@cliptokk.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Connexion en cours...');

    try {
      console.log('=== DÉBUT LOGIN SIMPLE ===');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        console.error('Erreur login:', error);
        setMessage(`Erreur: ${error.message}`);
        return;
      }

      if (data.user) {
        console.log('Utilisateur connecté:', data.user.id);
        setMessage('Connexion réussie! Redirection...');
        
        // Attendre un peu puis rediriger
        setTimeout(() => {
          onClose();
          router.push('/dashboard/clipper');
        }, 1000);
      }
      
    } catch (error: any) {
      console.error('Erreur:', error);
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative mx-4">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <IconX className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Connexion Simple
          </h3>
          <p className="text-gray-600">
            Test d'authentification minimal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-center ${
              message.includes('Erreur') 
                ? 'bg-red-50 text-red-700' 
                : message.includes('réussie') 
                ? 'bg-green-50 text-green-700'
                : 'bg-blue-50 text-blue-700'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          Version simplifiée pour debug
        </div>
      </div>
    </div>
  );
} 