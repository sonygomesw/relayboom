// Force new deployment - v7 - translations update
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🚀 Optimisations de performance avancées
  experimental: {
    optimizePackageImports: [],
    optimizeCss: false,
    optimizeServerReact: false,
  },
  
  // Packages externes pour le serveur
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // Optimisation des builds
  compiler: {
    removeConsole: false,
  },
  
  // Cache optimization pour le développement
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 1 minute
    pagesBufferLength: 5, // Plus de pages en cache
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [
      'images.unsplash.com',
      'assets.aceternity.com',
      'andscape.com',
      'ichef.bbci.co.uk',
      'tnj.com'
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Optimisation TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Simplified webpack configuration
  webpack: (config, { dev, isServer }) => {
    return config;
  },
};

export default nextConfig;
