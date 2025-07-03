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
    <div className="min-h-screen bg-white">
      {/* Header fixe */}
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

      {/* FOMO Banner Sticky */}
      <div className="sticky top-20 z-40 w-full bg-white py-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-[#FEE2E2] rounded-2xl p-4 flex items-center justify-between border border-[#EF4444]/20">
            <div className="flex items-center gap-4">
              <div className="bg-[#EF4444] rounded-full p-2">
                <span className="text-white">⏰</span>
              </div>
              <div>
                <div className="font-bold text-[#991B1B]">Challenge en cours : 2 340€ déjà gagnés</div>
                <div className="text-sm text-[#991B1B]/80">512 clippeurs actifs • Clôture dans 48h</div>
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

      {/* 1. Hero Section */}
      <section className="pt-48 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          {/* Badges de preuve sociale */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-[#E5F9EE] px-4 py-2 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
              <span className="text-sm font-medium">2,3M vues générées</span>
            </div>
            <div className="bg-[#E5F9EE] px-4 py-2 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
              <span className="text-sm font-medium">500+ clippeurs actifs</span>
            </div>
            <div className="bg-[#E5F9EE] px-4 py-2 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
              <span className="text-sm font-medium">500€+ cette semaine</span>
            </div>
          </div>

          {/* Titre et sous-titre */}
          <h1 className="text-6xl font-black text-[#0F172A] mb-6 leading-tight max-w-4xl mx-auto">
            Gagne de l'argent en postant des TikToks viraux
          </h1>
          <p className="text-xl text-[#0F172A]/70 mb-12 max-w-2xl mx-auto">
            Tu postes des clips ? On te paie pour chaque vue. Rejoins des missions, publie sur TikTok, et sois payé à la performance.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
        </div>
      </section>

      {/* 2. Statistiques */}
      <section className="py-16 bg-[#F9FAFB] border-t border-[#0F172A]/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-[#0F172A] mb-2">+2,3M</div>
              <div className="text-[#0F172A]/60">vues générées</div>
            </div>
            <div className="w-px bg-[#0F172A]/10 hidden sm:block"></div>
            <div>
              <div className="text-4xl font-black text-[#0F172A] mb-2">500+</div>
              <div className="text-[#0F172A]/60">clippeurs actifs</div>
            </div>
            <div className="w-px bg-[#0F172A]/10 hidden sm:block"></div>
            <div>
              <div className="text-4xl font-black text-[#0F172A] mb-2">100%</div>
              <div className="text-[#0F172A]/60">paiements via Stripe</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Comment ça marche */}
      <section id="how-it-works" className="py-24 bg-white border-t border-[#0F172A]/5">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-black text-[#0F172A] mb-16 text-center">
            3 étapes simples pour commencer
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E5F9EE] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[#10B981] text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Choisis une mission</h3>
              <p className="text-[#0F172A]/70">Browse et sélectionne une mission qui te plaît</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#E5F9EE] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[#10B981] text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Crée ton clip</h3>
              <p className="text-[#0F172A]/70">Clip la vidéo avec nos outils intégrés</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#E5F9EE] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[#10B981] text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Reçois tes gains</h3>
              <p className="text-[#0F172A]/70">Chaque vue compte. Littéralement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Simulateur de gains */}
      <section className="py-24 bg-[#F9FAFB] border-t border-[#0F172A]/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-[#0F172A] mb-4">
              Calcule tes gains potentiels
            </h2>
            <p className="text-[#0F172A]/70 text-xl">
              0,10€ pour chaque 1000 vues. Simple, transparent, automatique.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-12 shadow-sm border border-[#0F172A]/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-8">
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

            <div className="text-center p-6 bg-[#F9FAFB] rounded-2xl">
              <div className="text-[#0F172A] font-bold text-lg mb-4">
                💰 Soit <span className="text-[#10B981] text-2xl">36€/mois</span> en postant 3 clips par jour
              </div>
              <div className="text-[#0F172A]/60 text-sm mb-8">
                Certains clippeurs gagnent plus de 200€/mois 🚀
              </div>
              <Link
                href="/onboarding/role"
                className="bg-[#10B981] text-white px-8 py-4 rounded-full font-bold hover:bg-[#10B981]/90 transition-all duration-300 inline-block"
              >
                Rejoindre ClipTokk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Témoignages */}
      <section className="py-24 bg-white border-t border-[#0F172A]/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-black text-[#0F172A] mb-16 text-center">
            Ils gagnent déjà avec ClipTokk
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Lucas M.",
                role: "Étudiant, 19 ans",
                text: "Je gagne plus qu'avec mon job étudiant",
                earnings: "847€",
                avatar: "/speedfan.jpg"
              },
              {
                name: "Sarah K.",
                role: "Freelance",
                text: "Paiements toujours à l'heure, je diversifie mes revenus",
                earnings: "1 234€",
                avatar: "/kaicenatfan.jpg"
              },
              {
                name: "Alex R.",
                role: "Créateur",
                text: "Interface simple, gains transparents",
                earnings: "2 156€",
                avatar: "/mrbeast.jpg"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-[#F9FAFB] rounded-2xl p-8 border border-[#0F172A]/5">
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
                <p className="text-[#0F172A]/80 mb-4 italic">"{testimonial.text}"</p>
                <div className="text-[#10B981] font-bold text-2xl">{testimonial.earnings}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="text-[#0F172A]/70 hover:text-[#0F172A] transition-all duration-300">
              Lire plus d'avis →
            </button>
          </div>
        </div>
      </section>

      {/* 6. Les clips qui cartonnent */}
      <section className="py-24 bg-[#0F172A] border-t border-[#0F172A]/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="bg-[#EF4444] px-4 py-2 rounded-full text-white text-sm font-medium">
              🔥 Tendance cette semaine
            </div>
          </div>
          
          <h2 className="text-4xl font-black text-white mb-16 text-center">
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

      {/* 7. FAQ */}
      <section className="py-24 bg-[#F9FAFB] border-t border-[#0F172A]/5">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-black text-[#0F172A] mb-16 text-center">
            Questions fréquentes
          </h2>

          <div className="space-y-8">
            {[
              {
                question: "Comment je suis payé ?",
                answer: "Tu reçois 0,10€ pour chaque 1000 vues générées. Les paiements sont automatiques via Stripe dès que tu atteins 10€."
              },
              {
                question: "Est-ce que je peux commencer sans expérience ?",
                answer: "Oui ! Notre plateforme est conçue pour être accessible à tous. Nous fournissons des guides et des outils pour t'aider à démarrer."
              },
              {
                question: "Puis-je utiliser mon propre TikTok ?",
                answer: "Absolument ! Tu peux utiliser ton compte TikTok existant ou en créer un nouveau spécifiquement pour ClipTokk."
              },
              {
                question: "Puis-je retirer mes gains quand je veux ?",
                answer: "Oui ! Tu peux te faire plaisir quand tu veux dès que tu atteins 10€. Les retraits sont rapides et sécurisés via Stripe."
              },
              {
                question: "Combien de temps pour être payé ?",
                answer: "Les vues sont comptabilisées en temps réel. Une fois les 10€ atteints, le paiement est automatiquement déclenché sous 24-48h."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-[#0F172A]/5">
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{faq.question}</h3>
                <p className="text-[#0F172A]/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA Final */}
      <section className="py-32 bg-[#0F172A]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-black text-white mb-6">
            Prêt à gagner de l'argent avec TikTok ?
          </h2>
          <p className="text-xl text-white/70 mb-12">
            Rejoins les centaines de clippeurs qui gagnent déjà en partageant du contenu viral.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/onboarding/role"
              className="bg-[#10B981] text-white px-8 py-4 rounded-full font-bold hover:bg-[#10B981]/90 transition-all duration-300 text-lg group relative"
            >
              <span>Devenir clippeur</span>
              <span className="absolute -bottom-8 left-0 right-0 text-white/60 text-xs">
                Pas besoin d'expérience • Paiement dès 10€ • Aucun abonnement
              </span>
            </Link>
            <Link
              href="/missions"
              className="text-white border border-white/20 px-6 py-3 rounded-full hover:bg-white/5 transition-all duration-300"
            >
              Voir les missions
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <img src="/logo.png" alt="ClipTokk" className="h-8 mb-6 brightness-0 invert" />
              <p className="text-white/60 text-sm">
                La plateforme qui rémunère les créateurs de clips viraux.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Plateforme</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/missions" className="text-white/60 hover:text-white">
                    Missions disponibles
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-white/60 hover:text-white">
                    Comment ça marche
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-white/60 hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Légal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-white/60 hover:text-white">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white/60 hover:text-white">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-white/60 hover:text-white">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:support@cliptokk.com" className="text-white/60 hover:text-white">
                    support@cliptokk.com
                  </a>
                </li>
                <li className="text-white/60">
                  Paris, France
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-white/40 text-sm">
              © 2024 ClipTokk. Tous droits réservés.
            </p>
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

      <AuthModal 
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({...authModal, isOpen: false})}
        onModeChange={(mode) => setAuthModal({...authModal, mode})}
      />
    </div>
  );
}
