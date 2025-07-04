import HomePage from '@/components/HomePage'

// Configuration pour le pré-rendu statique
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export default function Home() {
  return <HomePage />
}
