/**
 * Data Cache Layer using Next.js unstable_cache
 * Provides persistent caching across requests and deployments
 * Implements Time-based and On-demand Revalidation
 */

import { unstable_cache } from 'next/cache';
// Import Appwrite services
// import { SuperAdminService } from '../superAdminService'; // Disabled Firebase service
import { AppwriteUniversityAdminService } from '../appwriteUniversityAdminService';
import type { UserData, VendorData, OrderData, UniversityData } from '../models';

// ========================================
// Cache Configuration Constants
// ========================================

export const CACHE_TAGS = {
  USERS: 'users',
  VENDORS: 'vendors',
  ORDERS: 'orders',
  UNIVERSITIES: 'universities',
  ANALYTICS: 'analytics',
  SUPER_ADMIN: 'super-admin',
  UNIVERSITY_ADMIN: 'university-admin',
  DASHBOARD_STATS: 'dashboard-stats'
} as const;

export const CACHE_DURATIONS = {
  // Static data - revalidate less frequently
  UNIVERSITIES: 24 * 60 * 60, // 24 hours
  USERS: 10 * 60, // 10 minutes
  VENDORS: 15 * 60, // 15 minutes
  
  // Dynamic data - revalidate more frequently
  ORDERS: 2 * 60, // 2 minutes
  ANALYTICS: 5 * 60, // 5 minutes
  DASHBOARD_STATS: 3 * 60, // 3 minutes
  
  // Real-time data - very short cache
  REAL_TIME: 30, // 30 seconds
  
  // Long-term static content
  STATIC: 7 * 24 * 60 * 60 // 7 days
} as const;

// ========================================
// Super Admin Data Cache Functions
// ========================================

/**
 * Get all users with persistent caching
 * Cache key includes all filter parameters for proper invalidation
 */
export const getPersistedAllUsers = unstable_cache(
  async (
    universityFilter?: string,
    roleFilter?: string,
    searchTerm?: string
  ): Promise<UserData[]> => {
    console.log('🔄 Cache MISS: Fetching users from database');
    // Placeholder implementation - return empty array since Firebase service is disabled
    return [];
  },
  ['super-admin-users'],
  {
    tags: [CACHE_TAGS.USERS, CACHE_TAGS.SUPER_ADMIN],
    revalidate: CACHE_DURATIONS.USERS
  }
);

/**
 * Get all vendors with persistent caching
 */
export const getPersistedAllVendors = unstable_cache(
  async (): Promise<VendorData[]> => {
    console.log('🔄 Cache MISS: Fetching vendors from database');
    // Placeholder implementation - return empty array since Firebase service is disabled
    return [];
  },
  ['super-admin-vendors'],
  {
    tags: [CACHE_TAGS.VENDORS, CACHE_TAGS.SUPER_ADMIN],
    revalidate: CACHE_DURATIONS.VENDORS
  }
);

/**
 * Get all universities with persistent caching
 * Universities change rarely, so cache for longer
 */
export const getPersistedAllUniversities = unstable_cache(
  async (): Promise<UniversityData[]> => {
    console.log('🔄 Cache MISS: Fetching universities from database');
    // Placeholder implementation - return empty array for now
    return [];
  },
  ['super-admin-universities'],
  {
    tags: [CACHE_TAGS.UNIVERSITIES, CACHE_TAGS.SUPER_ADMIN],
    revalidate: CACHE_DURATIONS.UNIVERSITIES
  }
);

/**
 * Get recent orders with persistent caching
 * Orders change frequently, so shorter cache duration
 */
export const getPersistedRecentOrders = unstable_cache(
  async (limit: number = 100): Promise<OrderData[]> => {
    console.log('🔄 Cache MISS: Fetching recent orders from database');
    // Placeholder implementation - return empty array for now
    return [];
  },
  ['super-admin-recent-orders'],
  {
    tags: [CACHE_TAGS.ORDERS, CACHE_TAGS.SUPER_ADMIN],
    revalidate: CACHE_DURATIONS.ORDERS
  }
);

/**
 * Get super admin dashboard stats with persistent caching
 */
export const getPersistedSuperAdminStats = unstable_cache(
  async () => {
    console.log('🔄 Cache MISS: Calculating dashboard stats');
    // Placeholder implementation - return empty stats for now
    return {
      totalUsers: 0,
      totalVendors: 0,
      totalOrders: 0,
      totalRevenue: 0,
      activeUsers: 0,
      activeVendors: 0,
      pendingOrders: 0,
      completedOrders: 0,
      universityCount: 0,
      avgOrderValue: 0,
      conversionRate: 0,
      monthlyGrowth: 0
    };
  },
  ['super-admin-dashboard-stats'],
  {
    tags: [CACHE_TAGS.DASHBOARD_STATS, CACHE_TAGS.SUPER_ADMIN],
    revalidate: CACHE_DURATIONS.DASHBOARD_STATS
  }
);

// ========================================
// University Admin Data Cache Functions
// ========================================

/**
 * Get university vendor performance with persistent caching
 */
export const getPersistedUniversityVendorPerformance = unstable_cache(
  async (universityName: string, timePeriod: string = '30d') => {
    console.log(`🔄 Cache MISS: Fetching vendor performance for ${universityName}`);
    // Placeholder implementation - return empty array for now
    return [];
  },
  ['university-vendor-performance'],
  {
    tags: [CACHE_TAGS.VENDORS, CACHE_TAGS.ANALYTICS, CACHE_TAGS.UNIVERSITY_ADMIN],
    revalidate: CACHE_DURATIONS.ANALYTICS
  }
);

/**
 * Get university analytics with persistent caching
 */
export const getPersistedUniversityAnalytics = unstable_cache(
  async (
    universityName: string,
    timePeriod: string = '30d',
    dateRange?: { from: Date; to: Date }
  ) => {
    console.log(`🔄 Cache MISS: Fetching analytics for ${universityName}`);
    // Placeholder implementation - return empty analytics for now
    return {
      totalOrders: 0,
      totalRevenue: 0,
      activeStudents: 0,
      avgOrderValue: 0,
      completionRate: 0,
      popularItems: [],
      revenueByDay: [],
      ordersByStatus: {
        pending: 0,
        confirmed: 0,
        preparing: 0,
        ready: 0,
        delivered: 0,
        cancelled: 0
      }
    };
  },
  ['university-analytics'],
  {
    tags: [CACHE_TAGS.ANALYTICS, CACHE_TAGS.UNIVERSITY_ADMIN],
    revalidate: CACHE_DURATIONS.ANALYTICS
  }
);

/**
 * Get university orders with persistent caching
 */
export const getPersistedUniversityOrders = unstable_cache(
  async (
    universityName: string,
    limit: number = 1000,
    dateRange?: { from: Date; to: Date }
  ): Promise<OrderData[]> => {
    console.log(`🔄 Cache MISS: Fetching orders for ${universityName}`);
    // Placeholder implementation - return empty array for now
    return [];
  },
  ['university-orders'],
  {
    tags: [CACHE_TAGS.ORDERS, CACHE_TAGS.UNIVERSITY_ADMIN],
    revalidate: CACHE_DURATIONS.ORDERS
  }
);

/**
 * Get vendor analytics with persistent caching
 */
export const getPersistedVendorAnalytics = unstable_cache(
  async (
    universityName: string,
    vendorId: string,
    dateRange?: { from: Date; to: Date }
  ) => {
    console.log(`🔄 Cache MISS: Fetching analytics for vendor ${vendorId}`);
    // Placeholder implementation - return empty analytics for now
    return {
      totalOrders: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      completionRate: 0,
      rating: 0,
      popularItems: [],
      revenueByDay: []
    };
  },
  ['vendor-analytics'],
  {
    tags: [CACHE_TAGS.ANALYTICS, CACHE_TAGS.VENDORS, CACHE_TAGS.UNIVERSITY_ADMIN],
    revalidate: CACHE_DURATIONS.ANALYTICS
  }
);

// ========================================
// Dynamic Cache Key Generation
// ========================================

/**
 * Creates a cache function with dynamic keys based on parameters
 * This allows for more granular cache invalidation
 */
export function createPersistedCache<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyPrefix: string,
  options: {
    tags: string[];
    revalidate: number;
    keyGenerator?: (...args: TArgs) => string;
  }
) {
  return unstable_cache(
    async (...args: TArgs): Promise<TReturn> => {
      const key = options.keyGenerator 
        ? options.keyGenerator(...args)
        : `${keyPrefix}-${args.join('-')}`;
      console.log(`🔄 Cache MISS: ${key}`);
      return await fn(...args);
    },
    [keyPrefix],
    {
      tags: options.tags,
      revalidate: options.revalidate
    }
  );
}

// ========================================
// Conditional Caching
// ========================================

/**
 * Conditionally cache based on environment or flags
 * Useful for development vs production caching behavior
 */
export function createConditionalCache<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  condition: () => boolean,
  cacheOptions: {
    keyPrefix: string;
    tags: string[];
    revalidate: number;
  }
) {
  const cachedFn = unstable_cache(
    fn,
    [cacheOptions.keyPrefix],
    {
      tags: cacheOptions.tags,
      revalidate: cacheOptions.revalidate
    }
  );

  return async (...args: TArgs): Promise<TReturn> => {
    if (condition()) {
      return await cachedFn(...args);
    }
    return await fn(...args);
  };
}

// ========================================
// Cache Health Monitoring
// ========================================

/**
 * Monitor cache performance and health
 */
export class CacheHealthMonitor {
  private static instance: CacheHealthMonitor;
  private cacheHits = new Map<string, number>();
  private cacheMisses = new Map<string, number>();
  private cacheErrors = new Map<string, number>();

  static getInstance(): CacheHealthMonitor {
    if (!CacheHealthMonitor.instance) {
      CacheHealthMonitor.instance = new CacheHealthMonitor();
    }
    return CacheHealthMonitor.instance;
  }

  recordHit(cacheKey: string): void {
    this.cacheHits.set(cacheKey, (this.cacheHits.get(cacheKey) || 0) + 1);
  }

  recordMiss(cacheKey: string): void {
    this.cacheMisses.set(cacheKey, (this.cacheMisses.get(cacheKey) || 0) + 1);
  }

  recordError(cacheKey: string): void {
    this.cacheErrors.set(cacheKey, (this.cacheErrors.get(cacheKey) || 0) + 1);
  }

  getStats(cacheKey?: string) {
    if (cacheKey) {
      const hits = this.cacheHits.get(cacheKey) || 0;
      const misses = this.cacheMisses.get(cacheKey) || 0;
      const errors = this.cacheErrors.get(cacheKey) || 0;
      const total = hits + misses;
      
      return {
        hits,
        misses,
        errors,
        total,
        hitRate: total > 0 ? ((hits / total) * 100).toFixed(2) + '%' : '0%'
      };
    }

    // Return overall stats
    const allHits = Array.from(this.cacheHits.values()).reduce((sum, val) => sum + val, 0);
    const allMisses = Array.from(this.cacheMisses.values()).reduce((sum, val) => sum + val, 0);
    const allErrors = Array.from(this.cacheErrors.values()).reduce((sum, val) => sum + val, 0);
    const total = allHits + allMisses;

    return {
      hits: allHits,
      misses: allMisses,
      errors: allErrors,
      total,
      hitRate: total > 0 ? ((allHits / total) * 100).toFixed(2) + '%' : '0%',
      cacheKeys: Array.from(new Set([
        ...Array.from(this.cacheHits.keys()),
        ...Array.from(this.cacheMisses.keys()),
        ...Array.from(this.cacheErrors.keys())
      ]))
    };
  }

  reset(): void {
    this.cacheHits.clear();
    this.cacheMisses.clear();
    this.cacheErrors.clear();
  }
}

export const cacheMonitor = CacheHealthMonitor.getInstance();