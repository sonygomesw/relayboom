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
    mode: 'login' | 'signup' | 'clipper-signup';
  }>({
    isOpen: false,
    mode: 'signup'
  });
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

  // Questions FAQ
  const faqData = [
    {
      question: "J'ai pas de compte TikTok, je peux quand même gagner ?",
      answer: "Absolument ! Tu peux poster sur YouTube Shorts, Instagram Reels, Facebook... Toutes les plateformes comptent. Pas besoin d'avoir TikTok spécifiquement."
    },
    {
      question: "Comment ça marche le bonus de bienvenue de 2€ ?",
      answer: "Dès ton premier clip validé et publié, tu reçois automatiquement 2€ en bonus, peu importe le nombre de vues. C'est notre façon de t'accueillir dans la communauté !"
    },
    {
      question: "Le programme de parrainage, ça fonctionne comment ?",
      answer: "Invite un ami avec ton lien unique. Pendant son premier mois, tu gagnes 10% de tous ses revenus en bonus. Plus il poste, plus tu gagnes !"
    },
    {
      question: "Combien je peux vraiment gagner par semaine ?",
      answer: "Nos clippeurs actifs gagnent entre 30€ et 200€/semaine. Avec 5-10 clips qui cumulent 100K vues chacun, tu peux facilement atteindre 50-100€. Les meilleurs dépassent 500€/mois."
    },
    {
      question: "Je peux poster plusieurs vidéos de la même mission ?",
      answer: "Oui ! Tu peux créer plusieurs versions d'une même mission. Chaque clip compte séparément pour les vues et les gains. Plus tu postes, plus tu gagnes."
    },
    {
      question: "Les paiements sont vraiment immédiats ?",
      answer: "Oui, via PayPal, Venmo, Cash App ou crypto. Dès que tes vues sont validées (24-48h), tu reçois ton paiement automatiquement. Aucun seuil minimum."
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <div className="relative z-10">
        {/* Header Apple-style */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-28">
              <div className="flex items-center">
                <img src="/logo.png" alt="ClipTokk" className="h-24 object-contain mix-blend-multiply" />
              </div>
              
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#how-it-works" className="text-[#0F172A]/70 hover:text-[#0F172A] transition-colors text-[15px] font-medium">Comment ça marche</a>
                <Link href="/missions" className="text-[#0F172A]/70 hover:text-[#0F172A] transition-colors text-[15px] font-medium">Missions</Link>
                <a href="#faq" className="text-[#0F172A]/70 hover:text-[#0F172A] transition-colors text-[15px] font-medium">FAQ</a>
              </nav>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setAuthModal({isOpen: true, mode: 'login'})}
                  className="text-[#0F172A]/70 hover:text-[#0F172A] transition-colors text-[15px] font-medium"
                >
                  Connexion
                </button>
                <button 
                  onClick={() => setAuthModal({isOpen: true, mode: 'signup'})}
                  className="bg-[#10B981] text-white px-6 py-2.5 rounded-full hover:bg-[#10B981]/90 transition-colors text-[15px] font-medium"
                >
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section - Fond blanc */}
        <section className="min-h-screen bg-white flex items-center relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32">
            <div className="text-center">
              {/* Stats avec pastille adoucie */}
              <div className="flex items-center gap-8 text-sm text-[#0F172A]/60 justify-center mb-8">
                <div className="flex items-center gap-2 bg-[#E5F9EE] px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  <span>500+ clippeurs actifs</span>
                </div>
                <div className="flex items-center gap-2 bg-[#E5F9EE] px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  <span>2,3M vues générées</span>
                </div>
              </div>

              {/* Badge premium */}
              <div className="inline-flex items-center gap-2 bg-[#10B981]/10 text-[#10B981] px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-[#10B981]/20">
                <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></span>
                500+ clippeurs actifs cette semaine
              </div>
              
              {/* Titre principal */}
              <h1 className="text-6xl md:text-7xl font-black text-[#0F172A] mb-8 leading-[0.9] tracking-tight">
                Gagne de l'argent en postant des{' '}
                <span className="bg-gradient-to-r from-[#10B981] to-[#10B981]/80 bg-clip-text text-transparent">
                  TikToks viraux
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-xl text-[#0F172A]/70 mb-12 max-w-2xl leading-relaxed">
                Tu postes des clips ? On te paie pour chaque vue. Rejoins des missions, publie sur ton TikTok, gagne de l'argent à la performance.
              </p>
              
              {/* Boutons CTA */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link 
                  href="/missions"
                  className="inline-flex items-center gap-2 bg-[#10B981] text-white px-8 py-4 rounded-full font-bold hover:bg-[#10B981]/90 transition-all duration-300 hover:shadow-lg text-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Voir les missions disponibles
                </Link>
                <button 
                  onClick={() => setAuthModal({isOpen: true, mode: 'clipper-signup'})}
                  className="inline-flex items-center gap-2 border-2 border-[#0F172A]/20 text-[#0F172A] px-8 py-4 rounded-full font-bold hover:bg-[#0F172A]/5 transition-all duration-300 text-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Devenir clippeur
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Clips qui cartonnent - Blanc */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-[#0F172A] mb-4">
                📹 Les clips qui cartonnent cette semaine
              </h2>
              <p className="text-xl text-[#0F172A]/70 font-light">Inspiration réelle de notre communauté</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start justify-items-center">
              {[
                { 
                  creator: "MrBeast", 
                  category: "Challenge", 
                  views: "2.1M", 
                  earnings: "€1,847", 
                  video: "/video/mrbeast.mp4",
                  title: "Je donne 100,000$ à celui qui...",
                  avatar: "M"
                },
                { 
                  creator: "Speed", 
                  category: "Gaming", 
                  views: "1.5M", 
                  earnings: "€1,534", 
                  video: "/video/speed.mp4",
                  title: "SPEED RAGE MOMENT ÉPIQUE",
                  avatar: "S"
                },
                { 
                  creator: "Kai Cenat", 
                  category: "Réaction", 
                  views: "2.1M", 
                  earnings: "€1,847", 
                  video: "/video/kaicenat.mp4",
                  title: "Kai Cenat réagit en live",
                  avatar: "K"
                }
              ].map((clip, index) => (
                <div key={index} className="group">
                  {/* Mockup TikTok mobile */}
                  <div className="relative mx-auto w-64 h-[500px] flex-shrink-0">
                    {/* Cadre smartphone */}
                    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-1.5 shadow-2xl w-64 h-[500px]">
                      {/* Écran */}
                      <div className="bg-black rounded-[2rem] overflow-hidden relative h-full">
                        {/* Status bar minimaliste */}
                        <div className="absolute top-0 left-0 right-0 h-8 bg-black/50 z-10 flex items-center justify-between px-4">
                          <div className="text-white text-xs font-semibold">9:41</div>
                          <div className="w-16 h-1 bg-white/30 rounded-full"></div>
                          <div className="text-white text-xs">100%</div>
                        </div>
                        
                        {/* Vidéo plein écran */}
                        <div className="relative h-full">
                          <video
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                          >
                            <source src={clip.video} type="video/mp4" />
                          </video>
                          
                          {/* Interface TikTok */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70">
                            {/* Boutons interaction droite */}
                            <div className="absolute right-3 bottom-24 flex flex-col items-center space-y-4">
                              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <span className="text-white text-sm">❤️</span>
                              </div>
                              <div className="text-white text-xs font-semibold">{clip.views}</div>
                              
                              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <span className="text-white text-sm">💬</span>
                              </div>
                              <div className="text-white text-xs">125K</div>
                              
                              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <span className="text-white text-sm">📤</span>
                              </div>
                            </div>
                            
                            {/* Infos créateur en bas */}
                            <div className="absolute bottom-4 left-3 right-16 text-white">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold text-xs">{clip.avatar}</span>
                                </div>
                                <div>
                                  <div className="text-sm font-bold">@{clip.creator.toLowerCase()}</div>
                                </div>
                              </div>
                              <div className="text-xs font-medium mb-1">{clip.title}</div>
                              <div className="text-xs text-gray-300">👁 {clip.views} vues</div>
                            </div>
                            
                            {/* Badge gains */}
                            <div className="absolute top-10 right-3 bg-[#10B981] text-white px-2 py-1 rounded-lg text-xs font-bold">
                              {clip.earnings}
                            </div>
                          </div>
                        </div>
                        
                        {/* Barre navigation */}
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-white/50 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Infos sous le téléphone */}
                  <div className="text-center mt-4">
                    <div className="text-[#0F172A] font-bold text-lg">{clip.creator}</div>
                    <div className="text-[#0F172A]/60 text-sm">{clip.category} • Il y a 2h</div>
                    <div className="text-[#10B981] font-bold text-xl mt-1">{clip.earnings}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button 
                onClick={() => setAuthModal({isOpen: true, mode: 'clipper-signup'})}
                className="bg-[#10B981] text-white px-8 py-4 rounded-full font-bold hover:bg-[#10B981]/90 transition-all duration-300 hover:shadow-lg"
              >
                Rejoindre ces clippeurs
              </button>
            </div>
          </div>
        </section>

        {/* Pourquoi ClipTokk - Blanc */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-[#0F172A] mb-8">
                Pourquoi ClipTokk
              </h2>
              <p className="text-2xl text-[#0F172A]/70 max-w-3xl mx-auto font-light">
                La première plateforme qui rémunère vraiment tes créations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  icon: IconCoin,
                  title: "Rémunération garantie",
                  description: "0,10€ automatique pour chaque 1000 vues sur tes clips",
                  color: "bg-[#10B981]"
                },
                {
                  icon: IconTarget,
                  title: "Missions chaque semaine",
                  description: "Nouveau contenu à clipper régulièrement par des créateurs populaires",
                  color: "bg-[#10B981]"
                },
                {
                  icon: IconCheck,
                  title: "100% gratuit",
                  description: "Aucun abonnement, aucun frais cachés. Tu gagnes, on gagne",
                  color: "bg-[#10B981]"
                }
              ].map((feature, index) => (
                <div key={index} className="group bg-white rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all duration-500 border border-[#0F172A]/10 hover:border-[#0F172A]/20">
                  <div className={`w-20 h-20 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-6">{feature.title}</h3>
                  <p className="text-[#0F172A]/70 leading-relaxed text-lg">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comment ça marche - Fond très légèrement teinté */}
        <section id="how-it-works" className="py-24 bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-[#0F172A] mb-8">
                3 étapes pour commencer
              </h2>
              <p className="text-2xl text-[#0F172A]/70 font-light">Simple, rapide, efficace</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  number: "1",
                  title: "Choisis une mission",
                  description: "Browse et sélectionne la mission qui te plaît",
                  icon: IconTarget
                },
                {
                  number: "2",
                  title: "Crée ton clip",
                  description: "Clip la vidéo avec nos outils intégrés",
                  icon: IconVideo
                },
                {
                  number: "3",
                  title: "Reçois tes gains",
                  description: "0,10€ automatique par 1000 vues",
                  icon: IconCoin
                }
              ].map((step, index) => (
                <div key={index} className="text-center group flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#0F172A] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-[#0F172A]/60 text-sm font-bold mb-3 tracking-wider">ÉTAPE {step.number}</div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-4 text-center">{step.title}</h3>
                  <p className="text-[#0F172A]/70 leading-relaxed text-center max-w-xs">{step.description}</p>
                </div>
              ))}
            </div>

            {/* Simulateur de gains */}
            <div className="mt-20 bg-white rounded-3xl p-12 shadow-lg border border-[#0F172A]/10">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-black text-[#0F172A] mb-4">
                  📊 Simulateur de gains
                </h3>
                <p className="text-[#0F172A]/70 text-lg">Calcule tes gains potentiels</p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div className="text-center">
                    <div className="text-[#0F172A]/60 text-sm font-bold mb-2">TU FAIS</div>
                    <div className="text-6xl font-black text-[#0F172A] mb-2">3</div>
                    <div className="text-[#0F172A]/70">clips par jour</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-[#0F172A]/60 text-sm font-bold mb-2">≈ VUES GÉNÉRÉES</div>
                    <div className="text-4xl font-black text-[#0F172A] mb-2">12 000</div>
                    <div className="text-[#0F172A]/70">vues/jour</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-[#0F172A]/60 text-sm font-bold mb-2">TU GAGNES</div>
                    <div className="text-6xl font-black text-[#10B981] mb-2">1.20€</div>
                    <div className="text-[#0F172A]/70">par jour</div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-[#F9FAFB] rounded-2xl text-center">
                  <div className="text-[#0F172A] font-bold text-lg mb-2">
                    💰 Soit <span className="text-[#10B981] text-2xl">36€/mois</span> en postant 3 clips par jour
                  </div>
                  <div className="text-[#0F172A]/60 text-sm">
                    Certains clippeurs gagnent plus de 200€/mois 🚀
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOMO Badge - Version sticky subtile */}
        <div className="sticky top-20 z-40 w-full bg-white py-2 border-y border-[#0F172A]/5">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="bg-[#FFF1F2] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-[#EF4444] rounded-full p-2">
                  <span className="text-white text-xl">🔥</span>
                </div>
                <div>
                  <div className="font-bold text-[#0F172A]">Challenge en cours : 2 340€ déjà gagnés</div>
                  <div className="text-sm text-[#0F172A]/60">512 clippeurs actifs • Clôture dans 48h ⏰</div>
                </div>
              </div>
              <Link 
                href="/missions"
                className="bg-[#EF4444] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#EF4444]/90 transition-all duration-300"
              >
                Voir les missions →
              </Link>
            </div>
          </div>
        </div>

        {/* Témoignages - Modernisés */}
        <section className="py-20 bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Lucas M.",
                  role: "Étudiant, 19 ans",
                  earnings: "€847",
                  period: "ce mois",
                  testimonial: "J'ai commencé il y a 3 semaines, je gagne déjà plus qu'avec mon job étudiant !",
                  avatar: "L"
                },
                {
                  name: "Sarah K.",
                  role: "Freelance, 24 ans", 
                  earnings: "€1,234",
                  period: "ce mois",
                  testimonial: "ClipTokk m'a permis de diversifier mes revenus. Les paiements sont toujours à l'heure.",
                  avatar: "S"
                },
                {
                  name: "Alex R.",
                  role: "Créateur, 21 ans",
                  earnings: "€2,156",
                  period: "ce mois",
                  testimonial: "Meilleure plateforme pour monétiser sa créativité. Interface simple, gains transparents.",
                  avatar: "A"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 border border-[#0F172A]/5">
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#10B981]"
                    />
                    <div>
                      <div className="font-['Caveat'] text-2xl text-[#0F172A]">{testimonial.name}</div>
                      <div className="text-[#0F172A]/60 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-[#0F172A]/80 mb-4 italic">"{testimonial.testimonial}"</p>
                  <div className="text-[#10B981] font-bold text-2xl">{testimonial.earnings}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transition vers les étapes */}
        <div className="py-20 bg-[#F9FAFB] text-center border-t border-[#0F172A]/5">
          <h2 className="text-3xl font-black text-[#0F172A]/80">
            🎯 Comment gagner de l'argent avec ClipTokk ?
          </h2>
          <p className="text-[#0F172A]/60 mt-4 text-lg">
            Un processus simple en 3 étapes
          </p>
        </div>

        {/* FAQ - Fond plus foncé */}
        <section className="py-24 bg-[#F4F4F5]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-[#0F172A] mb-6">
                Questions fréquentes
              </h2>
              <p className="text-xl text-[#0F172A]/70 font-light">Tout ce que tu dois savoir pour commencer</p>
            </div>

            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* Transition vers les clips */}
        <div className="py-20 bg-white text-center border-t border-[#0F172A]/5">
          <h2 className="text-3xl font-black text-[#0F172A]/80">
            🔥 Ils gagnent déjà en publiant des clips
          </h2>
          <p className="text-[#0F172A]/60 mt-4 text-lg">
            Des exemples concrets de notre communauté
          </p>
        </div>

        {/* CTA Final + Simulateur combinés - Bleu nuit */}
        <section className="py-32 bg-[#0F172A]">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            {/* Simulateur */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 mb-16">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-black text-white mb-4">
                  📊 Simulateur de gains
                </h3>
                <p className="text-white/70 text-lg">Calcule tes gains potentiels</p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div className="text-center">
                    <div className="text-white/60 text-sm font-bold mb-2">TU FAIS</div>
                    <div className="text-6xl font-black text-white mb-2">3</div>
                    <div className="text-white/70">clips par jour</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-white/60 text-sm font-bold mb-2">≈ VUES GÉNÉRÉES</div>
                    <div className="text-4xl font-black text-white mb-2">12 000</div>
                    <div className="text-white/70">vues/jour</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-white/60 text-sm font-bold mb-2">TU GAGNES</div>
                    <div className="text-6xl font-black text-[#10B981] mb-2">1.20€</div>
                    <div className="text-white/70">par jour</div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-white/5 rounded-2xl text-center">
                  <div className="text-white font-bold text-lg mb-2">
                    💰 Soit <span className="text-[#10B981] text-2xl">36€/mois</span> en postant 3 clips par jour
                  </div>
                  <div className="text-white/60 text-sm">
                    Certains clippeurs gagnent plus de 200€/mois 🚀
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Final */}
            <div className="text-center">
              <h2 className="text-5xl font-black text-white mb-8">
                Prêt à gagner de l'argent avec TikTok ?
              </h2>
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                Rejoins les centaines de clippeurs qui gagnent déjà de l'argent en partageant du contenu viral.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/onboarding/role"
                  className="bg-[#10B981] text-white px-8 py-4 rounded-full font-bold hover:bg-[#10B981]/90 transition-all duration-300 shadow-lg text-lg"
                >
                  Devenir clippeur
                </Link>
                <Link
                  href="/missions"
                  className="text-white border border-white/20 px-6 py-3 rounded-full hover:bg-white/5 transition-all duration-300"
                >
                  Voir les missions
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Bleu nuit */}
        <footer className="bg-[#0F172A] py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
              <div>
                <img src="/logo.png" alt="ClipTokk" className="h-20 mb-6 object-contain brightness-0 invert" />
                <p className="text-white/70 text-lg font-light">
                  La première plateforme qui rémunère tes TikToks
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-6 text-lg">Produit</h4>
                <ul className="space-y-4 text-white/70">
                  <li><Link href="/missions" className="hover:text-white transition-colors text-[15px]">Missions</Link></li>
                  <li><button onClick={() => setAuthModal({isOpen: true, mode: 'signup'})} className="hover:text-white transition-colors text-[15px]">Dashboard</button></li>
                  <li><a href="#how-it-works" className="hover:text-white transition-colors text-[15px]">Comment ça marche</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-6 text-lg">Support</h4>
                <ul className="space-y-4 text-white/70">
                  <li><a href="mailto:hello@cliptokk.com" className="hover:text-white transition-colors text-[15px]">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition-colors text-[15px]">FAQ</a></li>
                  <li><a href="#" className="hover:text-white transition-colors text-[15px]">Aide</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-6 text-lg">Légal</h4>
                <ul className="space-y-4 text-white/70">
                  <li><a href="#" className="hover:text-white transition-colors text-[15px]">Conditions</a></li>
                  <li><a href="#" className="hover:text-white transition-colors text-[15px]">Confidentialité</a></li>
                  <li><a href="#" className="hover:text-white transition-colors text-[15px]">Mentions légales</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-12">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-white/70 text-[15px]">
                  © 2025 ClipTokk. Tous droits réservés.
                </p>
                <div className="flex items-center gap-6 text-xs text-white/50">
                  <div className="flex items-center gap-2">
                    <IconShield className="w-4 h-4 text-[#10B981]" />
                    <span>Paiements sécurisés par Stripe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconBolt className="w-4 h-4 text-[#10B981]" />
                    <span>Plateforme 100% gratuite</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* CTA Sticky Mobile */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#10B981] p-4 shadow-2xl border-t border-[#10B981]/20 md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-white font-bold text-sm">🎁 Bonus 5€ de bienvenue</div>
              <div className="text-white/80 text-xs">Pour tes 3 premiers clips</div>
            </div>
            <Link 
              href="/onboarding/role"
              className="bg-white text-[#10B981] px-6 py-3 rounded-full font-bold hover:bg-white/90 transition-all duration-300 shadow-lg text-sm whitespace-nowrap"
            >
              Commencer 🚀
            </Link>
          </div>
        </div>

        {/* Transition vers les témoignages */}
        <div className="py-20 bg-[#F9FAFB] text-center border-t border-[#0F172A]/5">
          <h2 className="text-3xl font-black text-[#0F172A]/80">
            💬 La communauté ClipTokk en parle
          </h2>
          <p className="text-[#0F172A]/60 mt-4 text-lg">
            Des clippeurs satisfaits qui gagnent déjà
          </p>
        </div>

        <AuthModal 
          isOpen={authModal.isOpen}
          onClose={() => setAuthModal({...authModal, isOpen: false})}
          mode={authModal.mode}
          onModeChange={(mode) => setAuthModal({...authModal, mode})}
        />
      </div>
    </div>
  );
}
