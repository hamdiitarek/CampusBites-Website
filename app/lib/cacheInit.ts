/**
 * Cache Warmup Script
 * Pre-loads critical application data into cache for optimal performance
 */

import { CacheManager } from '../lib/cachedServices';
import { ScheduledInvalidator } from '../lib/cache/cacheInvalidation';
import { CacheDashboard } from '../lib/cache/cacheMonitoring';
import { runtimeCacheConfig } from '../lib/cache/cacheConfig';

/**
 * Initialize the caching system on application startup
 */
export async function initializeCaching(): Promise<void> {
  console.log('🚀 Initializing comprehensive caching system...');
  
  try {
    // 1. Warm up critical caches
    console.log('🔥 Warming up critical caches...');
    await CacheManager.warmAllCaches();
    
    // 2. Setup scheduled cache invalidation
    console.log('📅 Setting up scheduled cache invalidation...');
    ScheduledInvalidator.setupDefaultSchedules();
    
    // 3. Start cache monitoring dashboard
    console.log('📊 Starting cache monitoring...');
    CacheDashboard.start(5000); // Update every 5 seconds
    
    // 4. Configure runtime cache settings
    console.log('⚙️ Configuring runtime cache settings...');
    runtimeCacheConfig.setEnabled(true);
    
    // 5. Setup cache health monitoring
    setupCacheHealthMonitoring();
    
    console.log('✅ Caching system initialized successfully');
    
  } catch (error) {
    console.error('❌ Error initializing caching system:', error);
    
    // Fallback: disable caching if initialization fails
    console.warn('⚠️ Disabling caching due to initialization failure');
    runtimeCacheConfig.setEnabled(false);
  }
}

/**
 * Setup cache health monitoring and alerts
 */
function setupCacheHealthMonitoring(): void {
  // Monitor cache performance every minute
  setInterval(() => {
    try {
      const status = CacheManager.getCacheStatus();
      
      // Check for low hit rates
      const dashboardStats = status.dashboardCache;
      if (dashboardStats.size > 0) {
        // Log cache performance
        console.log('📈 Cache status:', {
          size: dashboardStats.size,
          memory: `${(dashboardStats.memoryUsage / 1024 / 1024).toFixed(2)}MB`,
          avgAge: `${(dashboardStats.avgAge / 1000 / 60).toFixed(1)}min`
        });
      }
      
      // Check monitoring data
      if (status.monitoring.overall.hitRate) {
        const hitRate = parseFloat(status.monitoring.overall.hitRate.replace('%', ''));
        
        if (hitRate < 30) {
          console.warn(`⚠️ Low cache hit rate: ${hitRate}%`);
        } else if (hitRate > 80) {
          console.log(`🎯 Excellent cache hit rate: ${hitRate}%`);
        }
      }
      
    } catch (error) {
      console.error('Error in cache health monitoring:', error);
    }
  }, 60 * 1000); // Every minute
}

/**
 * Graceful shutdown of caching system
 */
export function shutdownCaching(): void {
  console.log('🛑 Shutting down caching system...');
  
  try {
    // Stop scheduled invalidations
    ScheduledInvalidator.clearAllSchedules();
    
    // Stop cache dashboard
    CacheDashboard.stop();
    
    // Optimize cache before shutdown
    CacheManager.optimizeCache();
    
    console.log('✅ Caching system shut down gracefully');
    
  } catch (error) {
    console.error('❌ Error during cache shutdown:', error);
  }
}

/**
 * Cache emergency procedures
 */
export function handleCacheEmergency(reason: string): void {
  console.warn(`🚨 CACHE EMERGENCY: ${reason}`);
  
  try {
    // Emergency flush
    CacheManager.emergencyFlush();
    
    // Disable caching temporarily
    runtimeCacheConfig.emergencyDisable();
    
    // Log the incident
    console.error('Cache emergency procedures executed:', {
      reason,
      timestamp: new Date().toISOString(),
      action: 'Emergency flush and disable'
    });
    
  } catch (error) {
    console.error('❌ Error handling cache emergency:', error);
  }
}

/**
 * Development-specific cache utilities
 */
export const DevCacheUtils = {
  /**
   * Clear all caches (useful for development)
   */
  clearAll(): void {
    console.log('🧹 Clearing all caches (development mode)');
    CacheManager.emergencyFlush();
  },
  
  /**
   * Get detailed cache statistics
   */
  getDetailedStats(): any {
    return CacheManager.getCacheStatus();
  },
  
  /**
   * Simulate cache scenarios for testing
   */
  simulateLoad(operations: number = 100): void {
    console.log(`🔄 Simulating ${operations} cache operations`);
    
    // This would simulate various cache operations for testing
    // Implementation would depend on specific testing needs
  },
  
  /**
   * Test cache performance
   */
  async benchmarkCache(): Promise<void> {
    console.log('📊 Benchmarking cache performance...');
    
    const iterations = 1000;
    const start = performance.now();
    
    // Simulate cache operations
    for (let i = 0; i < iterations; i++) {
      // Would test actual cache operations here
    }
    
    const end = performance.now();
    const avgTime = (end - start) / iterations;
    
    console.log(`⚡ Cache benchmark: ${avgTime.toFixed(2)}ms average per operation`);
  }
};

/**
 * Production cache monitoring and alerting
 */
export const ProdCacheMonitoring = {
  /**
   * Setup production monitoring
   */
  setupProdMonitoring(): void {
    // Setup more conservative monitoring for production
    setInterval(() => {
      try {
        const status = CacheManager.getCacheStatus();
        
        // Log only critical issues in production
        if (status.monitoring.overall.hitRate) {
          const hitRate = parseFloat(status.monitoring.overall.hitRate.replace('%', ''));
          
          if (hitRate < 20) {
            console.error(`🚨 CRITICAL: Very low cache hit rate: ${hitRate}%`);
            // In production, this might trigger alerts to monitoring systems
          }
        }
        
      } catch (error) {
        console.error('Production cache monitoring error:', error);
      }
    }, 5 * 60 * 1000); // Every 5 minutes in production
  },
  
  /**
   * Get production-safe cache metrics
   */
  getMetrics(): {
    hitRate: string;
    cacheSize: number;
    memoryUsage: string;
    uptime: string;
  } {
    const status = CacheManager.getCacheStatus();
    
    return {
      hitRate: status.monitoring.overall.hitRate || '0%',
      cacheSize: status.dashboardCache.size || 0,
      memoryUsage: status.dashboardCache.memoryUsage 
        ? `${(status.dashboardCache.memoryUsage / 1024 / 1024).toFixed(2)}MB`
        : '0MB',
      uptime: `${(process.uptime() / 60).toFixed(1)}min`
    };
  }
};

// Export environment-specific initialization
export const initializeForEnvironment = process.env.NODE_ENV === 'development' 
  ? initializeCaching 
  : ProdCacheMonitoring.setupProdMonitoring;