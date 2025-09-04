/**
 * Cache Monitoring and Debugging System
 * Provides comprehensive cache observability and debugging tools
 */

import { getCacheConfig, CacheProfiler } from './cacheConfig';

// ========================================
// Cache Metrics Collection
// ========================================

export interface CacheMetrics {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  memoryUsage: number;
  avgResponseTime: number;
  errorRate: number;
  lastUpdated: Date;
}

export interface CacheOperation {
  operation: 'get' | 'set' | 'delete' | 'invalidate';
  key: string;
  hit: boolean;
  duration: number;
  timestamp: Date;
  size?: number;
  error?: string;
}

/**
 * Central cache monitoring system
 */
export class CacheMonitor {
  private static instance: CacheMonitor;
  private metrics: Map<string, CacheMetrics> = new Map();
  private operations: CacheOperation[] = [];
  private readonly maxOperations = 1000;
  private listeners: ((operation: CacheOperation) => void)[] = [];

  private constructor() {
    this.startCleanupTask();
  }

  static getInstance(): CacheMonitor {
    if (!CacheMonitor.instance) {
      CacheMonitor.instance = new CacheMonitor();
    }
    return CacheMonitor.instance;
  }

  /**
   * Record cache operation
   */
  recordOperation(operation: CacheOperation): void {
    // Add to operations log
    this.operations.unshift(operation);
    
    // Keep only recent operations
    if (this.operations.length > this.maxOperations) {
      this.operations = this.operations.slice(0, this.maxOperations);
    }

    // Update metrics
    this.updateMetrics(operation);

    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(operation);
      } catch (error) {
        console.error('Error in cache monitor listener:', error);
      }
    });

    // Log in development
    if (getCacheConfig().monitoring.logLevel === 'debug') {
      console.log(`🔍 Cache ${operation.operation}: ${operation.key} (${operation.hit ? 'HIT' : 'MISS'}) - ${operation.duration.toFixed(2)}ms`);
    }
  }

  /**
   * Update metrics for a cache key
   */
  private updateMetrics(operation: CacheOperation): void {
    const key = this.getCacheGroup(operation.key);
    let metrics = this.metrics.get(key);

    if (!metrics) {
      metrics = {
        hits: 0,
        misses: 0,
        evictions: 0,
        size: 0,
        memoryUsage: 0,
        avgResponseTime: 0,
        errorRate: 0,
        lastUpdated: new Date()
      };
      this.metrics.set(key, metrics);
    }

    // Update counters
    if (operation.hit) {
      metrics.hits++;
    } else {
      metrics.misses++;
    }

    if (operation.operation === 'delete' || operation.operation === 'invalidate') {
      metrics.evictions++;
    }

    if (operation.error) {
      metrics.errorRate = (metrics.errorRate + 1) / 2; // Simple moving average
    }

    // Update response time (moving average)
    const totalOps = metrics.hits + metrics.misses;
    metrics.avgResponseTime = ((metrics.avgResponseTime * (totalOps - 1)) + operation.duration) / totalOps;

    // Update size
    if (operation.size) {
      metrics.size += operation.size;
    }

    metrics.lastUpdated = new Date();
  }

  /**
   * Get cache group from key (first part before colon)
   */
  private getCacheGroup(key: string): string {
    return key.split(':')[0] || 'unknown';
  }

  /**
   * Get metrics for a specific cache group
   */
  getMetrics(group?: string): CacheMetrics | Map<string, CacheMetrics> {
    if (group) {
      return this.metrics.get(group) || this.createEmptyMetrics();
    }
    return new Map(this.metrics);
  }

  /**
   * Get recent operations
   */
  getRecentOperations(limit: number = 50): CacheOperation[] {
    return this.operations.slice(0, limit);
  }

  /**
   * Get operations for a specific key pattern
   */
  getOperationsForKey(keyPattern: string): CacheOperation[] {
    return this.operations.filter(op => 
      op.key.includes(keyPattern) || op.key.match(new RegExp(keyPattern))
    );
  }

  /**
   * Add listener for cache operations
   */
  addListener(listener: (operation: CacheOperation) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove listener
   */
  removeListener(listener: (operation: CacheOperation) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Generate cache health report
   */
  generateHealthReport(): {
    overall: {
      hitRate: string;
      avgResponseTime: number;
      totalOperations: number;
      errorRate: string;
      cacheGroups: number;
    };
    groups: Record<string, {
      hitRate: string;
      avgResponseTime: number;
      operations: number;
      memoryUsage: number;
    }>;
    recommendations: string[];
  } {
    const allMetrics = Array.from(this.metrics.values());
    const totalHits = allMetrics.reduce((sum, m) => sum + m.hits, 0);
    const totalMisses = allMetrics.reduce((sum, m) => sum + m.misses, 0);
    const totalOps = totalHits + totalMisses;
    const avgResponseTime = allMetrics.reduce((sum, m) => sum + m.avgResponseTime, 0) / allMetrics.length || 0;
    const avgErrorRate = allMetrics.reduce((sum, m) => sum + m.errorRate, 0) / allMetrics.length || 0;

    const groups: Record<string, any> = {};
    this.metrics.forEach((metrics, group) => {
      const groupOps = metrics.hits + metrics.misses;
      groups[group] = {
        hitRate: groupOps > 0 ? ((metrics.hits / groupOps) * 100).toFixed(2) + '%' : '0%',
        avgResponseTime: metrics.avgResponseTime,
        operations: groupOps,
        memoryUsage: metrics.memoryUsage
      };
    });

    const recommendations = this.generateRecommendations();

    return {
      overall: {
        hitRate: totalOps > 0 ? ((totalHits / totalOps) * 100).toFixed(2) + '%' : '0%',
        avgResponseTime,
        totalOperations: totalOps,
        errorRate: (avgErrorRate * 100).toFixed(2) + '%',
        cacheGroups: this.metrics.size
      },
      groups,
      recommendations
    };
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    this.metrics.forEach((metrics, group) => {
      const totalOps = metrics.hits + metrics.misses;
      const hitRate = totalOps > 0 ? (metrics.hits / totalOps) : 0;

      if (hitRate < 0.5) {
        recommendations.push(`Low hit rate for ${group}: ${(hitRate * 100).toFixed(1)}% - consider increasing TTL or optimizing cache keys`);
      }

      if (metrics.avgResponseTime > 100) {
        recommendations.push(`High response time for ${group}: ${metrics.avgResponseTime.toFixed(2)}ms - consider optimizing data retrieval or reducing cache size`);
      }

      if (metrics.evictions > totalOps * 0.1) {
        recommendations.push(`High eviction rate for ${group} - consider increasing cache size or reducing TTL`);
      }
    });

    // Add profiler recommendations
    recommendations.push(...CacheProfiler.getRecommendations());

    return recommendations;
  }

  /**
   * Clear all metrics and operations
   */
  clear(): void {
    this.metrics.clear();
    this.operations = [];
    console.log('🧹 Cache monitoring data cleared');
  }

  /**
   * Start cleanup task to prevent memory leaks
   */
  private startCleanupTask(): void {
    setInterval(() => {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
      
      // Clean old operations
      this.operations = this.operations.filter(op => op.timestamp > cutoff);
      
      // Reset metrics that haven't been updated recently
      this.metrics.forEach((metrics, key) => {
        if (metrics.lastUpdated < cutoff) {
          this.metrics.delete(key);
        }
      });
    }, 60 * 60 * 1000); // Run every hour
  }

  private createEmptyMetrics(): CacheMetrics {
    return {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0,
      memoryUsage: 0,
      avgResponseTime: 0,
      errorRate: 0,
      lastUpdated: new Date()
    };
  }
}

// ========================================
// Cache Debugging Tools
// ========================================

/**
 * Cache debugging utilities
 */
export class CacheDebugger {
  /**
   * Debug cache state for a specific key pattern
   */
  static debugKeyPattern(pattern: string): {
    matchingKeys: string[];
    operations: CacheOperation[];
    metrics: any;
  } {
    const monitor = CacheMonitor.getInstance();
    const operations = monitor.getOperationsForKey(pattern);
    const matchingKeys = Array.from(new Set(operations.map(op => op.key)));
    
    return {
      matchingKeys,
      operations,
      metrics: monitor.getMetrics()
    };
  }

  /**
   * Simulate cache scenarios for testing
   */
  static simulateScenario(scenario: {
    operations: Array<{
      type: 'get' | 'set' | 'delete';
      key: string;
      simulateHit?: boolean;
      delay?: number;
    }>;
  }): void {
    const monitor = CacheMonitor.getInstance();
    
    scenario.operations.forEach((op, index) => {
      setTimeout(() => {
        monitor.recordOperation({
          operation: op.type,
          key: op.key,
          hit: op.simulateHit || Math.random() > 0.3,
          duration: Math.random() * 100,
          timestamp: new Date()
        });
      }, (op.delay || 0) + index * 10);
    });
  }

  /**
   * Export cache monitoring data for analysis
   */
  static exportData(): {
    timestamp: Date;
    metrics: Record<string, CacheMetrics>;
    recentOperations: CacheOperation[];
    config: any;
  } {
    const monitor = CacheMonitor.getInstance();
    const metrics: Record<string, CacheMetrics> = {};
    
    // Convert Map to object for serialization
    const metricsMap = monitor.getMetrics() as Map<string, CacheMetrics>;
    metricsMap.forEach((value, key) => {
      metrics[key] = value;
    });

    return {
      timestamp: new Date(),
      metrics,
      recentOperations: monitor.getRecentOperations(100),
      config: getCacheConfig()
    };
  }

  /**
   * Validate cache consistency
   */
  static validateConsistency(): {
    isConsistent: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    const monitor = CacheMonitor.getInstance();
    const metrics = monitor.getMetrics() as Map<string, CacheMetrics>;

    // Check for suspicious metrics
    metrics.forEach((metric, group) => {
      const totalOps = metric.hits + metric.misses;
      
      if (totalOps > 0 && metric.hits === 0) {
        issues.push(`${group}: No cache hits recorded - possible cache misconfiguration`);
      }
      
      if (metric.avgResponseTime > 1000) {
        issues.push(`${group}: Very high average response time (${metric.avgResponseTime.toFixed(2)}ms)`);
      }
      
      if (metric.errorRate > 0.1) {
        issues.push(`${group}: High error rate (${(metric.errorRate * 100).toFixed(1)}%)`);
      }
    });

    return {
      isConsistent: issues.length === 0,
      issues
    };
  }
}

// ========================================
// Real-time Cache Dashboard
// ========================================

/**
 * Real-time cache monitoring dashboard data
 */
export class CacheDashboard {
  private static updateInterval: NodeJS.Timeout | null = null;
  private static subscribers: ((data: any) => void)[] = [];

  /**
   * Start real-time dashboard updates
   */
  static start(intervalMs: number = 5000): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(() => {
      const data = this.generateDashboardData();
      this.subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in dashboard subscriber:', error);
        }
      });
    }, intervalMs);

    console.log(`📊 Cache dashboard started (updating every ${intervalMs}ms)`);
  }

  /**
   * Stop dashboard updates
   */
  static stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log('📊 Cache dashboard stopped');
    }
  }

  /**
   * Subscribe to dashboard updates
   */
  static subscribe(callback: (data: any) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  /**
   * Generate current dashboard data
   */
  static generateDashboardData(): any {
    const monitor = CacheMonitor.getInstance();
    const healthReport = monitor.generateHealthReport();
    const recentOperations = monitor.getRecentOperations(10);
    const profilerStats = CacheProfiler.getStats();

    return {
      timestamp: new Date(),
      health: healthReport,
      recentActivity: recentOperations,
      performance: profilerStats,
      system: {
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      }
    };
  }

  /**
   * Get current dashboard snapshot
   */
  static getSnapshot(): any {
    return this.generateDashboardData();
  }
}

// Export singleton instances
export const cacheMonitor = CacheMonitor.getInstance();