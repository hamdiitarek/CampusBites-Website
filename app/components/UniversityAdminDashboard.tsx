'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { UniversityAdminLayout } from './universityAdmin/UniversityAdminLayout';
import { FoodTrendsAnalysis } from './universityAdmin/FoodTrendsAnalysis';
import { AdvancedAnalyticsCharts, MetricCard } from './universityAdmin/AnalyticsCharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../(landing)/components/ui/card';
import { Button } from '../(landing)/components/ui/button';
import { Input } from '../(landing)/components/ui/input';
import { Badge } from '../(landing)/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../(landing)/components/ui/tabs';
import { 
  Users, 
  Store, 
  ShoppingCart, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Star,
  Utensils,
  Coffee,
  Pizza,
  Apple,
  ChefHat,
  Timer,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  Eye,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../(landing)/components/ui/dropdown-menu';
import { 
  UniversityAdminService,
  AnalyticsData,
  StudentEngagementData,
  VendorPerformanceData,
  OrderData,
  FoodTrendData
} from '../../lib/universityAdminService';
import { AdvancedFilters, FilterConfig } from './universityAdmin/AdvancedFilters';
import { useToast } from '@/hooks/use-toast';

export function UniversityAdminDashboard() {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  // Initialize filters with default values instead of null
  const [filters, setFilters] = useState<FilterConfig>({
    dateRange: { from: null, to: null },
    timePeriod: '90d', // Changed from 30d to 90d to show all demo data by default
    categories: [],
    vendors: [],
    orderStatus: [],
    priceRange: { min: 0, max: 1000 },
    searchTerm: ''
  });

  // State for data
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [vendorPerformance, setVendorPerformance] = useState<VendorPerformanceData[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderData[]>([]);
  const [studentEngagement, setStudentEngagement] = useState<StudentEngagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get university name from user context
  const universityName = user?.universityName || 'Egypt University of Informatics';

  // State for vendor analytics
  const [vendorAnalytics, setVendorAnalytics] = useState<{[vendorId: string]: any}>({});

  // Utility function to handle different timestamp formats
  const toDate = (timestamp: any): Date => {
    if (!timestamp) return new Date();
    try {
      return timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    } catch (error) {
      return new Date();
    }
  };

  // Real-time calculation functions using migrated timestamp fields
  const calculateAverageResponseTime = (orders: OrderData[]) => {
    // Use real confirmedAt timestamps from migrated orders
    const ordersWithConfirmation = orders.filter(order => 
      order.confirmedAt && order.createdAt && order.status !== 'cancelled'
    );
    
    if (ordersWithConfirmation.length === 0) {
      // Fallback: estimate for orders without confirmed timestamps
      const completedOrders = orders.filter(order => 
        order.status === 'completed' && order.createdAt
      );
      
      if (completedOrders.length === 0) return 0;
      
      const now = new Date();
      const totalEstimatedTime = completedOrders.reduce((sum, order) => {
        const created = toDate(order.createdAt);
        const timeSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60);
        const estimatedResponseTime = Math.min(timeSinceCreated, 25);
        return sum + estimatedResponseTime;
      }, 0);
      
      return Math.round(totalEstimatedTime / completedOrders.length);
    }
    
    // Use real confirmation timestamps
    const totalResponseTime = ordersWithConfirmation.reduce((sum, order) => {
      const created = toDate(order.createdAt);
      const confirmed = toDate(order.confirmedAt);
      const responseTime = (confirmed.getTime() - created.getTime()) / (1000 * 60); // in minutes
      return sum + responseTime;
    }, 0);
    
    return Math.round(totalResponseTime / ordersWithConfirmation.length);
  };

  const calculateCompletionRate = (orders: OrderData[]) => {
    const totalOrders = orders.filter(order => order.status !== 'cancelled').length;
    if (totalOrders === 0) return 0;
    
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    return (completedOrders / totalOrders) * 100;
  };

  const calculateVendorMetrics = (vendorId: string, orders: OrderData[]) => {
    const vendorOrders = orders.filter(order => order.vendorId === vendorId);
    
    const totalRevenue = vendorOrders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.total, 0);
    
    return {
      totalOrders: vendorOrders.length,
      completionRate: calculateCompletionRate(vendorOrders),
      averageResponseTime: calculateAverageResponseTime(vendorOrders),
      totalRevenue
    };
  };

  const displayVendorMetrics = (vendor: VendorPerformanceData) => {
    const analytics = vendorAnalytics[vendor.id];
    
    return {
      completionRate: analytics?.completionRate ?? vendor.completionRate,
      responseTime: analytics?.averageResponseTime ?? vendor.responseTime,
      totalRevenue: analytics?.totalRevenue ?? vendor.totalRevenue,
      totalOrders: analytics?.totalOrders ?? vendor.totalOrders
    };
  };

    // Load initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        console.log('🚀 Loading dashboard data for university:', universityName);
        console.log('🔄 Dashboard useEffect triggered - loading initial data');
        
        const [analyticsData, vendorsData, ordersData, studentsData, studentListData] = await Promise.all([
          UniversityAdminService.getUniversityAnalytics(universityName, '90d'), // Changed from 30d to 90d to capture all demo data
          UniversityAdminService.getVendorPerformance(universityName),
          UniversityAdminService.getRecentOrders(universityName, 1000), // Load much more orders to match all demo data (783 orders)
          UniversityAdminService.getStudentEngagement(universityName),
          UniversityAdminService.getUniversityStudents(universityName, 100) // Load more students for better filtering
        ]);

        console.log('📊 Dashboard loaded data:', {
          analytics: analyticsData,
          ordersCount: ordersData.length,
          vendorsCount: vendorsData.length,
          studentsCount: studentsData
        });

        setAnalytics(analyticsData);
        setVendorPerformance(vendorsData);
        setRecentOrders(ordersData);
        setStudentEngagement(studentsData);
        setStudents(studentListData);
        setError(null);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load dashboard data');
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [universityName, toast]);

  // Load analytics data when time range changes (separate effect)
  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        // Use custom date range if available, otherwise fall back to time period
        let timePeriod = filters?.timePeriod || '90d'; // Changed default from 30d to 90d
        let customDateRange: { from: Date; to: Date } | undefined;
        
        // If we have a custom date range, use it
        if (filters?.dateRange?.from || filters?.dateRange?.to) {
          // Handle partial date ranges
          let fromDate = filters.dateRange?.from;
          let toDate = filters.dateRange?.to;
          
          if (fromDate && !toDate) {
            // If only "from" date is selected, set "to" date to end of that day
            toDate = new Date(fromDate);
            toDate.setHours(23, 59, 59, 999);
          } else if (!fromDate && toDate) {
            // If only "to" date is selected, set "from" date to start of that day
            fromDate = new Date(toDate);
            fromDate.setHours(0, 0, 0, 0);
          }
          
          if (fromDate && toDate) {
            customDateRange = { from: fromDate, to: toDate };
          }
        }
        
        const analyticsData = await UniversityAdminService.getUniversityAnalytics(
          universityName, 
          timePeriod, 
          customDateRange
        );
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Error loading analytics data:', err);
        toast({
          title: 'Warning',
          description: 'Failed to update analytics data',
          variant: 'destructive'
        });
      }
    };

    // Only load analytics if we have initial data loaded
    if (!loading) {
      loadAnalyticsData();
    }
  }, [universityName, filters?.timePeriod, filters?.dateRange, loading, toast]);

  // Load orders data when date range changes
  useEffect(() => {
    const loadOrdersData = async () => {
      try {
        let customDateRange: { from: Date; to: Date } | undefined;
        
        // If we have a custom date range, use it
        if (filters?.dateRange?.from || filters?.dateRange?.to) {
          // Handle partial date ranges
          let fromDate = filters.dateRange?.from;
          let toDate = filters.dateRange?.to;
          
          if (fromDate && !toDate) {
            // If only "from" date is selected, set "to" date to end of that day
            toDate = new Date(fromDate);
            toDate.setHours(23, 59, 59, 999);
          } else if (!fromDate && toDate) {
            // If only "to" date is selected, set "from" date to start of that day
            fromDate = new Date(toDate);
            fromDate.setHours(0, 0, 0, 0);
          }
          
          if (fromDate && toDate) {
            customDateRange = { from: fromDate, to: toDate };
          }
        }
        
        const ordersData = await UniversityAdminService.getRecentOrders(
          universityName, 
          1000, // Load much more orders to match all demo data
          customDateRange
        );
        setRecentOrders(ordersData);
      } catch (err) {
        console.error('Error loading orders data:', err);
        toast({
          title: 'Warning',
          description: 'Failed to update orders data',
          variant: 'destructive'
        });
      }
    };

    // Only load orders if we have initial data loaded
    if (!loading) {
      loadOrdersData();
    }
  }, [universityName, filters?.dateRange, loading, toast]);

  // Load real-time vendor analytics when vendor data or orders change
  useEffect(() => {
    const loadVendorAnalytics = async () => {
      if (vendorPerformance.length > 0) {
        try {
          const analyticsMap: {[vendorId: string]: any} = {};
          
          // Option 1: Use backend service for real-time data (when orders are available)
          if (recentOrders.length > 0) {
            // Calculate from local order data for real-time updates
            vendorPerformance.forEach(vendor => {
              const metrics = calculateVendorMetrics(vendor.id, recentOrders);
              analyticsMap[vendor.id] = metrics;
            });
          } else {
            // Option 2: Fetch from backend when local data is not available
            const analyticsPromises = vendorPerformance.slice(0, 5).map(async (vendor) => {
              try {
                const analytics = await UniversityAdminService.getVendorAnalytics(
                  universityName, 
                  vendor.id,
                  filters.dateRange && filters.dateRange.from && filters.dateRange.to 
                    ? { from: filters.dateRange.from, to: filters.dateRange.to }
                    : undefined
                );
                return { vendorId: vendor.id, analytics };
              } catch (error) {
                console.error(`Error loading analytics for vendor ${vendor.id}:`, error);
                // Fallback to original vendor data
                return { 
                  vendorId: vendor.id, 
                  analytics: {
                    completionRate: vendor.completionRate,
                    averageResponseTime: vendor.responseTime,
                    totalRevenue: vendor.totalRevenue,
                    totalOrders: vendor.totalOrders
                  }
                };
              }
            });
            
            const results = await Promise.all(analyticsPromises);
            results.forEach(({ vendorId, analytics }) => {
              analyticsMap[vendorId] = analytics;
            });
          }
          
          setVendorAnalytics(analyticsMap);
        } catch (error) {
          console.error('Error loading vendor analytics:', error);
        }
      }
    };

    loadVendorAnalytics();
  }, [vendorPerformance, recentOrders, filters.dateRange, universityName]);

  // Refresh function - preserves current filters
  const refresh = async () => {
    setLoading(true);
    try {
      const timePeriod = filters?.timePeriod || '90d'; // Changed default from 30d to 90d
      let customDateRange: { from: Date; to: Date } | undefined;
      
      // Use custom date range if available
      if (filters?.dateRange?.from || filters?.dateRange?.to) {
        // Handle partial date ranges
        let fromDate = filters.dateRange?.from;
        let toDate = filters.dateRange?.to;
        
        if (fromDate && !toDate) {
          // If only "from" date is selected, set "to" date to end of that day
          toDate = new Date(fromDate);
          toDate.setHours(23, 59, 59, 999);
        } else if (!fromDate && toDate) {
          // If only "to" date is selected, set "from" date to start of that day
          fromDate = new Date(toDate);
          fromDate.setHours(0, 0, 0, 0);
        }
        
        if (fromDate && toDate) {
          customDateRange = { from: fromDate, to: toDate };
        }
      }
      
      const [analyticsData, vendorsData, ordersData, studentsData, studentListData] = await Promise.all([
        UniversityAdminService.getUniversityAnalytics(universityName, timePeriod, customDateRange),
        UniversityAdminService.getVendorPerformance(universityName),
        UniversityAdminService.getRecentOrders(universityName, 1000, customDateRange), // Load much more orders to capture all demo data
        UniversityAdminService.getStudentEngagement(universityName),
        UniversityAdminService.getUniversityStudents(universityName, 100) // Load more students for better filtering
      ]);

      setAnalytics(analyticsData);
      setVendorPerformance(vendorsData);
      setRecentOrders(ordersData);
      setStudentEngagement(studentsData);
      setStudents(studentListData);
      
      toast({
        title: 'Success',
        description: 'Dashboard data refreshed successfully',
      });
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      toast({
        title: 'Error',
        description: 'Failed to refresh dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Derived state for UI
  const [students, setStudents] = useState([]);
  const foodTrends = analytics?.topSellingItems || [];

  // Trend calculation functions
  
  const getTrendDirection = (trendValue: number): 'up' | 'down' | 'stable' => {
    if (Math.abs(trendValue) < 1) return 'stable';
    return trendValue > 0 ? 'up' : 'down';
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: FilterConfig) => {
    const oldTimePeriod = filters?.timePeriod;
    const oldDateRange = filters?.dateRange;
    setFilters(newFilters);
    
    // Determine if we need to reload data
    const timePeriodChanged = oldTimePeriod !== newFilters.timePeriod;
    const dateRangeChanged = JSON.stringify(oldDateRange) !== JSON.stringify(newFilters.dateRange);
    
    // If time period or date range changed, reload data immediately
    if (timePeriodChanged || dateRangeChanged) {
      const loadData = async () => {
        try {
          let customDateRange: { from: Date; to: Date } | undefined;
          
          // Use custom date range if available
          if (newFilters.dateRange?.from || newFilters.dateRange?.to) {
            // Handle partial date ranges - if only one date is provided, create a reasonable range
            let fromDate = newFilters.dateRange?.from;
            let toDate = newFilters.dateRange?.to;
            
            if (fromDate && !toDate) {
              // If only "from" date is selected, set "to" date to end of that day
              toDate = new Date(fromDate);
              toDate.setHours(23, 59, 59, 999);
            } else if (!fromDate && toDate) {
              // If only "to" date is selected, set "from" date to start of that day
              fromDate = new Date(toDate);
              fromDate.setHours(0, 0, 0, 0);
            }
            
            if (fromDate && toDate) {
              customDateRange = { from: fromDate, to: toDate };
            }
          }
          
          // Load both analytics and orders data with the new filters
          const [analyticsData, ordersData] = await Promise.all([
            UniversityAdminService.getUniversityAnalytics(
              universityName, 
              newFilters.timePeriod,
              customDateRange
            ),
            UniversityAdminService.getRecentOrders(
              universityName, 
              1000, // Load much more orders to capture all demo data
              customDateRange
            )
          ]);
          
          setAnalytics(analyticsData);
          setRecentOrders(ordersData);
        } catch (err) {
          console.error('Error loading data:', err);
          toast({
            title: 'Warning',
            description: 'Failed to update data',
            variant: 'destructive'
          });
        }
      };
      loadData();
    }
  };

  // Apply filters to data for display
  const getFilteredVendors = () => {
    if (vendorPerformance.length === 0) return vendorPerformance;
    
    return vendorPerformance.filter(vendor => {
      // Apply vendor name filter
      if (filters.vendors && filters.vendors.length > 0) {
        if (!filters.vendors.includes(vendor.name)) return false;
      }
      
      // Apply status filter
      if (filters.orderStatus && filters.orderStatus.length > 0) {
        // Map vendor status to order status for filtering
        const vendorStatusMapping: { [key: string]: string[] } = {
          'active': ['completed', 'ready', 'confirmed'],
          'pending': ['pending'],
          'approved': ['completed', 'ready', 'confirmed'],
          'suspended': ['cancelled']
        };
        
        const relevantStatuses = vendorStatusMapping[vendor.status] || [vendor.status];
        const hasMatchingStatus = filters.orderStatus.some(status => 
          relevantStatuses.includes(status)
        );
        
        if (!hasMatchingStatus) return false;
      }
      
      return true;
    });
  };

  const getFilteredOrders = () => {
    if (recentOrders.length === 0) return recentOrders;
    
    const filtered = recentOrders.filter(order => {
      // Orders are already filtered by university through the service (vendor-based filtering)
      // No need for additional university filtering since orders don't have universityName field
      
      // Apply date range filter
      if (filters.dateRange?.from || filters.dateRange?.to) {
        const orderDate = toDate(order.createdAt);
        
        if (filters.dateRange.from && orderDate < filters.dateRange.from) return false;
        if (filters.dateRange.to && orderDate > filters.dateRange.to) return false;
      }
      
      // Apply status filter
      if (filters.orderStatus && filters.orderStatus.length > 0) {
        if (!filters.orderStatus.includes(order.status)) return false;
      }
      
      // Apply vendor filter (need to get vendor name from vendorId)
      if (filters.vendors && filters.vendors.length > 0) {
        const vendor = vendorPerformance.find(v => v.id === order.vendorId);
        if (!vendor || !filters.vendors.includes(vendor.name)) return false;
      }
      
      return true;
    });
    
    return filtered;
  };

  const calculateTrends = () => {
    if (!recentOrders.length) return {
      responseTime: { value: 0, trend: 0 },
      completionRate: { value: 0, trend: 0 },
      revenue: { value: 0, trend: 0 },
      orders: { value: 0, trend: 0 }
    };

    const currentOrders = getFilteredOrders();
    const currentTime = new Date();
    const weekAgo = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Split orders into current week and previous week
    const currentWeekOrders = currentOrders.filter(order => {
      const orderDate = toDate(order.createdAt);
      return orderDate >= weekAgo;
    });
    
    const previousWeekOrders = currentOrders.filter(order => {
      const orderDate = toDate(order.createdAt);
      const twoWeeksAgo = new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
      return orderDate >= twoWeeksAgo && orderDate < weekAgo;
    });
    
    // Calculate current vs previous metrics
    const currentResponseTime = calculateAverageResponseTime(currentWeekOrders);
    const previousResponseTime = calculateAverageResponseTime(previousWeekOrders);
    
    const currentCompletionRate = calculateCompletionRate(currentWeekOrders);
    const previousCompletionRate = calculateCompletionRate(previousWeekOrders);
    
    const currentRevenue = currentWeekOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, order) => sum + order.total, 0);
    
    const previousRevenue = previousWeekOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, order) => sum + order.total, 0);
    
    const currentCompletedCount = currentWeekOrders.filter(o => o.status === 'completed').length;
    const previousCompletedCount = previousWeekOrders.filter(o => o.status === 'completed').length;
    
    // Calculate percentage changes
    const responseTimeTrend = previousResponseTime > 0 
      ? ((currentResponseTime - previousResponseTime) / previousResponseTime) * 100 
      : 0;
      
    const completionRateTrend = previousCompletionRate > 0 
      ? ((currentCompletionRate - previousCompletionRate) / previousCompletionRate) * 100 
      : 0;
      
    const revenueTrend = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;
      
    const ordersTrend = previousCompletedCount > 0 
      ? ((currentCompletedCount - previousCompletedCount) / previousCompletedCount) * 100 
      : 0;
    
    return {
      responseTime: { value: currentResponseTime, trend: responseTimeTrend },
      completionRate: { value: currentCompletionRate, trend: completionRateTrend },
      revenue: { value: currentRevenue, trend: revenueTrend },
      orders: { value: currentCompletedCount, trend: ordersTrend }
    };
  };

  const trends = calculateTrends();

  const getFilteredStudents = () => {
    if (students.length === 0) return students;
    
    return students.filter(student => {
      // First: Filter by university name (extra safety check)
      if (student.universityName && student.universityName !== universityName) {
        return false;
      }
      
      // Apply date range filter for registration date
      if (filters.dateRange?.from || filters.dateRange?.to) {
        const studentDate = toDate(student.createdAt);
        
        if (filters.dateRange.from && studentDate < filters.dateRange.from) return false;
        if (filters.dateRange.to && studentDate > filters.dateRange.to) return false;
      }
      
      // Apply search term filter
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const matchesName = student.fullName?.toLowerCase().includes(searchTerm);
        const matchesEmail = student.email?.toLowerCase().includes(searchTerm);
        if (!matchesName && !matchesEmail) return false;
      }
      
      return true;
    });
  };

  // Error handling
  useEffect(() => {
    if (error) {
      toast({
        title: 'Connection Error',
        description: error,
        variant: 'destructive'
      });
    }
  }, [error, toast]);

  const handleUpdateVendorStatus = async (vendorId: string, status: 'active' | 'inactive') => {
    try {
      await UniversityAdminService.updateVendorStatus(vendorId, status);
      toast({
        title: 'Success',
        description: `Vendor status updated to ${status}`
      });
      // Real-time data will automatically update
    } catch (error) {
      console.error('Error updating vendor status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vendor status',
        variant: 'destructive'
      });
    }
  };

  const handleApproveVendor = async (vendorId: string) => {
    try {
      await UniversityAdminService.approveVendor(vendorId, universityName);
      toast({
        title: 'Success',
        description: 'Vendor has been approved'
      });
      // Real-time data will automatically update
    } catch (error) {
      console.error('Error approving vendor:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve vendor',
        variant: 'destructive'
      });
    }
  };

  const handleSuspendVendor = async (vendorId: string, reason?: string) => {
    try {
      await UniversityAdminService.suspendVendor(vendorId, reason);
      toast({
        title: 'Success',
        description: 'Vendor has been suspended'
      });
      // Real-time data will automatically update
    } catch (error) {
      console.error('Error suspending vendor:', error);
      toast({
        title: 'Error',
        description: 'Failed to suspend vendor',
        variant: 'destructive'
      });
    }
  };

  const handleReactivateVendor = async (vendorId: string) => {
    try {
      await UniversityAdminService.reactivateVendor(vendorId);
      toast({
        title: 'Success',
        description: 'Vendor has been reactivated'
      });
      // Real-time data will automatically update
    } catch (error) {
      console.error('Error reactivating vendor:', error);
      toast({
        title: 'Error',
        description: 'Failed to reactivate vendor',
        variant: 'destructive'
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'main course': return Pizza;
      case 'beverages': return Coffee;
      case 'light meals': return Utensils;
      case 'desserts': return Apple;
      default: return ChefHat;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return ArrowUpRight;
      case 'down': return ArrowDownRight;
      default: return Target;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'ready': return Clock;
      case 'pending': return Timer;
      case 'cancelled': return XCircle;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'ready': return 'text-blue-600';
      case 'confirmed': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP'
    }).format(amount);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[50vh]"
      >
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 1, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"
          />
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            Loading dashboard...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <UniversityAdminLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-none space-y-4 md:space-y-6 focus:outline-none [&_*]:focus:outline-none [&_*]:focus:ring-0 [&_button]:focus:outline-none [&_button]:focus:ring-0"
      >
        {/* Header with Refresh Button */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">University Admin Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Comprehensive analytics and management for your campus</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center space-x-4"
          >
            {/* Refresh Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button 
                variant="outline" 
                size="icon" 
                onClick={refresh} 
                disabled={loading}
                className="transition-all duration-200"
              >
                <motion.div
                  animate={loading ? { rotate: 360 } : {}}
                  transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                >
                  <RotateCcw className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

      {/* Advanced Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <AdvancedFilters
          onFiltersChange={handleFiltersChange}
          availableCategories={['Fast Food', 'Healthy', 'Beverages', 'Desserts', 'Snacks']}
          availableVendors={vendorPerformance.map(v => v.name)}
          availableStatuses={['pending', 'confirmed', 'ready', 'completed', 'cancelled']}
        />
      </motion.div>
      
      
        {/* Main Content Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="w-full overflow-x-auto"
          >
            <TabsList className="w-full min-w-max flex p-1 bg-muted rounded-lg focus:outline-none">
              <TabsTrigger value="analytics" className="flex-1 min-w-fit text-xs sm:text-sm px-3 py-2 transition-all duration-200 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap focus:outline-none focus:ring-0">Analytics</TabsTrigger>
              <TabsTrigger value="food-trends" className="flex-1 min-w-fit text-xs sm:text-sm px-3 py-2 transition-all duration-200 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap focus:outline-none focus:ring-0">Food Trends</TabsTrigger>
              <TabsTrigger value="vendors" className="flex-1 min-w-fit text-xs sm:text-sm px-3 py-2 transition-all duration-200 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap focus:outline-none focus:ring-0">Vendors</TabsTrigger>
              <TabsTrigger value="students" className="flex-1 min-w-fit text-xs sm:text-sm px-3 py-2 transition-all duration-200 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap focus:outline-none focus:ring-0">Students</TabsTrigger>
              <TabsTrigger value="orders" className="flex-1 min-w-fit text-xs sm:text-sm px-3 py-2 transition-all duration-200 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap focus:outline-none focus:ring-0">Orders</TabsTrigger>
            </TabsList>
          </motion.div>

        <TabsContent value="analytics" className="space-y-4 md:space-y-6">
          {/* University Performance Metrics Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center text-base md:text-lg">
                  <Activity className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  University Performance Metrics
                  {loading && (
                    <motion.div 
                      className="ml-2 w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Real-time performance indicators calculated from order data
                  {Object.keys(vendorAnalytics).length > 0 && (
                    <motion.span
                      className="ml-2 inline-flex items-center text-green-600"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      • Live data
                    </motion.span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <motion.div 
                    className="text-center p-4 bg-blue-50 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl font-bold text-blue-600">
                      {loading ? (
                        <motion.div 
                          className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        `${calculateAverageResponseTime(getFilteredOrders())}min`
                      )}
                    </div>
                    <div className="text-sm text-blue-700 flex items-center justify-center">
                      <span>Avg Response Time</span>
                      {!loading && Math.abs(trends.responseTime.trend) > 1 && (
                        <motion.div 
                          className={`ml-2 flex items-center ${getTrendColor(getTrendDirection(trends.responseTime.trend))}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {React.createElement(getTrendIcon(getTrendDirection(trends.responseTime.trend)), {
                            className: "h-3 w-3 mr-1"
                          })}
                          <span className="text-xs">{Math.abs(trends.responseTime.trend).toFixed(1)}%</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center p-4 bg-green-50 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl font-bold text-green-600">
                      {loading ? (
                        <motion.div 
                          className="inline-block w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        `${calculateCompletionRate(getFilteredOrders()).toFixed(1)}%`
                      )}
                    </div>
                    <div className="text-sm text-green-700 flex items-center justify-center">
                      <span>Completion Rate</span>
                      {!loading && Math.abs(trends.completionRate.trend) > 1 && (
                        <motion.div 
                          className={`ml-2 flex items-center ${getTrendColor(getTrendDirection(trends.completionRate.trend))}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {React.createElement(getTrendIcon(getTrendDirection(trends.completionRate.trend)), {
                            className: "h-3 w-3 mr-1"
                          })}
                          <span className="text-xs">{Math.abs(trends.completionRate.trend).toFixed(1)}%</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center p-4 bg-orange-50 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl font-bold text-orange-600">
                      {loading ? (
                        <motion.div 
                          className="inline-block w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        getFilteredOrders().filter(o => o.status === 'completed').length
                      )}
                    </div>
                    <div className="text-sm text-orange-700 flex items-center justify-center">
                      <span>Completed Orders</span>
                      {!loading && Math.abs(trends.orders.trend) > 1 && (
                        <motion.div 
                          className={`ml-2 flex items-center ${getTrendColor(getTrendDirection(trends.orders.trend))}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {React.createElement(getTrendIcon(getTrendDirection(trends.orders.trend)), {
                            className: "h-3 w-3 mr-1"
                          })}
                          <span className="text-xs">{Math.abs(trends.orders.trend).toFixed(1)}%</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center p-4 bg-purple-50 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl font-bold text-purple-600">
                      {loading ? (
                        <motion.div 
                          className="inline-block w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        formatCurrency(
                          getFilteredOrders()
                            .filter(o => o.status === 'completed')
                            .reduce((sum, order) => sum + order.total, 0)
                        )
                      )}
                    </div>
                    <div className="text-sm text-purple-700 flex items-center justify-center">
                      <span>Total Revenue</span>
                      {!loading && Math.abs(trends.revenue.trend) > 1 && (
                        <motion.div 
                          className={`ml-2 flex items-center ${getTrendColor(getTrendDirection(trends.revenue.trend))}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          {React.createElement(getTrendIcon(getTrendDirection(trends.revenue.trend)), {
                            className: "h-3 w-3 mr-1"
                          })}
                          <span className="text-xs">{Math.abs(trends.revenue.trend).toFixed(1)}%</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Advanced Analytics Charts */}
          {analytics && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="overflow-x-hidden"
            >
              <AdvancedAnalyticsCharts
              dailyData={analytics.dailyStats.map(stat => ({
                date: stat.date,
                orders: stat.orders,
                revenue: stat.revenue
              }))}
              hourlyData={analytics.peakOrderTimes.map(time => ({
                hour: time.hour,
                orders: time.orders,
                revenue: time.orders * (analytics.totalRevenue / Math.max(analytics.totalOrders, 1)) // Use actual average per order
              }))}
              categoryData={analytics.popularCategories.map(cat => ({
                category: cat.category,
                orders: cat.orders,
                revenue: cat.revenue, // Use actual revenue from service, not calculated estimate
                percentage: cat.percentage
              }))}
              orders={getFilteredOrders()} // Pass orders for correct category revenue calculation
            />
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6"
          >
            {/* Peak Hours Chart */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="transition-all duration-300 hover:shadow-lg w-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <BarChart3 className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Peak Ordering Hours
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Order distribution throughout the day
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 md:px-6 w-full">
                  {analytics && (
                    <div className="space-y-3 md:space-y-4">
                      {analytics.peakOrderTimes.slice(0, 8).map((time, index) => (
                        <motion.div 
                          key={time.hour}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                          className="flex items-center justify-between"
                        >
                          <span className="text-xs md:text-sm font-medium truncate mr-2">{time.hour}:00 - {time.hour + 1}:00</span>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <div className="w-16 md:w-24 bg-gray-200 rounded-full h-2">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(time.orders / Math.max(...analytics.peakOrderTimes.map(t => t.orders))) * 100}%` }}
                                transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                                className="bg-blue-600 h-2 rounded-full"
                              />
                            </div>
                            <span className="text-xs md:text-sm text-gray-600 w-6 md:w-8 text-right">{time.orders}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Popular Categories */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="transition-all duration-300 hover:shadow-lg w-full">
              <CardHeader>
                <CardTitle className="flex items-center text-base md:text-lg">
                  <PieChart className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Popular Food Categories
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Distribution of orders by food category
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 md:px-6 w-full">
                {analytics && (
                  <div className="space-y-3 md:space-y-4">
                    {analytics.popularCategories.slice(0, 6).map((category) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 min-w-0 flex-1 mr-2">
                          {React.createElement(getCategoryIcon(category.category), {
                            className: "h-3 w-3 md:h-4 md:w-4 text-gray-600 flex-shrink-0"
                          })}
                          <span className="text-xs md:text-sm font-medium truncate">{category.category}</span>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <div className="w-12 md:w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs md:text-sm text-gray-600 w-8 md:w-12 text-right">
                            {category.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          </motion.div>

          {/* Student Engagement Metrics 
          {studentEngagement && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="transition-all duration-300 hover:shadow-lg w-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <Target className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Student Engagement Metrics
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Key performance indicators for student activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 md:px-6 w-full">
                  <div className="grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-3 md:gap-6">
                    <motion.div 
                      className="text-center p-3 md:p-4 bg-blue-50 rounded-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-lg md:text-2xl font-bold text-blue-600">{studentEngagement.totalActiveStudents}</div>
                      <div className="text-xs md:text-sm text-blue-700">Active Students</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-3 md:p-4 bg-green-50 rounded-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-lg md:text-2xl font-bold text-green-600">{studentEngagement.newStudentsThisWeek}</div>
                      <div className="text-xs md:text-sm text-green-700">New This Week</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-3 md:p-4 bg-purple-50 rounded-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-lg md:text-2xl font-bold text-purple-600">{studentEngagement.averageOrdersPerStudent}</div>
                      <div className="text-xs md:text-sm text-purple-700">Avg Orders/Student</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-3 md:p-4 bg-orange-50 rounded-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.0 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-lg md:text-2xl font-bold text-orange-600">{studentEngagement.studentRetentionRate}%</div>
                      <div className="text-xs md:text-sm text-orange-700">Retention Rate</div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
            */}
        </TabsContent>
        

        <TabsContent value="food-trends" className="space-y-4 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-x-hidden"
          >
            <div className="w-full max-w-full">
              <FoodTrendsAnalysis trends={foodTrends} orders={getFilteredOrders()} />
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Vendor Performance</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Monitor and manage vendor performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 md:px-6 w-full">
                <div className="space-y-3 md:space-y-4">
                  {getFilteredVendors().map((vendor, index) => {
                    const metrics = calculateVendorMetrics(vendor.id, getFilteredOrders());
                    
                    return (
                    <motion.div 
                      key={vendor.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer gap-3 sm:gap-4"
                    >
                    <div className="flex items-start sm:items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                      <div className="flex-shrink-0 mt-1 sm:mt-0">
                        <Store className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm md:text-base truncate">{vendor.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 text-xs md:text-sm text-gray-600 space-y-1 sm:space-y-0">
                          <span className="truncate">{metrics.totalOrders} orders</span>
                          <span className="truncate">{formatCurrency(metrics.totalRevenue)}</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 mr-1" />
                            <span>{vendor.averageRating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row sm:flex-col lg:flex-row items-center space-x-3 sm:space-x-0 lg:space-x-4 sm:space-y-2 lg:space-y-0 w-full sm:w-auto">
                      <div className="text-left sm:text-right flex-1 sm:flex-initial">
                        <div className="flex items-center space-x-1">
                          <p className="text-xs md:text-sm font-medium">{metrics.completionRate.toFixed(1)}% Success</p>
                          {vendorAnalytics[vendor.id] && (
                            <motion.div 
                              className="w-2 h-2 bg-green-500 rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              title="Real-time data"
                            />
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <p className="text-xs text-gray-500">{metrics.averageResponseTime}min avg response</p>
                          {calculateAverageResponseTime(getFilteredOrders().filter(o => o.vendorId === vendor.id)) !== metrics.averageResponseTime && (
                            <motion.div 
                              className="text-xs text-blue-500"
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              ↻
                            </motion.div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={
                            vendor.status === 'approved' ? 'default' : 
                            vendor.status === 'suspended' ? 'destructive' : 
                            vendor.status === 'pending' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {vendor.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-3 w-3 md:h-4 md:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs md:text-sm">
                            <DropdownMenuItem>
                              <Eye className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                              Manage Settings
                            </DropdownMenuItem>
                            
                            {vendor.status === 'pending' && (
                              <DropdownMenuItem 
                                onClick={() => handleApproveVendor(vendor.id)}
                              >
                                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 mr-2 text-green-600" />
                                Approve Vendor
                              </DropdownMenuItem>
                            )}
                            
                            {vendor.status === 'approved' && (
                              <DropdownMenuItem 
                                onClick={() => handleSuspendVendor(vendor.id, 'Policy violation')}
                              >
                                <XCircle className="h-3 w-3 md:h-4 md:w-4 mr-2 text-red-600" />
                                Suspend Vendor
                              </DropdownMenuItem>
                            )}
                            
                            {vendor.status === 'suspended' && (
                              <DropdownMenuItem 
                                onClick={() => handleReactivateVendor(vendor.id)}
                              >
                                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 mr-2 text-green-600" />
                                Reactivate Vendor
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem 
                              onClick={() => handleUpdateVendorStatus(vendor.id, vendor.status === 'active' ? 'inactive' : 'active')}
                            >
                              {vendor.status === 'active' ? (
                                <>
                                  <XCircle className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    </motion.div>
                    );
                  })}
                  
                  {getFilteredVendors().length === 0 && (
                    <motion.div 
                      className="text-center py-8"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-muted-foreground text-sm">No vendor data available.</p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>        <TabsContent value="students" className="space-y-4 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 md:space-y-6"
          >
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="transition-all duration-300 hover:shadow-md w-full">
              <CardContent className="p-3 md:p-6 w-full">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                      <Input
                        placeholder="Search students by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 md:pl-10 text-xs md:text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button variant="outline" className="transition-all duration-200 text-xs md:text-sm h-8 md:h-10 px-3 md:px-4">
                      <Filter className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      Filters
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
          >
            <Card className="transition-all duration-300 hover:shadow-lg w-full">
              <CardHeader>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <CardTitle className="text-base md:text-lg">Student Management</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Monitor student activity and engagement
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="px-3 md:px-6 w-full">
                <div className="space-y-3 md:space-y-4">
                  <AnimatePresence>
                    {getFilteredStudents().filter(student => 
                      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
                    ).slice(0, 20).map((student, index) => (
                      <motion.div 
                        key={student.id}
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 300,
                          damping: 30
                        }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ 
                          scale: 1.02, 
                          x: 5,
                          transition: { duration: 0.2, ease: "easeOut" }
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 gap-3 sm:gap-4"
                      >
                        <div className="flex items-start sm:items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                          <motion.div 
                            className="flex-shrink-0 mt-1 sm:mt-0"
                            whileHover={{ rotate: 10 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                          </motion.div>
                          <div className="min-w-0 flex-1">
                            <motion.h3 
                              className="font-semibold text-sm md:text-base truncate"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 + index * 0.05 }}
                            >
                              {student.fullName || 'N/A'}
                            </motion.h3>
                            <motion.p 
                              className="text-xs md:text-sm text-gray-600 truncate"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 + index * 0.05 }}
                            >
                              {student.email || 'N/A'}
                            </motion.p>
                            <motion.p 
                              className="text-xs text-gray-500"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 + index * 0.05 }}
                            >
                              Joined: {formatDate(student.createdAt)}
                            </motion.p>
                          </div>
                        </div>
                        
                        <motion.div 
                          className="flex items-center space-x-2 md:space-x-4 w-full sm:w-auto justify-between sm:justify-end"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                        >
                          <div className="text-right">
                            <motion.p 
                              className="text-xs md:text-sm font-medium"
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              {formatCurrency(student.walletBalance || 0)}
                            </motion.p>
                            <p className="text-xs text-gray-500">Wallet Balance</p>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            <Badge variant="outline" className="transition-colors duration-200 text-xs">
                              Active
                            </Badge>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {getFilteredStudents().length === 0 && (
                    <motion.div 
                      className="text-center py-8"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <motion.p 
                        className="text-muted-foreground text-sm"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        No students found.
                      </motion.p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
          >
            <Card className="transition-all duration-300 hover:shadow-lg w-full">
              <CardHeader>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <CardTitle className="text-base md:text-lg">Recent Orders</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Monitor recent order activity and status
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="px-3 md:px-6 w-full">
                <div className="space-y-3 md:space-y-4">
                  <AnimatePresence>
                    {getFilteredOrders().map((order, index) => {
                      const StatusIcon = getStatusIcon(order.status);
                      const vendor = vendorPerformance.find(v => v.id === order.vendorId);
                      const vendorName = vendor ? vendor.name : 'Unknown Vendor';
                      
                      return (
                        <motion.div 
                          key={order.id || `order-${index}-${order.vendorId}-${order.createdAt?.seconds || Date.now()}`}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: index * 0.05,
                            type: "spring",
                            stiffness: 300,
                            damping: 25
                          }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true }}
                          whileHover={{ 
                            scale: 1.02, 
                            x: 8,
                            transition: { duration: 0.2, ease: "easeOut" }
                          }}
                          whileTap={{ scale: 0.98 }}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:border-primary/30 gap-3 sm:gap-4"
                        >
                          <div className="flex items-start sm:items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                            <motion.div 
                              className="flex-shrink-0 mt-1 sm:mt-0"
                              initial={{ rotate: -10, opacity: 0 }}
                              animate={{ rotate: 0, opacity: 1 }}
                              transition={{ delay: 0.1 + index * 0.05, type: "spring" }}
                              whileHover={{ 
                                scale: 1.2, 
                                rotate: 5,
                                transition: { type: "spring", stiffness: 500 }
                              }}
                            >
                              <StatusIcon className={`h-5 w-5 md:h-6 md:w-6 ${getStatusColor(order.status)} transition-all duration-200`} />
                            </motion.div>
                            <div className="min-w-0 flex-1">
                              <motion.h3 
                                className="font-semibold text-sm md:text-base truncate"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + index * 0.05 }}
                              >
                                Order #{order.id.slice(-6)}
                              </motion.h3>
                              <motion.p 
                                className="text-xs md:text-sm text-gray-600 truncate"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.25 + index * 0.05 }}
                              >
                                Vendor: {vendorName}
                              </motion.p>
                              <motion.p 
                                className="text-xs text-gray-500"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.05 }}
                              >
                                {formatDate(order.createdAt)}
                              </motion.p>
                            </div>
                          </div>
                          
                          <motion.div 
                            className="flex items-center space-x-2 md:space-x-4 w-full sm:w-auto justify-between sm:justify-end"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                          >
                            <div className="text-right">
                              <motion.p 
                                className="text-xs md:text-sm font-medium"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                {formatCurrency(order.total)}
                              </motion.p>
                              <p className="text-xs text-gray-500">
                                {order.items?.length || 0} items
                              </p>
                            </div>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ 
                                delay: 0.3 + index * 0.05,
                                type: "spring",
                                stiffness: 500
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Badge 
                                variant={
                                  order.status === 'completed' ? 'default' :
                                  order.status === 'ready' ? 'secondary' :
                                  order.status === 'cancelled' ? 'destructive' :
                                  'outline'
                                }
                                className="transition-all duration-200 hover:shadow-sm text-xs"
                              >
                                {order.status}
                              </Badge>
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  
                  {getFilteredOrders().length === 0 && (
                    <motion.div 
                      className="text-center py-8"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, type: "spring" }}
                    >
                      <motion.div
                        animate={{ 
                          opacity: [0.4, 1, 0.4],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      >
                        <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      </motion.div>
                      <motion.p 
                        className="text-muted-foreground text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        No recent orders found.
                      </motion.p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
      </motion.div>
    </motion.div>
    </UniversityAdminLayout>
  );
}
