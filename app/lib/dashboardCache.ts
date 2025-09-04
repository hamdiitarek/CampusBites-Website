/**
 * Enhanced Dashboard Cache Service
 * Provides caching functionality for admin and super-admin dashboards
 * Now integrated with Next.js caching mechanisms and monitoring
 */

import { cacheMonitor, type CacheOperation } from './cache/cacheMonitoring';
import { getCacheConfig } from './cache/cacheConfig';
import { CACHE_TAGS } from './cache/dataCache';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  lastUpdate: string; // ISO string of last known update
  tags?: string[]; // Associated cache tags
  size?: number; // Estimated memory size
}

class DashboardCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = getCacheConfig().ttl.medium; // Use config-based TTL
  private readonly MAX_CACHE_SIZE = 50; // Prevent memory bloat

  /**
   * Get cached data if valid, otherwise return null
   * Now includes monitoring and performance tracking
   */
  get<T>(key: string, ttl: number = this.DEFAULT_TTL): T | null {
    const startTime = performance.now();
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.recordOperation(key, 'get', false, startTime);
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > ttl) {
      this.cache.delete(key);
      this.recordOperation(key, 'get', false, startTime);
      return null;
    }

    this.recordOperation(key, 'get', true, startTime);
    return entry.data;
  }

  /**
   * Set data in cache with current timestamp
   * Enhanced with size tracking and cache eviction
   */
  set<T>(key: string, data: T, lastUpdate?: string, tags?: string[]): void {
    const startTime = performance.now();
    
    // Estimate data size (rough approximation)
    const size = this.estimateSize(data);
    
    // Check cache size and evict if necessary
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      lastUpdate: lastUpdate || new Date().toISOString(),
      tags,
      size
    });

    this.recordOperation(key, 'set', true, startTime, size);
  }

  /**
   * Get the last update timestamp for a cache key
   */
  getLastUpdate(key: string): string | null {
    const entry = this.cache.get(key);
    return entry?.lastUpdate || null;
  }

  /**
   * Check if we have cached data for a key
   */
  has(key: string, ttl: number = this.DEFAULT_TTL): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    return now - entry.timestamp <= ttl;
  }

  /**
   * Clear specific cache entry
   */
  delete(key: string): void {
    const startTime = performance.now();
    const existed = this.cache.has(key);
    this.cache.delete(key);
    this.recordOperation(key, 'delete', existed, startTime);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`🧹 Dashboard cache cleared (${size} entries)`);
  }

  /**
   * Clear expired cache entries
   */
  cleanExpired(ttl: number = this.DEFAULT_TTL): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > ttl) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
    
    if (keysToDelete.length > 0) {
      console.log(`🧹 Cleaned ${keysToDelete.length} expired cache entries`);
    }
  }

  /**
   * Clear cache entries by tags
   */
  clearByTags(tags: string[]): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (entry.tags?.some(tag => tags.includes(tag))) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
    
    if (keysToDelete.length > 0) {
      console.log(`🗑️ Cleared ${keysToDelete.length} entries with tags: ${tags.join(', ')}`);
    }
  }

  /**
   * Get cache statistics with enhanced metrics
   */
  getStats(): { 
    size: number; 
    keys: string[];
    memoryUsage: number;
    hitRate?: string;
    avgAge: number;
  } {
    const now = Date.now();
    let totalSize = 0;
    let totalAge = 0;
    
    this.cache.forEach(entry => {
      totalSize += entry.size || 0;
      totalAge += now - entry.timestamp;
    });
    
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      memoryUsage: totalSize,
      avgAge: this.cache.size > 0 ? totalAge / this.cache.size : 0
    };
  }

  /**
   * Get cache entries by tag
   */
  getByTag(tag: string): Array<{ key: string; data: any; timestamp: number }> {
    const results: Array<{ key: string; data: any; timestamp: number }> = [];
    
    this.cache.forEach((entry, key) => {
      if (entry.tags?.includes(tag)) {
        results.push({
          key,
          data: entry.data,
          timestamp: entry.timestamp
        });
      }
    });
    
    return results;
  }

  /**
   * Record cache operation for monitoring
   */
  private recordOperation(
    key: string, 
    operation: 'get' | 'set' | 'delete', 
    hit: boolean, 
    startTime: number,
    size?: number
  ): void {
    const duration = performance.now() - startTime;
    
    const cacheOperation: CacheOperation = {
      operation,
      key,
      hit,
      duration,
      timestamp: new Date(),
      size
    };
    
    cacheMonitor.recordOperation(cacheOperation);
  }

  /**
   * Estimate data size in bytes (rough approximation)
   */
  private estimateSize(data: any): number {
    try {
      return JSON.stringify(data).length * 2; // Rough Unicode estimation
    } catch {
      return 1000; // Default fallback
    }
  }

  /**
   * Evict oldest cache entry
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();
    
    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    });
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      console.log(`♻️ Evicted oldest cache entry: ${oldestKey}`);
    }
  }

  /**
   * Warm cache with critical data
   */
  async warmCache(): Promise<void> {
    console.log('🔥 Warming dashboard cache...');
    // Implementation would call key dashboard functions
    // This ensures critical data is cached on startup
  }

  /**
   * Get cache health metrics
   */
  getHealthMetrics(): {
    healthy: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const stats = this.getStats();
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check for potential issues
    if (stats.size >= this.MAX_CACHE_SIZE * 0.9) {
      issues.push('Cache is near capacity');
      recommendations.push('Consider increasing MAX_CACHE_SIZE or reducing TTL');
    }
    
    if (stats.avgAge > this.DEFAULT_TTL * 0.8) {
      issues.push('Cache entries are aging quickly');
      recommendations.push('Consider optimizing cache invalidation strategy');
    }
    
    if (stats.memoryUsage > 10 * 1024 * 1024) { // 10MB
      issues.push('High memory usage');
      recommendations.push('Consider compressing large cache entries');
    }
    
    return {
      healthy: issues.length === 0,
      issues,
      recommendations
    };
  }
}

// Create singleton instance with enhanced monitoring
export const dashboardCache = new DashboardCache();

// Enhanced Cache key generators with better structure
export const CacheKeys = {
  // Super Admin Dashboard - with improved granularity
  superAdminStats: () => 'super-admin:stats',
  superAdminUsers: (universityName?: string, role?: string, searchTerm?: string) => 
    `super-admin:users:${universityName || 'all'}:${role || 'all'}:${searchTerm ? btoa(searchTerm).slice(0, 8) : 'none'}`,
  superAdminVendors: () => 'super-admin:vendors',
  superAdminUniversities: () => 'super-admin:universities',
  superAdminOrders: (limit: number) => `super-admin:orders:${limit}`,
  superAdminComplaints: () => 'super-admin:complaints',

  // University Admin Dashboard - with better organization
  universityStats: (universityName: string, timePeriod: string) => 
    `university-admin:stats:${universityName}:${timePeriod}`,
  universityVendors: (universityName: string) => 
    `university-admin:vendors:${universityName}`,
  universityOrders: (universityName: string, limit: number, dateRange?: string) => 
    `university-admin:orders:${universityName}:${limit}:${dateRange ? btoa(dateRange).slice(0, 8) : 'none'}`,
  universityAnalytics: (universityName: string, timePeriod: string, dateRange?: string) => 
    `university-admin:analytics:${universityName}:${timePeriod}:${dateRange ? btoa(dateRange).slice(0, 8) : 'none'}`,
  vendorAnalytics: (universityName: string, vendorId: string, dateRange?: string) => 
    `vendor:analytics:${universityName}:${vendorId}:${dateRange ? btoa(dateRange).slice(0, 8) : 'none'}`,
    
  // Real-time data keys (shorter TTL)
  realtimeOrders: (universityName?: string) => 
    `realtime:orders:${universityName || 'all'}`,
  realtimeNotifications: (userId: string) => 
    `realtime:notifications:${userId}`,
    
  // Static data keys (longer TTL)
  staticUniversityList: () => 'static:universities:list',
  staticVendorCategories: () => 'static:vendor:categories',
  staticSystemConfig: () => 'static:system:config'
} as const;

// Cache tag associations for better invalidation
export const CacheTagMappings = {
  [CacheKeys.superAdminStats()]: [CACHE_TAGS.SUPER_ADMIN, CACHE_TAGS.DASHBOARD_STATS],
  [CacheKeys.superAdminVendors()]: [CACHE_TAGS.VENDORS, CACHE_TAGS.SUPER_ADMIN],
  [CacheKeys.superAdminUniversities()]: [CACHE_TAGS.UNIVERSITIES, CACHE_TAGS.SUPER_ADMIN],
  [CacheKeys.superAdminComplaints()]: [CACHE_TAGS.SUPER_ADMIN],
  [CacheKeys.staticUniversityList()]: [CACHE_TAGS.UNIVERSITIES],
  [CacheKeys.staticVendorCategories()]: [CACHE_TAGS.VENDORS],
  [CacheKeys.staticSystemConfig()]: []
};

/**
 * Enhanced cache helper functions
 */
export const CacheHelpers = {
  /**
   * Set data with automatic tag assignment
   */
  setWithTags<T>(key: string, data: T, lastUpdate?: string): void {
    const tags = CacheTagMappings[key as keyof typeof CacheTagMappings] || [];
    dashboardCache.set(key, data, lastUpdate, tags);
  },

  /**
   * Get with fallback and automatic refresh
   */
  async getWithFallback<T>(
    key: string, 
    fallbackFn: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    const cached = dashboardCache.get<T>(key, ttl);
    if (cached) {
      return cached;
    }

    const fresh = await fallbackFn();
    this.setWithTags(key, fresh);
    return fresh;
  },

  /**
   * Invalidate related caches when data changes
   */
  invalidateRelated(changedDataType: 'users' | 'vendors' | 'orders' | 'universities'): void {
    switch (changedDataType) {
      case 'users':
        dashboardCache.clearByTags([CACHE_TAGS.USERS, CACHE_TAGS.DASHBOARD_STATS]);
        break;
      case 'vendors':
        dashboardCache.clearByTags([CACHE_TAGS.VENDORS, CACHE_TAGS.ANALYTICS]);
        break;
      case 'orders':
        dashboardCache.clearByTags([CACHE_TAGS.ORDERS, CACHE_TAGS.ANALYTICS, CACHE_TAGS.DASHBOARD_STATS]);
        break;
      case 'universities':
        dashboardCache.clearByTags([CACHE_TAGS.UNIVERSITIES]);
        break;
    }
  },

  /**
   * Preload critical dashboard data
   */
  async preloadCriticalData(): Promise<void> {
    console.log('🚀 Preloading critical dashboard data...');
    // This would be implemented with actual service calls
    // For now, just log the intention
    await dashboardCache.warmCache();
  }
};

export default dashboardCache;