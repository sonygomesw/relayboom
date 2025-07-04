'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import LanguageSelector from './LanguageSelector';
import AuthModal from './AuthModal';
import VideoCarouselDemo from './VideoCarouselDemo';
import ExpandableCardDemo from './expandable-card-demo-standard';

export default function HomePage() {
  const { t } = useLanguage();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'clipper-signup'>('login');
  const [mounted, setMounted] = useState(false);
  const [viewsCount, setViewsCount] = useState(100000); // Default value for the simulator
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Show sticky CTA on scroll (mobile only)
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const isMobile = window.innerWidth < 768;
      
      // Show after scrolling 1 viewport height on mobile
      setShowStickyCTA(scrollY > windowHeight && isMobile);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/30">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-50 shadow-lg shadow-gray-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img src="/logo.png" alt="ClipTokk" className="h-20 w-auto" />
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#comment-ca-marche" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:bg-gray-50">
                  {t.nav.howItWorks}
                </a>
                <a href="#missions" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:bg-gray-50">
                  {t.nav.missions}
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <button
                onClick={() => {
                  setAuthModalMode('login')
                  setIsAuthModalOpen(true)
                }}
                className="text-gray-700 hover:text-gray-900 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:bg-gray-50"
              >
                {t.nav.login}
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('clipper-signup')
                  setIsAuthModalOpen(true)
                }}
                className="inline-flex items-center px-8 py-4 border-2 border-gray-200 text-sm font-semibold rounded-full text-gray-800 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {t.nav.becomeClipper}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <div className="mb-6">
                  <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-lg shadow-green-500/10">
                    {t.hero.badge}
                  </span>
                </div>
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700">{t.hero.title}</span>
                </h1>
                <p className="mt-6 text-xl text-gray-700 sm:text-2xl max-w-3xl font-medium leading-relaxed">
                  {t.hero.subtitle}
                </p>
                <div className="mt-10 sm:mt-12 sm:flex sm:justify-center lg:justify-start gap-4">
                  <div className="rounded-full shadow-lg shadow-green-500/25">
                    <button
                      onClick={() => {
                        setAuthModalMode('signup')
                        setIsAuthModalOpen(true)
                      }}
                      className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-full text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105"
                    >
                      {t.hero.ctaPrimary}
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={() => {
                        setAuthModalMode('clipper-signup')
                        setIsAuthModalOpen(true)
                      }}
                      className="w-full flex items-center justify-center px-8 py-4 border-2 border-gray-200 text-base font-semibold rounded-full text-gray-800 bg-white hover:bg-gray-50 hover:border-gray-300 md:py-4 md:text-lg md:px-10 shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      {t.hero.ctaSecondary}
                    </button>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {t.hero.stats.activeClippers}
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    {t.hero.stats.viewsGenerated}
                  </div>
                </div>
                
                {/* Link to platform preview */}
                <div className="mt-6 flex justify-center lg:justify-start">
                  <a
                    href="/platform-previews"
                    className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Voir un aperçu des missions
                  </a>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* iPhone Mockup */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex items-center justify-center p-8">
          <div className="relative">
            <div className="relative w-80 h-[600px] bg-black rounded-[4rem] p-3 shadow-2xl shadow-black/25">
              <div className="w-full h-full bg-white rounded-[3.5rem] overflow-hidden relative">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/video/mrbeast.mp4" type="video/mp4" />
                </video>
                
                {/* TikTok UI Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/20 to-transparent">
                  {/* Top UI */}
                  <div className="flex justify-between items-center pt-12">
                    <div className="text-white text-sm font-medium">Pour toi</div>
                    <div className="text-white text-sm font-medium">Abonnements</div>
                  </div>
                  
                  {/* Bottom UI */}
                  <div className="flex justify-between items-end">
                    <div className="flex-1 text-white">
                      <div className="mb-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {t.hero.stats.viewsGenerated}
                      </div>
                      <div className="text-sm font-medium mb-1">@mrbeast</div>
                      <div className="text-xs opacity-90">Incroyable défi à 100K$ ! 🔥</div>
                    </div>
                    <div className="flex flex-col items-center space-y-4 ml-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <span className="text-2xl">❤️</span>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <span className="text-2xl">💬</span>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <span className="text-2xl">📤</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment ça marche Section */}
      <div id="comment-ca-marche" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              {t.howItWorks.title}
            </h2>
            <p className="mt-6 max-w-2xl text-xl text-gray-700 lg:mx-auto font-medium">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center group">
                <div className="mx-auto h-20 w-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-red-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.howItWorks.steps.step1.title}</h3>
                <p className="text-gray-700 text-lg leading-relaxed">{t.howItWorks.steps.step1.description}</p>
              </div>

              <div className="text-center group">
                <div className="mx-auto h-20 w-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-red-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.howItWorks.steps.step2.title}</h3>
                <p className="text-gray-700 text-lg leading-relaxed">{t.howItWorks.steps.step2.description}</p>
              </div>

              <div className="text-center group">
                <div className="mx-auto h-20 w-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-yellow-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.howItWorks.steps.step3.title}</h3>
                <p className="text-gray-700 text-lg leading-relaxed">{t.howItWorks.steps.step3.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combien peux-tu gagner Section */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              {t.pricing.title}
            </h2>
            <p className="mt-6 max-w-2xl text-xl text-gray-700 lg:mx-auto font-medium">
              {t.pricing.subtitle}
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl px-8 py-10 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{t.pricing.plans.starter.price}</h3>
                  <p className="text-gray-600 font-medium mb-6">{t.pricing.plans.starter.views}</p>
                  <p className="text-gray-700 leading-relaxed">{t.pricing.plans.starter.description}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl px-8 py-10 shadow-xl shadow-green-500/10 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-green-200 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Populaire
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{t.pricing.plans.pro.price}</h3>
                  <p className="text-gray-600 font-medium mb-6">{t.pricing.plans.pro.views}</p>
                  <p className="text-gray-700 leading-relaxed">{t.pricing.plans.pro.description}</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-3xl px-8 py-10 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{t.pricing.plans.expert.price}</h3>
                  <p className="text-gray-600 font-medium mb-6">{t.pricing.plans.expert.views}</p>
                  <p className="text-gray-700 leading-relaxed">{t.pricing.plans.expert.description}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mini Earnings Simulator */}
          <div className="mt-20 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl p-8 text-white">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">💰 Simulateur de gains</h3>
                <p className="text-blue-100">Découvre combien tu peux gagner avec tes vues !</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Nombre de vues de ton clip
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="5000000"
                    step="10000"
                    value={viewsCount}
                    onChange={(e) => setViewsCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-blue-100 mt-2">
                    <span>10K</span>
                    <span>5M</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">
                    {viewsCount.toLocaleString()} vues
                  </div>
                  <div className="text-2xl font-semibold text-yellow-300">
                    = {Math.round(viewsCount * 0.0001)}€ gagnés
                  </div>
                  <p className="text-sm text-blue-100 mt-2">
                    Basé sur 0,10€ pour 1000 vues • Moyennes réelles de la plateforme
                  </p>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Avec {Math.round(viewsCount / 100000)} clips similaires par mois :</span>
                    <span className="font-bold text-yellow-300">
                      {Math.round(viewsCount * 0.0001 * (viewsCount / 100000))}€/mois
                    </span>
                  </div>
                  <div className="text-center mt-3 pt-3 border-t border-white/20">
                    <div className="flex items-center justify-center gap-2 text-xs text-blue-100">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Clippers payés chaque semaine via Stripe</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    onClick={() => {
                      setAuthModalMode('clipper-signup')
                      setIsAuthModalOpen(true)
                    }}
                    className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Je veux gagner ça ! 🚀
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aperçu des missions disponibles Section */}
      <div className="py-20 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
              Aperçu des missions disponibles
            </h2>
            <p className="text-xl text-gray-700 font-medium mb-4">
              Découvre les missions que tu peux réaliser dès maintenant
            </p>
            <p className="text-sm text-gray-600">
              🔓 Aperçu gratuit • Aucune inscription requise
            </p>
          </div>
          
          {/* Missions Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Mission 1 - MrBeast */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
                <div className="flex items-center justify-between">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    🔥 Populaire
                  </span>
                  <span className="text-white font-bold text-lg">15€</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Clip MrBeast Challenge</h3>
                <p className="text-gray-600 text-sm mb-4">Crée un clip viral de 30-60s à partir d'une vidéo MrBeast récente</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>100K+ followers • 2.3M vues/mois</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                    </svg>
                    <span>0,15€ pour 1000 vues</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                    <span>6 jours restants</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                    Voir les détails
                  </button>
                </div>
              </div>
            </div>
            
            {/* Mission 2 - Dance Challenge */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4">
                <div className="flex items-center justify-between">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    💃 Facile
                  </span>
                  <span className="text-white font-bold text-lg">12€</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dance Challenge Viral</h3>
                <p className="text-gray-600 text-sm mb-4">Reproduis une chorégraphie tendance avec ta propre créativité</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Tous niveaux • 1.8M vues/mois</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                    </svg>
                    <span>0,12€ pour 1000 vues</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                    <span>12 jours restants</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <button className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-pink-600 transition-colors">
                    Voir les détails
                  </button>
                </div>
              </div>
            </div>
            
            {/* Mission 3 - Gaming Reaction */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
                <div className="flex items-center justify-between">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    🎮 Expert
                  </span>
                  <span className="text-white font-bold text-lg">20€</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gaming Reaction Clip</h3>
                <p className="text-gray-600 text-sm mb-4">Réagis à un moment fort d'un stream gaming populaire</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Gaming créateurs • 3.1M vues/mois</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                    </svg>
                    <span>0,20€ pour 1000 vues</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                    <span>4 jours restants</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                    Voir les détails
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => {
                setAuthModalMode('clipper-signup')
                setIsAuthModalOpen(true)
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Voir toutes les missions disponibles →
            </button>
          </div>
        </div>
      </div>

      {/* Les clips qui cartonnent Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
              {t.trending.title}
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              {t.trending.subtitle}
            </p>
          </div>
          
          <VideoCarouselDemo />
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
              {t.testimonials.title}
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              {t.testimonials.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-900/5 p-8 border border-gray-100/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-blue-500/25">
                  L
                </div>
                <div className="ml-6">
                  <div className="font-bold text-lg">{t.testimonials.reviews.lucas.name}</div>
                  <div className="text-sm text-gray-500">{t.testimonials.reviews.lucas.role}</div>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{t.testimonials.reviews.lucas.text}"
              </p>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-bold">{t.testimonials.reviews.lucas.earnings}</div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-900/5 p-8 border border-gray-100/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-pink-500/25">
                  S
                </div>
                <div className="ml-6">
                  <div className="font-bold text-lg">{t.testimonials.reviews.sarah.name}</div>
                  <div className="text-sm text-gray-500">{t.testimonials.reviews.sarah.role}</div>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{t.testimonials.reviews.sarah.text}"
              </p>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-bold">{t.testimonials.reviews.sarah.views}</div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-900/5 p-8 border border-gray-100/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-orange-500/25">
                  T
                </div>
                <div className="ml-6">
                  <div className="font-bold text-lg">{t.testimonials.reviews.thomas.name}</div>
                  <div className="text-sm text-gray-500">{t.testimonials.reviews.thomas.role}</div>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{t.testimonials.reviews.thomas.text}"
              </p>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-bold">{t.testimonials.reviews.thomas.earnings}</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
              {t.faq.title}
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              {t.faq.subtitle}
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-gray-900/5 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t.faq.questions.q1.question}</h3>
              <p className="text-gray-700 leading-relaxed">{t.faq.questions.q1.answer}</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-gray-900/5 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t.faq.questions.q2.question}</h3>
              <p className="text-gray-700 leading-relaxed">{t.faq.questions.q2.answer}</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-gray-900/5 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t.faq.questions.q3.question}</h3>
              <p className="text-gray-700 leading-relaxed">{t.faq.questions.q3.answer}</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-gray-900/5 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t.faq.questions.q4.question}</h3>
              <p className="text-gray-700 leading-relaxed">{t.faq.questions.q4.answer}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final Section */}
      <div className="py-20 bg-gradient-to-r from-green-500 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-6">
            {t.cta.title}
          </h2>
          <p className="text-xl text-green-100 mb-10 font-medium">
            {t.cta.subtitle}
          </p>
          <button
            onClick={() => {
              setAuthModalMode('clipper-signup')
              setIsAuthModalOpen(true)
            }}
            className="inline-flex items-center px-12 py-5 text-lg font-semibold rounded-full text-green-600 bg-white hover:bg-gray-50 shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            {t.cta.button}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <img className="h-16" src="/logo.png" alt="ClipTokk" />
              <p className="text-gray-300 text-base leading-relaxed">
                {t.footer.description}
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    {t.footer.platform.title}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white transition-colors duration-200">
                        {t.footer.platform.howItWorks}
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white transition-colors duration-200">
                        {t.footer.platform.missions}
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white transition-colors duration-200">
                        {t.footer.platform.pricing}
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white transition-colors duration-200">
                        {t.footer.platform.stories}
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    {t.footer.support.title}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white transition-colors duration-200">
                        {t.footer.support.help}
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white transition-colors duration-200">
                        {t.footer.support.contact}
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white transition-colors duration-200">
                        {t.footer.support.terms}
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white transition-colors duration-200">
                        {t.footer.support.privacy}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky CTA Button for Mobile */}
      {showStickyCTA && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
          <button
            onClick={() => {
              setAuthModalMode('clipper-signup')
              setIsAuthModalOpen(true)
            }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-full font-semibold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            {t.cta.button}
          </button>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authModalMode}
        onModeChange={setAuthModalMode}
      />
    </div>
  );
} 