/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react'],
  output: 'standalone',
  
  // ========================================
  // Caching Optimizations
  // ========================================
  
  // Experimental features for better caching - temporarily disabled to debug build issue
  // experimental: {
  //   // Configure staleTimes for router cache
  //   staleTimes: {
  //     dynamic: 30,        // 30 seconds for dynamic pages
  //     static: 300,        // 5 minutes for static pages
  //   }
  // },
  
  // ========================================
  // Static Generation Configuration
  // ========================================
  
  // Generate static pages at build time
  generateBuildId: async () => {
    // Use timestamp for cache busting in development
    if (process.env.NODE_ENV === 'development') {
      return `dev-${Date.now()}`;
    }
    return null; // Use default in production
  },
  
  // ========================================
  // Headers for Better Caching
  // ========================================
  
  async headers() {
    return [
      // Static assets - aggressive caching
      {
        source: '/(.*)\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year
          },
        ],
      },
      
      // API routes - short caching
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=30', // 1 minute cache, 30s stale
          },
        ],
      },
      
      // Landing pages - moderate caching
      {
        source: '/(en|ar)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=300', // 1 hour cache, 5m stale
          },
        ],
      },
      
      // Dashboard pages - no caching (dynamic content)
      {
        source: '/(en|ar)/(admin|super-admin|vendor)-dashboard(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate',
          },
        ],
      },
      
      // Security headers
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
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // ========================================
  // Image Optimization
  // ========================================
  
  images: {
    // Enable image optimization
    formats: ['image/webp', 'image/avif'],
    
    // Cache images for performance
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    
    // Allowed image domains
    domains: [
      'images.unsplash.com',
      'campusbites.com'
    ],
    
    // Image sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // ========================================
  // Webpack Optimizations
  // ========================================
  
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      // Optimize chunks for better caching
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },

            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              priority: 20,
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // ========================================
  // Environment-specific Settings
  // ========================================
  
  // Compress responses
  compress: true,
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // React strict mode
  reactStrictMode: true,
  
  // ESLint configuration
  eslint: {
    // Ignore ESLint during builds (handle separately)
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration
  typescript: {
    // Ignore TypeScript errors during builds (handle separately)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
