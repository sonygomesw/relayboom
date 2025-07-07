'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestAuthSimple() {
  const [result, setResult] = useState<string>('');
  const [email, setEmail] = useState('test@cliptokk.com');
  const [password, setPassword] = useState('123456');

  const testSupabase = async () => {
    setResult('🔄 Test en cours...');
    
    try {
      // Test 1: Connexion de base
      setResult(prev => prev + '\n📡 Test connexion Supabase...');
      const { data: sessionCheck } = await supabase.auth.getSession();
      setResult(prev => prev + '\n✅ Supabase connecté');
      
      // Test 2: Tentative de connexion
      setResult(prev => prev + '\n🔐 Tentative de connexion...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });
      
      if (error) {
        setResult(prev => prev + `\n❌ Erreur: ${error.message}`);
        return;
      }
      
      setResult(prev => prev + '\n✅ Connexion réussie!');
      setResult(prev => prev + `\n👤 User ID: ${data.user?.id}`);
      setResult(prev => prev + `\n📧 Email: ${data.user?.email}`);
      
      // Test 3: Récupération du profil
      setResult(prev => prev + '\n📋 Récupération du profil...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) {
        setResult(prev => prev + `\n❌ Erreur profil: ${profileError.message}`);
        return;
      }
      
      setResult(prev => prev + '\n✅ Profil récupéré!');
      setResult(prev => prev + `\n🎯 Rôle: ${profile.role}`);
      setResult(prev => prev + `\n👑 Pseudo: ${profile.pseudo}`);
      
    } catch (error: any) {
      setResult(prev => prev + `\n💥 ERREUR CRITIQUE: ${error.message}`);
    }
  };

  const clearTest = () => {
    setResult('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">🧪 Test Authentification Simple</h1>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="flex gap-4 mb-6">
          <button 
            onClick={testSupabase}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700"
          >
            🚀 Tester la connexion
          </button>
          
          <button 
            onClick={clearTest}
            className="bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600"
          >
            🧹 Effacer
          </button>
        </div>
        
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg min-h-[200px] font-mono text-sm">
          <pre className="whitespace-pre-wrap">{result || '📄 En attente de test...'}</pre>
        </div>
        
        <div className="mt-6 text-center">
          <a 
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
} 