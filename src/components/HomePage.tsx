'use client'

import { useLanguage } from '@/components/LanguageContext'
import { homeTranslations } from '@/lib/home-translations'
import { Language } from '@/lib/types/translations'
import { useState } from 'react'
import AuthModal from './AuthModal'
import VideoCarouselDemo from './VideoCarouselDemo'
import CarouselDemo from './CarouselDemo'

export default function HomePage() {
  const { language } = useLanguage()
  const t = homeTranslations[language as Language] || homeTranslations.fr
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'clipper-signup'>('login')

  return (
    <div className="min-h-screen bg-white">
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
                  Comment ça marche
                </a>
                <a href="#missions" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:bg-gray-50">
                  Voir les missions
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setAuthModalMode('login')
                  setIsAuthModalOpen(true)
                }}
                className="text-gray-500 hover:text-gray-700 px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 hover:bg-gray-50"
              >
                Se connecter
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('clipper-signup')
                  setIsAuthModalOpen(true)
                }}
                className="inline-flex items-center px-8 py-4 border-2 border-gray-200 text-sm font-semibold rounded-full text-gray-800 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Devenir clippeur
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
                    ● 500+ clippeurs actifs cette semaine
                  </span>
                </div>
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Gagne de l'argent en</span>{' '}
                  <span className="block xl:inline">postant des </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 xl:inline">TikToks viraux</span>
                </h1>
                <p className="mt-6 text-base text-gray-700 sm:mt-8 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-8 md:text-xl lg:mx-0 font-medium">
                  Tu postes des clips ? On te paie pour chaque vue. Rejoins des missions, publie sur TikTok, gagne de l'argent à la performance.
                </p>
                <div className="mt-8 sm:mt-12 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="rounded-full shadow-2xl shadow-green-500/25">
                    <button
                      onClick={() => {
                        setAuthModalMode('clipper-signup')
                        setIsAuthModalOpen(true)
                      }}
                      className="w-full flex items-center justify-center px-10 py-5 border border-transparent text-base font-semibold rounded-full text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 md:py-6 md:text-lg md:px-12 shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Voir les missions disponibles →
                    </button>
                  </div>
                  <div className="rounded-full shadow-xl">
                    <button
                      onClick={() => {
                        setAuthModalMode('clipper-signup')
                        setIsAuthModalOpen(true)
                      }}
                      className="w-full flex items-center justify-center px-10 py-5 border-2 border-gray-300 text-base font-semibold rounded-full text-gray-800 bg-white/90 backdrop-blur-sm hover:bg-gray-50 hover:border-gray-400 md:py-6 md:text-lg md:px-12 transition-all duration-300 transform hover:scale-105"
                    >
                      Devenir clippeur →
                    </button>
                  </div>
                </div>
                <div className="mt-10 flex items-center space-x-8 text-sm text-gray-700">
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-100">
                    <span className="text-green-600 mr-2 font-bold">●</span>
                    <span className="font-medium">500+ clippeurs actifs</span>
                  </div>
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-100">
                    <span className="text-green-600 mr-2 font-bold">●</span>
                    <span className="font-medium">2,3M vues générées</span>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-br from-white to-gray-50/50 flex items-center justify-center">
            {/* iPhone 16 Mockup */}
            <div className="relative mx-auto">
              {/* iPhone Frame */}
              <div className="relative w-64 h-[500px] bg-black rounded-[4rem] p-3 shadow-2xl shadow-black/25">
                {/* iPhone Screen */}
                <div className="w-full h-full bg-black rounded-[3.5rem] overflow-hidden relative">
                  {/* Dynamic Island */}
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20"></div>
                  
                  {/* Video Content */}
                  <div className="relative w-full h-full">
                    <video 
                      src="/video/mrbeast.mp4" 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    
                    {/* TikTok UI Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                      {/* Top Section - Earnings */}
                      <div className="flex justify-end pt-10">
                        <div className="bg-black/80 backdrop-blur-md rounded-2xl px-4 py-2 text-right shadow-xl border border-white/10">
                          <div className="text-green-400 font-bold text-xs">Tes gains: 50€</div>
                          <div className="text-[10px] text-gray-200">pour 2.3M vues</div>
                        </div>
                      </div>
                      
                      {/* Right Side - TikTok Actions */}
                      <div className="absolute right-3 bottom-24 flex flex-col space-y-6">
                        <div className="w-12 h-12 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-white/20">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        </div>
                        <div className="w-12 h-12 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-white/20">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z"/>
                          </svg>
                        </div>
                        <div className="w-12 h-12 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-white/20">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        </div>
                      </div>
                      
                      {/* Bottom Section - User Info */}
                      <div className="flex items-end space-x-3 pb-6">
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-sm font-bold shadow-xl border border-white/20">
                          M
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-white">@mrbeast</div>
                          <div className="text-xs text-gray-200 leading-tight">Je donne 100 000$ à celui qui reste le plus longtemps dans ce cercle !</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* iPhone Home Indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment ça marche Section */}
      <div id="comment-ca-marche" className="py-20 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Comment ça marche ?
            </h2>
            <p className="mt-6 max-w-2xl text-xl text-gray-700 lg:mx-auto font-medium">
              3 étapes simples pour commencer à gagner
            </p>
          </div>

          <div className="mt-20">
            <div className="space-y-16 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-12 md:gap-y-16">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-16 w-16 rounded-3xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-2xl shadow-red-500/25">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </div>
                <div className="ml-20">
                  <h3 className="text-xl leading-6 font-bold text-gray-900">1. Choisis une mission</h3>
                  <p className="mt-4 text-base text-gray-700 leading-relaxed font-medium">
                    Parcours les missions disponibles et sélectionne celles qui t'intéressent. Chaque mission précise le thème et la rémunération.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-16 w-16 rounded-3xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-2xl shadow-red-500/25">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.89-2 2-2 2 .89 2 2-.89 2-2 2zm0 12c-1.1 0-2-.89-2-2s.89-2 2-2 2 .89 2 2-.89 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"/>
                  </svg>
                </div>
                <div className="ml-20">
                  <h3 className="text-xl leading-6 font-bold text-gray-900">2. Crée ton clip</h3>
                  <p className="mt-4 text-base text-gray-700 leading-relaxed font-medium">
                    Réalise et publie ton TikTok en suivant les consignes de la mission. Notre système détecte automatiquement tes vues.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-16 w-16 rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white shadow-2xl shadow-yellow-500/25">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V16h-2.67v2.09c-2.84-.48-5.09-2.73-5.57-5.57H7v-2.67H4.91c.48-2.84 2.73-5.09 5.57-5.57V6h2.67v2.09c2.84.48 5.09 2.73 5.57 5.57H17v2.67h2.09c-.48 2.84-2.73 5.09-5.57 5.57zM12 15c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"/>
                  </svg>
                </div>
                <div className="ml-20">
                  <h3 className="text-xl leading-6 font-bold text-gray-900">3. Reçois tes gains</h3>
                  <p className="mt-4 text-base text-gray-700 leading-relaxed font-medium">
                    Suis tes revenus en temps réel et retire ton argent dès 10€. Paiements rapides et sécurisés via Stripe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combien peux-tu gagner */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Combien peux-tu gagner ?
            </h2>
            <p className="mt-6 max-w-2xl text-xl text-gray-700 lg:mx-auto font-medium">
              La rémunération dépend du nombre de vues. Voici un exemple :
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-900/5 p-8 text-center border border-gray-200/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4">10€</div>
                <div className="text-gray-800 mb-6 font-semibold text-lg">Pour 100K vues</div>
                <div className="text-sm text-gray-700 leading-relaxed font-medium">
                  Plus tu génères de vues, plus tu gagnes ! Commence avec un objectif réaliste et progresse !
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-2xl shadow-green-500/10 p-8 text-center border-2 border-green-200 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4">50€</div>
                <div className="text-gray-800 mb-6 font-semibold text-lg">Pour 500K vues</div>
                <div className="text-sm text-gray-700 leading-relaxed font-medium">
                  Plus tu génères de vues, plus tu gagnes ! Commence avec un objectif réaliste et progresse !
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-900/5 p-8 text-center border border-gray-200/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4">100€</div>
                <div className="text-gray-800 mb-6 font-semibold text-lg">Pour 1M vues</div>
                <div className="text-sm text-gray-700 leading-relaxed font-medium">
                  Plus tu génères de vues, plus tu gagnes ! Commence avec un objectif réaliste et progresse !
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Témoignages */}
      <div className="py-20 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Ils cartonnent déjà
            </h2>
            <p className="mt-6 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Découvre les success stories de nos clippeurs
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-900/5 p-8 border border-gray-100/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-blue-500/25">
                    L
                  </div>
                  <div className="ml-6">
                    <div className="font-bold text-lg">Lucas M.</div>
                    <div className="text-sm text-gray-500">Étudiant</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "J'ai atteint 847€ avec seulement 9 clips ce mois-ci. C'est devenu une source de revenus stable !"
                </p>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-bold">847€ gagnés en Mars 2024</div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-900/5 p-8 border border-gray-100/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-pink-500/25">
                    S
                  </div>
                  <div className="ml-6">
                    <div className="font-bold text-lg">Sarah K.</div>
                    <div className="text-sm text-gray-500">Freelance</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "1,2M de vues en 3 semaines ! Je ne m'attendais pas à un tel succès sur mes premiers clips."
                </p>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-bold">1,2M vues en 3 semaines</div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-900/5 p-8 border border-gray-100/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-orange-500/25">
                    T
                  </div>
                  <div className="ml-6">
                    <div className="font-bold text-lg">Thomas R.</div>
                    <div className="text-sm text-gray-500">Créateur</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "Je gagne maintenant plus avec ClipTokk qu'avec mon ancien job ! Les missions sont variées et bien payées."
                </p>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-bold">2 340€ depuis janvier</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Badge */}
      <div className="flex justify-center py-12">
        <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-red-100 to-orange-100 text-red-800 text-sm font-semibold shadow-xl shadow-red-500/10">
          🔥 Tendance cette semaine
        </div>
      </div>

      {/* Video Carousel */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Les clips qui cartonnent
            </h2>
          </div>
          <VideoCarouselDemo />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Questions fréquentes
            </h2>
            <p className="mt-6 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Tout ce que tu dois savoir pour commencer
            </p>
          </div>

          <div className="mt-20">
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-900/5 p-8 border border-gray-100/50 transition-all duration-300 hover:shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  😊 Comment sont calculés les gains ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Tes gains sont calculés en fonction du nombre de vues réelles de ton clip TikTok. Plus ton clip génère de vues, plus tu gagnes. Le taux de rémunération est précisé dans chaque mission.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-900/5 p-8 border border-gray-100/50 transition-all duration-300 hover:shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  💰 Quand suis-je payé ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Tu peux retirer tes gains dès que tu atteins 10€. Les paiements sont effectués sous 48h via Stripe Connect directement sur ton compte bancaire.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-900/5 p-8 border border-gray-100/50 transition-all duration-300 hover:shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  🎯 Combien de missions puis-je accepter ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Il n'y a pas de limite ! Tu peux accepter autant de missions que tu veux. Plus tu en fais, plus tu gagnes. Certains clippeurs font 20+ missions par mois.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-900/5 p-8 border border-gray-100/50 transition-all duration-300 hover:shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  📱 Ai-je besoin d'un gros compte TikTok ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Non ! Même avec 0 abonné, tu peux créer des clips viraux. Notre algorithme aide tes clips à être vus. Beaucoup de nos clippeurs ont commencé avec de petits comptes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Tu veux commencer à gagner dès ce soir ?
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Rejoins ClipTokk maintenant et commence à monétiser tes TikToks. C'est gratuit et sans engagement.
          </p>
          <div className="mt-10">
            <button
              onClick={() => {
                setAuthModalMode('clipper-signup')
                setIsAuthModalOpen(true)
              }}
              className="inline-flex items-center px-12 py-6 border border-transparent text-lg font-semibold rounded-full text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Je deviens clippeur maintenant
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <img src="/logo.png" alt="ClipTokk" className="h-20 w-auto" />
              </div>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                ClipTokk est la première plateforme qui te permet de gagner de l'argent en postant des TikToks viraux. Rejoins une communauté de créateurs passionnés et monétise ton contenu.
              </p>
              <div className="mt-8 flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.5 13.559 3.5 12.017s.698-2.878 1.626-3.674c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.796 1.626 2.132 1.626 3.674s-.698 2.878-1.626 3.674c-.875.807-2.026 1.297-3.323 1.297zm7.83 0c-1.297 0-2.448-.49-3.323-1.297-.928-.796-1.626-2.132-1.626-3.674s.698-2.878 1.626-3.674c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.796 1.626 2.132 1.626 3.674s-.698 2.878-1.626 3.674c-.875.807-2.026 1.297-3.323 1.297z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
                  <span className="sr-only">TikTok</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Plateforme</h3>
              <ul className="space-y-4">
                <li><a href="#comment-ca-marche" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Comment ça marche</a></li>
                <li><a href="#missions" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Missions</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Tarifs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Success stories</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Support</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Centre d'aide</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Conditions d'utilisation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Politique de confidentialité</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">
              © 2024 ClipTokk. Tous droits réservés. Fait avec ❤️ en France.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authModalMode}
        onModeChange={setAuthModalMode}
      />
    </div>
  )
} 