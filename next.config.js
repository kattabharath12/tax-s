// Update your next.config.js for App Router compatibility
const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  
  // Force standalone output - no static optimization
  output: 'standalone',
  
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
    serverComponentsExternalPackages: ['@prisma/client', '@google-cloud/documentai'],
    // Remove this line: staticPageGenerationTimeout: 0,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: { 
    unoptimized: true,
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  swcMinify: true,
  
  serverRuntimeConfig: {
    uploadDir: process.env.UPLOAD_DIR || './uploads'
  },
  
  publicRuntimeConfig: {
    maxFileSize: process.env.MAX_FILE_SIZE || '10485760'
  },
  env: {
    GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
    GOOGLE_DOCUMENT_AI_LOCATION: process.env.GOOGLE_DOCUMENT_AI_LOCATION,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Prevent Prisma from being bundled on the client side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@google-cloud/documentai': '@google-cloud/documentai',
        '@prisma/client': '@prisma/client',
      });
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
