// Force new deployment - v7 - translations update
import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cliptokk.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@tabler/icons-react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 1 minute
    pagesBufferLength: 5, // Plus de pages en cache
  },
  serverExternalPackages: ['@supabase/supabase-js'],
  eslint: {
    ignoreDuringBuilds: true, // Temporairement activé pour le déploiement
  },
  typescript: {
    ignoreBuildErrors: true, // Temporairement activé pour le déploiement
  },
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
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
