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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img src="/logo.png" alt="ClipTokk" className="h-32 w-auto" />
            </div>

            {/* Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-1">
              <a 
                href="#comment-ca-marche" 
                className="group relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                {t.nav.howItWorks}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center"></span>
              </a>
              <a 
                href="#missions" 
                className="group relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                {t.nav.missions}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center"></span>
              </a>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <div className="hidden sm:block">
                <LanguageSelector />
              </div>

              {/* Login Button */}
              <button
                onClick={() => {
                  setAuthModalMode('login')
                  setIsAuthModalOpen(true)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                {t.nav.login}
              </button>

              {/* CTA Button */}
              <button
                onClick={() => {
                  setAuthModalMode('clipper-signup')
                  setIsAuthModalOpen(true)
                }}
                className="group inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {t.nav.becomeClipper}
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,102,204,0.15)_1px,transparent_0)] bg-[length:24px_24px] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="relative z-10 pb-16 sm:pb-20 md:pb-24 lg:max-w-2xl lg:w-full lg:pb-32 xl:pb-40">
            <main className="mt-16 mx-auto max-w-7xl px-6 sm:mt-20 sm:px-8 md:mt-24 lg:mt-28 lg:px-12 xl:mt-36">
              <div className="sm:text-center lg:text-left">
                {/* Badge avec design Apple-style */}
                <div className="mb-8 animate-fade-in">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/80 backdrop-blur-sm text-primary-700 border border-primary-200/50 shadow-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    {t.hero.badge}
                  </span>
                </div>

                {/* Titre avec typographie Apple-style */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 leading-[0.9] tracking-tight animate-fade-in">
                  <span className="block">{t.hero.title}</span>
                </h1>

                {/* Sous-titre avec espacement Apple-style */}
                <p className="mt-8 text-xl sm:text-2xl text-gray-600 max-w-2xl font-normal leading-relaxed animate-fade-in">
                  {t.hero.subtitle}
                </p>

                {/* Boutons avec design Apple-style */}
                <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4 animate-fade-in">
                  <button
                    onClick={() => {
                      setAuthModalMode('signup')
                      setIsAuthModalOpen(true)
                    }}
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <span className="relative z-10">{t.hero.ctaPrimary}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setAuthModalMode('clipper-signup')
                      setIsAuthModalOpen(true)
                    }}
                    className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl shadow-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    {t.hero.ctaSecondary}
                    <svg className="ml-2 w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Stats avec design Apple-style */}
                <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8 animate-fade-in">
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    <span className="font-medium">{t.hero.stats.activeClippers}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 animate-pulse"></div>
                    <span className="font-medium">{t.hero.stats.viewsGenerated}</span>
                  </div>
                </div>
                
                {/* Link avec design Apple-style */}
                <div className="mt-8 flex justify-center lg:justify-start animate-fade-in">
                  <a
                    href="/platform-previews"
                    className="group inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="border-b border-primary-200 group-hover:border-primary-400 transition-colors duration-200">
                      Voir un aperçu des missions
                    </span>
                  </a>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* iPhone Mockup avec design Apple-style amélioré */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex items-center justify-center p-8">
          <div className="relative animate-fade-in">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary-500/20 rounded-[4rem] blur-3xl scale-110 opacity-30"></div>
            
            {/* iPhone mockup */}
            <div className="relative w-80 h-[600px] bg-gray-900 rounded-[4rem] p-2 shadow-2xl shadow-gray-900/30">
              {/* Screen */}
              <div className="w-full h-full bg-black rounded-[3.5rem] overflow-hidden relative">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>
                
                {/* Video */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/video/mrbeast.mp4" type="video/mp4" />
                </video>
                
                {/* TikTok UI Overlay avec design amélioré */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-t from-black/40 via-transparent to-black/20">
                  {/* Top UI */}
                  <div className="flex justify-center items-center pt-8 relative z-10">
                    <div className="flex space-x-8">
                      <div className="text-white text-sm font-medium opacity-60">Abonnements</div>
                      <div className="text-white text-sm font-semibold border-b-2 border-white pb-1">Pour toi</div>
                      <div className="text-white text-sm font-medium opacity-60">En direct</div>
                    </div>
                  </div>
                  
                  {/* Bottom UI */}
                  <div className="flex justify-between items-end">
                    <div className="flex-1 text-white max-w-[250px]">
                      {/* Earnings badge */}
                      <div className="mb-4 inline-flex items-center bg-green-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd"/>
                        </svg>
                        {t.hero.stats.viewsGenerated}
                      </div>
                      
                      {/* Creator info */}
                      <div className="text-sm font-semibold mb-1">@mrbeast</div>
                      <div className="text-xs opacity-90 leading-relaxed">Incroyable défi à 100K$ ! 🔥 #challenge #money</div>
                      
                      {/* Hashtags */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="text-xs text-blue-300">#viral</span>
                        <span className="text-xs text-blue-300">#money</span>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex flex-col items-center space-y-4 ml-4">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
                        <span className="text-xl">❤️</span>
                      </div>
                      <div className="text-white text-xs font-medium">2.1M</div>
                      
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
                        <span className="text-xl">💬</span>
                      </div>
                      <div className="text-white text-xs font-medium">45K</div>
                      
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
                        <span className="text-xl">📤</span>
                      </div>
                      <div className="text-white text-xs font-medium">12K</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment ça marche Section */}
      <div id="comment-ca-marche" className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header avec design Apple-style */}
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
              {t.howItWorks.title}
            </h2>
            <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-gray-600 font-normal leading-relaxed">
              {t.howItWorks.subtitle}
            </p>
          </div>

          {/* Steps avec design Apple-style */}
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-3 relative z-20">
            {/* Step 1 */}
            <div className="group text-center">
              <div className="relative mb-8">
                {/* Numéro de step */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-lg">
                  1
                </div>
                
                {/* Icône avec design amélioré */}
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-xl shadow-primary-500/25 group-hover:shadow-2xl group-hover:shadow-primary-500/30 transition-all duration-300 group-hover:scale-105">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 tracking-tight">
                {t.howItWorks.steps.step1.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed max-w-sm mx-auto">
                {t.howItWorks.steps.step1.description}
              </p>
            </div>

            {/* Step 2 */}
            <div className="group text-center">
              <div className="relative mb-8">
                {/* Numéro de step */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-lg">
                  2
                </div>
                
                {/* Icône avec design amélioré */}
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-500/25 group-hover:shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-300 group-hover:scale-105">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 tracking-tight">
                {t.howItWorks.steps.step2.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed max-w-sm mx-auto">
                {t.howItWorks.steps.step2.description}
              </p>
            </div>

            {/* Step 3 */}
            <div className="group text-center">
              <div className="relative mb-8">
                {/* Numéro de step */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-lg">
                  3
                </div>
                
                {/* Icône avec design amélioré */}
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-xl shadow-green-500/25 group-hover:shadow-2xl group-hover:shadow-green-500/30 transition-all duration-300 group-hover:scale-105">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 tracking-tight">
                {t.howItWorks.steps.step3.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed max-w-sm mx-auto">
                {t.howItWorks.steps.step3.description}
              </p>
            </div>
          </div>

          {/* Ligne de connexion entre les steps (desktop only) */}
          <div className="hidden lg:block relative -mt-32 mb-40">
            <div className="absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-primary-200 transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-2/3 w-1/3 h-0.5 bg-primary-200 transform -translate-y-1/2"></div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-40 mb-60 relative z-30">
            <div className="inline-flex items-center px-6 py-3 bg-gray-50 rounded-full text-sm font-medium text-gray-600 mb-32">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Commencez en moins de 2 minutes
            </div>
            
            <button
              onClick={() => {
                setAuthModalMode('clipper-signup')
                setIsAuthModalOpen(true)
              }}
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Commencer maintenant
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Combien peux-tu gagner Section */}
      <div className="py-32 bg-gradient-to-b from-white to-gray-50/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
              {t.pricing.title}
            </h2>
            <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-gray-600 font-normal leading-relaxed">
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
            <div className="bg-gradient-to-r from-primary-400 to-cyan-400 rounded-3xl p-8 text-white">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">💰 Simulateur de gains</h3>
                <p className="text-primary-100">Découvre combien tu peux gagner avec tes vues !</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-primary-100 mb-2">
                    Nombre de vues de ton clip
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="5000000"
                    step="10000"
                    value={viewsCount}
                    onChange={(e) => setViewsCount(parseInt(e.target.value))}
                    className="w-full h-3 bg-white/40 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #10B981 0%, #10B981 ${((viewsCount - 10000) / (5000000 - 10000)) * 100}%, rgba(255,255,255,0.4) ${((viewsCount - 10000) / (5000000 - 10000)) * 100}%, rgba(255,255,255,0.4) 100%)`,
                      WebkitAppearance: 'none',
                      outline: 'none'
                    }}
                  />
                  <style jsx>{`
                    .slider::-webkit-slider-thumb {
                      appearance: none;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #ffffff;
                      cursor: pointer;
                      border: 3px solid #10B981;
                      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                    }
                    .slider::-moz-range-thumb {
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #ffffff;
                      cursor: pointer;
                      border: 3px solid #10B981;
                      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                    }
                  `}</style>
                  <div className="flex justify-between text-xs text-primary-100 mt-2">
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
                  <p className="text-sm text-primary-100 mt-2">
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
                    <div className="flex items-center justify-center gap-2 text-xs text-primary-100">
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
                    className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
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
      <div id="missions" className="py-32 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header avec design Apple-style */}
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
              Aperçu des missions disponibles
            </h2>
            <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-gray-600 font-normal leading-relaxed mb-6">
              Découvre les missions que tu peux réaliser dès maintenant
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full text-sm font-medium text-green-700 border border-green-200/50">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Aperçu gratuit • Aucune inscription requise
            </div>
          </div>
          
          {/* Missions Preview Grid avec design Apple-style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Mission 1 - MrBeast */}
            <div className="group bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-xl hover:border-gray-300/50 transition-all duration-300 hover:scale-[1.02]">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                    🔥 Populaire
                  </span>
                  <span className="text-white font-bold text-lg">12€/1000 vues</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <img 
                    src="/mrbeast.jpg" 
                    alt="MrBeast" 
                    className="w-14 h-14 rounded-xl object-cover mr-4 shadow-sm"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">MrBeast Challenge</h3>
                    <p className="text-sm text-gray-500 font-medium">Défis Extrêmes</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Clippe les moments les plus fous des challenges MrBeast ! Focus sur les réactions authentiques, les twists inattendus.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <span>200M+ abonnés • 5.2M vues/mois</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Budget: 5000€ • Taux premium</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span>Durée: 30-60s • 8 jours restants</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setAuthModalMode('clipper-signup')
                    setIsAuthModalOpen(true)
                  }}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 group-hover:shadow-md"
                >
                  Accepter cette mission
                </button>
              </div>
            </div>
            
            {/* Mission 2 - Speed Gaming */}
            <div className="group bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-xl hover:border-gray-300/50 transition-all duration-300 hover:scale-[1.02]">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-500 to-slate-600 p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                    🎮 Gaming
                  </span>
                  <span className="text-white font-bold text-lg">10€/1000 vues</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <img 
                    src="/speedfan.jpg" 
                    alt="Speed" 
                    className="w-14 h-14 rounded-xl object-cover mr-4 shadow-sm"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Speed Gaming</h3>
                    <p className="text-sm text-gray-500 font-medium">Réactions Epic</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Capture les meilleures réactions gaming de Speed ! Ses explosions de joie, de rage, ses moments de skill intense.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <span>25M+ abonnés • 3.8M vues/mois</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Budget: 3000€ • Engagement élevé</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span>Durée: 15-45s • 12 jours restants</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setAuthModalMode('clipper-signup')
                    setIsAuthModalOpen(true)
                  }}
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 group-hover:shadow-md"
                >
                  Accepter cette mission
                </button>
              </div>
            </div>
            
            {/* Mission 3 - Kai Cenat */}
            <div className="group bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-xl hover:border-gray-300/50 transition-all duration-300 hover:scale-[1.02]">
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                    🎬 Streaming
                  </span>
                  <span className="text-white font-bold text-lg">9€/1000 vues</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <img 
                    src="/kaicenatfan.jpg" 
                    alt="Kai Cenat" 
                    className="w-14 h-14 rounded-xl object-cover mr-4 shadow-sm"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Kai Cenat</h3>
                    <p className="text-sm text-gray-500 font-medium">Best Moments</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Filme les moments les plus épiques de Kai Cenat ! Ses réactions face au contenu viral, interactions avec le chat.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <span>12M+ abonnés • 2.5M vues/mois</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Budget: 2500€ • Roi de Twitch</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span>Durée: 20-60s • 15 jours restants</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setAuthModalMode('clipper-signup')
                    setIsAuthModalOpen(true)
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 group-hover:shadow-md"
                >
                  Accepter cette mission
                </button>
              </div>
            </div>
          </div>
          
          {/* Section avec plus de créateurs */}
          <div className="text-center mb-12">
            <p className="text-lg text-gray-600 mb-8 font-medium">
              Et bien d'autres créateurs disponibles...
            </p>
          </div>
          
          {/* Grille supplémentaire avec plus de créateurs - Design Apple-style */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {/* Drake */}
            <div className="group bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-lg hover:border-gray-300/50 transition-all duration-300 hover:scale-[1.02]">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                    🎵 Musique
                  </span>
                  <span className="text-white font-bold text-sm">15€/1000 vues</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <img 
                    src="/drakefan.jpg" 
                    alt="Drake" 
                    className="w-10 h-10 rounded-lg object-cover mr-3 shadow-sm"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Drake</h4>
                    <p className="text-xs text-gray-500">Moments Iconiques</p>
                  </div>
                </div>
                <p className="text-gray-600 text-xs mb-3 leading-relaxed">Concerts, interviews, réactions spontanées. Contenu premium pour audience massive.</p>
                <div className="text-xs text-gray-500 mb-3 font-medium">
                  <span>140M+ abonnés • 4000€ budget</span>
                </div>
                <button 
                  onClick={() => {
                    setAuthModalMode('clipper-signup')
                    setIsAuthModalOpen(true)
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200"
                >
                  Voir mission
                </button>
              </div>
            </div>
            
            {/* Travis Scott */}
            <div className="group bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-lg hover:border-gray-300/50 transition-all duration-300 hover:scale-[1.02]">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                    🎤 Rap
                  </span>
                  <span className="text-white font-bold text-sm">13€/1000 vues</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <img 
                    src="/traviscottfan.jpg" 
                    alt="Travis Scott" 
                    className="w-10 h-10 rounded-lg object-cover mr-3 shadow-sm"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Travis Scott</h4>
                    <p className="text-xs text-gray-500">Astroworld Vibes</p>
                  </div>
                </div>
                <p className="text-gray-600 text-xs mb-3 leading-relaxed">Concerts épiques, studio sessions, lifestyle. L'énergie Travis Scott en clips.</p>
                <div className="text-xs text-gray-500 mb-3 font-medium">
                  <span>50M+ abonnés • 3500€ budget</span>
                </div>
                <button 
                  onClick={() => {
                    setAuthModalMode('clipper-signup')
                    setIsAuthModalOpen(true)
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200"
                >
                  Voir mission
                </button>
              </div>
            </div>
            
            {/* Central Cee */}
            <div className="group bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-lg hover:border-gray-300/50 transition-all duration-300 hover:scale-[1.02]">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                    🇬🇧 UK Drill
                  </span>
                  <span className="text-white font-bold text-sm">11€/1000 vues</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <img 
                    src="/centralfan.jpg" 
                    alt="Central Cee" 
                    className="w-10 h-10 rounded-lg object-cover mr-3 shadow-sm"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Central Cee</h4>
                    <p className="text-xs text-gray-500">UK Drill King</p>
                  </div>
                </div>
                <p className="text-gray-600 text-xs mb-3 leading-relaxed">Clips drill UK, freestyles, lifestyle Londres. Contenu authentique UK.</p>
                <div className="text-xs text-gray-500 mb-3 font-medium">
                  <span>8M+ abonnés • 2800€ budget</span>
                </div>
                <button 
                  onClick={() => {
                    setAuthModalMode('clipper-signup')
                    setIsAuthModalOpen(true)
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200"
                >
                  Voir mission
                </button>
              </div>
            </div>
            
            {/* Keine Musik */}
            <div className="group bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-lg hover:border-gray-300/50 transition-all duration-300 hover:scale-[1.02]">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                    🇩🇪 Électro
                  </span>
                  <span className="text-white font-bold text-sm">8€/1000 vues</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <img 
                    src="/keinemusikfan.jpg" 
                    alt="Keine Musik" 
                    className="w-10 h-10 rounded-lg object-cover mr-3 shadow-sm"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Keine Musik</h4>
                    <p className="text-xs text-gray-500">Électro Berlin</p>
                  </div>
                </div>
                <p className="text-gray-600 text-xs mb-3 leading-relaxed">Sets électro, festivals, ambiance Berlin. Musique électronique premium.</p>
                <div className="text-xs text-gray-500 mb-3 font-medium">
                  <span>2M+ abonnés • 1800€ budget</span>
                </div>
                <button 
                  onClick={() => {
                    setAuthModalMode('clipper-signup')
                    setIsAuthModalOpen(true)
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200"
                >
                  Voir mission
                </button>
              </div>
            </div>
          </div>
          
          {/* CTA Final */}
          <div className="text-center">
            <button
              onClick={() => {
                setAuthModalMode('clipper-signup')
                setIsAuthModalOpen(true)
              }}
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Voir toutes les missions disponibles
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Les clips qui cartonnent Section */}
      <div className="py-32 bg-white">
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
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-primary-500/25">
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
                              <img className="h-32" src="/logo.png" alt="ClipTokk" />
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