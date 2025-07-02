'use client'

import { SWRConfig } from 'swr'

// 🚀 Configuration SWR globale pour performances maximales
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 0,
  dedupingInterval: 60000, // 1 minute
  focusThrottleInterval: 5000,
  errorRetryCount: 2,
  errorRetryInterval: 1000,
  onError: (error: Error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 SWR Error:', error);
    }
  },
  onSuccess: (data: any, key: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ SWR Success:', key);
    }
  }
}

interface SWRProviderProps {
  children: React.ReactNode
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  )
} 