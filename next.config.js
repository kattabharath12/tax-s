const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { 
    unoptimized: true,
    domains: ['localhost']
  },
  // Railway specific optimizations
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  // Handle file uploads in Railway environment
  serverRuntimeConfig: {
    // Will only be available on the server side
    uploadDir: process.env.UPLOAD_DIR || './uploads'
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    maxFileSize: process.env.MAX_FILE_SIZE || '10485760' // 10MB
  }
};

module.exports = nextConfig;
