import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import { SWRProvider } from "@/components/SWRProvider";
import { LanguageProvider } from '@/components/LanguageContext'

// Police Inter optimisée avec poids plus épais pour une meilleure lisibilité
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  weight: ["400", "500", "600", "700"], // Ajout de poids plus épais
});

export const metadata: Metadata = {
  title: "ClipTokk - Plateforme de Clipping TikTok",
  description: "Connectez créateurs et clippeurs pour du contenu viral TikTok",
  keywords: ["tiktok", "clipping", "créateurs", "contenu viral"],
  // Optimisations SEO et performance
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        {/* Preconnect pour optimiser les ressources externes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Prefetch pour les ressources critiques */}
        <link rel="dns-prefetch" href="//supabase.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        

      </head>
      <body className={`${inter.className} antialiased font-medium`} suppressHydrationWarning>
        <SWRProvider>
          <AuthProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </AuthProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
