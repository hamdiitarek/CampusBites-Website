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
  popularCategories: { category: string; percentage: number; orders: number; }[];
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
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: string;
  createdAt: Timestamp;
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

      // Filter orders by university (since we can't query by universityName directly due to compound index limitations)
      // We'll get the vendor's university and filter
      const vendorsQuery = query(
        collection(db, 'vendors'),
        where('universityName', '==', universityName)
      );
      
      const vendorsSnapshot = await getDocs(vendorsQuery);
      const universityVendorIds = vendorsSnapshot.docs.map(doc => doc.id);

      // Filter orders for this university's vendors
      const orders = allOrders.filter(order => 
        universityVendorIds.includes(order.vendorId)
      );

      // Calculate analytics
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

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
      
      const previousOrders = allPreviousOrders.filter(order => 
        universityVendorIds.includes(order.vendorId)
      );
      
      const previousRevenue = previousOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const ordersGrowth = previousOrders.length > 0 ? ((totalOrders - previousOrders.length) / previousOrders.length) * 100 : 0;
      const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      // Analyze food trends
      const itemCounts: { [key: string]: { count: number; revenue: number; category: string; } } = {};
      const categoryCounts: { [key: string]: number } = {};
      const hourlyOrders: { [key: number]: number } = {};

      // Get vendor data to enrich order items with categories
      const vendorDataMap: { [vendorId: string]: any } = {};
      for (const vendorDoc of vendorsSnapshot.docs) {
        vendorDataMap[vendorDoc.id] = vendorDoc.data();
      }

      orders.forEach(order => {
        const hour = order.createdAt.toDate().getHours();
        hourlyOrders[hour] = (hourlyOrders[hour] || 0) + 1;

        const vendorData = vendorDataMap[order.vendorId];
        const defaultCategory = vendorData?.categories?.[0] || 'Main Course';

        order.items.forEach(item => {
          // Use the vendor's main category as default category for items
          const itemCategory = defaultCategory;
          
          if (!itemCounts[item.name]) {
            itemCounts[item.name] = { count: 0, revenue: 0, category: itemCategory };
          }
          itemCounts[item.name].count += item.quantity;
          itemCounts[item.name].revenue += item.price * item.quantity;
          
          categoryCounts[itemCategory] = (categoryCounts[itemCategory] || 0) + item.quantity;
        });
      });

      // Top selling items
      const topSellingItems: FoodTrendData[] = Object.entries(itemCounts)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(([name, data]) => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          category: data.category,
          totalOrders: data.count,
          revenue: data.revenue,
          averageRating: 4.2, // TODO: Calculate from reviews
          popularityScore: (data.count / totalOrders) * 100,
          trend: 'stable' as const, // TODO: Calculate trend
          trendPercentage: 0,
          peakHours: ['12:00', '18:00'], // TODO: Calculate actual peak hours
          lastWeekOrders: Math.floor(data.count * 0.4),
          thisWeekOrders: Math.floor(data.count * 0.6)
        }));

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
          percentage: (count / totalCategoryOrders) * 100
        }))
        .sort((a, b) => b.orders - a.orders);

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
        
        // Filter orders for this specific vendor
        const orders = allOrders.filter((order: any) => order.vendorId === vendorDoc.id);

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
        const completedOrders = orders.filter((order: any) => order.status === 'completed').length;
        const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

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
      // Get vendors for this university first
      const vendorsQuery = query(
        collection(db, 'vendors'),
        where('universityName', '==', universityName)
      );
      
      const vendorsSnapshot = await getDocs(vendorsQuery);
      const universityVendorIds = vendorsSnapshot.docs.map(doc => doc.id);

      if (universityVendorIds.length === 0) {
        return [];
      }

      // Build orders query
      let ordersQuery;
      
      if (customDateRange) {
        // Query with date range
        const startTimestamp = Timestamp.fromDate(customDateRange.from);
        const endDate = new Date(customDateRange.to);
        endDate.setHours(23, 59, 59, 999); // End of day
        const endTimestamp = Timestamp.fromDate(endDate);
        
        ordersQuery = query(
          collection(db, 'orders'),
          where('createdAt', '>=', startTimestamp),
          where('createdAt', '<=', endTimestamp),
          orderBy('createdAt', 'desc'),
          limit(limitCount * 2) // Get extra to filter by university vendors
        );
      } else {
        // Regular query without date filter
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

      // Filter orders for this university's vendors
      const universityOrders = allOrders
        .filter(order => universityVendorIds.includes(order.vendorId))
        .slice(0, limitCount);

      return universityOrders;

    } catch (error) {
      console.error('Error fetching recent orders:', error);
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
}
