'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../(landing)/components/ui/card';
import { Button } from '../(landing)/components/ui/button';
import { Input } from '../(landing)/components/ui/input';
import { Badge } from '../(landing)/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../(landing)/components/ui/tabs';
import { 
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
  Users,
  ChefHat,
  Timer,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  Package,
  Utensils,
  Coffee
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../(landing)/components/ui/dropdown-menu';
import { 
  AppwriteVendorService,
  VendorDashboardMetrics,
  PopularMenuItem,
  VendorRevenueData,
  VendorOrderTrend,
  VendorCustomerInsight
} from '@/lib/appwriteVendorService';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';

// Chart components
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Color palette for charts
const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

interface VendorOrder {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: 'Wallet' | 'Cash';
  createdAt: string;
  customerNote?: string;
}

// MetricCard component for displaying key metrics
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
  loading?: boolean;
}

function MetricCard({ title, value, change, icon: Icon, color, loading = false }: MetricCardProps) {
  const isPositive = change && change > 0;
  const changeIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              {loading ? (
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  {change !== undefined && (
                    <div className={`flex items-center gap-1 ${changeColor}`}>
                      {React.createElement(changeIcon, { size: 16 })}
                      <span className="text-sm font-medium">{Math.abs(change)}%</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
              <Icon size={24} className="text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Order status badge component
function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
    ready: { color: 'bg-purple-100 text-purple-800', label: 'Ready' },
    completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  
  return (
    <Badge className={`${config.color} border-0`}>
      {config.label}
    </Badge>
  );
}

export function VendorDashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data states
  const [metrics, setMetrics] = useState<VendorDashboardMetrics | null>(null);
  const [popularItems, setPopularItems] = useState<PopularMenuItem[]>([]);
  const [revenueData, setRevenueData] = useState<VendorRevenueData[]>([]);
  const [orderTrends, setOrderTrends] = useState<VendorOrderTrend[]>([]);
  const [customerInsights, setCustomerInsights] = useState<VendorCustomerInsight | null>(null);
  const [recentOrders, setRecentOrders] = useState<VendorOrder[]>([]);
  const [vendorData, setVendorData] = useState<any>(null);
  
  // Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  
  // Get vendor ID - will be fetched from vendor document
  const vendorId = vendorData?.$id;

  // Load initial data
  useEffect(() => {
    const loadVendorData = async () => {
      if (!user?.$id) return;
      
      try {
        // First, fetch vendor document for this user
        const vendorResponse = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.vendorsCollectionId,
          [Query.equal('userId', user.$id)]
        );

        if (vendorResponse.documents.length > 0) {
          setVendorData(vendorResponse.documents[0]);
        } else {
          console.error('No vendor found for user');
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      }
    };

    loadVendorData();
  }, [user?.$id]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!vendorId) return;
      
      setLoading(true);
      try {
        console.log('🚀 Loading vendor dashboard data for vendor:', vendorId);
        
        // Load all data in parallel
        const [
          metricsData,
          popularItemsData,
          revenueDataResult,
          orderTrendsData,
          customerInsightsData,
          ordersResult
        ] = await Promise.all([
          AppwriteVendorService.getVendorMetrics(vendorId),
          AppwriteVendorService.getPopularMenuItems(vendorId, 8),
          AppwriteVendorService.getRevenueTrends(vendorId, 30),
          AppwriteVendorService.getOrderTrendsByHour(vendorId),
          AppwriteVendorService.getCustomerInsights(vendorId),
          AppwriteVendorService.getVendorOrders(vendorId, 'all', 10)
        ]);
        
        setMetrics(metricsData);
        setPopularItems(popularItemsData);
        setRevenueData(revenueDataResult);
        setOrderTrends(orderTrendsData);
        setCustomerInsights(customerInsightsData);
        setRecentOrders(ordersResult.orders);
        
        console.log('✅ Dashboard data loaded successfully');
      } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [vendorId]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (!vendorId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You need to be logged in as a vendor to access this dashboard.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Vendor Dashboard
              </h1>
              <p className="text-gray-600">
                Monitor your business performance and manage orders
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Store
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-white p-1 rounded-lg shadow-sm border">
              <TabsTrigger value="overview" className="flex-1 min-w-fit text-xs sm:text-sm px-3 py-2">
                Overview
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex-1 min-w-fit text-xs sm:text-sm px-3 py-2">
                Orders
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex-1 min-w-fit text-xs sm:text-sm px-3 py-2">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="menu" className="flex-1 min-w-fit text-xs sm:text-sm px-3 py-2">
                Menu
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex-1 min-w-fit text-xs sm:text-sm px-3 py-2">
                Customers
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <MetricCard
                title="Total Revenue"
                value={metrics ? formatCurrency(metrics.totalRevenue) : '0'}
                icon={DollarSign}
                color="bg-green-500"
                loading={loading}
              />
              <MetricCard
                title="Total Orders"
                value={metrics ? metrics.totalOrders.toString() : '0'}
                icon={ShoppingCart}
                color="bg-blue-500"
                loading={loading}
              />
              <MetricCard
                title="Average Order Value"
                value={metrics ? formatCurrency(metrics.averageOrderValue) : '0'}
                icon={TrendingUp}
                color="bg-purple-500"
                loading={loading}
              />
              <MetricCard
                title="Completion Rate"
                value={metrics ? formatPercentage(metrics.completionRate) : '0%'}
                icon={Target}
                color="bg-orange-500"
                loading={loading}
              />
            </motion.div>

            {/* Today's Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Orders Today</span>
                      <span className="font-semibold">{metrics?.todayOrders || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Revenue Today</span>
                      <span className="font-semibold">{formatCurrency(metrics?.todayRevenue || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pending Orders</span>
                      <span className="font-semibold text-orange-600">{metrics?.pendingOrders || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {metrics ? Math.round(metrics.responseTime) : 0}
                    </div>
                    <div className="text-gray-600">minutes average</div>
                    <div className="mt-4 text-sm text-gray-500">
                      Time to confirm orders
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Customer Base
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Customers</span>
                      <span className="font-semibold">{customerInsights?.totalCustomers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Returning</span>
                      <span className="font-semibold text-green-600">{customerInsights?.returningCustomers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Retention Rate</span>
                      <span className="font-semibold">{formatPercentage(customerInsights?.customerRetentionRate || 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Revenue Trends Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue Trends (Last 30 Days)
                  </CardTitle>
                  <CardDescription>Daily revenue and order volume</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-80 bg-gray-100 rounded-lg animate-pulse" />
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'revenue' ? formatCurrency(Number(value)) : value,
                            name === 'revenue' ? 'Revenue' : 'Orders'
                          ]}
                          labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Popular Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Popular Menu Items
                  </CardTitle>
                  <CardDescription>Your best-selling items</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {popularItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">#{index + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-500">{item.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">{item.totalSold} sold</div>
                            <div className="text-sm text-gray-500">{formatCurrency(item.revenue)}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">Recent Orders</CardTitle>
                      <CardDescription>Manage and track your orders</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm"
                      >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="ready">Ready</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-sm font-mono text-gray-500">
                              #{order.id.slice(-6).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {order.items.length} items • {formatCurrency(order.total)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <OrderStatusBadge status={order.status} />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                {order.status === 'pending' && (
                                  <DropdownMenuItem>Confirm Order</DropdownMenuItem>
                                )}
                                {order.status === 'confirmed' && (
                                  <DropdownMenuItem>Mark Ready</DropdownMenuItem>
                                )}
                                {order.status === 'ready' && (
                                  <DropdownMenuItem>Mark Completed</DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Order Trends by Hour */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Peak Hours Analysis
                  </CardTitle>
                  <CardDescription>Order volume by hour of day</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={orderTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="orders" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Top Customers
                  </CardTitle>
                  <CardDescription>Your most valuable customers</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customerInsights?.topCustomers.map((customer, index) => (
                        <div key={customer.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">#{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">{customer.totalOrders} orders</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">{formatCurrency(customer.totalSpent)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">Menu Management</CardTitle>
                      <CardDescription>Manage your menu items and categories</CardDescription>
                    </div>
                    <Button>
                      <Package className="h-4 w-4 mr-2" />
                      Add New Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Menu Management</h3>
                    <p className="text-gray-600 mb-4">
                      Menu management features are coming soon. You'll be able to add, edit, and organize your menu items.
                    </p>
                    <Button variant="outline">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Customer Analytics
                  </CardTitle>
                  <CardDescription>Insights about your customers</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 border rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {customerInsights?.totalCustomers || 0}
                        </div>
                        <div className="text-gray-600">Total Customers</div>
                      </div>
                      <div className="text-center p-6 border rounded-lg">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {formatPercentage(customerInsights?.customerRetentionRate || 0)}
                        </div>
                        <div className="text-gray-600">Retention Rate</div>
                      </div>
                      <div className="text-center p-6 border rounded-lg">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {customerInsights?.averageOrdersPerCustomer.toFixed(1) || '0.0'}
                        </div>
                        <div className="text-gray-600">Avg Orders per Customer</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}