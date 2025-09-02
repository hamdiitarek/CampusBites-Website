/**
 * Appwrite University Admin Service
 * Migrated from Firebase UniversityAdminService - Database Schema Compliant Filtering
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

import { databases, appwriteConfig } from './appwrite';
import { Query } from 'appwrite';
import type {
  User,
  Vendor,
  Order,
  OrderStatus,
  UserRole
} from './models';

// Types for University Admin Analytics (Appwrite version with string dates)
interface AppwriteOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
  customizations?: any;
  category?: string;
}

interface AppwriteOrder {
  id: string;
  userId: string;
  vendorId: string;
  items: AppwriteOrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: 'Wallet' | 'Cash';
  createdAt: string;
  updatedAt?: string;
  estimatedReadyTime?: string;
  completedAt?: string;
  confirmedAt?: string;
  readyAt?: string;
  cancelledAt?: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    updatedBy: string;
    note?: string;
  }>;
  customerNote?: string;
}
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

export class AppwriteUniversityAdminService {
  // Helper function to convert timestamp to Date
  private static toDate(timestamp: string | any): Date {
    if (typeof timestamp === 'string') {
      return new Date(timestamp);
    }
    // Handle Firebase Timestamp objects
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    // Handle Firebase Timestamp objects with seconds property
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    return new Date(timestamp);
  }
  // Helper function to convert Appwrite document to Order
  private static convertDocumentToOrder(doc: any): Order {
    return {
      id: doc.$id,
      userId: doc.userId,
      vendorId: doc.vendorId,
      items: typeof doc.items === 'string' ? JSON.parse(doc.items) : doc.items,
      total: doc.total,
      status: doc.status,
      paymentMethod: doc.paymentMethod,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
      estimatedReadyTime: doc.estimatedReadyTime,
      completedAt: doc.completedAt,
      confirmedAt: doc.confirmedAt,
      readyAt: doc.readyAt,
      cancelledAt: doc.cancelledAt,
      statusHistory: typeof doc.statusHistory === 'string' ? JSON.parse(doc.statusHistory || '[]') : doc.statusHistory,
      customerNote: doc.customerNote
    };
  }

  // Helper function to convert Appwrite document to User
  private static convertDocumentToUser(doc: any): User {
    return {
      $id: doc.$id,
      id: doc.$id, // Use $id as the main id field
      fullName: doc.fullName,
      email: doc.email,
      universityId: doc.universityId,
      universityName: doc.universityName,
      phoneNumber: doc.phoneNumber,
      isEmailVerified: doc.isEmailVerified,
      role: doc.role,
      walletBalance: doc.walletBalance,
      profileImageUrl: doc.profileImageUrl,
      fcmToken: doc.fcmToken,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt
    } as User;
  }

  // Helper function to convert Appwrite document to Vendor
  private static convertDocumentToVendor(doc: any): Vendor {
    return {
      $id: doc.$id,
      id: doc.$id, // Use $id as the main id field
      name: doc.name,
      userId: doc.userId,
      universityId: doc.universityId,
      universityName: doc.universityName,
      description: doc.description,
      imageUrl: doc.imageUrl,
      rating: doc.rating,
      reviewCount: doc.reviewCount,
      categories: typeof doc.categories === 'string' ? JSON.parse(doc.categories || '[]') : doc.categories,
      isOpen: doc.isOpen,
      isApproved: doc.isApproved,
      isSuspended: doc.isSuspended,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt
    } as Vendor;
  }
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

      // Get orders data - using date range filter
      const ordersResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        [
          Query.greaterThanEqual('createdAt', startDate.toISOString()),
          Query.lessThanEqual('createdAt', endDate.toISOString()),
          Query.orderDesc('createdAt'),
          Query.limit(4000) // Large limit to capture all orders in range
        ]
      );

      // Convert Appwrite documents to Order objects
      const allOrders = ordersResponse.documents.map(doc => AppwriteUniversityAdminService.convertDocumentToOrder(doc));

      // Filter orders by university (vendor-based filtering per database schema)
      // Get vendors for this university
      const vendorsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.vendorsCollectionId,
        [
          Query.equal('universityName', universityName),
          Query.limit(4000) // Large limit for vendors
        ]
      );
      
      const universityVendorIds = vendorsResponse.documents.map(doc => doc.$id);

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
      
      const previousOrdersResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        [
          Query.greaterThanEqual('createdAt', previousStartDate.toISOString()),
          Query.lessThan('createdAt', startDate.toISOString()),
          Query.orderDesc('createdAt'),
          Query.limit(4000)
        ]
      );

      const allPreviousOrders = previousOrdersResponse.documents.map(doc => AppwriteUniversityAdminService.convertDocumentToOrder(doc));
      
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
      for (const vendorDoc of vendorsResponse.documents) {
        vendorDataMap[vendorDoc.$id] = vendorDoc;
      }

      // Process ONLY completed orders for category performance breakdown
      completedOrders.forEach(order => {
        const orderDate = AppwriteUniversityAdminService.toDate(order.createdAt);
        const hour = orderDate.getHours();
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
      const calculateFoodTrends = (itemCounts: {[key: string]: {count: number; revenue: number; category: string}}, orders: Order[]) => {
        const currentTime = new Date();
        const weekAgo = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Split orders into current week and previous week for each item
        const currentWeekItemCounts: {[key: string]: number} = {};
        const previousWeekItemCounts: {[key: string]: number} = {};
        
        orders.forEach(order => {
          const orderDate = AppwriteUniversityAdminService.toDate(order.createdAt);
          
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
        const dateKey = AppwriteUniversityAdminService.toDate(order.createdAt).toISOString().split('T')[0];
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
      const studentsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [
          Query.equal('universityName', universityName),
          Query.equal('role', 'student'),
          Query.limit(4000)
        ]
      );

      const students = studentsResponse.documents.map(doc => AppwriteUniversityAdminService.convertDocumentToUser(doc));
      const totalActiveStudents = students.length;

      // Get new students this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const newStudentsThisWeek = students.filter((student: any) => {
        if (!student.createdAt) return false;
        const createdAt = AppwriteUniversityAdminService.toDate(student.createdAt);
        return createdAt >= weekAgo;
      }).length;

      // Calculate returning customers by getting students with multiple orders
      const ordersResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        [
          Query.orderDesc('createdAt'),
          Query.limit(4000) // Get recent orders to analyze
        ]
      );

      const orders = ordersResponse.documents.map(doc => AppwriteUniversityAdminService.convertDocumentToOrder(doc));
      
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
          const student = students.find((s: any) => s.$id === order.userId);
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
      const vendorsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.vendorsCollectionId,
        [
          Query.equal('universityName', universityName),
          Query.equal('isApproved', true),
          Query.limit(4000)
        ]
      );

      const vendors = vendorsResponse.documents.map(doc => AppwriteUniversityAdminService.convertDocumentToVendor(doc));
      const vendorPerformance: VendorPerformanceData[] = [];

      // Get all orders to analyze vendor performance
      const ordersResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        [
          Query.orderDesc('createdAt'),
          Query.limit(4000) // Get recent orders for performance analysis
        ]
      );

      const allOrders = ordersResponse.documents.map(doc => AppwriteUniversityAdminService.convertDocumentToOrder(doc));

      for (const vendor of vendors) {
        // Filter orders for this specific vendor (vendor-only filtering per database schema)
        const orders = allOrders.filter((order: any) => {
          return order.vendorId === vendor.id;
        });

        const totalOrders = orders.length;
        const completedOrders = orders.filter((order: any) => order.status === 'completed');
        const totalRevenue = completedOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
        const completionRate = totalOrders > 0 ? (completedOrders.length / totalOrders) * 100 : 0;

        // Calculate average response time (mock data for now as we don't track response times)
        const averageResponseTime = 15; // minutes - placeholder

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
          const orderDate = AppwriteUniversityAdminService.toDate(order.createdAt);
          return orderDate >= thirtyDaysAgo;
        });

        const previousOrders = orders.filter((order: any) => {
          const orderDate = AppwriteUniversityAdminService.toDate(order.createdAt);
          return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
        });

        const growth = previousOrders.length > 0 ? 
          ((recentOrders.length - previousOrders.length) / previousOrders.length) * 100 : 0;

        vendorPerformance.push({
          id: vendor.id,
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
  ): Promise<Order[]> {
    try {
      console.log(`🔍 getRecentOrders called with limit: ${limitCount} for university: ${universityName}`);
      console.log(`📅 Custom date range:`, customDateRange);
      
      // Get vendors for this university first
      const vendorsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.vendorsCollectionId,
        [
          Query.equal('universityName', universityName),
          Query.limit(4000)
        ]
      );
      
      const universityVendorIds = vendorsResponse.documents.map(doc => doc.$id);

      console.log(`🏪 Found ${universityVendorIds.length} vendors for university`);

      if (universityVendorIds.length === 0) {
        console.log(`❌ No vendors found for university: ${universityName}`);
        return [];
      }

      // Build orders query
      let queryFilters = [
        Query.orderDesc('createdAt'),
        Query.limit(limitCount * 2) // Get extra to filter by university vendors
      ];
      
      console.log(`📊 Building query with limit multiplier: ${limitCount} * 2 = ${limitCount * 2}`);
      
      if (customDateRange) {
        // Query with date range
        const endDate = new Date(customDateRange.to);
        endDate.setHours(23, 59, 59, 999); // End of day
        
        console.log(`📅 Using date range: ${customDateRange.from.toISOString()} to ${endDate.toISOString()}`);
        
        queryFilters = [
          Query.greaterThanEqual('createdAt', customDateRange.from.toISOString()),
          Query.lessThanEqual('createdAt', endDate.toISOString()),
          Query.orderDesc('createdAt'),
          Query.limit(limitCount * 2) // Get extra to filter by university vendors
        ];
      } else {
        // Regular query without date filter
        console.log(`📅 Using recent orders query without date filter`);
      }

      const ordersResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        queryFilters
      );

      const allOrders = ordersResponse.documents.map(doc => AppwriteUniversityAdminService.convertDocumentToOrder(doc));

      console.log(`📦 Appwrite returned ${allOrders.length} total orders`);
      
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
      const vendorsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.vendorsCollectionId,
        [
          Query.equal('universityName', universityName),
          Query.limit(4000)
        ]
      );
      
      const universityVendorIds = vendorsResponse.documents.map(doc => doc.$id);
      
      // Get orders, we'll filter by vendor after fetching
      let queryFilters = [
        Query.orderDesc('createdAt'),
        Query.limit(4000) // Limit for performance
      ];
      
      if (vendorId) {
        // If specific vendor requested, only get that vendor's orders
        queryFilters = [
          Query.equal('vendorId', vendorId),
          Query.orderDesc('createdAt'),
          Query.limit(4000)
        ];
      }
      
      const ordersResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        queryFilters
      );
      
      let orders = ordersResponse.documents.map(doc => AppwriteUniversityAdminService.convertDocumentToOrder(doc));
      
      // Filter orders by university vendors (if no specific vendor requested)
      if (!vendorId) {
        orders = orders.filter(order => universityVendorIds.includes(order.vendorId));
      }
      
      // Apply date range filter if provided
      if (dateRange) {
        orders = orders.filter(order => {
          const orderDate = AppwriteUniversityAdminService.toDate(order.createdAt);
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
          const created = AppwriteUniversityAdminService.toDate(order.createdAt);
          const confirmed = AppwriteUniversityAdminService.toDate(order.confirmedAt!);
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
            const created = AppwriteUniversityAdminService.toDate(order.createdAt);
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
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.vendorsCollectionId,
        vendorId,
        {
          isOpen: status === 'active',
          updatedAt: new Date().toISOString()
        }
      );
    } catch (error) {
      console.error('Error updating vendor status:', error);
      throw error;
    }
  }

  // Get university students
  static async getUniversityStudents(universityName: string, limitCount: number = 50): Promise<User[]> {
    try {
      const studentsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [
          Query.equal('universityName', universityName),
          Query.equal('role', 'student'),
          Query.limit(limitCount)
        ]
      );

      return studentsResponse.documents.map(doc => AppwriteUniversityAdminService.convertDocumentToUser(doc));

    } catch (error) {
      console.error('Error fetching university students:', error);
      throw error;
    }
  }

  // Vendor Management Functions
  static async approveVendor(vendorId: string, universityName: string): Promise<boolean> {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.vendorsCollectionId,
        vendorId,
        {
          status: 'approved',
          approvedBy: 'university_admin',
          approvedAt: new Date().toISOString(),
          universityName: universityName
        }
      );
      return true;
    } catch (error) {
      console.error('Error approving vendor:', error);
      throw error;
    }
  }

  static async suspendVendor(vendorId: string, reason?: string): Promise<boolean> {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.vendorsCollectionId,
        vendorId,
        {
          status: 'suspended',
          suspendedBy: 'university_admin',
          suspendedAt: new Date().toISOString(),
          suspensionReason: reason || 'No reason provided'
        }
      );
      return true;
    } catch (error) {
      console.error('Error suspending vendor:', error);
      throw error;
    }
  }

  static async reactivateVendor(vendorId: string): Promise<boolean> {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.vendorsCollectionId,
        vendorId,
        {
          status: 'approved',
          reactivatedBy: 'university_admin',
          reactivatedAt: new Date().toISOString(),
          suspendedBy: null,
          suspendedAt: null,
          suspensionReason: null
        }
      );
      return true;
    } catch (error) {
      console.error('Error reactivating vendor:', error);
      throw error;
    }
  }
}