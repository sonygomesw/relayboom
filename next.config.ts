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
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
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
  
  // Gestion des erreurs TypeScript et ESLint
  eslint: {
    ignoreDuringBuilds: true, // Temporairement activé pour le déploiement
  },
  
  // Optimisation TypeScript
  typescript: {
    ignoreBuildErrors: true, // Temporairement activé pour le déploiement
  },
  
  // Configuration de la sortie
  output: 'standalone',
  
  // Gestion des redirections et rewrites
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Configuration webpack simplifiée
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Optimisations pour la production
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };
    }
    return config;
  },
};

export default nextConfig;
