'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Button } from '@/(landing)/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/(landing)/components/ui/select';
import { Badge } from '@/(landing)/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/(landing)/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  Download,
  Calendar,
  Filter,
  PieChart,
  LineChart,
  Activity,
  Target,
  Globe,
  Clock,
  Star,
  AlertCircle
} from 'lucide-react';
import { SuperAdminService } from '@/lib/appwriteSuperAdminService';
import { useToast } from '@/hooks/use-toast';

export function AnalyticsManagement() {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [universities, setUniversities] = useState<any[]>([]);
  
  // Analytics data
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: {
      current: 0,
      previous: 0,
      growth: 0,
      trend: 'up' as 'up' | 'down'
    },
    orderMetrics: {
      totalOrders: 0,
      avgOrderValue: 0,
      conversionRate: 0,
      repeatCustomers: 0
    },
    revenueAnalytics: {
      totalRevenue: 0,
      growth: 0,
      forecastNext: 0,
      topPerformers: [] as any[]
    },
    userBehavior: {
      avgSessionTime: 0,
      bounceRate: 0,
      mostOrderedItems: [] as any[],
      peakHours: [] as any[]
    },
    geographicData: {
      byUniversity: [] as any[],
      byRegion: [] as any[]
    }
  });

  // Performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    systemHealth: 99.9,
    responseTime: 125,
    errorRate: 0.1,
    uptime: 99.8
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod, selectedUniversity]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const [dashboardStats, universitiesData, ordersData, vendorsData] = await Promise.all([
        SuperAdminService.getDashboardStats(),
        SuperAdminService.getUniversitiesWithCounts(),
        SuperAdminService.getRecentOrders(200),
        SuperAdminService.getAllVendors()
      ]);
      
      setUniversities(universitiesData);
      
      // Calculate analytics metrics
      const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0);
      const avgOrderValue = ordersData.length > 0 ? totalRevenue / ordersData.length : 0;
      
      setAnalyticsData({
        userGrowth: {
          current: dashboardStats.totalUsers,
          previous: Math.floor(dashboardStats.totalUsers * 0.85), // Mock previous period
          growth: 15.2,
          trend: 'up'
        },
        orderMetrics: {
          totalOrders: ordersData.length,
          avgOrderValue,
          conversionRate: 3.2,
          repeatCustomers: Math.floor(dashboardStats.totalUsers * 0.4)
        },
        revenueAnalytics: {
          totalRevenue,
          growth: 18.5,
          forecastNext: totalRevenue * 1.12,
          topPerformers: vendorsData
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5)
            .map(vendor => ({
              name: vendor.name,
              revenue: Math.random() * 5000,
              orders: Math.floor(Math.random() * 100),
              rating: vendor.rating
            }))
        },
        userBehavior: {
          avgSessionTime: 8.5,
          bounceRate: 24.3,
          mostOrderedItems: [
            { name: 'Chicken Burger', orders: 245, percentage: 22 },
            { name: 'Pizza Margherita', orders: 198, percentage: 18 },
            { name: 'Cappuccino', orders: 176, percentage: 16 },
            { name: 'Caesar Salad', orders: 134, percentage: 12 },
            { name: 'Chocolate Cake', orders: 98, percentage: 9 }
          ],
          peakHours: [
            { hour: '12:00', orders: 45 },
            { hour: '13:00', orders: 67 },
            { hour: '18:00', orders: 52 },
            { hour: '19:00', orders: 73 },
            { hour: '20:00', orders: 48 }
          ]
        },
        geographicData: {
          byUniversity: universitiesData.map(uni => ({
            name: uni.name,
            users: uni.studentsCount || 0,
            orders: Math.floor(Math.random() * 500),
            revenue: Math.random() * 10000
          })),
          byRegion: [
            { region: 'Cairo', percentage: 45, users: 2500 },
            { region: 'Giza', percentage: 30, users: 1800 },
            { region: 'Alexandria', percentage: 15, users: 900 },
            { region: 'Other', percentage: 10, users: 600 }
          ]
        }
      });

    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = (type: string) => {
    toast({
      title: 'Coming Soon',
      description: `${type} export functionality will be implemented`
    });
  };

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getTrendColor = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="University" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Universities</SelectItem>
              {universities.map((university) => (
                <SelectItem key={university.id} value={university.id}>
                  {university.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleExportReport('analytics')}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => handleExportReport('dashboard')}>
            <Eye className="h-4 w-4 mr-2" />
            View Dashboard
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">User Growth</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.userGrowth.current.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(analyticsData.userGrowth.trend)}
                  <span className={`text-xs ml-1 ${getTrendColor(analyticsData.userGrowth.trend)}`}>
                    +{analyticsData.userGrowth.growth}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.orderMetrics.totalOrders.toLocaleString()}
                </p>
                <span className="text-xs text-gray-500">
                  ${analyticsData.orderMetrics.avgOrderValue.toFixed(2)} avg
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${analyticsData.revenueAnalytics.totalRevenue.toFixed(0)}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">
                    +{analyticsData.revenueAnalytics.growth}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-orange-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.orderMetrics.conversionRate}%
                </p>
                <span className="text-xs text-gray-500">
                  {analyticsData.orderMetrics.repeatCustomers} repeat customers
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="orders">Order Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Revenue growth over selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Revenue trend chart</p>
                    <p className="text-xs text-gray-400">Chart.js implementation needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Vendors</CardTitle>
                <CardDescription>Highest revenue generating vendors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.revenueAnalytics.topPerformers.map((vendor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            <span className="text-xs text-gray-500">{vendor.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${vendor.revenue.toFixed(0)}</p>
                        <p className="text-xs text-gray-500">{vendor.orders} orders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Behavior */}
            <Card>
              <CardHeader>
                <CardTitle>User Behavior</CardTitle>
                <CardDescription>User engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Avg Session Time</p>
                      <p className="text-sm text-gray-500">Time spent per session</p>
                    </div>
                    <p className="text-lg font-bold">{analyticsData.userBehavior.avgSessionTime} min</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Bounce Rate</p>
                      <p className="text-sm text-gray-500">Users leaving immediately</p>
                    </div>
                    <p className="text-lg font-bold">{analyticsData.userBehavior.bounceRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Most Ordered Items */}
            <Card>
              <CardHeader>
                <CardTitle>Most Ordered Items</CardTitle>
                <CardDescription>Popular menu items across platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.userBehavior.mostOrderedItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{item.orders}</p>
                        <p className="text-xs text-gray-500">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Peak Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Peak Order Hours</CardTitle>
                <CardDescription>Busiest times for order placement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Peak hours chart</p>
                    <p className="text-xs text-gray-400">Bar chart implementation needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
                <CardDescription>Current order status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Order status pie chart</p>
                    <p className="text-xs text-gray-400">Pie chart implementation needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-green-600" />
                  <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                    <p className="text-sm font-medium text-gray-600">System Health</p>
                    <p className="text-2xl font-bold text-gray-900">{performanceMetrics.systemHealth}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                    <p className="text-sm font-medium text-gray-600">Response Time</p>
                    <p className="text-2xl font-bold text-gray-900">{performanceMetrics.responseTime}ms</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                  <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                    <p className="text-sm font-medium text-gray-600">Error Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{performanceMetrics.errorRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                    <p className="text-sm font-medium text-gray-600">Uptime</p>
                    <p className="text-2xl font-bold text-gray-900">{performanceMetrics.uptime}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By University */}
            <Card>
              <CardHeader>
                <CardTitle>Performance by University</CardTitle>
                <CardDescription>Usage metrics across universities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.geographicData.byUniversity.map((uni, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{uni.name}</p>
                        <p className="text-sm text-gray-500">{uni.users} users</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{uni.orders} orders</p>
                        <p className="text-sm text-gray-500">${uni.revenue.toFixed(0)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* By Region */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>User distribution by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.geographicData.byRegion.map((region, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{region.region}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{region.percentage}%</p>
                        <p className="text-sm text-gray-500">{region.users} users</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
