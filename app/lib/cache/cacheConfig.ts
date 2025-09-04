/**
 * Cache Configuration System
 * Central configuration for all caching mechanisms
 * Environment-specific cache settings
 */

// ========================================
// Environment Detection
// ========================================

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isTest = process.env.NODE_ENV === 'test';

// ========================================
// Global Cache Configuration
// ========================================

export interface CacheConfig {
  enabled: boolean;
  ttl: {
    short: number;
    medium: number;
    long: number;
    static: number;
  };
  revalidation: {
    background: boolean;
    onDemand: boolean;
    scheduled: boolean;
  };
  storage: {
    type: 'memory' | 'redis' | 'hybrid';
    maxSize?: number;
    compression?: boolean;
  };
  monitoring: {
    enabled: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
    metrics: boolean;
  };
}

/**
 * Production cache configuration - optimized for performance
 */
export const PRODUCTION_CACHE_CONFIG: CacheConfig = {
  enabled: true,
  ttl: {
    short: 30,           // 30 seconds
    medium: 5 * 60,      // 5 minutes
    long: 30 * 60,       // 30 minutes
    static: 24 * 60 * 60 // 24 hours
  },
  revalidation: {
    background: true,
    onDemand: true,
    scheduled: true
  },
  storage: {
    type: 'hybrid',
    maxSize: 100 * 1024 * 1024, // 100MB
    compression: true
  },
  monitoring: {
    enabled: true,
    logLevel: 'warn',
    metrics: true
  }
};

/**
 * Development cache configuration - optimized for debugging
 */
export const DEVELOPMENT_CACHE_CONFIG: CacheConfig = {
  enabled: true,
  ttl: {
    short: 10,           // 10 seconds
    medium: 30,          // 30 seconds
    long: 2 * 60,        // 2 minutes
    static: 5 * 60       // 5 minutes
  },
  revalidation: {
    background: false,
    onDemand: true,
    scheduled: false
  },
  storage: {
    type: 'memory',
    maxSize: 10 * 1024 * 1024, // 10MB
    compression: false
  },
  monitoring: {
    enabled: true,
    logLevel: 'debug',
    metrics: true
  }
};

/**
 * Test cache configuration - minimal caching for predictable tests
 */
export const TEST_CACHE_CONFIG: CacheConfig = {
  enabled: false,
  ttl: {
    short: 1,
    medium: 1,
    long: 1,
    static: 1
  },
  revalidation: {
    background: false,
    onDemand: false,
    scheduled: false
  },
  storage: {
    type: 'memory',
    maxSize: 1024 * 1024, // 1MB
    compression: false
  },
  monitoring: {
    enabled: false,
    logLevel: 'error',
    metrics: false
  }
};

/**
 * Get current cache configuration based on environment
 */
export function getCacheConfig(): CacheConfig {
  if (isProduction) {
    return PRODUCTION_CACHE_CONFIG;
  } else if (isTest) {
    return TEST_CACHE_CONFIG;
  } else {
    return DEVELOPMENT_CACHE_CONFIG;
  }
}

// ========================================
// Feature-Specific Cache Configurations
// ========================================

/**
 * Data type specific cache settings
 */
export const DATA_CACHE_CONFIGS = {
  // Critical data that affects revenue/operations
  critical: {
    ttl: getCacheConfig().ttl.short,
    revalidate: true,
    tags: ['critical'],
    staleWhileRevalidate: true
  },
  
  // User-facing data that should be fresh
  userFacing: {
    ttl: getCacheConfig().ttl.medium,
    revalidate: true,
    tags: ['user-facing'],
    staleWhileRevalidate: true
  },
  
  // Analytics and reporting data
  analytics: {
    ttl: getCacheConfig().ttl.medium,
    revalidate: true,
    tags: ['analytics'],
    staleWhileRevalidate: true
  },
  
  // Static reference data
  reference: {
    ttl: getCacheConfig().ttl.static,
    revalidate: false,
    tags: ['reference'],
    staleWhileRevalidate: false
  },
  
  // Administrative data
  admin: {
    ttl: getCacheConfig().ttl.short,
    revalidate: true,
    tags: ['admin'],
    staleWhileRevalidate: false
  }
};

// ========================================
// Page-Level Cache Settings
// ========================================

/**
 * Route-specific cache configurations
 */
export const ROUTE_CACHE_CONFIGS = {
  // Landing and marketing pages
  marketing: {
    static: true,
    revalidate: getCacheConfig().ttl.static,
    prefetch: true,
    staleTimes: {
      static: 5 * 60,
      dynamic: 0
    }
  },
  
  // Authentication pages
  auth: {
    static: false,
    revalidate: getCacheConfig().ttl.long,
    prefetch: false,
    staleTimes: {
      static: 2 * 60,
      dynamic: 0
    }
  },
  
  // Dashboard pages
  dashboard: {
    static: false,
    revalidate: getCacheConfig().ttl.medium,
    prefetch: false,
    staleTimes: {
      static: 30,
      dynamic: 0
    }
  },
  
  // Real-time pages
  realtime: {
    static: false,
    revalidate: 0,
    prefetch: false,
    staleTimes: {
      static: 0,
      dynamic: 0
    }
  }
};

// ========================================
// Cache Strategy Selector
// ========================================

/**
 * Select appropriate cache strategy based on data characteristics
 */
export function selectCacheStrategy(characteristics: {
  updateFrequency: 'high' | 'medium' | 'low';
  importance: 'critical' | 'important' | 'normal';
  userType: 'public' | 'authenticated' | 'admin';
  dataSize: 'small' | 'medium' | 'large';
}): {
  ttl: number;
  revalidate: boolean;
  strategy: 'no-cache' | 'cache-first' | 'network-first' | 'stale-while-revalidate';
} {
  const { updateFrequency, importance, userType, dataSize } = characteristics;
  
  // Critical data with high update frequency - minimal caching
  if (importance === 'critical' && updateFrequency === 'high') {
    return {
      ttl: getCacheConfig().ttl.short,
      revalidate: true,
      strategy: 'network-first'
    };
  }
  
  // Admin data - short cache
  if (userType === 'admin') {
    return {
      ttl: getCacheConfig().ttl.short,
      revalidate: true,
      strategy: 'stale-while-revalidate'
    };
  }
  
  // Public data with low update frequency - aggressive caching
  if (userType === 'public' && updateFrequency === 'low') {
    return {
      ttl: getCacheConfig().ttl.static,
      revalidate: false,
      strategy: 'cache-first'
    };
  }
  
  // Large data - shorter cache to manage memory
  if (dataSize === 'large') {
    return {
      ttl: getCacheConfig().ttl.medium,
      revalidate: true,
      strategy: 'stale-while-revalidate'
    };
  }
  
  // Default strategy
  return {
    ttl: getCacheConfig().ttl.medium,
    revalidate: true,
    strategy: 'stale-while-revalidate'
  };
}

// ========================================
// Cache Headers Configuration
// ========================================

/**
 * Generate appropriate cache headers for responses
 */
export function generateCacheHeaders(config: {
  maxAge: number;
  staleWhileRevalidate?: number;
  public?: boolean;
  mustRevalidate?: boolean;
}): Record<string, string> {
  const { maxAge, staleWhileRevalidate, public: isPublic = true, mustRevalidate = false } = config;
  
  let cacheControl = isPublic ? 'public' : 'private';
  cacheControl += `, max-age=${maxAge}`;
  
  if (staleWhileRevalidate) {
    cacheControl += `, stale-while-revalidate=${staleWhileRevalidate}`;
  }
  
  if (mustRevalidate) {
    cacheControl += ', must-revalidate';
  }
  
  return {
    'Cache-Control': cacheControl,
    'Vary': 'Accept-Encoding, Accept-Language'
  };
}

// ========================================
// Runtime Cache Configuration
// ========================================

/**
 * Dynamic cache configuration that can be updated at runtime
 */
export class RuntimeCacheConfig {
  private static instance: RuntimeCacheConfig;
  private config: CacheConfig;
  private overrides: Map<string, Partial<CacheConfig>> = new Map();

  private constructor() {
    this.config = getCacheConfig();
  }

  static getInstance(): RuntimeCacheConfig {
    if (!RuntimeCacheConfig.instance) {
      RuntimeCacheConfig.instance = new RuntimeCacheConfig();
    }
    return RuntimeCacheConfig.instance;
  }

  /**
   * Get current configuration
   */
  getConfig(): CacheConfig {
    return { ...this.config };
  }

  /**
   * Update cache configuration
   */
  updateConfig(updates: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...updates };
    console.log('🔧 Cache configuration updated:', updates);
  }

  /**
   * Set feature-specific override
   */
  setOverride(feature: string, override: Partial<CacheConfig>): void {
    this.overrides.set(feature, override);
    console.log(`🔧 Cache override set for ${feature}:`, override);
  }

  /**
   * Get configuration for a specific feature
   */
  getFeatureConfig(feature: string): CacheConfig {
    const override = this.overrides.get(feature);
    return override ? { ...this.config, ...override } : this.config;
  }

  /**
   * Remove feature override
   */
  removeOverride(feature: string): void {
    this.overrides.delete(feature);
    console.log(`🔧 Cache override removed for ${feature}`);
  }

  /**
   * Enable/disable caching globally
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    console.log(`🔧 Caching ${enabled ? 'enabled' : 'disabled'} globally`);
  }

  /**
   * Emergency cache disable (for incidents)
   */
  emergencyDisable(): void {
    this.config = {
      ...this.config,
      enabled: false,
      ttl: {
        short: 0,
        medium: 0,
        long: 0,
        static: 0
      }
    };
    console.warn('🚨 EMERGENCY: All caching disabled');
  }
}

// ========================================
// Cache Performance Profiler
// ========================================

/**
 * Profile cache performance and suggest optimizations
 */
export class CacheProfiler {
  private static measurements: Map<string, number[]> = new Map();

  /**
   * Measure cache operation performance
   */
  static measure<T>(operation: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    if (!this.measurements.has(operation)) {
      this.measurements.set(operation, []);
    }
    
    this.measurements.get(operation)!.push(duration);
    
    return result;
  }

  /**
   * Get performance statistics
   */
  static getStats(operation?: string) {
    if (operation) {
      const measurements = this.measurements.get(operation) || [];
      return this.calculateStats(measurements);
    }

    // Return stats for all operations
    const allStats: Record<string, any> = {};
    this.measurements.forEach((measurements, op) => {
      allStats[op] = this.calculateStats(measurements);
    });
    
    return allStats;
  }

  private static calculateStats(measurements: number[]) {
    if (measurements.length === 0) {
      return { count: 0, avg: 0, min: 0, max: 0, median: 0 };
    }

    const sorted = [...measurements].sort((a, b) => a - b);
    const sum = measurements.reduce((a, b) => a + b, 0);
    
    return {
      count: measurements.length,
      avg: sum / measurements.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)]
    };
  }

  /**
   * Clear measurements
   */
  static clear(): void {
    this.measurements.clear();
  }

  /**
   * Get performance recommendations
   */
  static getRecommendations(): string[] {
    const recommendations: string[] = [];
    const allStats = this.getStats();

    Object.entries(allStats).forEach(([operation, stats]) => {
      if (stats.avg > 100) {
        recommendations.push(`Consider optimizing ${operation} - average time: ${stats.avg.toFixed(2)}ms`);
      }
      
      if (stats.p95 > 500) {
        recommendations.push(`${operation} has high P95 latency: ${stats.p95.toFixed(2)}ms`);
      }
    });

    return recommendations;
  }
}

// Export singleton instance
export const runtimeCacheConfig = RuntimeCacheConfig.getInstance();