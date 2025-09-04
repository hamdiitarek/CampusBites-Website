/**
 * Route Cache Configuration
 * Configures static/dynamic rendering and route segment options
 * Implements Full Route Cache and Router Cache optimizations
 */

// ========================================
// Route Segment Config Presets
// ========================================

/**
 * Static pages that rarely change - maximum caching
 */
export const STATIC_ROUTE_CONFIG = {
  // Enable static rendering at build time
  dynamic: 'force-static' as const,
  
  // Cache for 24 hours
  revalidate: 24 * 60 * 60,
  
  // Enable all fetch caching
  fetchCache: 'default-cache' as const,
  
  // Prefer static params
  dynamicParams: true,
  
  // Runtime for static pages
  runtime: 'nodejs' as const
};

/**
 * Semi-static pages that change occasionally - moderate caching
 */
export const SEMI_STATIC_ROUTE_CONFIG = {
  // Allow static rendering but revalidate
  revalidate: 5 * 60, // 5 minutes
  
  // Cache most fetches
  fetchCache: 'default-cache' as const,
  
  // Dynamic params allowed
  dynamicParams: true
};

/**
 * Dynamic pages that change frequently - minimal caching
 */
export const DYNAMIC_ROUTE_CONFIG = {
  // Force dynamic rendering
  dynamic: 'force-dynamic' as const,
  
  // Disable caching for real-time data
  fetchCache: 'default-no-store' as const,
  
  // Short revalidation
  revalidate: 60 // 1 minute
};

/**
 * Real-time pages that must always be fresh - no caching
 */
export const REALTIME_ROUTE_CONFIG = {
  // Force dynamic rendering
  dynamic: 'force-dynamic' as const,
  
  // No caching
  fetchCache: 'force-no-store' as const,
  
  // No revalidation
  revalidate: 0
};

// ========================================
// Page-Specific Cache Configurations
// ========================================

/**
 * Landing page - mostly static content
 */
export const LANDING_PAGE_CONFIG = {
  ...STATIC_ROUTE_CONFIG,
  revalidate: 12 * 60 * 60 // 12 hours
};

/**
 * Authentication pages - static but with dynamic elements
 */
export const AUTH_PAGE_CONFIG = {
  ...SEMI_STATIC_ROUTE_CONFIG,
  revalidate: 60 * 60 // 1 hour
};

/**
 * Dashboard pages - dynamic with frequent updates
 */
export const DASHBOARD_PAGE_CONFIG = {
  // Allow caching but keep fresh
  revalidate: 2 * 60, // 2 minutes
  fetchCache: 'default-cache' as const
};

/**
 * Admin dashboard - real-time data required
 */
export const ADMIN_DASHBOARD_CONFIG = {
  ...DYNAMIC_ROUTE_CONFIG,
  revalidate: 30 // 30 seconds for admin data
};

/**
 * Super admin dashboard - most critical real-time data
 */
export const SUPER_ADMIN_DASHBOARD_CONFIG = {
  ...REALTIME_ROUTE_CONFIG
};

/**
 * University pages - relatively static
 */
export const UNIVERSITY_PAGE_CONFIG = {
  ...SEMI_STATIC_ROUTE_CONFIG,
  revalidate: 30 * 60 // 30 minutes
};

/**
 * Vendor pages - dynamic content
 */
export const VENDOR_PAGE_CONFIG = {
  ...SEMI_STATIC_ROUTE_CONFIG,
  revalidate: 10 * 60 // 10 minutes
};

// ========================================
// generateStaticParams Configurations
// ========================================

/**
 * Optimized static params generation for universities
 * Pre-renders most popular university pages at build time
 */
export async function generateUniversityStaticParams() {
  // In a real implementation, you would fetch from your database
  // Here we return the most common universities to pre-render
  const popularUniversities = [
    'cairo-university',
    'american-university-cairo',
    'german-university-cairo',
    'alexandria-university',
    'ain-shams-university'
  ];

  return popularUniversities.map((slug) => ({
    university: slug,
  }));
}

/**
 * Generate static params for vendor pages
 * Pre-renders top vendors at build time
 */
export async function generateVendorStaticParams() {
  // Return empty array to generate on-demand
  // This prevents long build times while still allowing static generation
  return [];
}

// ========================================
// Router Cache Configuration
// ========================================

/**
 * Configure client-side router cache behavior
 */
export const ROUTER_CACHE_CONFIG = {
  // Prefetch settings for different page types
  prefetch: {
    // Static pages - prefetch aggressively
    static: true,
    
    // Dynamic pages - prefetch conditionally
    dynamic: null,
    
    // Admin pages - don't prefetch (too dynamic)
    admin: false
  },
  
  // Stale times for different content types
  staleTimes: {
    // Static content can be stale longer
    static: 5 * 60, // 5 minutes
    
    // Dynamic content should be fresher
    dynamic: 30, // 30 seconds
    
    // Admin content should always be fresh
    admin: 0
  }
};

// ========================================
// Link Component Configuration Helpers
// ========================================

/**
 * Get appropriate prefetch setting for a link based on page type
 */
export function getPrefetchSetting(pageType: 'static' | 'dynamic' | 'admin'): boolean | null {
  return ROUTER_CACHE_CONFIG.prefetch[pageType];
}

/**
 * Determine if a route should be statically rendered
 */
export function shouldStaticRender(pathname: string): boolean {
  // Static routes
  const staticRoutes = [
    '/',
    '/en',
    '/ar',
    '/campus-food-guide-egypt',
    '/student-discounts-egypt'
  ];
  
  // Check if path matches static routes
  if (staticRoutes.includes(pathname)) {
    return true;
  }
  
  // Check for dynamic but cacheable routes
  const semiStaticPatterns = [
    /^\/[a-z]{2}\/universities\//,
    /^\/[a-z]{2}\/vendors\//,
    /^\/[a-z]{2}\/signup/,
    /^\/[a-z]{2}\/login/
  ];
  
  return semiStaticPatterns.some(pattern => pattern.test(pathname));
}

/**
 * Get revalidation time for a route
 */
export function getRevalidationTime(pathname: string): number {
  // Real-time admin routes
  if (pathname.includes('super-admin-dashboard')) {
    return 0;
  }
  
  // Admin dashboards
  if (pathname.includes('admin-dashboard') || pathname.includes('vendor-dashboard')) {
    return 30;
  }
  
  // University pages
  if (pathname.includes('/universities/')) {
    return 30 * 60; // 30 minutes
  }
  
  // Auth pages
  if (pathname.includes('/login') || pathname.includes('/signup')) {
    return 60 * 60; // 1 hour
  }
  
  // Default static pages
  return 12 * 60 * 60; // 12 hours
}

// ========================================
// Middleware Cache Configuration
// ========================================

/**
 * Configure caching behavior in middleware
 */
export const MIDDLEWARE_CACHE_CONFIG = {
  // Skip caching for these paths
  skipPaths: [
    '/_next',
    '/api',
    '/favicon',
    '/robots.txt',
    '/sitemap.xml'
  ],
  
  // Cache headers for different route types
  headers: {
    static: {
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600' // 24h cache, 1h stale
    },
    dynamic: {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60' // 5m cache, 1m stale
    },
    admin: {
      'Cache-Control': 'private, no-cache, no-store, must-revalidate' // No caching
    }
  }
};

// ========================================
// Cache Invalidation Patterns
// ========================================

/**
 * Paths that should trigger cache invalidation when modified
 */
export const CACHE_INVALIDATION_PATTERNS = {
  // When users are modified
  users: [
    '/admin-dashboard',
    '/super-admin-dashboard/users',
    '/super-admin-dashboard'
  ],
  
  // When vendors are modified
  vendors: [
    '/vendor-dashboard',
    '/admin-dashboard',
    '/super-admin-dashboard/vendors',
    '/universities/*'
  ],
  
  // When orders are modified
  orders: [
    '/admin-dashboard',
    '/vendor-dashboard',
    '/super-admin-dashboard',
    '/super-admin-dashboard/orders'
  ],
  
  // When universities are modified
  universities: [
    '/universities/*',
    '/admin-dashboard',
    '/super-admin-dashboard/universities'
  ]
};

/**
 * Get paths to invalidate when data type changes
 */
export function getInvalidationPaths(dataType: keyof typeof CACHE_INVALIDATION_PATTERNS): string[] {
  return CACHE_INVALIDATION_PATTERNS[dataType] || [];
}