import { IconLoader2 } from '@tabler/icons-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <IconLoader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Chargement...</h2>
        <p className="text-gray-500 mt-2">Préparation de votre contenu</p>
      </div>
    </div>
  )
} 