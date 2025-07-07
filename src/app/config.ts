// Configuration globale pour Next.js
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

// Configuration du runtime et de la région
export const preferredRegion = 'cdg1' // Paris pour une meilleure latence en Europe
export const runtime = 'experimental-edge' // Utilisation du runtime edge expérimental

// Configuration pour le mode de rendu
export const generateStaticParams = () => {
  return []
} 