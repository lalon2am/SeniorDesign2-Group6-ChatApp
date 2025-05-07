// next.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Add async rewrites to proxy API requests to your Spring Boot backend
  async rewrites() {
    return [
      // 🔁 Route ONLY message-related API requests to Spring Boot (8080)
      {
        source: '/api/messages/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL ||'http://localhost:8080'}/api/messages/:path*`
      },
  
      // ✅ Let all other /api requests (users, friends, etc.) go to default backend (3000 or whatever it's running on)
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/:path*`
      }
    ];
  },
  
  // Custom headers for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' }
        ]
      }
    ]
  },
  
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@lib': path.resolve(__dirname, 'lib')
    };
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      os: false,
      fs: false,
      path: false,
      http: false,
      https: false
    };
    
    return config;
  },
  
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  }
};

export default nextConfig;