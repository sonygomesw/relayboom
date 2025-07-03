"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  IconCheck,
  IconPlayerPlay,
  IconCoin,
  IconTarget,
  IconRefresh,
  IconTrendingUp,
  IconEye,
  IconChevronDown,
  IconArrowRight,
  IconVideo,
  IconClock,
  IconStar,
  IconUsers,
  IconMail,
  IconX,
  IconBrandTiktok,
  IconShield,
  IconBolt,
  IconGlobe
} from '@tabler/icons-react';
import AuthModal from '@/components/AuthModal';
import Link from 'next/link';
import { motion } from 'framer-motion';

type AuthModalMode = 'login' | 'signup' | 'clipper-signup';

// Composant Compte à rebours
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 47,
    minutes: 23,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <span className="text-white text-lg">Clôture dans :</span>
      <div className="flex gap-2">
        {[
          { value: timeLeft.hours, label: 'h' },
          { value: timeLeft.minutes, label: 'm' },
          { value: timeLeft.seconds, label: 's' }
        ].map((unit, index) => (
          <div key={index} className="bg-white/20 rounded-lg px-3 py-2 text-center min-w-[50px]">
            <div className="text-white font-bold text-xl">{unit.value.toString().padStart(2, '0')}</div>
            <div className="text-white/60 text-xs">{unit.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant FAQ avec accordéon
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 overflow-hidden">
      <button
        className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-700/20 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl font-semibold text-white pr-8">{question}</span>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="px-8 pb-6">
          <p className="text-gray-300 leading-relaxed text-lg">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: AuthModalMode;
  }>({
    isOpen: false,
    mode: 'clipper-signup'
  });
  const [isSticky, setIsSticky] = useState(false);
  const router = useRouter();

  // État pour gérer la lecture des vidéos
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  // Détecter si l'utilisateur vient de valider son email
  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        // Vérifier s'il y a des hash params dans l'URL (tokens Supabase)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          console.log('🔄 Tokens détectés, gestion de l\'authentification...');
          
          // Attendre un peu que Supabase traite automatiquement les tokens
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Vérifier la session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (session?.user && !error) {
            console.log('✅ Utilisateur authentifié, redirection vers onboarding');
            // Nettoyer l'URL
            window.history.replaceState({}, document.title, window.location.pathname);
            // Rediriger vers l'onboarding
            router.push('/onboarding/role');
          }
        }
      } catch (error) {
        console.error('❌ Erreur lors de la gestion de l\'auth redirect:', error);
      }
    };

    handleAuthRedirect();
  }, [router]);

  // Gestion du sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="relative">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#0F172A]/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="ClipTokk" className="h-8" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-[#0F172A]/70 hover:text-[#0F172A]">
              Comment ça marche
            </Link>
            <Link href="/missions" className="text-[#0F172A]/70 hover:text-[#0F172A]">
              Voir les missions
            </Link>
            <button
              onClick={() => setAuthModal({isOpen: true, mode: 'clipper-signup'})}
              className="bg-[#10B981] text-white px-6 py-2 rounded-full font-bold hover:bg-[#10B981]/90 transition-all duration-300"
            >
              Devenir clippeur
            </button>
          </nav>
        </div>
      </header>

      {/* Sticky CTA */}
      {isSticky && (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 py-4 transform translate-y-0 transition-transform duration-300">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
            <p className="text-[#0F172A] font-semibold">Prêt à commencer ? 500+ clippeurs nous ont déjà rejoints</p>
            <button
              onClick={() => setAuthModal({isOpen: true, mode: 'clipper-signup'})}
              className="bg-[#10B981] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#10B981]/90 transition-all duration-300"
            >
              Devenir clippeur
            </button>
          </div>
        </div>
      )}

      {/* Challenge Banner - Redesigned */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-red-600 text-xl">🔥</span>
              <span className="font-semibold text-red-700">
                Challenge en cours : <span className="font-bold">2 340€</span> déjà gagnés !
              </span>
            </div>
            <Link
              href="/missions"
              className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-all duration-300 text-sm whitespace-nowrap"
            >
              🚀 Participer maintenant
            </Link>
          </div>
        </div>
      </div>

      {/* 1. Hero Section */}
      <section className="pt-32 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 bg-[#10B981]/10 text-[#10B981] px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-[#10B981]/20">
            <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></span>
            +500 clippeurs déjà inscrits
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-[#F8FAFC] p-6 rounded-2xl">
              <div className="text-3xl font-bold text-[#10B981] mb-2">2.3M+</div>
              <div className="text-[#0F172A]/70">Vues générées</div>
            </div>
            <div className="bg-[#F8FAFC] p-6 rounded-2xl">
              <div className="text-3xl font-bold text-[#10B981] mb-2">500+</div>
              <div className="text-[#0F172A]/70">Clippeurs actifs</div>
            </div>
            <div className="bg-[#F8FAFC] p-6 rounded-2xl">
              <div className="text-3xl font-bold text-[#10B981] mb-2">10€</div>
              <div className="text-[#0F172A]/70">Retrait minimum</div>
            </div>
          </div>

          {/* Hero Content */}
          <h1 className="text-6xl font-black text-[#0F172A] mb-6 leading-tight max-w-4xl mx-auto">
            Gagne de l'argent en postant des TikToks viraux
          </h1>
          <p className="text-xl text-[#0F172A]/70 mb-12 max-w-2xl mx-auto">
            Tu postes des clips ? On te paie pour chaque vue. Rejoins des missions, publie sur TikTok, et sois payé à la performance.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/missions"
              className="bg-[#10B981] text-white px-8 py-4 rounded-full font-bold hover:bg-[#10B981]/90 transition-all duration-300 text-lg"
            >
              Voir les missions disponibles
            </Link>
            <button
              onClick={() => setAuthModal({isOpen: true, mode: 'clipper-signup'})}
              className="text-[#0F172A] hover:text-[#0F172A]/70 transition-all duration-300"
            >
              Devenir clippeur →
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-col items-center justify-center gap-6 pt-8 border-t border-[#0F172A]/5">
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center gap-3 text-[#0F172A]/60 text-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Pas d'abonnement</span>
              </div>
              <div className="flex items-center gap-3 text-[#0F172A]/60 text-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Paiement à la performance</span>
              </div>
              <div className="flex items-center gap-3 text-[#0F172A]/60 text-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Retrait dès 10€</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#0F172A]/60 text-sm">
              <span>Paiements sécurisés via</span>
              <svg className="h-6" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M59.1 25h-58C.5 25 0 24.5 0 24V1C0 .5.5 0 1.1 0h58c.6 0 1.1.5 1.1 1v23c0 .5-.5 1-1.1 1z" fill="#635BFF"/>
                <path d="M8.3 7.5c0-.3.3-.4.4-.2l1.1 1.4c.3.3.6.4 1 .4h1.3c.5 0 .8.3.8.7v.1c0 .4-.3.7-.8.7h-1.2c-.4 0-.7.3-.7.7v.1c0 .4.3.7.7.7h1.2c.5 0 .8.3.8.7v.1c0 .4-.3.7-.8.7h-1.3c-.4 0-.8.2-1 .4l-1.1 1.4c-.1.2-.4.1-.4-.2V7.5z" fill="#fff"/>
                <path d="M13.9 7.5c0-.3.3-.4.4-.2l1.1 1.4c.3.3.6.4 1 .4h1.3c.5 0 .8.3.8.7v.1c0 .4-.3.7-.8.7h-1.2c-.4 0-.7.3-.7.7v.1c0 .4.3.7.7.7h1.2c.5 0 .8.3.8.7v.1c0 .4-.3.7-.8.7h-1.3c-.4 0-.8.2-1 .4l-1.1 1.4c-.1.2-.4.1-.4-.2V7.5z" fill="#fff"/>
                <path d="M19.5 7.5c0-.3.3-.4.4-.2l1.1 1.4c.3.3.6.4 1 .4h1.3c.5 0 .8.3.8.7v.1c0 .4-.3.7-.8.7h-1.2c-.4 0-.7.3-.7.7v.1c0 .4.3.7.7.7h1.2c.5 0 .8.3.8.7v.1c0 .4-.3.7-.8.7h-1.3c-.4 0-.8.2-1 .4l-1.1 1.4c-.1.2-.4.1-.4-.2V7.5z" fill="#fff"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How it Works */}
      <section className="py-24 bg-gradient-to-b from-white to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Comment ça marche ?</h2>
            <p className="text-xl text-[#0F172A]/70">3 étapes simples pour commencer à gagner</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-4 text-center">1. Choisis une mission</h3>
              <p className="text-[#0F172A]/70 text-center">
                Parcours les missions disponibles et sélectionne celles qui t'intéressent. Chaque mission précise le thème et la rémunération.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">✂️</span>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-4 text-center">2. Crée ton clip</h3>
              <p className="text-[#0F172A]/70 text-center">
                Réalise et publie ton TikTok en suivant les consignes de la mission. Notre système détecte automatiquement tes vues.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">💸</span>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-4 text-center">3. Reçois tes gains</h3>
              <p className="text-[#0F172A]/70 text-center">
                Suis tes revenus en temps réel et retire ton argent dès 10€. Paiements rapides et sécurisés via Stripe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Earnings Calculator */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Combien peux-tu gagner ?</h2>
                <p className="text-xl text-[#0F172A]/70">
                  La rémunération dépend du nombre de vues. Voici un exemple :
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#F8FAFC] p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-[#10B981] mb-2">50€</div>
                  <div className="text-sm text-[#0F172A]/70">Pour 100K vues</div>
                </div>
                <div className="bg-[#F8FAFC] p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-[#10B981] mb-2">250€</div>
                  <div className="text-sm text-[#0F172A]/70">Pour 500K vues</div>
                </div>
                <div className="bg-[#F8FAFC] p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-[#10B981] mb-2">500€</div>
                  <div className="text-sm text-[#0F172A]/70">Pour 1M vues</div>
                </div>
              </div>

              <div className="text-center mt-8 text-[#0F172A]/70">
                <p>Plus tu génères de vues, plus tu gagnes. Commence avec un objectif réaliste et progresse !</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Success Stories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Ils cartonnent déjà</h2>
            <p className="text-xl text-[#0F172A]/70">Découvre les success stories de nos clippeurs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Story 1 */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[#10B981] rounded-full flex items-center justify-center text-white font-bold">
                  L
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A]">Lucas M.</h3>
                  <p className="text-[#0F172A]/70 text-sm">Étudiant</p>
                </div>
              </div>
              <div className="mb-4">
                <img src="/images/dashboard-example.png" alt="Dashboard Lucas" className="rounded-lg w-full" />
              </div>
              <p className="text-[#0F172A]/70 mb-4">
                "J'ai atteint 847€ avec seulement 9 clips ce mois-ci. C'est devenu une source de revenus stable !"
              </p>
              <div className="text-sm text-[#10B981] font-semibold">
                847€ gagnés en Mars 2024
              </div>
            </div>

            {/* Story 2 */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[#10B981] rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A]">Sarah K.</h3>
                  <p className="text-[#0F172A]/70 text-sm">Freelance</p>
                </div>
              </div>
              <div className="mb-4">
                <img src="/images/tiktok-stats.png" alt="Stats TikTok Sarah" className="rounded-lg w-full" />
              </div>
              <p className="text-[#0F172A]/70 mb-4">
                "1.2M de vues en 3 semaines ! Je ne m'attendais pas à un tel succès sur mes premiers clips."
              </p>
              <div className="text-sm text-[#10B981] font-semibold">
                1.2M vues en 3 semaines
              </div>
            </div>

            {/* Story 3 */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[#10B981] rounded-full flex items-center justify-center text-white font-bold">
                  T
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A]">Thomas R.</h3>
                  <p className="text-[#0F172A]/70 text-sm">Créateur</p>
                </div>
              </div>
              <div className="mb-4">
                <img src="/images/earnings-graph.png" alt="Graphique gains Thomas" className="rounded-lg w-full" />
              </div>
              <p className="text-[#0F172A]/70 mb-4">
                "Je gagne maintenant plus avec ClipTokk qu'avec mon ancien job ! Les missions sont variées et bien payées."
              </p>
              <div className="text-sm text-[#10B981] font-semibold">
                2 340€ depuis janvier
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Les clips qui cartonnent - AFTER Success Stories */}
      <section className="py-24 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="bg-[#EF4444] px-4 py-2 rounded-full text-white text-sm font-medium">
              🔥 Tendance cette semaine
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-16 text-center">
            Les clips qui cartonnent
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                creator: "MrBeast",
                video: "/video/mrbeast.mp4",
                views: "2.3M",
                likes: "125K",
                earnings: "230€",
                category: "Challenge"
              },
              {
                creator: "Speed",
                video: "/video/speed.mp4",
                views: "1.8M",
                likes: "98K",
                earnings: "180€",
                category: "Gaming"
              },
              {
                creator: "Kai Cenat",
                video: "/video/kaicenat.mp4",
                views: "1.5M",
                likes: "82K",
                earnings: "150€",
                category: "IRL"
              }
            ].map((clip, index) => (
              <div key={index} className="relative">
                <div className="aspect-[9/16] rounded-2xl overflow-hidden bg-[#1E293B] relative">
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src={clip.video} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white font-bold">{clip.creator[0]}</span>
                      </div>
                      <div className="text-white">
                        <div className="font-bold">{clip.creator}</div>
                        <div className="text-sm text-white/70">{clip.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-white/90 text-sm">
                      <span>👁 {clip.views}</span>
                      <span>❤️ {clip.likes}</span>
                      <span className="text-[#10B981] font-bold">{clip.earnings}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Questions fréquentes</h2>
            <p className="text-xl text-[#0F172A]/70">Tout ce que tu dois savoir pour commencer</p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "🤔 Comment sont calculés les gains ?",
                answer: "Tes gains sont calculés en fonction du nombre de vues que génèrent tes clips. Plus tu as de vues, plus tu gagnes ! Le taux varie selon les missions, mais commence généralement à 50€ pour 100K vues."
              },
              {
                question: "💳 Quand suis-je payé ?",
                answer: "Tu peux retirer ton argent dès que ton solde atteint 10€. Les paiements sont traités par Stripe et arrivent sur ton compte en 2-3 jours ouvrés."
              },
              {
                question: "🎯 Combien de missions puis-je accepter ?",
                answer: "Tu peux accepter autant de missions que tu veux ! Il n'y a pas de limite. Choisis celles qui correspondent le mieux à ton style et ton audience."
              },
              {
                question: "📱 Ai-je besoin d'un gros compte TikTok ?",
                answer: "Non ! Tu peux commencer même avec un nouveau compte. Ce qui compte, c'est la qualité de tes clips et leur potentiel viral."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <button className="w-full flex justify-between items-center text-left">
                  <span className="font-semibold text-[#0F172A]">{item.question}</span>
                  <svg className="w-5 h-5 text-[#0F172A]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="mt-4 text-[#0F172A]/70">
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="py-24 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Tu veux commencer à gagner dès ce soir ?</h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Rejoins les 500+ clippeurs qui gagnent déjà de l'argent avec leurs TikToks.
            Plus tu attends, plus tu passes à côté d'opportunités !
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={() => setAuthModal({isOpen: true, mode: 'clipper-signup'})}
              className="bg-[#10B981] text-white px-8 py-4 rounded-full font-bold hover:bg-[#10B981]/90 transition-all duration-300 text-lg"
            >
              Je deviens clippeur maintenant
            </button>
            <p className="text-white/60 text-sm">
              Inscription gratuite • Pas d'abonnement • Paiement dès 10€
            </p>
          </div>
        </div>
      </section>

      {/* CTA Sticky Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#10B981] p-4 shadow-2xl border-t border-[#10B981]/20 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-white font-bold text-sm">🎁 Bonus 5€ de bienvenue</div>
            <div className="text-white/80 text-xs">Pour tes 3 premiers clips</div>
          </div>
          <button
            onClick={() => setAuthModal({isOpen: true, mode: 'clipper-signup'})}
            className="bg-white text-[#10B981] px-6 py-3 rounded-full font-bold hover:bg-white/90 transition-all duration-300 shadow-lg text-sm whitespace-nowrap"
          >
            Commencer 🚀
          </button>
        </div>
      </div>

      <AuthModal 
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({...authModal, isOpen: false})}
        onModeChange={(mode) => setAuthModal({...authModal, mode})}
      />
    </main>
  );
}
