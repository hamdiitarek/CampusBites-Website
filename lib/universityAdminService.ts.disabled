import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc,
  Timestamp,
  startAfter,
  endBefore
} from 'firebase/firestore';

/**
 * University Admin Service - Database Schema Compliant Filtering
 * 
 * This service filters all metrics, food trends, orders, and analytics by university
 * through VENDOR ASSOCIATION ONLY, following the actual database schema where:
 * - Orders contain only userId and vendorId (no universityName/universityId)
 * - University filtering is achieved by first getting university vendors
 * - Then filtering orders by those vendor IDs
 * - Order items include category field (post-migration v1.1)
 * 
 * Key Features:
 * - Vendor-based university filtering (database schema compliant)
 * - Revenue calculations only from completed orders  
 * - Proper handling of enhanced timestamp fields (migration v2.0)
 * - University-scoped analytics through vendor association
 * - Category analytics using migrated order item categories
 * 
 * All service methods filter by universityName through vendor relationships.
 */

// Types for University Admin Analytics
export interface FoodTrendData {
  id: string;
  name: string;
  category: string;
  totalOrders: number;
  revenue: number;
  averageRating: number;
  popularityScore: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  peakHours: string[];
  lastWeekOrders: number;
  thisWeekOrders: number;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalStudents: number;
  totalVendors: number;
  averageOrderValue: number;
  ordersGrowth: number;
  revenueGrowth: number;
  topSellingItems: FoodTrendData[];
  peakOrderTimes: { hour: number; orders: number; }[];
  popularCategories: { category: string; percentage: number; orders: number; revenue: number; }[];
  dailyStats: { date: string; orders: number; revenue: number; }[];
  weeklyComparison: { thisWeek: number; lastWeek: number; growth: number; };
  monthlyComparison: { thisMonth: number; lastMonth: number; growth: number; };
}

export interface StudentEngagementData {
  totalActiveStudents: number;
  newStudentsThisWeek: number;
  returningCustomers: number;
  averageOrdersPerStudent: number;
  studentRetentionRate: number;
  topSpendingStudents: {
    id: string;
    name: string;
    totalSpent: number;
    orderCount: number;
    averageOrder: number;
  }[];
}

export interface VendorPerformanceData {
  id: string;
  name: string;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  responseTime: number;
  completionRate: number;
  popularItems: string[];
  peakHours: string[];
  growth: number;
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'suspended';
}

export interface OrderData {
  id: string;
  userId: string;  // Customer ID
  vendorId: string;  // Vendor ID
  items: Array<{
    id?: string;
    name: string;
    quantity: number;
    price: number;
    note?: string;
    customizations?: any;
    category?: string; // Added for database schema v1.1 (post-migration)
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: string;
  createdAt: Timestamp;  // Order creation time
  // Enhanced timestamp fields (Version 2.0 - may not exist in all orders)
  confirmedAt?: Timestamp;  // When vendor confirms order
  readyAt?: Timestamp;      // When order is ready for pickup
  completedAt?: Timestamp;  // When order is completed
  cancelledAt?: Timestamp;  // When order is cancelled
  statusHistory?: Array<{   // Track all status changes
    status: string;
    timestamp: Timestamp;
    updatedBy: string;
    note?: string;
  }>;
  schemaVersion?: string;   // Migration version tracking
  migratedAt?: Timestamp;   // When migration was applied
  // NOTE: Orders do NOT have universityName/universityId in database schema
  // University filtering is done through vendor association only
}

export class UniversityAdminService {
  // Get comprehensive analytics for university
  static async getUniversityAnalytics(
    universityName: string, 
    timeRange: '7d' | '30d' | '90d' = '30d',
    customDateRange?: { from: Date; to: Date }
  ): Promise<AnalyticsData> {
    try {
      let endDate: Date;
      let startDate: Date;
      
      // Use custom date range if provided, otherwise use time range
      if (customDateRange) {
        startDate = new Date(customDateRange.from);
        endDate = new Date(customDateRange.to);
        // Set end date to end of day
        endDate.setHours(23, 59, 59, 999);
      } else {
        endDate = new Date();
        startDate = new Date();
        
        switch (timeRange) {
          case '7d':
            startDate.setDate(endDate.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(endDate.getDate() - 30);
            break;
          case '90d':
            startDate.setDate(endDate.getDate() - 90);
            break;
        }
      }

      // Get orders data - using universityName instead of universityId based on your schema
      const ordersQuery = query(
        collection(db, 'orders'),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate)),
        orderBy('createdAt', 'desc')
      );

      const ordersSnapshot = await getDocs(ordersQuery);
      const allOrders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as OrderData));

      // Filter orders by university (vendor-based filtering per database schema)
      // Get vendors for this university
      const vendorsQuery = query(
        collection(db, 'vendors'),
        where('universityName', '==', universityName)
      );
      
      const vendorsSnapshot = await getDocs(vendorsQuery);
      const universityVendorIds = vendorsSnapshot.docs.map(doc => doc.id);

      console.log(`🏛️  University: ${universityName}`);
      console.log(`🏪 Found ${universityVendorIds.length} vendors for university: ${universityVendorIds.join(', ')}`);

      // Filter orders for this university's vendors (vendor-only filtering per database schema)
      const orders = allOrders.filter(order => {
        return universityVendorIds.includes(order.vendorId);
      });

      console.log(`📦 Total orders before university filter: ${allOrders.length}`);
      console.log(`📦 Orders after university filter: ${orders.length}`);
      
      // Calculate analytics - only include completed orders for revenue and categories
      const totalOrders = orders.length;
      const completedOrders = orders.filter(order => order.status === 'completed');
      const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      console.log(`📦 Completed orders for analytics: ${completedOrders.length}`);
      console.log(`📦 Sample vendor IDs from orders: ${Array.from(new Set(orders.slice(0, 5).map(o => o.vendorId))).join(', ')}`);
      
      const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

      // Get unique students and vendors
      const uniqueStudents = new Set(orders.map(order => order.userId)).size;
      const uniqueVendors = universityVendorIds.length;

      // Calculate trends (compare with previous period)
      const periodLength = endDate.getTime() - startDate.getTime();
      const previousStartDate = new Date(startDate.getTime() - periodLength);
      
      const previousOrdersQuery = query(
        collection(db, 'orders'),
        where('createdAt', '>=', Timestamp.fromDate(previousStartDate)),
        where('createdAt', '<', Timestamp.fromDate(startDate)),
        orderBy('createdAt', 'desc')
      );

      const previousOrdersSnapshot = await getDocs(previousOrdersQuery);
      const allPreviousOrders = previousOrdersSnapshot.docs.map(doc => doc.data() as OrderData);
      
      const previousOrders = allPreviousOrders.filter(order => {
        return universityVendorIds.includes(order.vendorId);
      });
      
      const previousCompletedOrders = previousOrders.filter(order => order.status === 'completed');
      const previousRevenue = previousCompletedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const ordersGrowth = previousOrders.length > 0 ? ((totalOrders - previousOrders.length) / previousOrders.length) * 100 : 0;
      const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      // Analyze food trends - ONLY use completed orders for category analysis
      const itemCounts: { [key: string]: { count: number; revenue: number; category: string; } } = {};
      const categoryCounts: { [key: string]: number } = {};
      const categoryRevenue: { [key: string]: number } = {};
      const hourlyOrders: { [key: number]: number } = {};

      // Get vendor data to enrich order items with categories
      const vendorDataMap: { [vendorId: string]: any } = {};
      for (const vendorDoc of vendorsSnapshot.docs) {
        vendorDataMap[vendorDoc.id] = vendorDoc.data();
      }

      // Process ONLY completed orders for category performance breakdown
      completedOrders.forEach(order => {
        const hour = order.createdAt.toDate().getHours();
        hourlyOrders[hour] = (hourlyOrders[hour] || 0) + 1;

        const vendorData = vendorDataMap[order.vendorId];
        const fallbackCategory = vendorData?.categories?.[0] || 'Other';

        order.items.forEach(item => {
          // Use the item's category from database schema (post-migration), fallback to vendor's main category
          const itemCategory = item.category || fallbackCategory;
          const itemRevenue = item.price * item.quantity;
          
          if (!itemCounts[item.name]) {
            itemCounts[item.name] = { count: 0, revenue: 0, category: itemCategory };
          }
          itemCounts[item.name].count += item.quantity;
          itemCounts[item.name].revenue += itemRevenue;
          
          categoryCounts[itemCategory] = (categoryCounts[itemCategory] || 0) + item.quantity;
          categoryRevenue[itemCategory] = (categoryRevenue[itemCategory] || 0) + itemRevenue;
        });
      });

      // Calculate food trends using proper weekly comparison logic
      const calculateFoodTrends = (itemCounts: {[key: string]: {count: number; revenue: number; category: string}}, orders: any[]) => {
        const currentTime = new Date();
        const weekAgo = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Split orders into current week and previous week for each item
        const currentWeekItemCounts: {[key: string]: number} = {};
        const previousWeekItemCounts: {[key: string]: number} = {};
        
        orders.forEach(order => {
          const orderDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
          
          order.items.forEach((item: any) => {
            const itemName = item.name;
            
            if (orderDate >= weekAgo) {
              // Current week
              currentWeekItemCounts[itemName] = (currentWeekItemCounts[itemName] || 0) + item.quantity;
            } else if (orderDate >= twoWeeksAgo && orderDate < weekAgo) {
              // Previous week
              previousWeekItemCounts[itemName] = (previousWeekItemCounts[itemName] || 0) + item.quantity;
            }
          });
        });
        
        return Object.entries(itemCounts).map(([name, data]) => {
          const currentWeekCount = currentWeekItemCounts[name] || 0;
          const previousWeekCount = previousWeekItemCounts[name] || 0;
          
          // Calculate trend percentage
          let trendPercentage = 0;
          let trend: 'up' | 'down' | 'stable' = 'stable';
          
          if (previousWeekCount > 0) {
            trendPercentage = ((currentWeekCount - previousWeekCount) / previousWeekCount) * 100;
          } else if (currentWeekCount > 0) {
            trendPercentage = 100; // New item this week
          }
          
          // Determine trend direction
          if (Math.abs(trendPercentage) < 5) {
            trend = 'stable';
          } else if (trendPercentage > 0) {
            trend = 'up';
          } else {
            trend = 'down';
          }
          
          return {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            category: data.category,
            totalOrders: data.count,
            revenue: data.revenue,
            averageRating: 4.2, // TODO: Calculate from reviews
            popularityScore: (data.count / totalOrders) * 100,
            trend,
            trendPercentage: Math.round(trendPercentage * 10) / 10, // Round to 1 decimal
            peakHours: ['12:00', '18:00'], // TODO: Calculate actual peak hours
            lastWeekOrders: previousWeekCount,
            thisWeekOrders: currentWeekCount
          };
        });
      };

      // Top selling items with proper trend calculations - using COMPLETED orders only
      const topSellingItems: FoodTrendData[] = calculateFoodTrends(itemCounts, completedOrders)
        .sort((a, b) => b.totalOrders - a.totalOrders)
        .slice(0, 10);

      // Peak order times
      const peakOrderTimes = Object.entries(hourlyOrders)
        .map(([hour, count]) => ({ hour: parseInt(hour), orders: count }))
        .sort((a, b) => a.hour - b.hour); // Sort by hour ascending for proper chronological display

      // Popular categories
      const totalCategoryOrders = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
      const popularCategories = Object.entries(categoryCounts)
        .map(([category, count]) => ({
          category,
          orders: count,
          percentage: (count / totalCategoryOrders) * 100,
          revenue: categoryRevenue[category] || 0
        }))
        .sort((a, b) => b.orders - a.orders);

      console.log(`📊 Category breakdown for ${universityName}:`, popularCategories);
      console.log(`📊 Total category orders: ${totalCategoryOrders}`);
      console.log(`📊 Category counts:`, categoryCounts);
      console.log(`📊 Category revenue:`, categoryRevenue);
      
      // Daily stats
      const dailyStats: { [key: string]: { orders: number; revenue: number; } } = {};
      orders.forEach(order => {
        const dateKey = order.createdAt.toDate().toISOString().split('T')[0];
        if (!dailyStats[dateKey]) {
          dailyStats[dateKey] = { orders: 0, revenue: 0 };
        }
        dailyStats[dateKey].orders += 1;
        dailyStats[dateKey].revenue += order.total;
      });

      const dailyStatsArray = Object.entries(dailyStats)
        .map(([date, stats]) => ({ date, ...stats }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        totalRevenue,
        totalOrders,
        totalStudents: uniqueStudents,
        totalVendors: uniqueVendors,
        averageOrderValue,
        ordersGrowth,
        revenueGrowth,
        topSellingItems,
        peakOrderTimes,
        popularCategories,
        dailyStats: dailyStatsArray,
        weeklyComparison: { thisWeek: 0, lastWeek: 0, growth: 0 }, // TODO: Implement
        monthlyComparison: { thisMonth: 0, lastMonth: 0, growth: 0 } // TODO: Implement
      };

    } catch (error) {
      console.error('Error fetching university analytics:', error);
      throw error;
    }
  }

  // Get student engagement data
  static async getStudentEngagement(universityName: string): Promise<StudentEngagementData> {
    try {
      const studentsQuery = query(
        collection(db, 'users'),
        where('universityName', '==', universityName),
        where('role', '==', 'student')
      );

      const studentsSnapshot = await getDocs(studentsQuery);
      const totalActiveStudents = studentsSnapshot.size;

      // Get new students this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const students = studentsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...(doc.data() as any)
      }));
      const newStudentsThisWeek = students.filter((student: any) => {
        if (!student.createdAt) return false;
        const createdAt = student.createdAt?.toDate ? student.createdAt.toDate() : new Date(student.createdAt);
        return createdAt >= weekAgo;
      }).length;

      // Calculate returning customers by getting students with multiple orders
      const ordersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        limit(1000) // Get recent orders to analyze
      );

      const ordersSnapshot = await getDocs(ordersQuery);
      const orders = ordersSnapshot.docs.map(doc => doc.data());
      
      // Filter orders by university students
      const studentIds = new Set(students.map(s => s.id));
      const universityOrders = orders.filter(order => studentIds.has(order.userId));
      
      // Count orders per student
      const orderCounts: { [studentId: string]: number } = {};
      universityOrders.forEach(order => {
        orderCounts[order.userId] = (orderCounts[order.userId] || 0) + 1;
      });

      const returningCustomers = Object.values(orderCounts).filter(count => count > 1).length;
      const averageOrdersPerStudent = totalActiveStudents > 0 ? universityOrders.length / totalActiveStudents : 0;
      const studentRetentionRate = totalActiveStudents > 0 ? (returningCustomers / totalActiveStudents) * 100 : 0;

      // Get top spending students
      const studentSpending: { [studentId: string]: { total: number; count: number; name: string } } = {};
      
      universityOrders.forEach((order: any) => {
        if (!studentSpending[order.userId]) {
          const student = students.find((s: any) => s.id === order.userId);
          studentSpending[order.userId] = { 
            total: 0, 
            count: 0, 
            name: student?.fullName || 'Unknown'
          };
        }
        studentSpending[order.userId].total += order.total || 0;
        studentSpending[order.userId].count += 1;
      });

      const topSpendingStudents = Object.entries(studentSpending)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 5)
        .map(([id, data]) => ({
          id,
          name: data.name,
          totalSpent: data.total,
          orderCount: data.count,
          averageOrder: data.count > 0 ? data.total / data.count : 0
        }));

      return {
        totalActiveStudents,
        newStudentsThisWeek,
        returningCustomers,
        averageOrdersPerStudent: Number(averageOrdersPerStudent.toFixed(1)),
        studentRetentionRate: Number(studentRetentionRate.toFixed(1)),
        topSpendingStudents
      };

    } catch (error) {
      console.error('Error fetching student engagement:', error);
      throw error;
    }
  }

  // Get vendor performance data
  static async getVendorPerformance(universityName: string): Promise<VendorPerformanceData[]> {
    try {
      const vendorsQuery = query(
        collection(db, 'vendors'),
        where('universityName', '==', universityName),
        where('isApproved', '==', true)
      );

      const vendorsSnapshot = await getDocs(vendorsQuery);
      const vendorPerformance: VendorPerformanceData[] = [];

      // Get all orders to analyze vendor performance
      const ordersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        limit(1000) // Get recent orders for performance analysis
      );

      const ordersSnapshot = await getDocs(ordersQuery);
      const allOrders = ordersSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...(doc.data() as any)
      }));

      for (const vendorDoc of vendorsSnapshot.docs) {
        const vendor = vendorDoc.data() as any;
        
        // Filter orders for this specific vendor (vendor-only filtering per database schema)
        const orders = allOrders.filter((order: any) => {
          return order.vendorId === vendorDoc.id;
        });

        const totalOrders = orders.length;
        const completedOrders = orders.filter((order: any) => order.status === 'completed');
        const totalRevenue = completedOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
        const completionRate = totalOrders > 0 ? (completedOrders.length / totalOrders) * 100 : 0;

        // Calculate average response time based on actual order data
        const averageResponseTime = this.calculateAverageResponseTime(orders);

        // Get popular items (simplified - just count item names from orders)
        const itemCounts: { [itemName: string]: number } = {};
        orders.forEach((order: any) => {
          order.items?.forEach((item: any) => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
          });
        });

        const popularItems = Object.entries(itemCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name]) => name);

        // Calculate growth (compare last 30 days vs previous 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const recentOrders = orders.filter((order: any) => {
          const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
          return orderDate >= thirtyDaysAgo;
        });

        const previousOrders = orders.filter((order: any) => {
          const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
          return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
        });

        const growth = previousOrders.length > 0 ? 
          ((recentOrders.length - previousOrders.length) / previousOrders.length) * 100 : 0;

        vendorPerformance.push({
          id: vendorDoc.id,
          name: vendor.name || 'Unknown Vendor',
          totalOrders,
          totalRevenue,
          averageRating: vendor.rating || 4.0,
          responseTime: averageResponseTime,
          completionRate,
          popularItems,
          peakHours: ['12:00-14:00', '18:00-20:00'], // Mock data
          growth: Number(growth.toFixed(1)),
          status: vendor.isOpen && !vendor.isSuspended ? 'active' : 'inactive'
        });
      }

      return vendorPerformance.sort((a, b) => b.totalRevenue - a.totalRevenue);

    } catch (error) {
      console.error('Error fetching vendor performance:', error);
      throw error;
    }
  }

  // Get recent orders for the university
  static async getRecentOrders(
    universityName: string, 
    limitCount: number = 20, 
    customDateRange?: { from: Date; to: Date }
  ): Promise<OrderData[]> {
    try {
      console.log(`🔍 getRecentOrders called with limit: ${limitCount} for university: ${universityName}`);
      console.log(`📅 Custom date range:`, customDateRange);
      
      // Get vendors for this university first
      const vendorsQuery = query(
        collection(db, 'vendors'),
        where('universityName', '==', universityName)
      );
      
      const vendorsSnapshot = await getDocs(vendorsQuery);
      const universityVendorIds = vendorsSnapshot.docs.map(doc => doc.id);

      console.log(`🏪 Found ${universityVendorIds.length} vendors for university`);

      if (universityVendorIds.length === 0) {
        console.log(`❌ No vendors found for university: ${universityName}`);
        return [];
      }

      // Build orders query
      let ordersQuery;
      
      console.log(`📊 Building query with limit multiplier: ${limitCount} * 2 = ${limitCount * 2}`);
      
      if (customDateRange) {
        // Query with date range
        const startTimestamp = Timestamp.fromDate(customDateRange.from);
        const endDate = new Date(customDateRange.to);
        endDate.setHours(23, 59, 59, 999); // End of day
        const endTimestamp = Timestamp.fromDate(endDate);
        
        console.log(`📅 Using date range: ${customDateRange.from.toISOString()} to ${endTimestamp.toDate().toISOString()}`);
        
        ordersQuery = query(
          collection(db, 'orders'),
          where('createdAt', '>=', startTimestamp),
          where('createdAt', '<=', endTimestamp),
          orderBy('createdAt', 'desc'),
          limit(limitCount * 2) // Get extra to filter by university vendors
        );
      } else {
        // Regular query without date filter
        console.log(`📅 Using recent orders query without date filter`);
        ordersQuery = query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc'),
          limit(limitCount * 2) // Get extra to filter by university vendors
        );
      }

      const ordersSnapshot = await getDocs(ordersQuery);
      const allOrders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any)
      } as OrderData));

      console.log(`📦 Firebase returned ${allOrders.length} total orders`);
      
      // Filter orders for this university's vendors (vendor-only filtering per database schema)
      const universityOrders = allOrders
        .filter(order => {
          return universityVendorIds.includes(order.vendorId);
        })
        .slice(0, limitCount);

      console.log(`📦 After university filtering: ${allOrders.filter(order => universityVendorIds.includes(order.vendorId)).length} orders`);
      console.log(`📦 After final slice(0, ${limitCount}): ${universityOrders.length} orders`);
      
      const completedCount = universityOrders.filter(order => order.status === 'completed').length;
      console.log(`✅ Completed orders in result: ${completedCount}`);

      return universityOrders;

    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }
  }

  // Get vendor-specific analytics
  static async getVendorAnalytics(
    universityName: string, 
    vendorId?: string,
    dateRange?: { from: Date; to: Date }
  ): Promise<{
    averageResponseTime: number;
    completionRate: number;
    totalRevenue: number;
    totalOrders: number;
  }> {
    try {
      // Get university vendors first, then filter orders by vendor IDs
      const vendorsQuery = query(
        collection(db, 'vendors'),
        where('universityName', '==', universityName)
      );
      
      const vendorsSnapshot = await getDocs(vendorsQuery);
      const universityVendorIds = vendorsSnapshot.docs.map(doc => doc.id);
      
      // Get orders, we'll filter by vendor after fetching
      const ordersRef = collection(db, 'orders');
      let q = query(
        ordersRef,
        orderBy('createdAt', 'desc'),
        limit(1000) // Limit for performance
      );
      
      if (vendorId) {
        // If specific vendor requested, only get that vendor's orders
        q = query(ordersRef, where('vendorId', '==', vendorId), orderBy('createdAt', 'desc'));
      }
      
      const snapshot = await getDocs(q);
      let orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OrderData[];
      
      // Filter orders by university vendors (if no specific vendor requested)
      if (!vendorId) {
        orders = orders.filter(order => universityVendorIds.includes(order.vendorId));
      }
      
      // Apply date range filter if provided (no university ID filtering since orders don't have university fields)
      if (dateRange) {
        orders = orders.filter(order => {
          const orderDate = order.createdAt.toDate();
          return orderDate >= dateRange.from && orderDate <= dateRange.to;
        });
      }
      
      // Calculate metrics
      const totalOrders = orders.length;
      const completedOrders = orders.filter(order => order.status === 'completed').length;
      const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
      
      // Calculate average response time using real timestamps from migration
      const ordersWithConfirmation = orders.filter(order => 
        order.confirmedAt && order.createdAt && order.status !== 'cancelled'
      );
      
      let averageResponseTime = 0;
      if (ordersWithConfirmation.length > 0) {
        // Use real confirmation timestamps
        const totalResponseTime = ordersWithConfirmation.reduce((sum, order) => {
          const created = order.createdAt.toDate();
          const confirmed = order.confirmedAt!.toDate();
          const responseTime = (confirmed.getTime() - created.getTime()) / (1000 * 60); // in minutes
          return sum + responseTime;
        }, 0);
        
        averageResponseTime = Math.round(totalResponseTime / ordersWithConfirmation.length);
      } else {
        // Fallback: estimate for orders without confirmed timestamps
        const completedOrdersForResponse = orders.filter(order => 
          order.status === 'completed' && order.createdAt
        );
        
        if (completedOrdersForResponse.length > 0) {
          const now = new Date();
          const totalEstimatedTime = completedOrdersForResponse.reduce((sum, order) => {
            const created = order.createdAt.toDate();
            const timeSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60); // in minutes
            
            // For completed orders, estimate they were confirmed within 15-30 minutes
            const estimatedResponseTime = Math.min(timeSinceCreated, 25); // Cap at 25 minutes
            return sum + estimatedResponseTime;
          }, 0);
          
          averageResponseTime = Math.round(totalEstimatedTime / completedOrdersForResponse.length);
        }
      }
      
      // Calculate total revenue
      const totalRevenue = orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.total, 0);
      
      return {
        averageResponseTime,
        completionRate,
        totalRevenue,
        totalOrders
      };
      
    } catch (error) {
      console.error('Error getting vendor analytics:', error);
      throw error;
    }
  }

  // Update vendor status
  static async updateVendorStatus(vendorId: string, status: 'active' | 'inactive'): Promise<void> {
    try {
      const vendorRef = doc(db, 'vendors', vendorId);
      await updateDoc(vendorRef, {
        isOpen: status === 'active',
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating vendor status:', error);
      throw error;
    }
  }

  // Get university students
  static async getUniversityStudents(universityName: string, limitCount: number = 50): Promise<any[]> {
    try {
      const studentsQuery = query(
        collection(db, 'users'),
        where('universityName', '==', universityName),
        where('role', '==', 'student'),
        limit(limitCount)
      );

      const studentsSnapshot = await getDocs(studentsQuery);
      return studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any)
      }));

    } catch (error) {
      console.error('Error fetching university students:', error);
      throw error;
    }
  }

  // Vendor Management Functions
  static async approveVendor(vendorId: string, universityName: string) {
    try {
      const vendorRef = doc(db, 'vendors', vendorId);
      await updateDoc(vendorRef, {
        status: 'approved',
        approvedBy: 'university_admin',
        approvedAt: Timestamp.now(),
        universityName: universityName
      });
      return true;
    } catch (error) {
      console.error('Error approving vendor:', error);
      throw error;
    }
  }

  static async suspendVendor(vendorId: string, reason?: string) {
    try {
      const vendorRef = doc(db, 'vendors', vendorId);
      await updateDoc(vendorRef, {
        status: 'suspended',
        suspendedBy: 'university_admin',
        suspendedAt: Timestamp.now(),
        suspensionReason: reason || 'No reason provided'
      });
      return true;
    } catch (error) {
      console.error('Error suspending vendor:', error);
      throw error;
    }
  }

  static async reactivateVendor(vendorId: string) {
    try {
      const vendorRef = doc(db, 'vendors', vendorId);
      await updateDoc(vendorRef, {
        status: 'approved',
        reactivatedBy: 'university_admin',
        reactivatedAt: Timestamp.now(),
        suspendedBy: null,
        suspendedAt: null,
        suspensionReason: null
      });
      return true;
    } catch (error) {
      console.error('Error reactivating vendor:', error);
      throw error;
    }
  }

  /**
   * Calculate average response time for orders
   * Response time is calculated as time between order creation and confirmation
   */
  private static calculateAverageResponseTime(orders: any[]): number {
    const ordersWithConfirmation = orders.filter(order => 
      order.createdAt && order.confirmedAt && order.status !== 'cancelled'
    );

    if (ordersWithConfirmation.length === 0) return 15; // Default fallback

    const totalResponseTime = ordersWithConfirmation.reduce((sum, order) => {
      const created = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      const confirmed = order.confirmedAt?.toDate ? order.confirmedAt.toDate() : new Date(order.confirmedAt);
      const responseTime = (confirmed.getTime() - created.getTime()) / (1000 * 60); // in minutes
      return sum + Math.max(0, responseTime); // Ensure non-negative
    }, 0);

    return Math.round(totalResponseTime / ordersWithConfirmation.length);
  }
}
