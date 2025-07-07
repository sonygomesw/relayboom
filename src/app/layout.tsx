import './globals.css'
import { Suspense } from 'react'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { AuthProvider } from '@/components/AuthContext'
import { LanguageProvider } from '@/components/LanguageContext'
import { SWRProvider } from '@/components/SWRProvider'
import { ClientOnlyRouter } from '@/components/SafeRouter'
import { Analytics } from '@vercel/analytics/react'
import Loading from './loading'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cliptokk - Plateforme de mise en relation créateurs/clippeurs',
  description: 'Cliptokk est une plateforme qui met en relation les créateurs de contenu avec des clippeurs professionnels pour maximiser leur visibilité sur TikTok.',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Cliptokk',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cliptokk" />
        <link rel="icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className={inter.className}>
        <ClientOnlyRouter>
          <SWRProvider>
            <LanguageProvider>
              <AuthProvider>
                <Suspense fallback={<Loading />}>
                  {children}
                </Suspense>
              </AuthProvider>
            </LanguageProvider>
          </SWRProvider>
        </ClientOnlyRouter>
        <Analytics />
      </body>
    </html>
  )
}
