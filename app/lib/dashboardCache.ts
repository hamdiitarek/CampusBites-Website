/**
 * Dashboard Cache Service
 * Provides caching functionality for admin and super-admin dashboards
 * to avoid full API calls and only fetch new data
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  lastUpdate: string; // ISO string of last known update
}

class DashboardCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached data if valid, otherwise return null
   */
  get<T>(key: string, ttl: number = this.DEFAULT_TTL): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set data in cache with current timestamp
   */
  set<T>(key: string, data: T, lastUpdate?: string): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      lastUpdate: lastUpdate || new Date().toISOString()
    });
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
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
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
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Create singleton instance
export const dashboardCache = new DashboardCache();

// Cache key generators
export const CacheKeys = {
  // Super Admin Dashboard
  superAdminStats: () => 'super-admin:stats',
  superAdminUsers: (universityName?: string, role?: string, searchTerm?: string) => 
    `super-admin:users:${universityName || 'all'}:${role || 'all'}:${searchTerm || ''}`,
  superAdminVendors: () => 'super-admin:vendors',
  superAdminUniversities: () => 'super-admin:universities',
  superAdminOrders: (limit: number) => `super-admin:orders:${limit}`,
  superAdminComplaints: () => 'super-admin:complaints',

  // University Admin Dashboard  
  universityStats: (universityName: string, timePeriod: string) => 
    `university-admin:stats:${universityName}:${timePeriod}`,
  universityVendors: (universityName: string) => 
    `university-admin:vendors:${universityName}`,
  universityOrders: (universityName: string, limit: number, dateRange?: string) => 
    `university-admin:orders:${universityName}:${limit}:${dateRange || 'none'}`,
  universityAnalytics: (universityName: string, timePeriod: string, dateRange?: string) => 
    `university-admin:analytics:${universityName}:${timePeriod}:${dateRange || 'none'}`,
  vendorAnalytics: (universityName: string, vendorId: string, dateRange?: string) => 
    `vendor:analytics:${universityName}:${vendorId}:${dateRange || 'none'}`
} as const;

export default dashboardCache;