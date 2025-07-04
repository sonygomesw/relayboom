import AnalyticsPage from '@/components/AnalyticsPage'

// Configuration pour désactiver le pré-rendu statique
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export default function CreatorAnalytics() {
  return <AnalyticsPage />
}
