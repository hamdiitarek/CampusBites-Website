/**
 * Appwrite Vendor Service
 * Service for vendor dashboard analytics and management
 * 
 * This service provides vendor-specific data including:
 * - Order management and analytics
 * - Revenue tracking and trends
 * - Menu item performance
 * - Customer analytics
 * - Operational metrics
 * 
 * All data is filtered by vendorId for security and relevance.
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

// Types for Vendor Dashboard Analytics
interface VendorOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
  customizations?: any;
  category?: string;
}

interface VendorOrder {
  id: string;
  userId: string;
  vendorId: string;
  items: VendorOrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: 'Wallet' | 'Cash';
  createdAt: string;
  updatedAt: string;
  estimatedReadyTime?: string;
  completedAt?: string;
  confirmedAt?: string;
  readyAt?: string;
  cancelledAt?: string;
  statusHistory?: any[];
  customerNote?: string;
}

export interface VendorDashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  completionRate: number;
  pendingOrders: number;
  todayOrders: number;
  todayRevenue: number;
  responseTime: number; // in minutes
}

export interface PopularMenuItem {
  id: string;
  name: string;
  category: string;
  totalSold: number;
  revenue: number;
  averageRating: number;
  trend: 'up' | 'down' | 'stable';
}

export interface VendorRevenueData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface VendorOrderTrend {
  hour: string;
  orders: number;
  revenue: number;
}

export interface VendorCustomerInsight {
  totalCustomers: number;
  returningCustomers: number;
  newCustomers: number;
  customerRetentionRate: number;
  averageOrdersPerCustomer: number;
  topCustomers: {
    id: string;
    name: string;
    totalOrders: number;
    totalSpent: number;
  }[];
}

export class AppwriteVendorService {
  // Helper function to convert Appwrite document to Order
  private static convertDocumentToOrder(doc: any): VendorOrder {
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
      id: doc.$id,
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
      id: doc.$id,
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

  /**
   * Get vendor dashboard metrics
   */
  static async getVendorMetrics(vendorId: string): Promise<VendorDashboardMetrics> {
    try {
      // Get all orders for this vendor
      const ordersResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        [
          Query.equal('vendorId', vendorId),
          Query.orderDesc('$createdAt'),
          Query.limit(1000) // Reasonable limit for analytics
        ]
      );

      const orders = ordersResponse.documents.map(this.convertDocumentToOrder);
      const completedOrders = orders.filter(order => order.status === 'completed');
      
      // Calculate date boundaries
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const todayOrders = orders.filter(order => 
        new Date(order.createdAt) >= todayStart
      );
      
      const todayCompletedOrders = todayOrders.filter(order => order.status === 'completed');

      // Calculate metrics
      const totalOrders = orders.length;
      const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
      const averageOrderValue = totalRevenue / (completedOrders.length || 1);
      const completionRate = (completedOrders.length / (totalOrders || 1)) * 100;
      const pendingOrders = orders.filter(order => 
        ['pending', 'confirmed', 'ready'].includes(order.status)
      ).length;
      
      const todayRevenue = todayCompletedOrders.reduce((sum, order) => sum + order.total, 0);

      // Calculate average response time (time from order to confirmation)
      const responseTimes = orders
        .filter(order => order.confirmedAt && order.createdAt)
        .map(order => {
          const created = new Date(order.createdAt);
          const confirmed = new Date(order.confirmedAt!);
          return (confirmed.getTime() - created.getTime()) / (1000 * 60); // minutes
        });
      
      const responseTime = responseTimes.length > 0 
        ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
        : 0;

      return {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        completionRate,
        pendingOrders,
        todayOrders: todayOrders.length,
        todayRevenue,
        responseTime
      };
    } catch (error) {
      console.error('Error fetching vendor metrics:', error);
      throw error;
    }
  }

  /**
   * Get popular menu items
   */
  static async getPopularMenuItems(vendorId: string, limit: number = 10): Promise<PopularMenuItem[]> {
    try {
      // Get completed orders for this vendor
      const ordersResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        [
          Query.equal('vendorId', vendorId),
          Query.equal('status', 'completed'),
          Query.orderDesc('$createdAt'),
          Query.limit(500) // Get recent completed orders
        ]
      );

      const orders = ordersResponse.documents.map(this.convertDocumentToOrder);
      
      // Aggregate item sales
      const itemStats = new Map<string, {
        name: string;
        category: string;
        totalSold: number;
        revenue: number;
        appearances: number;
      }>();

      orders.forEach(order => {
        order.items.forEach(item => {
          const key = item.name;
          const existing = itemStats.get(key);
          
          if (existing) {
            existing.totalSold += item.quantity;
            existing.revenue += item.price * item.quantity;
            existing.appearances += 1;
          } else {
            itemStats.set(key, {
              name: item.name,
              category: item.category || 'Other',
              totalSold: item.quantity,
              revenue: item.price * item.quantity,
              appearances: 1
            });
          }
        });
      });

      // Convert to array and sort by total sold
      const popularItems = Array.from(itemStats.entries())
        .map(([id, stats]) => ({
          id,
          name: stats.name,
          category: stats.category,
          totalSold: stats.totalSold,
          revenue: stats.revenue,
          averageRating: 4.2, // TODO: Integrate with reviews when available
          trend: 'stable' as const // TODO: Calculate trend based on historical data
        }))
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, limit);

      return popularItems;
    } catch (error) {
      console.error('Error fetching popular menu items:', error);
      throw error;
    }
  }

  /**
   * Get revenue trends over time
   */
  static async getRevenueTrends(vendorId: string, days: number = 30): Promise<VendorRevenueData[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      // Get orders within date range
      const ordersResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        [
          Query.equal('vendorId', vendorId),
          Query.equal('status', 'completed'),
          Query.greaterThanEqual('$createdAt', startDate.toISOString()),
          Query.lessThanEqual('$createdAt', endDate.toISOString()),
          Query.orderDesc('$createdAt'),
          Query.limit(1000)
        ]
      );

      const orders = ordersResponse.documents.map(this.convertDocumentToOrder);
      
      // Group by date
      const dailyData = new Map<string, { revenue: number; orders: number }>();
      
      // Initialize all dates in range
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        dailyData.set(dateKey, { revenue: 0, orders: 0 });
      }

      // Aggregate orders by date
      orders.forEach(order => {
        const dateKey = order.createdAt.split('T')[0];
        const existing = dailyData.get(dateKey);
        if (existing) {
          existing.revenue += order.total;
          existing.orders += 1;
        }
      });

      // Convert to array
      return Array.from(dailyData.entries())
        .map(([date, stats]) => ({
          date,
          revenue: stats.revenue,
          orders: stats.orders,
          averageOrderValue: stats.orders > 0 ? stats.revenue / stats.orders : 0
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error('Error fetching revenue trends:', error);
      throw error;
    }
  }

  /**
   * Get order trends by hour
   */
  static async getOrderTrendsByHour(vendorId: string): Promise<VendorOrderTrend[]> {
    try {
      // Get recent orders (last 7 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);

      const ordersResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        [
          Query.equal('vendorId', vendorId),
          Query.greaterThanEqual('$createdAt', startDate.toISOString()),
          Query.lessThanEqual('$createdAt', endDate.toISOString()),
          Query.orderDesc('$createdAt'),
          Query.limit(1000)
        ]
      );

      const orders = ordersResponse.documents.map(this.convertDocumentToOrder);
      
      // Group by hour (0-23)
      const hourlyData = new Map<number, { orders: number; revenue: number }>();
      
      // Initialize all hours
      for (let i = 0; i < 24; i++) {
        hourlyData.set(i, { orders: 0, revenue: 0 });
      }

      // Aggregate by hour
      orders.forEach(order => {
        const hour = new Date(order.createdAt).getHours();
        const existing = hourlyData.get(hour)!;
        existing.orders += 1;
        if (order.status === 'completed') {
          existing.revenue += order.total;
        }
      });

      // Convert to array
      return Array.from(hourlyData.entries())
        .map(([hour, stats]) => ({
          hour: `${hour.toString().padStart(2, '0')}:00`,
          orders: stats.orders,
          revenue: stats.revenue
        }));
    } catch (error) {
      console.error('Error fetching order trends by hour:', error);
      throw error;
    }
  }

  /**
   * Get customer insights
   */
  static async getCustomerInsights(vendorId: string): Promise<VendorCustomerInsight> {
    try {
      // Get all orders for this vendor
      const ordersResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        [
          Query.equal('vendorId', vendorId),
          Query.orderDesc('$createdAt'),
          Query.limit(1000)
        ]
      );

      const orders = ordersResponse.documents.map(this.convertDocumentToOrder);
      
      // Group by customer
      const customerStats = new Map<string, {
        totalOrders: number;
        totalSpent: number;
        firstOrder: Date;
        lastOrder: Date;
      }>();

      orders.forEach(order => {
        const userId = order.userId;
        const existing = customerStats.get(userId);
        const orderDate = new Date(order.createdAt);
        const orderValue = order.status === 'completed' ? order.total : 0;
        
        if (existing) {
          existing.totalOrders += 1;
          existing.totalSpent += orderValue;
          if (orderDate < existing.firstOrder) existing.firstOrder = orderDate;
          if (orderDate > existing.lastOrder) existing.lastOrder = orderDate;
        } else {
          customerStats.set(userId, {
            totalOrders: 1,
            totalSpent: orderValue,
            firstOrder: orderDate,
            lastOrder: orderDate
          });
        }
      });

      const totalCustomers = customerStats.size;
      const returningCustomers = Array.from(customerStats.values())
        .filter(stats => stats.totalOrders > 1).length;
      const newCustomers = totalCustomers - returningCustomers;
      
      const customerRetentionRate = totalCustomers > 0 
        ? (returningCustomers / totalCustomers) * 100 
        : 0;
      
      const averageOrdersPerCustomer = totalCustomers > 0 
        ? orders.length / totalCustomers 
        : 0;

      // Get customer details for top customers
      const topCustomerIds = Array.from(customerStats.entries())
        .sort(([, a], [, b]) => b.totalSpent - a.totalSpent)
        .slice(0, 5)
        .map(([userId]) => userId);

      const topCustomers = [];
      for (const userId of topCustomerIds) {
        try {
          const userDoc = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            userId
          );
          const user = this.convertDocumentToUser(userDoc);
          const stats = customerStats.get(userId)!;
          
          topCustomers.push({
            id: userId,
            name: user.fullName,
            totalOrders: stats.totalOrders,
            totalSpent: stats.totalSpent
          });
        } catch (error) {
          // Skip if user not found
          console.warn(`User ${userId} not found`);
        }
      }

      return {
        totalCustomers,
        returningCustomers,
        newCustomers,
        customerRetentionRate,
        averageOrdersPerCustomer,
        topCustomers
      };
    } catch (error) {
      console.error('Error fetching customer insights:', error);
      throw error;
    }
  }

  /**
   * Get vendor orders with pagination
   */
  static async getVendorOrders(
    vendorId: string, 
    status?: string, 
    limit: number = 20,
    offset: number = 0
  ): Promise<{ orders: VendorOrder[]; total: number }> {
    try {
      const queries = [
        Query.equal('vendorId', vendorId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.offset(offset)
      ];

      if (status && status !== 'all') {
        queries.push(Query.equal('status', status));
      }

      const ordersResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        queries
      );

      const orders = ordersResponse.documents.map(this.convertDocumentToOrder);
      
      return {
        orders,
        total: ordersResponse.total
      };
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
      throw error;
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date().toISOString()
      };

      // Set appropriate timestamp based on status
      const now = new Date().toISOString();
      switch (status) {
        case 'confirmed':
          updateData.confirmedAt = now;
          break;
        case 'ready':
          updateData.readyAt = now;
          break;
        case 'completed':
          updateData.completedAt = now;
          break;
        case 'cancelled':
          updateData.cancelledAt = now;
          break;
      }

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        orderId,
        updateData
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}