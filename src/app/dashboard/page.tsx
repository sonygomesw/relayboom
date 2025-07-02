"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardRedirect() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const redirectToCorrectDashboard = async () => {
      try {
        // Vérifier l'authentification
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/');
          return;
        }

        // Récupérer le profil utilisateur pour déterminer le rôle
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          router.push('/onboarding/role');
          return;
        }

        // Rediriger selon le rôle
        if (profile?.role === 'creator') {
          router.push('/dashboard/creator');
        } else if (profile?.role === 'clipper') {
          router.push('/dashboard/clipper');
        } else {
          // Pas de rôle défini, rediriger vers l'onboarding
          router.push('/onboarding/role');
        }
      } catch (error) {
        console.error('Erreur:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    redirectToCorrectDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return null;
} 