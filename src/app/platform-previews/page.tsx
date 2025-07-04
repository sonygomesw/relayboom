'use client'

import { useLanguage } from '@/components/LanguageContext'
import { translations } from '@/lib/translations.new'

export default function PlatformPreviews() {
  const { language } = useLanguage()
  const t = translations[language].platformPreviews

  return (
    <div className="p-8 space-y-8">
      {/* Mission Preview */}
      <div className="w-[800px] h-[600px] bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.mission.title}</h2>
            <p className="text-gray-600">{t.mission.expiresIn.replace('{days}', '3')}</p>
          </div>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            {t.mission.reward.replace('{amount}', '0,10')}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <img 
              src="https://picsum.photos/100"
              alt="Creator"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">MrBeast Gaming</h3>
              <p className="text-gray-600">{t.mission.subscribers.replace('{count}', '12.5')}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-800 text-lg">
              Crée un clip sur notre nouveau jeu "Beast Battle Royale". Montre les meilleurs moments et donne ton avis !
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{t.mission.keyPoints.title}</h4>
              <p className="text-gray-600">{t.mission.keyPoints.content}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{t.mission.duration.title}</h4>
              <p className="text-gray-600">{t.mission.duration.content}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button className="w-full bg-[#10B981] text-white py-4 rounded-xl font-medium text-lg hover:bg-[#10B981]/90 transition-colors">
            {t.mission.acceptButton}
          </button>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="w-[800px] h-[600px] bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{t.dashboard.title}</h2>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            {t.dashboard.level}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-sm">{t.dashboard.stats.totalEarnings}</p>
                <p className="text-2xl font-bold text-gray-900">347,20 €</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-sm">{t.dashboard.stats.totalViews}</p>
                <p className="text-2xl font-bold text-gray-900">2.3M</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-sm">{t.dashboard.stats.postedClips}</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.dashboard.recentClips.title}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div>
                  <p className="font-medium text-gray-900">MrBeast Challenge</p>
                  <p className="text-gray-600 text-sm">{t.dashboard.recentClips.timeAgo.replace('{days}', '2')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+42,50 €</p>
                <p className="text-gray-600 text-sm">425K vues</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div>
                  <p className="font-medium text-gray-900">Speed IRL Stream</p>
                  <p className="text-gray-600 text-sm">{t.dashboard.recentClips.timeAgo.replace('{days}', '4')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+28,30 €</p>
                <p className="text-gray-600 text-sm">283K vues</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Preview */}
      <div className="w-[800px] h-[600px] bg-white rounded-xl shadow-lg p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.upload.title}</h2>
          <p className="text-gray-600">{t.upload.description}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.upload.tiktokLink}
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                tiktok.com/
              </span>
              <input
                type="text"
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-[#10B981] focus:border-[#10B981]"
                placeholder={t.upload.placeholder}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.upload.autoDetection.title}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">{t.upload.autoDetection.duration.replace('{seconds}', '45')}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">{t.upload.autoDetection.hashtags}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">{t.upload.autoDetection.mention}</p>
              </div>
            </div>
          </div>

          <button className="w-full bg-[#10B981] text-white py-4 rounded-xl font-medium text-lg hover:bg-[#10B981]/90 transition-colors">
            {t.upload.submitButton}
          </button>
        </div>
      </div>

      {/* Payment Preview */}
      <div className="w-[800px] h-[600px] bg-white rounded-xl shadow-lg p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.withdraw.title}</h2>
          <p className="text-gray-600">{t.withdraw.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t.withdraw.availableBalance}</h3>
              <span className="text-2xl font-bold text-[#10B981]">347,20 €</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.withdraw.amount.label}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">€</span>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 focus:ring-[#10B981] focus:border-[#10B981]"
                    placeholder={t.withdraw.amount.placeholder}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button className="h-full px-3 text-sm text-[#10B981] font-medium hover:text-[#10B981]/80">
                      {t.withdraw.amount.max}
                    </button>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#10B981] text-white py-3 rounded-xl font-medium hover:bg-[#10B981]/90 transition-colors">
                Retirer maintenant
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Paiement sécurisé</h4>
                  <p className="text-gray-600 text-sm">Via Stripe Connect</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Virement rapide</h4>
                  <p className="text-gray-600 text-sm">Sous 24-48h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 