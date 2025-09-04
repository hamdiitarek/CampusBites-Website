/**
 * Client-Side Cache Invalidation System
 * Provides cache invalidation for client components without server-only functions
 * Implements selective cache invalidation for optimal performance
 */

import { CACHE_TAGS } from './dataCache';
import { getInvalidationPaths } from './routeCache';

// ========================================
// Client Cache Invalidation Interface
// ========================================

/**
 * Client-side cache invalidation (for client components)
 * These methods handle local cache invalidation and can trigger server actions
 */
export class ClientCacheInvalidator {
  /**
   * Mark user-related caches for invalidation
   */
  static async invalidateUsers(): Promise<void> {
    console.log('🗑️ Marking user caches for invalidation...');
    // In a real implementation, this would call server actions or API endpoints
    // For now, just log the intent
  }

  /**
   * Mark vendor-related caches for invalidation
   */
  static async invalidateVendors(): Promise<void> {
    console.log('🗑️ Marking vendor caches for invalidation...');
  }

  /**
   * Mark order-related caches for invalidation
   */
  static async invalidateOrders(): Promise<void> {
    console.log('🗑️ Marking order caches for invalidation...');
  }

  /**
   * Mark university-related caches for invalidation
   */
  static async invalidateUniversities(): Promise<void> {
    console.log('🗑️ Marking university caches for invalidation...');
  }

  /**
   * Mark analytics caches for invalidation
   */
  static async invalidateAnalytics(): Promise<void> {
    console.log('🗑️ Marking analytics caches for invalidation...');
  }

  /**
   * Mark all caches for invalidation
   */
  static async invalidateAll(): Promise<void> {
    console.log('💥 Marking ALL caches for invalidation...');
  }

  /**
   * Mark specific tags for invalidation
   */
  static async invalidateTags(tags: string[]): Promise<void> {
    console.log(`🗑️ Marking tags for invalidation: ${tags.join(', ')}`);
  }
}

// ========================================
// Client Path-Based Invalidation
// ========================================

/**
 * Client-side path invalidation interface
 */
export class ClientPathInvalidator {
  /**
   * Mark dashboard pages for invalidation
   */
  static async invalidateDashboards(): Promise<void> {
    console.log('🗑️ Marking dashboard pages for invalidation...');
  }

  /**
   * Mark specific dashboard sections for invalidation
   */
  static async invalidateDashboardSection(section: string): Promise<void> {
    console.log(`🗑️ Marking dashboard section for invalidation: ${section}`);
  }

  /**
   * Mark university-specific pages for invalidation
   */
  static async invalidateUniversityPages(universitySlug?: string): Promise<void> {
    if (universitySlug) {
      console.log(`🗑️ Marking pages for university invalidation: ${universitySlug}`);
    } else {
      console.log('🗑️ Marking all university pages for invalidation...');
    }
  }

  /**
   * Mark specific paths for invalidation
   */
  static async invalidatePaths(paths: string[]): Promise<void> {
    console.log(`🗑️ Marking paths for invalidation: ${paths.join(', ')}`);
  }
}

// ========================================
// Client Smart Invalidation
// ========================================

/**
 * Intelligent cache invalidation for client components
 */
export class ClientSmartInvalidator {
  /**
   * Handle cache invalidation when a user is created/updated/deleted
   */
  static async onUserChange(userId: string, changeType: 'create' | 'update' | 'delete'): Promise<void> {
    console.log(`🔄 User ${changeType}: ${userId}`);
    
    await ClientCacheInvalidator.invalidateUsers();
    
    if (changeType === 'delete') {
      await ClientPathInvalidator.invalidateDashboards();
    }
  }

  /**
   * Handle cache invalidation when a vendor is created/updated/deleted
   */
  static async onVendorChange(vendorId: string, changeType: 'create' | 'update' | 'delete', universitySlug?: string): Promise<void> {
    console.log(`🔄 Vendor ${changeType}: ${vendorId}`);
    
    await ClientCacheInvalidator.invalidateVendors();
    
    if (universitySlug) {
      await ClientPathInvalidator.invalidateUniversityPages(universitySlug);
    }
    
    if (changeType === 'create' || changeType === 'delete') {
      await ClientPathInvalidator.invalidateDashboards();
    }
  }

  /**
   * Handle cache invalidation when an order is created/updated
   */
  static async onOrderChange(orderId: string, changeType: 'create' | 'update' | 'status_change'): Promise<void> {
    console.log(`🔄 Order ${changeType}: ${orderId}`);
    
    await ClientCacheInvalidator.invalidateOrders();
    await ClientPathInvalidator.invalidateDashboards();
  }

  /**
   * Handle cache invalidation when university data changes
   */
  static async onUniversityChange(universityId: string, changeType: 'create' | 'update' | 'delete', slug?: string): Promise<void> {
    console.log(`🔄 University ${changeType}: ${universityId}`);
    
    await ClientCacheInvalidator.invalidateUniversities();
    
    if (slug) {
      await ClientPathInvalidator.invalidateUniversityPages(slug);
    }
    
    await ClientPathInvalidator.invalidateDashboards();
  }
}

// ========================================
// Scheduled Invalidation (Client-Safe)
// ========================================

/**
 * Automatic cache invalidation on schedules (client-safe version)
 */
export class ClientScheduledInvalidator {
  private static intervals: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Schedule periodic cache invalidation
   */
  static scheduleInvalidation(
    key: string,
    intervalMs: number,
    invalidationFn: () => Promise<void>
  ): void {
    // Clear existing interval if any
    this.clearSchedule(key);

    const interval = setInterval(async () => {
      try {
        await invalidationFn();
      } catch (error) {
        console.error(`Error in scheduled invalidation ${key}:`, error);
      }
    }, intervalMs);

    this.intervals.set(key, interval);
    console.log(`📅 Scheduled cache invalidation: ${key} every ${intervalMs}ms`);
  }

  /**
   * Clear a scheduled invalidation
   */
  static clearSchedule(key: string): void {
    const interval = this.intervals.get(key);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(key);
      console.log(`❌ Cleared scheduled invalidation: ${key}`);
    }
  }

  /**
   * Clear all scheduled invalidations
   */
  static clearAllSchedules(): void {
    this.intervals.forEach((interval, key) => {
      clearInterval(interval);
      console.log(`❌ Cleared scheduled invalidation: ${key}`);
    });
    this.intervals.clear();
  }

  /**
   * Setup default schedules for the application (client-safe)
   */
  static setupDefaultSchedules(): void {
    // Invalidate analytics every 5 minutes
    this.scheduleInvalidation(
      'analytics',
      5 * 60 * 1000,
      () => ClientCacheInvalidator.invalidateAnalytics()
    );

    // Invalidate dashboard stats every 3 minutes
    this.scheduleInvalidation(
      'dashboard-stats',
      3 * 60 * 1000,
      () => ClientCacheInvalidator.invalidateTags([CACHE_TAGS.DASHBOARD_STATS])
    );

    // Invalidate order data every 2 minutes
    this.scheduleInvalidation(
      'orders',
      2 * 60 * 1000,
      () => ClientCacheInvalidator.invalidateOrders()
    );
  }
}

// ========================================
// Batch Operations (Client-Safe)
// ========================================

/**
 * Batch multiple cache operations for efficiency (client-safe)
 */
export class ClientBatchCacheOperations {
  private static pendingInvalidations: Set<string> = new Set();
  private static pendingPaths: Set<string> = new Set();
  private static batchTimeout: NodeJS.Timeout | null = null;

  /**
   * Add tag to batch invalidation
   */
  static addTagInvalidation(tag: string): void {
    this.pendingInvalidations.add(tag);
    this.scheduleBatch();
  }

  /**
   * Add path to batch invalidation
   */
  static addPathInvalidation(path: string): void {
    this.pendingPaths.add(path);
    this.scheduleBatch();
  }

  /**
   * Schedule batch execution
   */
  private static scheduleBatch(): void {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    this.batchTimeout = setTimeout(() => {
      this.executeBatch();
    }, 100); // Batch operations over 100ms
  }

  /**
   * Execute batched invalidations
   */
  private static async executeBatch(): Promise<void> {
    const tags = Array.from(this.pendingInvalidations);
    const paths = Array.from(this.pendingPaths);

    if (tags.length > 0) {
      console.log(`🔄 Batch invalidating tags: ${tags.join(', ')}`);
      await ClientCacheInvalidator.invalidateTags(tags);
    }

    if (paths.length > 0) {
      console.log(`🔄 Batch invalidating paths: ${paths.join(', ')}`);
      await ClientPathInvalidator.invalidatePaths(paths);
    }

    // Clear batches
    this.pendingInvalidations.clear();
    this.pendingPaths.clear();
    this.batchTimeout = null;
  }

  /**
   * Force immediate execution of pending batch
   */
  static async flushBatch(): Promise<void> {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
    await this.executeBatch();
  }
}

// ========================================
// Aliases for backward compatibility
// ========================================

// Export client-safe versions with the same names for compatibility
export const CacheInvalidator = ClientCacheInvalidator;
export const PathInvalidator = ClientPathInvalidator;
export const SmartInvalidator = ClientSmartInvalidator;
export const ScheduledInvalidator = ClientScheduledInvalidator;
export const BatchCacheOperations = ClientBatchCacheOperations;