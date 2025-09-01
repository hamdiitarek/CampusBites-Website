'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Button } from '@/(landing)/components/ui/button';
import { Input } from '@/(landing)/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/(landing)/components/ui/select';
import { Badge } from '@/(landing)/components/ui/badge';
import { Switch } from '@/(landing)/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/(landing)/components/ui/tabs';
import { 
  ShoppingCart, 
  Search, 
  Download,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  RefreshCw,
  DollarSign,
  User,
  Store,
  MapPin,
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/(landing)/components/ui/dropdown-menu';
import { SuperAdminService, EnrichedOrderData } from '@/lib/appwriteSuperAdminService';
import { safeTimestampToDate } from '@/lib/models';
import { useToast } from '@/hooks/use-toast';

export function OrdersManagement() {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<EnrichedOrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [universities, setUniversities] = useState<any[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  
  // Statistics
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    ready: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
    avgOrderValue: 0
  });

  // Real-time updates
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

  useEffect(() => {
    loadData();
    
    // Set up auto-refresh every 30 seconds for real-time monitoring
    let interval: NodeJS.Timeout | null = null;
    
    if (autoRefreshEnabled) {
      interval = setInterval(() => {
        refreshData();
      }, 30000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefreshEnabled]);

  useEffect(() => {
    loadOrders();
  }, [searchTerm, selectedStatus, selectedUniversity, dateRange, currentPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, universitiesData] = await Promise.all([
        SuperAdminService.getDashboardStats(),
        SuperAdminService.getUniversitiesWithCounts()
      ]);
      
      setUniversities(universitiesData);
      
      // Load orders separately with filters applied
      await loadOrders();
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      await loadOrders(); // This will refresh orders with current filters
      setLastRefreshTime(new Date());
      toast({
        title: 'Data Refreshed',
        description: 'Order data has been updated'
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedUniversity('all');
    setDateRange('all');
    toast({
      title: 'Filters Cleared',
      description: 'All filters have been reset'
    });
  };

  const loadOrders = async () => {
    try {
      let ordersData = await SuperAdminService.getEnrichedOrders(500);
      
      // Calculate statistics from all orders (before filtering)
      const stats = calculateOrderStats(ordersData);
      setOrderStats(stats);
      
      // Apply filters
      let filteredOrders = ordersData;
      
      // Search filter
      if (searchTerm) {
        filteredOrders = filteredOrders.filter(order =>
          (order.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (order.userId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (order.vendorId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (order.userDetails?.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (order.userDetails?.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (order.userDetails?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (order.userDetails?.universityId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (order.vendorDetails?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (order.universityDetails?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (order.userDetails?.universityName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
      }
      
      // Status filter
      if (selectedStatus !== 'all') {
        filteredOrders = filteredOrders.filter(order =>
          order?.status === selectedStatus
        );
      }
      
      // University filter
      if (selectedUniversity !== 'all') {
        filteredOrders = filteredOrders.filter(order =>
          // order?.universityId === selectedUniversity || // Order model doesn't have universityId
          order?.userDetails?.universityId === selectedUniversity ||
          order?.universityDetails?.id === selectedUniversity
        );
      }
      
      // Date filter
      if (dateRange !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        switch (dateRange) {
          case 'today':
            startDate.setHours(0, 0, 0, 0);
            break;
          case 'yesterday':
            startDate.setDate(now.getDate() - 1);
            startDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          default:
            startDate = new Date(0); // No filter
        }
        
        if (dateRange !== 'all') {
          filteredOrders = filteredOrders.filter(order => {
            const orderDate = safeTimestampToDate(order?.createdAt);
            return orderDate >= startDate;
          });
        }
      }
      
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive'
      });
    }
  };

  const calculateOrderStats = (ordersData: EnrichedOrderData[] = []) => {
    if (!ordersData || !Array.isArray(ordersData)) {
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        ready: 0,
        completed: 0,
        cancelled: 0,
        totalRevenue: 0,
        avgOrderValue: 0
      };
    }

    const stats = {
      total: ordersData.length,
      pending: ordersData.filter(o => o?.status === 'pending').length,
      confirmed: ordersData.filter(o => o?.status === 'confirmed').length,
      ready: ordersData.filter(o => o?.status === 'ready').length,
      completed: ordersData.filter(o => o?.status === 'completed').length,
      cancelled: ordersData.filter(o => o?.status === 'cancelled').length,
      totalRevenue: ordersData.reduce((sum, o) => sum + (o?.total || 0), 0),
      avgOrderValue: 0
    };
    
    stats.avgOrderValue = stats.total > 0 ? stats.totalRevenue / stats.total : 0;
    
    return stats;
  };

  const handleViewOrder = (orderId: string) => {
    toast({
      title: 'Coming Soon',
      description: 'Detailed order view will be implemented'
    });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    toast({
      title: 'Coming Soon',
      description: 'Order status update functionality will be implemented'
    });
  };

  const handleRefundOrder = (orderId: string) => {
    toast({
      title: 'Coming Soon',
      description: 'Order refund functionality will be implemented'
    });
  };

  const handleAutoRefreshToggle = (enabled: boolean) => {
    setAutoRefreshEnabled(enabled);
    toast({
      title: enabled ? 'Auto Refresh Enabled' : 'Auto Refresh Disabled',
      description: enabled 
        ? 'Orders will refresh automatically every 30 seconds' 
        : 'Manual refresh only',
      variant: enabled ? 'default' : 'destructive'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      ready: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string | undefined) => {
    const colors = {
      'credit_card': 'bg-blue-100 text-blue-800',
      'wallet': 'bg-green-100 text-green-800',
      'cash': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={colors[method as keyof typeof colors] || colors.cash}>
        {method ? method.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
      </Badge>
    );
  };

  // Pagination
  const totalPages = Math.ceil((orders?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = (orders || []).slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders with user details...</p>
          <p className="text-xs text-gray-400 mt-2">Fetching enriched order data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className={`h-5 w-5 ${autoRefreshEnabled ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`text-sm ${autoRefreshEnabled ? 'text-green-600' : 'text-gray-600'}`}>
              {autoRefreshEnabled ? 'Live Orders Monitoring' : 'Orders Monitoring (Manual)'}
            </span>
            {autoRefreshEnabled && (
              <div className="animate-pulse w-2 h-2 bg-green-600 rounded-full"></div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 border-l pl-4">
            <span className="text-sm text-gray-600">Auto Refresh</span>
            <Switch
              checked={autoRefreshEnabled}
              onCheckedChange={handleAutoRefreshToggle}
            />
            <span className="text-xs text-gray-500">
              {autoRefreshEnabled ? '30s' : 'Off'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {lastRefreshTime && (
            <div className="text-xs text-gray-500">
              Last updated: {lastRefreshTime.toLocaleTimeString()}
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${orderStats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Orders Management</CardTitle>
              <CardDescription>
                Real-time monitoring and management of all platform orders
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          </div>

          {/* Orders Table */}
          <div className="space-y-4">
            {currentOrders.map((order) => (
              <div key={order.id || `order-${Math.random()}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">Order #{order.id?.slice(-8) || 'Unknown'}</h3>
                      {order.vendorDetails?.name && (
                        <Badge variant="outline" className="text-xs">
                          {order.vendorDetails.name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.items?.length || 0} items • ${order.total?.toFixed(2) || '0.00'}
                      {order.userDetails?.displayName && (
                        <span className="ml-2">
                          • by {order.userDetails.displayName}
                          {order.userDetails?.universityId && (
                            <span className="text-xs text-gray-500"> ({order.userDetails.universityId})</span>
                          )}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'Unknown date'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {getStatusBadge(order.status)}
                  {getPaymentMethodBadge(order.paymentMethod)}
                  
                  <div className="text-right min-w-[200px]">
                    <div className="mb-1">
                      <p className="text-sm font-medium">
                        User: {order.userDetails?.displayName || order.userDetails?.fullName || order.userDetails?.email?.split('@')[0] || `ID: ${order.userId?.slice(-8)}`}
                        {order.userDetails?.universityId && (
                          <span className="text-xs text-gray-500 ml-2">({order.userDetails.universityId})</span>
                        )}
                      </p>
                      {(order.universityDetails?.name || order.userDetails?.universityName) && (
                        <p className="text-xs text-blue-600">
                          📚 {order.universityDetails?.name || order.userDetails?.universityName}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        Vendor: {order.vendorDetails?.name || `ID: ${order.vendorId?.slice(-8)}`}
                      </p>
                      {order.vendorDetails?.category && (
                        <p className="text-xs text-gray-400">
                          🏪 {order.vendorDetails.category}
                        </p>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewOrder(order.id || 'unknown')}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id || 'unknown', 'confirmed')}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Update Status
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleRefundOrder(order.id || 'unknown')}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Process Refund
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            
            {currentOrders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No orders found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(endIndex, orders.length)} of {orders.length} orders
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common order management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">Dispute Resolution</p>
                <p className="text-xs text-gray-500">Handle order disputes</p>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
              <TrendingUp className="h-5 w-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">Analytics Report</p>
                <p className="text-xs text-gray-500">Generate order analytics</p>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
              <RefreshCw className="h-5 w-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">Bulk Refunds</p>
                <p className="text-xs text-gray-500">Process multiple refunds</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
