/**
 * Route Segment Configuration Utilities
 * Provides pre-configured route segment options for different page types
 */

import { STATIC_ROUTE_CONFIG, SEMI_STATIC_ROUTE_CONFIG, DYNAMIC_ROUTE_CONFIG, REALTIME_ROUTE_CONFIG } from './cache/routeCache';

// ========================================
// Static Page Configuration
// ========================================

/**
 * Configuration for landing and marketing pages
 * These pages have static content that rarely changes
 */
export const LANDING_PAGE_SEGMENT_CONFIG = {
  ...STATIC_ROUTE_CONFIG,
  revalidate: 12 * 60 * 60, // 12 hours
  metadata: {
    title: 'CampusBites - Campus Food Delivery Egypt',
    description: 'Order food from your university campus with fast delivery across Egyptian universities'
  }
};

/**
 * Configuration for authentication pages
 * Static structure but with dynamic form handling
 */
export const AUTH_PAGE_SEGMENT_CONFIG = {
  ...SEMI_STATIC_ROUTE_CONFIG,
  revalidate: 60 * 60, // 1 hour
  fetchCache: 'default-cache' as const
};

/**
 * Configuration for university pages
 * Semi-static content that updates occasionally
 */
export const UNIVERSITY_PAGE_SEGMENT_CONFIG = {
  ...SEMI_STATIC_ROUTE_CONFIG,
  revalidate: 30 * 60, // 30 minutes
  generateStaticParams: true
};

/**
 * Configuration for vendor pages
 * Dynamic content that updates regularly
 */
export const VENDOR_PAGE_SEGMENT_CONFIG = {
  ...SEMI_STATIC_ROUTE_CONFIG,
  revalidate: 10 * 60, // 10 minutes
  fetchCache: 'default-cache' as const
};

// ========================================
// Dashboard Page Configurations
// ========================================

/**
 * Configuration for university admin dashboard
 * Dynamic content with moderate update frequency
 */
export const UNIVERSITY_ADMIN_SEGMENT_CONFIG = {
  dynamic: 'auto' as const,
  revalidate: 2 * 60, // 2 minutes
  fetchCache: 'default-cache' as const,
  dynamicParams: true
};

/**
 * Configuration for vendor dashboard
 * Dynamic content with frequent updates
 */
export const VENDOR_DASHBOARD_SEGMENT_CONFIG = {
  dynamic: 'auto' as const,
  revalidate: 60, // 1 minute
  fetchCache: 'default-cache' as const,
  dynamicParams: true
};

/**
 * Configuration for super admin dashboard
 * Real-time data that should always be fresh
 */
export const SUPER_ADMIN_SEGMENT_CONFIG = {
  ...REALTIME_ROUTE_CONFIG
};

// ========================================
// Content-Specific Configurations
// ========================================

/**
 * Configuration for blog/content pages
 * Static content with occasional updates
 */
export const CONTENT_PAGE_SEGMENT_CONFIG = {
  ...STATIC_ROUTE_CONFIG,
  revalidate: 24 * 60 * 60, // 24 hours
  generateStaticParams: true
};

/**
 * Configuration for help/documentation pages
 * Static content that rarely changes
 */
export const DOCS_PAGE_SEGMENT_CONFIG = {
  ...STATIC_ROUTE_CONFIG,
  revalidate: 7 * 24 * 60 * 60, // 7 days
  generateStaticParams: true
};

/**
 * Configuration for legal pages
 * Static content that very rarely changes
 */
export const LEGAL_PAGE_SEGMENT_CONFIG = {
  ...STATIC_ROUTE_CONFIG,
  revalidate: 30 * 24 * 60 * 60, // 30 days
  generateStaticParams: true
};

// ========================================
// Dynamic Route Configurations
// ========================================

/**
 * Configuration for order tracking pages
 * Real-time data for order status
 */
export const ORDER_TRACKING_SEGMENT_CONFIG = {
  ...REALTIME_ROUTE_CONFIG,
  dynamicParams: true
};

/**
 * Configuration for search results
 * Dynamic content based on query parameters
 */
export const SEARCH_RESULTS_SEGMENT_CONFIG = {
  dynamic: 'force-dynamic' as const,
  fetchCache: 'default-no-store' as const,
  revalidate: 0
};

/**
 * Configuration for user profile pages
 * Semi-static content with user-specific data
 */
export const PROFILE_PAGE_SEGMENT_CONFIG = {
  dynamic: 'auto' as const,
  revalidate: 5 * 60, // 5 minutes
  fetchCache: 'default-cache' as const,
  dynamicParams: true
};

// ========================================
// Configuration Selector
// ========================================

/**
 * Select appropriate route configuration based on page type
 */
export function getRouteConfig(pageType: string) {
  const configs = {
    'landing': LANDING_PAGE_SEGMENT_CONFIG,
    'auth': AUTH_PAGE_SEGMENT_CONFIG,
    'university': UNIVERSITY_PAGE_SEGMENT_CONFIG,
    'vendor': VENDOR_PAGE_SEGMENT_CONFIG,
    'university-admin': UNIVERSITY_ADMIN_SEGMENT_CONFIG,
    'vendor-dashboard': VENDOR_DASHBOARD_SEGMENT_CONFIG,
    'super-admin': SUPER_ADMIN_SEGMENT_CONFIG,
    'content': CONTENT_PAGE_SEGMENT_CONFIG,
    'docs': DOCS_PAGE_SEGMENT_CONFIG,
    'legal': LEGAL_PAGE_SEGMENT_CONFIG,
    'order-tracking': ORDER_TRACKING_SEGMENT_CONFIG,
    'search': SEARCH_RESULTS_SEGMENT_CONFIG,
    'profile': PROFILE_PAGE_SEGMENT_CONFIG
  };

  return configs[pageType as keyof typeof configs] || SEMI_STATIC_ROUTE_CONFIG;
}

/**
 * Determine page type from pathname
 */
export function determinePageType(pathname: string): string {
  // Remove language prefix
  const cleanPath = pathname.replace(/^\/(en|ar)/, '');
  
  if (cleanPath === '' || cleanPath === '/') {
    return 'landing';
  }
  
  if (cleanPath.includes('/login') || cleanPath.includes('/signup') || cleanPath.includes('/forgot-password')) {
    return 'auth';
  }
  
  if (cleanPath.includes('/super-admin-dashboard')) {
    return 'super-admin';
  }
  
  if (cleanPath.includes('/admin-dashboard')) {
    return 'university-admin';
  }
  
  if (cleanPath.includes('/vendor-dashboard')) {
    return 'vendor-dashboard';
  }
  
  if (cleanPath.includes('/universities/')) {
    return 'university';
  }
  
  if (cleanPath.includes('/vendors/')) {
    return 'vendor';
  }
  
  if (cleanPath.includes('/orders/') || cleanPath.includes('/tracking/')) {
    return 'order-tracking';
  }
  
  if (cleanPath.includes('/search')) {
    return 'search';
  }
  
  if (cleanPath.includes('/profile')) {
    return 'profile';
  }
  
  if (cleanPath.includes('/docs') || cleanPath.includes('/help')) {
    return 'docs';
  }
  
  if (cleanPath.includes('/privacy') || cleanPath.includes('/terms') || cleanPath.includes('/legal')) {
    return 'legal';
  }
  
  if (cleanPath.includes('/blog') || cleanPath.includes('/news')) {
    return 'content';
  }
  
  return 'landing'; // Default fallback
}

// ========================================
// Runtime Configuration Updates
// ========================================

/**
 * Update route configuration at runtime based on conditions
 */
export function getAdaptiveConfig(baseConfig: any, conditions: {
  serverLoad?: 'low' | 'medium' | 'high';
  userType?: 'anonymous' | 'authenticated' | 'admin';
  timeOfDay?: 'peak' | 'normal' | 'off-peak';
}) {
  const { serverLoad, userType, timeOfDay } = conditions;
  let adaptedConfig = { ...baseConfig };
  
  // Adjust based on server load
  if (serverLoad === 'high') {
    // Increase caching during high load
    adaptedConfig.revalidate = Math.max(adaptedConfig.revalidate * 2, 300); // Minimum 5 minutes
    adaptedConfig.fetchCache = 'force-cache';
  } else if (serverLoad === 'low') {
    // Reduce caching during low load for fresher data
    adaptedConfig.revalidate = Math.min(adaptedConfig.revalidate / 2, 60); // Maximum 1 minute
  }
  
  // Adjust based on user type
  if (userType === 'admin') {
    // Admins need fresher data
    adaptedConfig.revalidate = Math.min(adaptedConfig.revalidate, 60);
  } else if (userType === 'anonymous') {
    // Anonymous users can have more cached data
    adaptedConfig.revalidate = Math.max(adaptedConfig.revalidate, 300);
  }
  
  // Adjust based on time of day
  if (timeOfDay === 'peak') {
    // During peak hours, cache more aggressively
    adaptedConfig.revalidate = Math.max(adaptedConfig.revalidate * 1.5, 180);
  }
  
  return adaptedConfig;
}

// ========================================
// Export utility function for pages
// ========================================

/**
 * Generate route segment config for a specific page
 * Usage: export const { revalidate, dynamic, fetchCache } = createPageConfig('landing');
 */
export function createPageConfig(pageType: string, conditions?: {
  serverLoad?: 'low' | 'medium' | 'high';
  userType?: 'anonymous' | 'authenticated' | 'admin';
  timeOfDay?: 'peak' | 'normal' | 'off-peak';
}) {
  const baseConfig = getRouteConfig(pageType);
  
  if (conditions) {
    return getAdaptiveConfig(baseConfig, conditions);
  }
  
  return baseConfig;
}