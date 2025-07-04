// Configuration globale pour Next.js
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

// Désactiver l'optimisation des routes
export const preferredRegion = 'auto'
export const runtime = 'nodejs'

// Configuration pour le mode de rendu
export const generateStaticParams = () => {
  return []
} 