// Force new deployment - v6 - black button update
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
import { useLanguage } from '@/components/LanguageContext';
import { Language } from '@/lib/translations';

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

  const { t, language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'it', label: 'Italiano' }
  ];

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
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-40 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="ClipTokk" className="h-40" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-[#0F172A]/70 hover:text-[#0F172A]">
              {t('nav.howItWorks')}
            </Link>
            <Link href="#faq" className="text-[#0F172A]/70 hover:text-[#0F172A]">
              {t('nav.faq')}
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-2 text-[#0F172A]/70 hover:text-[#0F172A]">
                <span>{t('nav.language')}</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                      language === lang.code ? 'text-[#0F172A] font-medium' : 'text-[#0F172A]/70'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setAuthModal({isOpen: true, mode: 'login'})}
              className="px-4 py-2 rounded-full bg-[#0F172A] text-white hover:bg-[#0F172A]/90 transition-all duration-300"
            >
              {t('nav.signIn')}
            </button>
          </nav>
        </div>
      </header>

      {/* Challenge Banner - Redesigned */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-red-600 text-xl">🔥</span>
              <span className="font-semibold text-red-700">
                {t('hero.challenge.ongoing')}: <span className="font-bold">$2,340</span> {t('hero.challenge.earned')}
              </span>
            </div>
            <Link
              href="/missions"
              className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-all duration-300 text-sm whitespace-nowrap"
            >
              🚀 {t('hero.challenge.joinNow')}
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-40 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#E5F9EE] text-[#10B981] px-4 py-2 rounded-full text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-[#10B981] rounded-full"></span>
                {t('hero.badge')}
              </div>

              {/* Title */}
              <h1 className="text-6xl font-black text-[#0F172A] mb-6 leading-tight">
                {t('hero.title.part1')}{' '}
                <span className="text-[#10B981]">{t('hero.title.part2')}</span>
              </h1>

              {/* Description */}
              <p className="text-xl text-[#0F172A]/70 mb-8">
                {t('hero.description')}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/missions"
                  className="inline-flex items-center justify-center bg-[#10B981] text-white px-8 py-4 rounded-full font-bold hover:bg-[#10B981]/90 transition-all duration-300 text-lg"
                >
                  <span>{t('hero.cta.missions')}</span>
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <button
                  onClick={() => setAuthModal({isOpen: true, mode: 'clipper-signup'})}
                  className="inline-flex items-center justify-center text-[#0F172A] hover:text-[#0F172A]/70 transition-all duration-300 px-8 py-4"
                >
                  <span>{t('hero.cta.becomeClipper')}</span>
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mt-12">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  <span className="text-[#0F172A]/70">{t('hero.stats.clippers')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  <span className="text-[#0F172A]/70">{t('hero.stats.views')}</span>
                </div>
              </div>
            </div>

            {/* Right Column - iPhone Mockup */}
            <div className="relative">
              <div className="relative mx-auto w-[320px] h-[650px]">
                {/* iPhone Frame */}
                <div className="absolute inset-0 bg-black rounded-[3rem] shadow-xl">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[40%] h-7 bg-black rounded-b-3xl"></div>
                  
                  {/* Status Bar */}
                  <div className="absolute top-1 left-6 right-6 flex justify-between items-center text-white text-xs">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <span className="block w-4 h-1 bg-white rounded-sm"></span>
                      <span className="block w-4 h-1 bg-white rounded-sm"></span>
                      <span className="block w-4 h-1 bg-white rounded-sm"></span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* TikTok Video */}
                  <div className="absolute top-0 left-0 right-0 bottom-0 rounded-[2.8rem] overflow-hidden">
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src="/video/mrbeast.mp4" type="video/mp4" />
                    </video>

                    {/* TikTok UI Overlay */}
                    <div className="absolute top-12 left-4 right-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 inline-flex items-center">
                        <span className="text-white text-sm">Tes gains</span>
                        <span className="ml-2 text-[#10B981] font-bold">230€</span>
                        <span className="text-white/60 text-xs ml-2">pour 2.3M vues</span>
                      </div>
                    </div>

                    {/* TikTok Bottom UI */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-start gap-2">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <span className="text-white font-bold">M</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold">@mrbeast</div>
                          <div className="text-white/80 text-sm">Je donne 100,000$ à celui qui reste le plus longtemps dans ce cercle ! 🔥</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">{t('howItWorks.title')}</h2>
            <p className="text-xl text-[#0F172A]/70">{t('howItWorks.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-4 text-center">
                {t('howItWorks.steps.mission.title')}
              </h3>
              <p className="text-[#0F172A]/70 text-center">
                {t('howItWorks.steps.mission.description')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">✂️</span>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-4 text-center">
                {t('howItWorks.steps.create.title')}
              </h3>
              <p className="text-[#0F172A]/70 text-center">
                {t('howItWorks.steps.create.description')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">💸</span>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-4 text-center">
                {t('howItWorks.steps.paid.title')}
              </h3>
              <p className="text-[#0F172A]/70 text-center">
                {t('howItWorks.steps.paid.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Aperçu de la plateforme */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">
              {t('platform.title')}
            </h2>
            <p className="text-xl text-[#0F172A]/70 max-w-3xl mx-auto">
              {t('platform.subtitle')}
            </p>
          </div>

          {/* Galerie en grille */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Carte 1 : Mission */}
            <div className="flex flex-col">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 text-[#10B981] font-medium mb-2">
                  <span className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center">1</span>
                  <span>{t('platform.sections.mission.title')}</span>
                </div>
                <p className="text-gray-600">{t('platform.sections.mission.subtitle')}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 p-6 h-[300px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">MrBeast Gaming</h3>
                      <p className="text-sm text-gray-600">12.5M {t('platform.sections.mission.followers')}</p>
                    </div>
                  </div>
                  <span className="bg-[#10B981]/10 text-[#10B981] text-sm font-medium px-3 py-1 rounded-full">
                    {t('platform.sections.mission.rate')}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-gray-600">
                    Create a clip about our new game "Beast Battle Royale". Show the best moments!
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('platform.sections.mission.duration')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm text-gray-600">{t('platform.sections.mission.expires')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte 2 : Dashboard */}
            <div className="flex flex-col">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 text-[#10B981] font-medium mb-2">
                  <span className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center">2</span>
                  <span>{t('platform.sections.performance.title')}</span>
                </div>
                <p className="text-gray-600">{t('platform.sections.performance.subtitle')}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 p-6 h-[300px]">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('platform.sections.performance.stats.earnings')}</p>
                        <p className="font-bold text-[#10B981]">$347</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('platform.sections.performance.stats.views')}</p>
                        <p className="font-bold text-gray-900">2.3M</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">MrBeast Challenge</p>
                        <p className="text-xs text-gray-600">425K views</p>
                      </div>
                    </div>
                    <span className="text-[#10B981] font-medium">+$42</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Speed IRL</p>
                        <p className="text-xs text-gray-600">283K views</p>
                      </div>
                    </div>
                    <span className="text-[#10B981] font-medium">+$28</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte 3 : Upload */}
            <div className="flex flex-col">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 text-[#10B981] font-medium mb-2">
                  <span className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center">3</span>
                  <span>{t('platform.sections.submission.title')}</span>
                </div>
                <p className="text-gray-600">{t('platform.sections.submission.subtitle')}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 p-6 h-[300px]">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500">tiktok.com/</span>
                    <div className="flex-1 h-10 bg-gray-50 rounded-lg border border-gray-200"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-600">{t('platform.sections.submission.checks.duration')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-600">{t('platform.sections.submission.checks.hashtags')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-600">{t('platform.sections.submission.checks.mention')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte 4 : Paiement */}
            <div className="flex flex-col">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 text-[#10B981] font-medium mb-2">
                  <span className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center">4</span>
                  <span>{t('platform.sections.withdrawal.title')}</span>
                </div>
                <p className="text-gray-600">{t('platform.sections.withdrawal.subtitle')}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 p-6 h-[300px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-800">{t('platform.sections.withdrawal.balance')}</h3>
                  <span className="text-2xl font-bold text-[#10B981]">$347.20</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{t('platform.sections.withdrawal.stripe.title')}</p>
                        <p className="text-sm text-gray-600">{t('platform.sections.withdrawal.stripe.subtitle')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{t('platform.sections.withdrawal.transfer.time')}</p>
                        <p className="text-sm text-gray-600">{t('platform.sections.withdrawal.transfer.subtitle')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <button
              onClick={() => setAuthModal({isOpen: true, mode: 'clipper-signup'})}
              className="inline-flex items-center justify-center bg-[#10B981] text-white px-8 py-4 rounded-full font-bold hover:bg-[#10B981]/90 transition-all duration-300 text-lg"
            >
              {t('platform.cta')}
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Potentiel de gains */}
      <section className="py-24 bg-white">
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
                {[
                  {
                    amount: "10€",
                    views: "100K",
                    description: "Pour 100K vues"
                  },
                  {
                    amount: "50€",
                    views: "500K",
                    description: "Pour 500K vues"
                  },
                  {
                    amount: "100€",
                    views: "1M",
                    description: "Pour 1M vues"
                  }
                ].map((tier, index) => (
                  <div
                    key={index}
                    className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center h-48"
                  >
                    <div className="text-4xl font-bold text-[#10B981] mb-4">
                      {tier.amount}
                    </div>
                    <div className="text-[#0F172A]/80 text-lg">
                      {tier.description}
                    </div>
                  </div>
                ))}
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
          <h2 className="text-4xl font-bold text-center text-[#0F172A] mb-4">Ils cartonnent déjà</h2>
          <p className="text-xl text-center text-[#0F172A]/70 mb-16">Découvre les success stories de nos clippeurs</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=60" 
                  alt="Lucas M."
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-[#0F172A]">Lucas M.</h3>
                  <p className="text-[#0F172A]/60">Étudiant</p>
                </div>
              </div>
              <p className="text-[#0F172A]/80 mb-6">
                "J'ai atteint 847€ avec seulement 9 clips ce mois-ci. C'est devenu une source de revenus stable !"
              </p>
              <div className="text-[#10B981] font-semibold">
                847€ gagnés en Mars 2024
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60" 
                  alt="Sarah K."
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-[#0F172A]">Sarah K.</h3>
                  <p className="text-[#0F172A]/60">Freelance</p>
                </div>
              </div>
              <p className="text-[#0F172A]/80 mb-6">
                "1.2M de vues en 3 semaines ! Je ne m'attendais pas à un tel succès sur mes premiers clips."
              </p>
              <div className="text-[#10B981] font-semibold">
                1.2M vues en 3 semaines
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60" 
                  alt="Thomas R."
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-[#0F172A]">Thomas R.</h3>
                  <p className="text-[#0F172A]/60">Créateur</p>
                </div>
              </div>
              <p className="text-[#0F172A]/80 mb-6">
                "Je gagne maintenant plus avec ClipTokk qu'avec mon ancien job ! Les missions sont variées et bien payées."
              </p>
              <div className="text-[#10B981] font-semibold">
                2 340€ depuis janvier
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Les clips qui cartonnent - AFTER Success Stories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="bg-[#EF4444] px-4 py-2 rounded-full text-white text-sm font-medium">
              🔥 Tendance cette semaine
            </div>
          </div>

          <h2 className="text-4xl font-bold text-[#0F172A] mb-16 text-center">
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
                <div className="aspect-[9/16] rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100 relative">
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
                      <div>
                        <div className="font-bold text-white">{clip.creator}</div>
                        <div className="text-sm text-white/90">{clip.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white">👁 {clip.views}</span>
                      <span className="text-white">❤️ {clip.likes}</span>
                      <span className="text-[#10B981] font-bold bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">{clip.earnings}</span>
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
                answer: "Tes gains sont calculés en fonction du nombre de vues que génèrent tes clips. Plus tu as de vues, plus tu gagnes ! Le taux est de 100€ pour 1 million de vues."
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

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Logo et Description */}
            <div className="col-span-1 md:col-span-2">
              <img src="/logo.png" alt="ClipTokk" className="h-20 mb-6" />
              <p className="text-white/70 mb-6">
                ClipTokk est la première plateforme qui te permet de gagner de l'argent en postant des TikToks viraux.
                Rejoins une communauté de créateurs passionnés et monétise ton contenu.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-white/70 hover:text-white">
                  <IconBrandTiktok className="w-6 h-6" />
                </a>
                <a href="#" className="text-white/70 hover:text-white">
                  <IconMail className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="font-bold text-lg mb-4">Navigation</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/missions" className="text-white/70 hover:text-white">
                    Voir les missions
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-white/70 hover:text-white">
                    Comment ça marche
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-white/70 hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h3 className="font-bold text-lg mb-4">Légal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-white/70 hover:text-white">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white/70 hover:text-white">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-white/70 hover:text-white">
                    Politique des cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/70 text-sm">
              © 2024 ClipTokk. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <IconShield className="w-5 h-5 text-[#10B981]" />
              <span className="text-white/70 text-sm">Paiements sécurisés par Stripe</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({...authModal, isOpen: false})}
        onModeChange={(mode) => setAuthModal({...authModal, mode})}
      />
    </main>
  );
}
