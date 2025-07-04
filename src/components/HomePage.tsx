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
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-green-600">▶ ClipTokk</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#comment-ca-marche" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Comment ça marche
                </a>
                <a href="#missions" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
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
                className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              >
                Se connecter
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('clipper-signup')
                  setIsAuthModalOpen(true)
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Devenir clippeur
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ● 500+ clippeurs actifs cette semaine
                  </span>
                </div>
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Gagne de l'argent en</span>{' '}
                  <span className="block xl:inline">postant des </span>
                  <span className="block text-green-600 xl:inline">TikToks viraux</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Tu postes des clips ? On te paie pour chaque vue. Rejoins des missions, publie sur TikTok, gagne de l'argent à la performance.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-3">
                  <div className="rounded-md shadow">
                    <button
                      onClick={() => {
                        setAuthModalMode('clipper-signup')
                        setIsAuthModalOpen(true)
                      }}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
                    >
                      Voir les missions disponibles →
                    </button>
                  </div>
                  <div className="rounded-md">
                    <button
                      onClick={() => {
                        setAuthModalMode('clipper-signup')
                        setIsAuthModalOpen(true)
                      }}
                      className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      Devenir clippeur →
                    </button>
                  </div>
                </div>
                <div className="mt-8 flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">●</span>
                    500+ clippeurs actifs
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">●</span>
                    2,3M vues générées
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
            <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-xl p-4">
              <div className="relative bg-gray-900 rounded-xl overflow-hidden">
                {/* Video Background */}
                <video 
                  src="/video/mrbeast.mp4" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-48 object-cover"
                />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-3 text-white">
                  {/* Top Section - Earnings */}
                  <div className="flex justify-end">
                    <div className="bg-black/60 rounded-lg px-3 py-1 text-right">
                      <div className="text-green-400 font-bold text-sm">Tes gains: 50€</div>
                      <div className="text-xs text-gray-300">pour 2.3M vues</div>
                    </div>
                  </div>
                  
                  {/* Bottom Section - User Info */}
                  <div className="flex items-end space-x-2">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-bold">
                      M
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">@mrbeast</div>
                      <div className="text-xs text-gray-300 leading-tight">Je donne 100 000$ à celui qui reste le plus longtemps dans ce cercle !</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment ça marche Section */}
      <div id="comment-ca-marche" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Comment ça marche ?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              3 étapes simples pour commencer à gagner
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <span className="text-xl font-bold">1</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">1. Choisis une mission</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Parcours les missions disponibles et sélectionne celles qui t'intéressent. Chaque mission précise le thème et la rémunération.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <span className="text-xl font-bold">2</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">2. Crée ton clip</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Réalise et publie ton TikTok en suivant les consignes de la mission. Notre système détecte automatiquement tes vues.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <span className="text-xl font-bold">3</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">3. Reçois tes gains</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Suis tes revenus en temps réel et retire ton argent dès 10€. Paiements rapides et sécurisés via Stripe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combien peux-tu gagner */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Combien peux-tu gagner ?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              La rémunération dépend du nombre de vues. Voici un exemple :
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">10€</div>
                <div className="text-gray-600 mb-4">Pour 100K vues</div>
                <div className="text-sm text-gray-500">
                  Plus tu génères de vues, plus tu gagnes ! Commence avec un objectif réaliste et progresse !
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-green-500">
                <div className="text-4xl font-bold text-green-600 mb-2">50€</div>
                <div className="text-gray-600 mb-4">Pour 500K vues</div>
                <div className="text-sm text-gray-500">
                  Plus tu génères de vues, plus tu gagnes ! Commence avec un objectif réaliste et progresse !
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">100€</div>
                <div className="text-gray-600 mb-4">Pour 1M vues</div>
                <div className="text-sm text-gray-500">
                  Plus tu génères de vues, plus tu gagnes ! Commence avec un objectif réaliste et progresse !
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Témoignages */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Ils cartonnent déjà
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Découvre les success stories de nos clippeurs
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    L
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold">Lucas M.</div>
                    <div className="text-sm text-gray-500">Étudiant</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "J'ai atteint 847€ avec seulement 9 clips ce mois-ci. C'est devenu une source de revenus stable !"
                </p>
                <div className="text-green-600 font-semibold">847€ gagnés en Mars 2024</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold">Sarah K.</div>
                    <div className="text-sm text-gray-500">Freelance</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "1,2M de vues en 3 semaines ! Je ne m'attendais pas à un tel succès sur mes premiers clips."
                </p>
                <div className="text-green-600 font-semibold">1,2M vues en 3 semaines</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    T
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold">Thomas R.</div>
                    <div className="text-sm text-gray-500">Créateur</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Je gagne maintenant plus avec ClipTokk qu'avec mon ancien job ! Les missions sont variées et bien payées."
                </p>
                <div className="text-green-600 font-semibold">2 340€ depuis janvier</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Badge */}
      <div className="flex justify-center py-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-medium">
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

      {/* FAQ */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Questions fréquentes
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Tout ce que tu dois savoir pour commencer
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  😊 Comment sont calculés les gains ?
                </h3>
                <p className="text-gray-600">
                  Tes gains sont calculés en fonction du nombre de vues que génèrent tes clips. Plus tu as de vues, plus tu gagnes ! Le taux est de 100€ pour 1 million de vues.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  💰 Quand suis-je payé ?
                </h3>
                <p className="text-gray-600">
                  Tu peux retirer ton argent dès que ton solde atteint 10€. Les paiements sont traités par Stripe et arrivent sur ton compte en 2-3 jours ouvrés.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  🎯 Combien de missions puis-je accepter ?
                </h3>
                <p className="text-gray-600">
                  Tu peux accepter autant de missions que tu veux ! Il n'y a pas de limite. Choisis celles qui correspondent le mieux à ton style et ton audience.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  📱 Ai-je besoin d'un gros compte TikTok ?
                </h3>
                <p className="text-gray-600">
                  Non ! Tu peux commencer même avec un nouveau compte. Ce qui compte, c'est la qualité de tes clips et leur potentiel viral.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Tu veux commencer à gagner dès ce soir ?
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            Rejoins les 500+ clippeurs qui gagnent déjà de l'argent avec leurs TikToks. Plus tu attends, plus tu passes à côté d'opportunités !
          </p>
          <div className="mt-8">
            <button
              onClick={() => {
                setAuthModalMode('clipper-signup')
                setIsAuthModalOpen(true)
              }}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-green-500 hover:bg-green-400 md:py-4 md:text-lg md:px-10"
            >
              Je deviens clippeur maintenant
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Inscription gratuite • Pas d'abonnement • Paiement dès 10€
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-green-500">▶</span>
              </div>
              <p className="mt-4 text-gray-400 text-sm">
                ClipTokk est la première plateforme qui te permet de gagner de l'argent en postant des TikToks viraux. Rejoins une communauté de créateurs passionnés et monétise ton contenu.
              </p>
              <div className="mt-6 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">TikTok</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Email</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Navigation</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#missions" className="text-base text-gray-300 hover:text-white">
                    Voir les missions
                  </a>
                </li>
                <li>
                  <a href="#comment-ca-marche" className="text-base text-gray-300 hover:text-white">
                    Comment ça marche
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Légal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Conditions d'utilisation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Politique des cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <div className="flex items-center text-gray-400">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Paiements sécurisés par Stripe
              </div>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              © 2024 ClipTokk. Tous droits réservés.
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