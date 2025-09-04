/**
 * Cached Service Layer
 * Integrates all caching mechanisms with existing services
 * Provides a unified interface for cached data access
 */

import { getCachedAllUsers, getCachedAllVendors, getCachedAllUniversities, getCachedRecentOrders, getCachedSuperAdminStats } from './cache/reactCache';
import { getPersistedAllUsers, getPersistedAllVendors, getPersistedAllUniversities, getPersistedRecentOrders, getPersistedSuperAdminStats } from './cache/dataCache';
import { CacheHelpers, dashboardCache, CacheKeys } from './dashboardCache';
import { SmartInvalidator } from './cache/cacheInvalidation';
import { cacheMonitor } from './cache/cacheMonitoring';
import { getCacheConfig } from './cache/cacheConfig';

// Import original services - need to check if these methods exist
import { SuperAdminService as OriginalSuperAdminService } from './superAdminService';
import { AppwriteUniversityAdminService as OriginalUniversityAdminService } from './appwriteUniversityAdminService';
import type { UserData, VendorData, OrderData, UniversityData } from './models';

// ========================================
// Cached Super Admin Service
// ========================================

export class CachedSuperAdminService {
  /**
   * Get all users with multi-layer caching
   * Uses React cache for request deduplication and Next.js cache for persistence
   */
  static async getAllUsers(
    universityFilter?: string,
    roleFilter?: string,
    searchTerm?: string
  ): Promise<UserData[]> {
    const config = getCacheConfig();
    
    if (!config.enabled) {
      return await OriginalSuperAdminService.getAllUsers(universityFilter, roleFilter, searchTerm);
    }

    try {
      // Layer 1: Dashboard Cache (fastest)
      const cacheKey = CacheKeys.superAdminUsers(universityFilter, roleFilter, searchTerm);
      const dashboardCached = dashboardCache.get<UserData[]>(cacheKey);
      
      if (dashboardCached) {
        console.log('🚀 Cache HIT: Dashboard cache (users)');
        return dashboardCached;
      }

      // Layer 2: React Cache (request memoization)
      const reactCached = await getCachedAllUsers(universityFilter, roleFilter, searchTerm);
      
      // Store in dashboard cache for next time
      CacheHelpers.setWithTags(cacheKey, reactCached);
      
      console.log('🔄 Cache PARTIAL: React cache (users)');
      return reactCached;
      
    } catch (error) {
      console.error('Error in cached getAllUsers:', error);
      // Fallback to direct service call
      return await OriginalSuperAdminService.getAllUsers(universityFilter, roleFilter, searchTerm);
    }
  }

  /**
   * Get all vendors with caching
   */
  static async getAllVendors(): Promise<VendorData[]> {
    const config = getCacheConfig();
    
    if (!config.enabled) {
      return await OriginalSuperAdminService.getAllVendors();
    }

    return await CacheHelpers.getWithFallback(
      CacheKeys.superAdminVendors(),
      () => getCachedAllVendors(),
      config.ttl.medium
    );
  }

  /**
   * Get all universities with caching (long TTL since they rarely change)
   */
  static async getAllUniversities(): Promise<UniversityData[]> {
    const config = getCacheConfig();
    
    if (!config.enabled) {
      // Placeholder implementation - return empty array for now
      return [];
    }

    return await CacheHelpers.getWithFallback(
      CacheKeys.staticUniversityList(),
      () => getCachedAllUniversities(),
      config.ttl.static // Long TTL for static data
    );
  }

  /**
   * Get recent orders with short-term caching
   */
  static async getRecentOrders(limit: number = 100): Promise<OrderData[]> {
    const config = getCacheConfig();
    
    if (!config.enabled) {
      // Placeholder implementation - return empty array for now
      return [];
    }

    return await CacheHelpers.getWithFallback(
      CacheKeys.superAdminOrders(limit),
      () => getCachedRecentOrders(limit),
      config.ttl.short // Short TTL for dynamic data
    );
  }

  /**
   * Get dashboard stats with optimized caching
   */
  static async getDashboardStats() {
    const config = getCacheConfig();
    
    if (!config.enabled) {
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
    }

    return await CacheHelpers.getWithFallback(
      CacheKeys.superAdminStats(),
      () => getCachedSuperAdminStats(),
      config.ttl.medium
    );
  }

  /**
   * Get all complaints (placeholder - might not exist in original service)
   */
  static async getAllComplaints() {
    try {
      // Check if method exists on original service
      if (typeof OriginalSuperAdminService.getAllComplaints === 'function') {
        return await OriginalSuperAdminService.getAllComplaints();
      }
      return [];
    } catch (error) {
      console.warn('getAllComplaints method not available:', error);
      return [];
    }
  }

  /**
   * Create user with cache invalidation (placeholder)
   */
  static async createUser(userData: any): Promise<any> {
    try {
      // Placeholder implementation - return mock result
      const result = { id: 'mock-id', ...userData };
      
      // Invalidate related caches
      await SmartInvalidator.onUserChange(result.id, 'create');
      CacheHelpers.invalidateRelated('users');
      
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user with cache invalidation (placeholder)
   */
  static async updateUser(userId: string, updates: any): Promise<any> {
    try {
      // Placeholder implementation - return mock result
      const result = { id: userId, ...updates };
      
      // Invalidate related caches
      await SmartInvalidator.onUserChange(userId, 'update');
      CacheHelpers.invalidateRelated('users');
      
      return result;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user with cache invalidation (placeholder)
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      // Placeholder implementation - just log
      console.log(`Would delete user: ${userId}`);
      
      // Invalidate related caches
      await SmartInvalidator.onUserChange(userId, 'delete');
      CacheHelpers.invalidateRelated('users');
      
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

// ========================================
// Cached University Admin Service
// ========================================

export class CachedUniversityAdminService {
  /**
   * Get vendor performance with caching
   */
  static async getVendorPerformance(
    universityName: string,
    timePeriod: string = '30d'
  ) {
    const config = getCacheConfig();
    
    if (!config.enabled) {
      return await OriginalUniversityAdminService.getVendorPerformance(universityName, timePeriod);
    }

    return await CacheHelpers.getWithFallback(
      CacheKeys.universityVendors(universityName),
      () => OriginalUniversityAdminService.getVendorPerformance(universityName, timePeriod),
      config.ttl.medium
    );
  }

  /**
   * Get university analytics with caching
   */
  static async getAnalytics(
    universityName: string,
    timePeriod: string = '30d',
    dateRange?: { from: Date; to: Date }
  ) {
    const config = getCacheConfig();
    
    if (!config.enabled) {
      return await OriginalUniversityAdminService.getAnalytics(universityName, timePeriod, dateRange);
    }

    const dateRangeKey = dateRange ? `${dateRange.from.toISOString()}-${dateRange.to.toISOString()}` : undefined;
    
    return await CacheHelpers.getWithFallback(
      CacheKeys.universityAnalytics(universityName, timePeriod, dateRangeKey),
      () => OriginalUniversityAdminService.getAnalytics(universityName, timePeriod, dateRange),
      config.ttl.medium
    );
  }

  /**
   * Get university orders with caching
   */
  static async getUniversityOrders(
    universityName: string,
    limit: number = 1000,
    dateRange?: { from: Date; to: Date }
  ): Promise<OrderData[]> {
    const config = getCacheConfig();
    
    if (!config.enabled) {
      return await OriginalUniversityAdminService.getUniversityOrders(universityName, limit, dateRange);
    }

    const dateRangeKey = dateRange ? `${dateRange.from.toISOString()}-${dateRange.to.toISOString()}` : undefined;
    
    return await CacheHelpers.getWithFallback(
      CacheKeys.universityOrders(universityName, limit, dateRangeKey),
      () => OriginalUniversityAdminService.getUniversityOrders(universityName, limit, dateRange),
      config.ttl.short // Orders change frequently
    );
  }

  /**
   * Get vendor analytics with caching
   */
  static async getVendorAnalytics(
    universityName: string,
    vendorId: string,
    dateRange?: { from: Date; to: Date }
  ) {
    const config = getCacheConfig();
    
    if (!config.enabled) {
      return await OriginalUniversityAdminService.getVendorAnalytics(universityName, vendorId, dateRange);
    }

    const dateRangeKey = dateRange ? `${dateRange.from.toISOString()}-${dateRange.to.toISOString()}` : undefined;
    
    return await CacheHelpers.getWithFallback(
      CacheKeys.vendorAnalytics(universityName, vendorId, dateRangeKey),
      () => OriginalUniversityAdminService.getVendorAnalytics(universityName, vendorId, dateRange),
      config.ttl.medium
    );
  }

  /**
   * Update vendor with cache invalidation (placeholder)
   */
  static async updateVendor(vendorId: string, updates: any, universitySlug?: string): Promise<any> {
    try {
      let result;
      if (typeof OriginalUniversityAdminService.updateVendor === 'function') {
        result = await OriginalUniversityAdminService.updateVendor(vendorId, updates);
      } else {
        throw new Error('updateVendor method not implemented');
      }
      
      // Invalidate related caches
      await SmartInvalidator.onVendorChange(vendorId, 'update', universitySlug);
      CacheHelpers.invalidateRelated('vendors');
      
      return result;
    } catch (error) {
      console.error('Error updating vendor:', error);
      throw error;
    }
  }

  /**
   * Create order with cache invalidation (placeholder)
   */
  static async createOrder(orderData: any): Promise<any> {
    try {
      let result;
      if (typeof OriginalUniversityAdminService.createOrder === 'function') {
        result = await OriginalUniversityAdminService.createOrder(orderData);
      } else {
        throw new Error('createOrder method not implemented');
      }
      
      // Invalidate related caches
      await SmartInvalidator.onOrderChange(result.id, 'create');
      CacheHelpers.invalidateRelated('orders');
      
      return result;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Update order status with cache invalidation (placeholder)
   */
  static async updateOrderStatus(orderId: string, status: string): Promise<any> {
    try {
      let result;
      if (typeof OriginalUniversityAdminService.updateOrderStatus === 'function') {
        result = await OriginalUniversityAdminService.updateOrderStatus(orderId, status);
      } else {
        throw new Error('updateOrderStatus method not implemented');
      }
      
      // Invalidate related caches
      await SmartInvalidator.onOrderChange(orderId, 'status_change');
      CacheHelpers.invalidateRelated('orders');
      
      return result;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}

// ========================================
// Cache Management Utilities
// ========================================

export class CacheManager {
  /**
   * Warm up all critical caches
   */
  static async warmAllCaches(): Promise<void> {
    console.log('🔥 Warming all application caches...');
    
    try {
      await Promise.all([
        CachedSuperAdminService.getAllUniversities(), // Static data
        CachedSuperAdminService.getAllVendors(),      // Semi-static data
        CacheHelpers.preloadCriticalData()            // Dashboard cache
      ]);
      
      console.log('✅ All caches warmed successfully');
    } catch (error) {
      console.error('❌ Error warming caches:', error);
    }
  }

  /**
   * Get comprehensive cache status
   */
  static getCacheStatus(): {
    dashboardCache: any;
    monitoring: any;
    config: any;
  } {
    return {
      dashboardCache: dashboardCache.getStats(),
      monitoring: cacheMonitor.generateHealthReport(),
      config: getCacheConfig()
    };
  }

  /**
   * Emergency cache flush
   */
  static emergencyFlush(): void {
    console.warn('🚨 EMERGENCY: Flushing all caches');
    dashboardCache.clear();
    // Additional cache clearing would go here
  }

  /**
   * Optimize cache performance
   */
  static async optimizeCache(): Promise<void> {
    console.log('⚡ Optimizing cache performance...');
    
    // Clean expired entries
    dashboardCache.cleanExpired();
    
    // Get health metrics
    const health = dashboardCache.getHealthMetrics();
    
    if (!health.healthy) {
      console.warn('🔧 Cache health issues detected:', health.issues);
      console.log('💡 Recommendations:', health.recommendations);
    }
  }
}

// ========================================
// Export cached services as default
// ========================================

// Export the cached services to replace direct service usage
export { CachedSuperAdminService as SuperAdminService };
export { CachedUniversityAdminService as UniversityAdminService };
// CacheManager is already exported as a class above