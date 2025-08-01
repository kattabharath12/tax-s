const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
    // Add Google Cloud Document AI to external packages
    serverComponentsExternalPackages: ['@prisma/client', '@google-cloud/documentai'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { 
    unoptimized: true,
    domains: ['localhost'],
    // Add common image domains for document processing
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Railway specific optimizations
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  swcMinify: true,
  
  // Handle file uploads in Railway environment
  serverRuntimeConfig: {
    // Will only be available on the server side
    uploadDir: process.env.UPLOAD_DIR || './uploads'
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    maxFileSize: process.env.MAX_FILE_SIZE || '10485760' // 10MB
  },

  // Environment variables that should be available in the browser
  env: {
    GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
    GOOGLE_DOCUMENT_AI_LOCATION: process.env.GOOGLE_DOCUMENT_AI_LOCATION,
    // Note: Don't expose sensitive credentials to browser
  },

  // Webpack configuration for better compatibility
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle Google Cloud libraries properly
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@google-cloud/documentai': '@google-cloud/documentai',
      });
    }

    // Handle file uploads and processing
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };

    // Improve build performance
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };

    return config;
  },

  // API routes configuration for document processing
  async rewrites() {
    return [
      // Add any URL rewrites if needed for document processing
    ];
  },

  // Headers for better security and performance
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
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
