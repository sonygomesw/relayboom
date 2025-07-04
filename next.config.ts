// Force new deployment - v7 - translations update
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🚀 Optimisations de performance avancées
  experimental: {
    optimizePackageImports: process.env.NODE_ENV === 'production' ? ['@tabler/icons-react', 'framer-motion'] : [],
    // optimizeCss désactivé car il cause des erreurs avec critters
    optimizeCss: false,
    optimizeServerReact: false,
  },
  
  // Packages externes pour le serveur
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // Optimisation des builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
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
    ignoreDuringBuilds: true,
  },
  
  // Optimisation TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Simplified webpack configuration to fix caching issues
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Optimisations pour le développement
      config.watchOptions = {
        poll: false,
        aggregateTimeout: 100,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      };
      
      // Disable problematic optimizations in dev
      config.optimization = {
        ...config.optimization,
        minimize: false,
      };
      
      config.performance = {
        hints: false
      };
    }
    
    return config;
  },
};

export default nextConfig;
