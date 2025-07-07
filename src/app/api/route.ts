import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Cache en mémoire avec TTL
const apiCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Middleware de cache
const withCache = async (key: string, handler: () => Promise<Response>) => {
  const cached = apiCache.get(key)
  const now = Date.now()

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data)
  }

  const response = await handler()
  const data = await response.json()
  
  apiCache.set(key, { data, timestamp: now })
  return NextResponse.json(data)
}

// Middleware de rate limiting
const rateLimit = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT = {
  MAX_REQUESTS: 100,
  WINDOW_MS: 60 * 1000 // 1 minute
}

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT.WINDOW_MS
  
  // Nettoyer les anciennes entrées
  for (const [key, value] of rateLimit.entries()) {
    if (value.timestamp < windowStart) {
      rateLimit.delete(key)
    }
  }

  const current = rateLimit.get(ip) || { count: 0, timestamp: now }
  
  if (current.timestamp < windowStart) {
    current.count = 1
    current.timestamp = now
  } else if (current.count >= RATE_LIMIT.MAX_REQUESTS) {
    return false
  } else {
    current.count++
  }
  
  rateLimit.set(ip, current)
  return true
}

// Middleware de compression
const compress = (data: any): any => {
  if (typeof data !== 'object') return data
  
  return Object.fromEntries(
    Object.entries(data)
      .filter(([_, value]) => value !== null && value !== undefined)
      .map(([key, value]) => [
        key,
        Array.isArray(value) ? value.map(compress) :
        typeof value === 'object' ? compress(value) :
        value
      ])
  )
}

export async function GET(request: Request) {
  const headersList = headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'
  
  // Vérifier le rate limit
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  try {
    const response = await withCache('api_status', async () => {
      const data = {
        status: 'healthy',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        cache: {
          size: apiCache.size,
          items: Array.from(apiCache.keys())
        },
        rateLimit: {
          current: rateLimit.get(ip)?.count || 0,
          max: RATE_LIMIT.MAX_REQUESTS,
          windowMs: RATE_LIMIT.WINDOW_MS
        }
      }
      
      return NextResponse.json(compress(data))
    })

    return response
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Nettoyage périodique du cache
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of apiCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      apiCache.delete(key)
    }
  }
}, CACHE_TTL) 