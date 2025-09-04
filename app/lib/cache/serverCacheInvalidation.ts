/**
 * Server-Side Cache Invalidation System
 * Provides on-demand cache revalidation using revalidateTag and revalidatePath
 * This file is server-only and should only be imported in server components or API routes
 */

import { revalidateTag, revalidatePath } from 'next/cache';
import { CACHE_TAGS } from './dataCache';

// ========================================
// Server Cache Tag Invalidation
// ========================================

/**
 * Invalidate cache by tags (server-side only)
 */
export class ServerCacheInvalidator {
  /**
   * Invalidate user-related caches
   */
  static async invalidateUsers(): Promise<void> {
    console.log('🗑️ Invalidating user caches...');
    revalidateTag(CACHE_TAGS.USERS);
    revalidateTag(CACHE_TAGS.SUPER_ADMIN);
    revalidateTag(CACHE_TAGS.DASHBOARD_STATS);
  }

  /**
   * Invalidate vendor-related caches
   */
  static async invalidateVendors(): Promise<void> {
    console.log('🗑️ Invalidating vendor caches...');
    revalidateTag(CACHE_TAGS.VENDORS);
    revalidateTag(CACHE_TAGS.SUPER_ADMIN);
    revalidateTag(CACHE_TAGS.UNIVERSITY_ADMIN);
    revalidateTag(CACHE_TAGS.ANALYTICS);
  }

  /**
   * Invalidate order-related caches
   */
  static async invalidateOrders(): Promise<void> {
    console.log('🗑️ Invalidating order caches...');
    revalidateTag(CACHE_TAGS.ORDERS);
    revalidateTag(CACHE_TAGS.ANALYTICS);
    revalidateTag(CACHE_TAGS.DASHBOARD_STATS);
    revalidateTag(CACHE_TAGS.SUPER_ADMIN);
    revalidateTag(CACHE_TAGS.UNIVERSITY_ADMIN);
  }

  /**
   * Invalidate university-related caches
   */
  static async invalidateUniversities(): Promise<void> {
    console.log('🗑️ Invalidating university caches...');
    revalidateTag(CACHE_TAGS.UNIVERSITIES);
    revalidateTag(CACHE_TAGS.SUPER_ADMIN);
    revalidateTag(CACHE_TAGS.ANALYTICS);
  }

  /**
   * Invalidate analytics caches
   */
  static async invalidateAnalytics(): Promise<void> {
    console.log('🗑️ Invalidating analytics caches...');
    revalidateTag(CACHE_TAGS.ANALYTICS);
    revalidateTag(CACHE_TAGS.DASHBOARD_STATS);
  }

  /**
   * Nuclear option - invalidate all caches
   */
  static async invalidateAll(): Promise<void> {
    console.log('💥 Invalidating ALL caches...');
    Object.values(CACHE_TAGS).forEach(tag => {
      revalidateTag(tag);
    });
  }

  /**
   * Invalidate specific tags
   */
  static async invalidateTags(tags: string[]): Promise<void> {
    console.log(`🗑️ Invalidating tags: ${tags.join(', ')}`);
    tags.forEach(tag => {
      revalidateTag(tag);
    });
  }
}

// ========================================
// Server Path-Based Invalidation
// ========================================

/**
 * Invalidate specific paths (server-side only)
 */
export class ServerPathInvalidator {
  /**
   * Invalidate dashboard pages
   */
  static async invalidateDashboards(): Promise<void> {
    console.log('🗑️ Invalidating dashboard pages...');
    const dashboardPaths = [
      '/en/super-admin-dashboard',
      '/ar/super-admin-dashboard',
      '/en/admin-dashboard',
      '/ar/admin-dashboard',
      '/en/vendor-dashboard',
      '/ar/vendor-dashboard'
    ];

    dashboardPaths.forEach(path => {
      revalidatePath(path);
    });
  }

  /**
   * Invalidate specific dashboard sections
   */
  static async invalidateDashboardSection(section: string): Promise<void> {
    console.log(`🗑️ Invalidating dashboard section: ${section}`);
    const paths = [
      `/en/super-admin-dashboard/${section}`,
      `/ar/super-admin-dashboard/${section}`
    ];

    paths.forEach(path => {
      revalidatePath(path);
    });
  }

  /**
   * Invalidate university-specific pages
   */
  static async invalidateUniversityPages(universitySlug?: string): Promise<void> {
    if (universitySlug) {
      console.log(`🗑️ Invalidating pages for university: ${universitySlug}`);
      const paths = [
        `/en/universities/${universitySlug}`,
        `/ar/universities/${universitySlug}`
      ];
      
      paths.forEach(path => {
        revalidatePath(path);
      });
    } else {
      console.log('🗑️ Invalidating all university pages...');
      revalidatePath('/en/universities');
      revalidatePath('/ar/universities');
    }
  }

  /**
   * Invalidate specific paths
   */
  static async invalidatePaths(paths: string[]): Promise<void> {
    console.log(`🗑️ Invalidating paths: ${paths.join(', ')}`);
    paths.forEach(path => {
      revalidatePath(path);
    });
  }
}

// ========================================
// Server Smart Invalidation
// ========================================

/**
 * Intelligent cache invalidation based on data changes (server-side only)
 */
export class ServerSmartInvalidator {
  /**
   * Invalidate caches when a user is created/updated/deleted
   */
  static async onUserChange(userId: string, changeType: 'create' | 'update' | 'delete'): Promise<void> {
    console.log(`🔄 User ${changeType}: ${userId}`);
    
    await ServerCacheInvalidator.invalidateUsers();
    
    if (changeType === 'delete') {
      await ServerPathInvalidator.invalidateDashboards();
    }
  }

  /**
   * Invalidate caches when a vendor is created/updated/deleted
   */
  static async onVendorChange(vendorId: string, changeType: 'create' | 'update' | 'delete', universitySlug?: string): Promise<void> {
    console.log(`🔄 Vendor ${changeType}: ${vendorId}`);
    
    await ServerCacheInvalidator.invalidateVendors();
    
    if (universitySlug) {
      await ServerPathInvalidator.invalidateUniversityPages(universitySlug);
    }
    
    if (changeType === 'create' || changeType === 'delete') {
      await ServerPathInvalidator.invalidateDashboards();
    }
  }

  /**
   * Invalidate caches when an order is created/updated
   */
  static async onOrderChange(orderId: string, changeType: 'create' | 'update' | 'status_change'): Promise<void> {
    console.log(`🔄 Order ${changeType}: ${orderId}`);
    
    await ServerCacheInvalidator.invalidateOrders();
    await ServerPathInvalidator.invalidateDashboards();
  }

  /**
   * Invalidate caches when university data changes
   */
  static async onUniversityChange(universityId: string, changeType: 'create' | 'update' | 'delete', slug?: string): Promise<void> {
    console.log(`🔄 University ${changeType}: ${universityId}`);
    
    await ServerCacheInvalidator.invalidateUniversities();
    
    if (slug) {
      await ServerPathInvalidator.invalidateUniversityPages(slug);
    }
    
    await ServerPathInvalidator.invalidateDashboards();
  }
}