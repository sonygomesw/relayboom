'use client'

import { useLanguage } from '@/components/LanguageContext'
import { IconEye, IconHeart, IconShare, IconCoin, IconCalendar, IconClock } from '@tabler/icons-react'
import Link from 'next/link'

export default function PlatformPreviewPage() {
  const { t } = useLanguage()

  const sampleMissions = [
    {
      id: 1,
      title: "Clip viral sur MrBeast",
      description: "Crée un clip de 30-60 secondes sur les dernières vidéos de MrBeast. Focus sur les moments les plus épiques !",
      reward: "15€",
      viewsTarget: "100K",
      timeLeft: "2 jours",
      difficulty: "Facile",
      category: "Gaming",
      creator: {
        name: "MrBeast",
        avatar: "/mrbeast.jpg",
        followers: "200M"
      },
      requirements: [
        "Clip de 30-60 secondes",
        "Hashtags: #MrBeast #Viral #ClipTokk",
        "Qualité HD minimum",
        "Pas de contenu inapproprié"
      ],
      examples: [
        "Réaction aux giveaways",
        "Moments de compétition",
        "Surprises aux participants"
      ]
    },
    {
      id: 2,
      title: "Trending Dance Challenge",
      description: "Participe au nouveau challenge de danse qui fait le buzz ! Ajoute ta touche personnelle.",
      reward: "12€",
      viewsTarget: "80K",
      timeLeft: "5 jours",
      difficulty: "Moyen",
      category: "Dance",
      creator: {
        name: "TikTok Trends",
        avatar: "/centralfan.jpg",
        followers: "5M"
      },
      requirements: [
        "Reproduire la chorégraphie",
        "Ajouter ta personnalité",
        "Hashtags: #DanceChallenge #Trending",
        "Bonne qualité audio"
      ],
      examples: [
        "Version originale",
        "Avec des amis",
        "Dans un lieu unique"
      ]
    },
    {
      id: 3,
      title: "Réaction Gaming Epic",
      description: "Réagis aux moments les plus épiques de gaming. Montre tes émotions authentiques !",
      reward: "20€",
      viewsTarget: "150K",
      timeLeft: "1 jour",
      difficulty: "Expert",
      category: "Gaming",
      creator: {
        name: "Gaming World",
        avatar: "/speedfan.jpg",
        followers: "10M"
      },
      requirements: [
        "Réaction authentique",
        "Commentaires engageants",
        "Hashtags: #Gaming #Reaction",
        "Montage dynamique"
      ],
      examples: [
        "Clutch moments",
        "Fails épiques",
        "Nouvelles sorties"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="ClipTokk" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-gray-900">ClipTokk</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Aperçu de la plateforme</span>
              <Link
                href="/"
                className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Rejoindre ClipTokk
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Voici à quoi ressemblent nos missions
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Découvre les missions disponibles et commence à gagner dès maintenant
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="flex items-center">
              <IconCoin className="h-5 w-5 text-green-600 mr-2" />
              <span>Paiement garanti</span>
            </div>
            <div className="flex items-center">
              <IconCalendar className="h-5 w-5 text-blue-600 mr-2" />
              <span>Nouvelles missions quotidiennes</span>
            </div>
            <div className="flex items-center">
              <IconClock className="h-5 w-5 text-purple-600 mr-2" />
              <span>Paiement sous 48h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleMissions.map((mission) => (
            <div key={mission.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Mission Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    mission.difficulty === 'Facile' ? 'bg-green-100 text-green-800' :
                    mission.difficulty === 'Moyen' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {mission.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">{mission.timeLeft} restants</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{mission.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{mission.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={mission.creator.avatar} 
                      alt={mission.creator.name}
                      className="h-8 w-8 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium text-sm">{mission.creator.name}</p>
                      <p className="text-xs text-gray-500">{mission.creator.followers} followers</p>
                    </div>
                  </div>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                    {mission.category}
                  </span>
                </div>
              </div>

              {/* Reward Section */}
              <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Récompense</p>
                    <p className="text-2xl font-bold text-green-600">{mission.reward}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Objectif</p>
                    <p className="text-lg font-semibold text-gray-900">{mission.viewsTarget} vues</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
                
                <button className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors">
                  Voir les détails
                </button>
              </div>

              {/* Requirements */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Exigences</h4>
                <ul className="space-y-2">
                  {mission.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-600">{req}</span>
                    </li>
                  ))}
                </ul>
                
                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Exemples d'idées</h4>
                <div className="flex flex-wrap gap-2">
                  {mission.examples.map((example, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à commencer ta première mission ?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Rejoins ClipTokk maintenant et commence à gagner avec tes TikToks
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Je commence à gagner avec mes TikToks
            </Link>
            <Link
              href="/"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 ClipTokk. Tous droits réservés. Fait avec ❤️ en France.
          </p>
        </div>
      </div>
    </div>
  )
} 