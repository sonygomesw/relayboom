import './globals.css'
import { Suspense } from 'react'
import { AuthProvider } from '@/components/AuthContext'
import { LanguageProvider } from '@/components/LanguageContext'
import { SWRProvider } from '@/components/SWRProvider'
import { Analytics } from '@vercel/analytics/react'
import Loading from './loading'

// Optimisation des polices
const fontSans = {
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif']
}

export const metadata = {
  title: 'Cliptokk - Plateforme de Clipping',
  description: 'Créez et monétisez vos clips TikTok. Rejoignez la communauté de créateurs et gagnez de l\'argent avec vos clips.',
  keywords: ['tiktok', 'clip', 'monetization', 'creator', 'social media', 'viral content'],
  authors: [{ name: 'Cliptokk Team' }],
  openGraph: {
    title: 'Cliptokk - Monétisez vos clips TikTok',
    description: 'Créez des clips viraux et gagnez de l\'argent. Rejoignez la communauté Cliptokk.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://cliptokk.com',
    siteName: 'Cliptokk',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Cliptokk Platform'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cliptokk - Monétisez vos clips TikTok',
    description: 'Créez des clips viraux et gagnez de l\'argent. Rejoignez la communauté Cliptokk.',
    images: ['/og-image.jpg']
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#000000',
  manifest: '/manifest.json'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <SWRProvider>
          <LanguageProvider>
            <AuthProvider>
              <Suspense fallback={<Loading />}>
                {children}
              </Suspense>
            </AuthProvider>
          </LanguageProvider>
        </SWRProvider>
        <Analytics />
      </body>
    </html>
  )
}
