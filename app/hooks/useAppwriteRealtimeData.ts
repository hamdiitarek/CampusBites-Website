'use client';

import { useState, useEffect, useRef } from 'react';
import { Query } from 'appwrite';
import { databases, appwriteConfig, client } from '@/lib/appwrite';
import { 
  AnalyticsData, 
  VendorPerformanceData, 
  OrderData, 
  StudentEngagementData,
  FoodTrendData 
} from '../../lib/universityAdminService';

interface RealtimeData {
  analytics: AnalyticsData | null;
  vendorPerformance: VendorPerformanceData[];
  recentOrders: OrderData[];
  studentEngagement: StudentEngagementData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface UseRealtimeDataOptions {
  universityName?: string;
  refreshInterval?: number;
  enableRealtime?: boolean;
}

export function useAppwriteRealtimeData(options: UseRealtimeDataOptions = {}): RealtimeData {
  const {
    universityName,
    refreshInterval = 30000, // 30 seconds
    enableRealtime = true
  } = options;

  const [data, setData] = useState<RealtimeData>({
    analytics: null,
    vendorPerformance: [],
    recentOrders: [],
    studentEngagement: null,
    loading: true,
    error: null,
    lastUpdated: null
  });

  const subscriptionsRef = useRef<Array<() => void>>([]);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch analytics data
  const fetchAnalytics = async (): Promise<AnalyticsData | null> => {
    try {
      const queries = universityName 
        ? [Query.equal('universityName', universityName)]
        : [];

      // Get total orders
      const ordersResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        [...queries, Query.limit(1000)]
      );

      // Get total revenue
      const totalRevenue = ordersResponse.documents
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + (order.total || 0), 0);

      // Get active vendors
      const vendorsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.vendorsCollectionId,
        [
          ...queries,
          Query.equal('isApproved', true),
          Query.equal('isSuspended', false)
        ]
      );

      // Get active students (users with role 'student')
      const studentsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [
          ...queries,
          Query.equal('role', 'student')
        ]
      );

      return {
        totalOrders: ordersResponse.documents.length,
        totalRevenue,
        totalVendors: vendorsResponse.documents.length,
        totalStudents: studentsResponse.documents.length,
        averageOrderValue: ordersResponse.documents.length > 0 
          ? totalRevenue / ordersResponse.documents.length 
          : 0,
        ordersGrowth: 0, // TODO: Calculate based on historical data
        revenueGrowth: 0, // TODO: Calculate based on historical data
        topSellingItems: [], // TODO: Analyze order items
        peakOrderTimes: [], // TODO: Analyze order timestamps
        popularCategories: [], // TODO: Analyze categories
        dailyStats: [], // TODO: Calculate daily statistics
        weeklyComparison: { thisWeek: 0, lastWeek: 0, growth: 0 }, // TODO: Calculate
        monthlyComparison: { thisMonth: 0, lastMonth: 0, growth: 0 } // TODO: Calculate
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  };

  // Fetch vendor performance data
  const fetchVendorPerformance = async (): Promise<VendorPerformanceData[]> => {
    try {
      const queries = universityName 
        ? [Query.equal('universityName', universityName)]
        : [];

      const vendorsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.vendorsCollectionId,
        [...queries, Query.equal('isApproved', true)]
      );

      const performance: VendorPerformanceData[] = [];

      for (const vendor of vendorsResponse.documents) {
        // Get orders for this vendor
        const ordersResponse = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.ordersCollectionId,
          [Query.equal('vendorId', vendor.$id)]
        );

        const completedOrders = ordersResponse.documents.filter(
          order => order.status === 'completed'
        );

        const totalRevenue = completedOrders.reduce(
          (sum, order) => sum + (order.total || 0), 0
        );

        performance.push({
          id: vendor.$id,
          name: vendor.name,
          totalOrders: ordersResponse.documents.length,
          totalRevenue,
          averageRating: vendor.rating || 0,
          responseTime: 0, // TODO: Calculate from order timestamps
          completionRate: ordersResponse.documents.length > 0 
            ? (completedOrders.length / ordersResponse.documents.length) * 100 
            : 0,
          popularItems: [], // TODO: Analyze order items
          peakHours: [], // TODO: Analyze order timestamps
          growth: 0, // TODO: Calculate growth rate
          status: vendor.isApproved ? 'approved' : 'pending'
        });
      }

      return performance.sort((a, b) => b.totalRevenue - a.totalRevenue);
    } catch (error) {
      console.error('Error fetching vendor performance:', error);
      return [];
    }
  };

  // Helper function to create Firebase-compatible timestamp
  const createTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return {
      toDate: () => date,
      seconds: Math.floor(date.getTime() / 1000),
      nanoseconds: 0,
      toMillis: () => date.getTime(),
      toJSON: () => ({ 
        seconds: Math.floor(date.getTime() / 1000), 
        nanoseconds: 0,
        type: 'timestamp'
      }),
      isEqual: (other: any) => date.getTime() === other.toMillis(),
      valueOf: () => date.toISOString()
    };
  };

  // Fetch recent orders
  const fetchRecentOrders = async (): Promise<OrderData[]> => {
    try {
      const queries = universityName 
        ? [Query.equal('universityName', universityName)] // TODO: Add university filter to orders
        : [];

      const ordersResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        [
          ...queries,
          Query.orderDesc('$createdAt'),
          Query.limit(50)
        ]
      );

      return ordersResponse.documents.map(order => ({
        id: order.$id,
        userId: order.userId,
        vendorId: order.vendorId,
        items: order.items || [],
        total: order.total,
        status: order.status,
        paymentMethod: order.paymentMethod,
        createdAt: createTimestamp(order.$createdAt),
        confirmedAt: order.confirmedAt ? createTimestamp(order.confirmedAt) : undefined,
        readyAt: order.readyAt ? createTimestamp(order.readyAt) : undefined,
        completedAt: order.completedAt ? createTimestamp(order.completedAt) : undefined,
        cancelledAt: order.cancelledAt ? createTimestamp(order.cancelledAt) : undefined,
        statusHistory: order.statusHistory || []
      }));
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      return [];
    }
  };

  // Fetch student engagement data
  const fetchStudentEngagement = async (): Promise<StudentEngagementData | null> => {
    try {
      const queries = universityName 
        ? [Query.equal('universityName', universityName)]
        : [];

      // Get total students
      const studentsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [...queries, Query.equal('role', 'student')]
      );

      // Get orders from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentOrdersResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        [
          ...queries,
          Query.greaterThan('$createdAt', thirtyDaysAgo.toISOString())
        ]
      );

      // Calculate unique active users
      const activeUsers = new Set(recentOrdersResponse.documents.map(order => order.userId));

      return {
        totalActiveStudents: activeUsers.size,
        newStudentsThisWeek: 0, // TODO: Calculate new students this week
        returningCustomers: 0, // TODO: Calculate returning customers
        averageOrdersPerStudent: activeUsers.size > 0 
          ? recentOrdersResponse.documents.length / activeUsers.size 
          : 0,
        studentRetentionRate: 0, // TODO: Calculate based on historical data
        topSpendingStudents: [] // TODO: Calculate top spending students
      };
    } catch (error) {
      console.error('Error fetching student engagement:', error);
      return null;
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [analytics, vendorPerformance, recentOrders, studentEngagement] = await Promise.all([
        fetchAnalytics(),
        fetchVendorPerformance(),
        fetchRecentOrders(),
        fetchStudentEngagement()
      ]);

      setData({
        analytics,
        vendorPerformance,
        recentOrders,
        studentEngagement,
        loading: false,
        error: null,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data'
      }));
    }
  };

  // Set up real-time subscriptions
  const setupRealtimeSubscriptions = () => {
    if (!enableRealtime) return;

    // Subscribe to orders collection
    const ordersChannel = `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.ordersCollectionId}.documents`;
    const ordersUnsubscribe = client.subscribe(ordersChannel, (response) => {
      console.log('Orders updated:', response);
      // Refresh data when orders change
      fetchAllData();
    });

    // Subscribe to vendors collection
    const vendorsChannel = `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.vendorsCollectionId}.documents`;
    const vendorsUnsubscribe = client.subscribe(vendorsChannel, (response) => {
      console.log('Vendors updated:', response);
      // Refresh data when vendors change
      fetchAllData();
    });

    subscriptionsRef.current = [ordersUnsubscribe, vendorsUnsubscribe];
  };

  // Set up periodic refresh
  const setupPeriodicRefresh = () => {
    if (refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(fetchAllData, refreshInterval);
    }
  };

  // Initialize
  useEffect(() => {
    fetchAllData();
    setupRealtimeSubscriptions();
    setupPeriodicRefresh();

    return () => {
      // Cleanup subscriptions
      subscriptionsRef.current.forEach(unsubscribe => {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing:', error);
        }
      });

      // Cleanup interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [universityName, refreshInterval, enableRealtime]);

  return data;
}

// Export for compatibility
export { useAppwriteRealtimeData as useRealtimeData };