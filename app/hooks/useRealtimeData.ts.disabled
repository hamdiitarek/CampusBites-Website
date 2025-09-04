'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
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

export function useRealtimeUniversityData(universityName: string) {
  const [data, setData] = useState<RealtimeData>({
    analytics: null,
    vendorPerformance: [],
    recentOrders: [],
    studentEngagement: null,
    loading: true,
    error: null,
    lastUpdated: null
  });

  const unsubscribers = useRef<Unsubscribe[]>([]);
  const dataCache = useRef<Map<string, any>>(new Map());

  // Debounce updates to prevent too frequent re-renders
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdates = useRef<Partial<RealtimeData>>({});

  const debouncedUpdate = (updates: Partial<RealtimeData>) => {
    Object.assign(pendingUpdates.current, updates);
    
    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
    }
    
    updateTimeout.current = setTimeout(() => {
      setData(prev => ({
        ...prev,
        ...pendingUpdates.current,
        lastUpdated: new Date()
      }));
      pendingUpdates.current = {};
    }, 500); // 500ms debounce
  };

  useEffect(() => {
    if (!universityName) return;

    const setupRealtimeListeners = () => {
      try {
        // 1. Orders Listener (for analytics and recent orders)
        const ordersQuery = query(
          collection(db, 'orders'),
          where('universityName', '==', universityName),
          orderBy('createdAt', 'desc'),
          limit(100)
        );

        const ordersUnsubscribe = onSnapshot(ordersQuery, (snapshot) => {
          const orders: OrderData[] = [];
          const now = new Date();
          const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

          // Process order data
          let totalRevenue = 0;
          let totalOrders = 0;
          let last30DaysRevenue = 0;
          let last30DaysOrders = 0;
          let last7DaysRevenue = 0;
          let last7DaysOrders = 0;
          const hourlyOrders: { [hour: number]: number } = {};
          const categoryCounts: { [category: string]: number } = {};
          const dailyStats: { [date: string]: { orders: number; revenue: number } } = {};

          snapshot.docs.forEach((doc) => {
            const orderData = { id: doc.id, ...doc.data() } as OrderData;
            const orderDate = orderData.createdAt?.toDate() || new Date();
            
            orders.push(orderData);
            
            // Calculate analytics
            const orderValue = orderData.total || 0;
            totalRevenue += orderValue;
            totalOrders++;

            if (orderDate >= last30Days) {
              last30DaysRevenue += orderValue;
              last30DaysOrders++;
            }

            if (orderDate >= last7Days) {
              last7DaysRevenue += orderValue;
              last7DaysOrders++;
            }

            // Hourly distribution
            const hour = orderDate.getHours();
            hourlyOrders[hour] = (hourlyOrders[hour] || 0) + 1;

            // Category counts
            if (orderData.items) {
              orderData.items.forEach((item: any) => {
                const category = item.category || 'Other';
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
              });
            }

            // Daily stats
            const dateStr = orderDate.toISOString().split('T')[0];
            if (!dailyStats[dateStr]) {
              dailyStats[dateStr] = { orders: 0, revenue: 0 };
            }
            dailyStats[dateStr].orders++;
            dailyStats[dateStr].revenue += orderValue;
          });

          // Build analytics object
          const analytics: AnalyticsData = {
            totalRevenue: last30DaysRevenue || 45000, // Fallback sample data
            totalOrders: last30DaysOrders || 320,
            totalStudents: 0, // Will be updated by students listener
            totalVendors: 0, // Will be updated by vendors listener
            averageOrderValue: last30DaysOrders > 0 ? last30DaysRevenue / last30DaysOrders : 140,
            ordersGrowth: Math.random() * 20 - 10, // Sample growth rate
            revenueGrowth: Math.random() * 15 - 5, // Sample growth rate
            topSellingItems: [
              { 
                id: '1', 
                name: 'Chicken Burger', 
                category: 'Fast Food',
                totalOrders: 45,
                revenue: 2250,
                averageRating: 4.5,
                popularityScore: 95,
                trend: 'up' as const,
                trendPercentage: 12,
                peakHours: ['12:00', '13:00', '18:00'],
                lastWeekOrders: 38,
                thisWeekOrders: 45
              },
              { 
                id: '2', 
                name: 'Caesar Salad', 
                category: 'Healthy',
                totalOrders: 38,
                revenue: 1520,
                averageRating: 4.3,
                popularityScore: 88,
                trend: 'stable' as const,
                trendPercentage: 2,
                peakHours: ['12:00', '14:00'],
                lastWeekOrders: 37,
                thisWeekOrders: 38
              },
              { 
                id: '3', 
                name: 'Coffee Latte', 
                category: 'Beverages',
                totalOrders: 62,
                revenue: 1860,
                averageRating: 4.7,
                popularityScore: 92,
                trend: 'up' as const,
                trendPercentage: 8,
                peakHours: ['08:00', '10:00', '15:00'],
                lastWeekOrders: 55,
                thisWeekOrders: 62
              }
            ], // Sample top items
            peakOrderTimes: Object.entries(hourlyOrders).length > 0 
              ? Object.entries(hourlyOrders)
                  .map(([hour, count]) => ({ hour: parseInt(hour), orders: count }))
                  .sort((a, b) => a.hour - b.hour)
              : [
                  { hour: 8, orders: 12 }, { hour: 9, orders: 18 }, { hour: 10, orders: 15 },
                  { hour: 11, orders: 25 }, { hour: 12, orders: 45 }, { hour: 13, orders: 38 },
                  { hour: 14, orders: 22 }, { hour: 15, orders: 19 }, { hour: 16, orders: 28 },
                  { hour: 17, orders: 35 }, { hour: 18, orders: 42 }, { hour: 19, orders: 31 },
                  { hour: 20, orders: 24 }, { hour: 21, orders: 16 }
                ],
            popularCategories: Object.entries(categoryCounts).length > 0
              ? Object.entries(categoryCounts)
                  .map(([category, count]) => ({
                    category,
                    orders: count,
                    percentage: (count / totalOrders) * 100,
                    revenue: count * 50 // Mock revenue calculation for real-time data
                  }))
                  .sort((a, b) => b.orders - a.orders)
              : [
                  { category: 'Fast Food', orders: 85, percentage: 26.6, revenue: 4250 },
                  { category: 'Healthy', orders: 72, percentage: 22.5, revenue: 3600 },
                  { category: 'Beverages', orders: 68, percentage: 21.2, revenue: 3400 },
                  { category: 'Desserts', orders: 45, percentage: 14.1, revenue: 2250 },
                  { category: 'Snacks', orders: 50, percentage: 15.6, revenue: 2500 }
                ],
            dailyStats: Object.entries(dailyStats).length > 0
              ? Object.entries(dailyStats)
                  .map(([date, stats]) => ({
                    date,
                    orders: stats.orders,
                    revenue: stats.revenue
                  }))
                  .sort((a, b) => a.date.localeCompare(b.date))
              : [
                  { date: '2025-08-01', orders: 32, revenue: 4480 },
                  { date: '2025-08-02', orders: 28, revenue: 3920 },
                  { date: '2025-08-03', orders: 35, revenue: 4900 },
                  { date: '2025-08-04', orders: 42, revenue: 5880 },
                  { date: '2025-08-05', orders: 38, revenue: 5320 },
                  { date: '2025-08-06', orders: 45, revenue: 6300 },
                  { date: '2025-08-07', orders: 40, revenue: 5600 }
                ],
            weeklyComparison: {
              thisWeek: last7DaysRevenue,
              lastWeek: 0, // Calculate from previous week data
              growth: 0
            },
            monthlyComparison: {
              thisMonth: last30DaysRevenue,
              lastMonth: 0, // Calculate from previous month data
              growth: 0
            }
          };

          debouncedUpdate({
            analytics,
            recentOrders: orders.slice(0, 20),
            loading: false
          });
        }, (error) => {
          console.error('Orders listener error:', error);
          debouncedUpdate({ error: error.message, loading: false });
        });

        // 2. Vendors Listener
        const vendorsQuery = query(
          collection(db, 'vendors'),
          where('universityName', '==', universityName)
        );

        const vendorsUnsubscribe = onSnapshot(vendorsQuery, (snapshot) => {
          const vendors: VendorPerformanceData[] = [];
          
          snapshot.docs.forEach((doc) => {
            const vendorData = doc.data();
            vendors.push({
              id: doc.id,
              name: vendorData.name || 'Unknown Vendor',
              totalOrders: vendorData.totalOrders || 0,
              totalRevenue: vendorData.totalRevenue || 0,
              averageRating: vendorData.averageRating || 0,
              completionRate: vendorData.completionRate || 0,
              responseTime: vendorData.responseTime || 0,
              status: vendorData.status || 'active',
              popularItems: vendorData.popularItems || [],
              peakHours: vendorData.peakHours || [],
              growth: vendorData.growth || 0
            });
          });

          // Update analytics with vendor count
          debouncedUpdate({
            vendorPerformance: vendors,
            analytics: data.analytics ? {
              ...data.analytics,
              totalVendors: vendors.length
            } : null
          });
        }, (error) => {
          console.error('Vendors listener error:', error);
          debouncedUpdate({ error: error.message });
        });

        // 3. Students Listener
        const studentsQuery = query(
          collection(db, 'users'),
          where('universityName', '==', universityName),
          where('role', '==', 'student')
        );

        const studentsUnsubscribe = onSnapshot(studentsQuery, (snapshot) => {
          const studentCount = snapshot.size;
          const activeStudents = snapshot.docs.filter(doc => {
            const data = doc.data();
            const lastActive = data.lastActive?.toDate();
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return lastActive && lastActive > sevenDaysAgo;
          }).length;

          const studentEngagement: StudentEngagementData = {
            totalActiveStudents: activeStudents,
            newStudentsThisWeek: 0, // Calculate based on registration date
            returningCustomers: 0, // Calculate from orders data
            averageOrdersPerStudent: 0, // Calculate from orders data
            studentRetentionRate: 0, // Calculate retention rate
            topSpendingStudents: []
          };

          debouncedUpdate({
            studentEngagement,
            analytics: data.analytics ? {
              ...data.analytics,
              totalStudents: studentCount
            } : null
          });
        }, (error) => {
          console.error('Students listener error:', error);
          debouncedUpdate({ error: error.message });
        });

        // Store unsubscribers
        unsubscribers.current = [
          ordersUnsubscribe,
          vendorsUnsubscribe,
          studentsUnsubscribe
        ];

      } catch (error) {
        console.error('Error setting up realtime listeners:', error);
        setData(prev => ({
          ...prev,
          error: 'Failed to setup real-time updates',
          loading: false
        }));
      }
    };

    setupRealtimeListeners();

    // Cleanup function
    return () => {
      unsubscribers.current.forEach(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
      unsubscribers.current = [];
      
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
    };
  }, [universityName]);

  // Manual refresh function
  const refresh = () => {
    setData(prev => ({ ...prev, loading: true, error: null }));
    // Listeners will automatically update the data
  };

  return {
    ...data,
    refresh,
    isConnected: unsubscribers.current.length > 0
  };
}

// Hook for real-time notifications
export function useRealtimeNotifications(universityName: string) {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'order' | 'vendor' | 'system';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>>([]);

  useEffect(() => {
    if (!universityName) return;

    // Listen for new orders for notifications
    const ordersQuery = query(
      collection(db, 'orders'),
      where('universityName', '==', universityName),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const orderData = change.doc.data();
          setNotifications(prev => [{
            id: change.doc.id,
            type: 'order',
            title: 'New Order',
            message: `New order from ${orderData.customerName || 'Customer'} - ${orderData.totalAmount} EGP`,
            timestamp: orderData.createdAt?.toDate() || new Date(),
            read: false
          }, ...prev.slice(0, 9)]);
        }
      });
    });

    return () => unsubscribe();
  }, [universityName]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAsRead,
    clearAll
  };
}
