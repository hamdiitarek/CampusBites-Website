'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Button } from '@/(landing)/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/(landing)/components/ui/select';
import { Badge } from '@/(landing)/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/(landing)/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  PieChart,
  BarChart3,
  Download,
  Calendar,
  Users,
  Store,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { SuperAdminService } from '@/lib/appwriteSuperAdminService';
import { useToast } from '@/hooks/use-toast';

export function FinanceManagement() {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [universities, setUniversities] = useState<any[]>([]);
  
  // Financial metrics
  const [financeData, setFinanceData] = useState({
    totalRevenue: 0,
    commission: 0,
    vendorPayouts: 0,
    netProfit: 0,
    monthlyGrowth: 0,
    transactionCount: 0,
    averageOrderValue: 0,
    commissionRate: 0.15 // 15% default commission
  });

  // Revenue breakdown
  const [revenueBreakdown, setRevenueBreakdown] = useState({
    byUniversity: [] as any[],
    byPaymentMethod: [] as any[],
    byVendorCategory: [] as any[]
  });

  // Recent transactions
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadFinancialData();
  }, [selectedPeriod, selectedUniversity]);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, these would be proper financial service calls
      const [dashboardStats, universitiesData, ordersData] = await Promise.all([
        SuperAdminService.getDashboardStats(),
        SuperAdminService.getUniversitiesWithCounts(),
        SuperAdminService.getRecentOrders(100)
      ]);
      
      setUniversities(universitiesData);
      
      // Calculate financial metrics from orders data
      const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0);
      const commission = totalRevenue * 0.15; // 15% commission
      const vendorPayouts = totalRevenue - commission;
      const transactionCount = ordersData.length;
      const averageOrderValue = transactionCount > 0 ? totalRevenue / transactionCount : 0;
      
      setFinanceData({
        totalRevenue,
        commission,
        vendorPayouts,
        netProfit: commission * 0.7, // Assuming 70% of commission is profit
        monthlyGrowth: 12.5, // Mock growth rate
        transactionCount,
        averageOrderValue,
        commissionRate: 0.15
      });

      // Mock breakdown data
      setRevenueBreakdown({
        byUniversity: universitiesData.map(uni => ({
          name: uni.name,
          revenue: Math.random() * 10000,
          percentage: Math.random() * 30
        })),
        byPaymentMethod: [
          { method: 'Credit Card', amount: totalRevenue * 0.6, percentage: 60 },
          { method: 'Wallet', amount: totalRevenue * 0.3, percentage: 30 },
          { method: 'Cash', amount: totalRevenue * 0.1, percentage: 10 }
        ],
        byVendorCategory: [
          { category: 'Fast Food', amount: totalRevenue * 0.4, percentage: 40 },
          { category: 'Beverages', amount: totalRevenue * 0.25, percentage: 25 },
          { category: 'Desserts', amount: totalRevenue * 0.2, percentage: 20 },
          { category: 'Healthy', amount: totalRevenue * 0.15, percentage: 15 }
        ]
      });

      // Mock recent transactions
      setRecentTransactions([
        {
          id: 'tx001',
          type: 'commission',
          amount: 125.50,
          vendor: 'Pizza Corner',
          university: 'Cairo University',
          date: new Date(),
          status: 'completed'
        },
        {
          id: 'tx002',
          type: 'payout',
          amount: -850.00,
          vendor: 'Burger House',
          university: 'AUC',
          date: new Date(),
          status: 'pending'
        },
        {
          id: 'tx003',
          type: 'refund',
          amount: -45.00,
          vendor: 'Coffee Shop',
          university: 'GUC',
          date: new Date(),
          status: 'completed'
        }
      ]);

    } catch (error) {
      console.error('Error loading financial data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load financial data',
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'commission':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'payout':
        return <ArrowDownRight className="h-4 w-4 text-blue-600" />;
      case 'refund':
        return <RefreshCw className="h-4 w-4 text-red-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'commission':
        return 'text-green-600';
      case 'payout':
        return 'text-blue-600';
      case 'refund':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
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
        </div>

        <Button onClick={() => handleExportReport('financial')}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(financeData.totalRevenue)}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+{financeData.monthlyGrowth}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <PieChart className="h-8 w-8 text-blue-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Commission Earned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(financeData.commission)}
                </p>
                <span className="text-xs text-gray-500">
                  {(financeData.commissionRate * 100).toFixed(1)}% rate
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Vendor Payouts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(financeData.vendorPayouts)}
                </p>
                <span className="text-xs text-gray-500">
                  {financeData.transactionCount} transactions
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(financeData.netProfit)}
                </p>
                <span className="text-xs text-gray-500">
                  Avg: {formatCurrency(financeData.averageOrderValue)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="breakdown">Revenue Breakdown</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Vendor Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Revenue growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Revenue chart will be implemented</p>
                    <p className="text-xs text-gray-400">Using Chart.js or Recharts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commission Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Commission Overview</CardTitle>
                <CardDescription>Commission breakdown by period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">This Month</p>
                      <p className="text-sm text-gray-500">Commission earned</p>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(financeData.commission)}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Pending Payouts</p>
                      <p className="text-sm text-gray-500">To be processed</p>
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(financeData.vendorPayouts * 0.3)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium">Platform Fees</p>
                      <p className="text-sm text-gray-500">Operational costs</p>
                    </div>
                    <p className="text-lg font-bold text-purple-600">
                      {formatCurrency(financeData.commission * 0.3)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* By University */}
            <Card>
              <CardHeader>
                <CardTitle>By University</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {revenueBreakdown.byUniversity.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
                      <div className="text-right">
                        <p className="text-sm font-bold">{formatCurrency(item.revenue)}</p>
                        <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* By Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>By Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {revenueBreakdown.byPaymentMethod.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.method}</span>
                      <div className="text-right">
                        <p className="text-sm font-bold">{formatCurrency(item.amount)}</p>
                        <p className="text-xs text-gray-500">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* By Category */}
            <Card>
              <CardHeader>
                <CardTitle>By Vendor Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {revenueBreakdown.byVendorCategory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.category}</span>
                      <div className="text-right">
                        <p className="text-sm font-bold">{formatCurrency(item.amount)}</p>
                        <p className="text-xs text-gray-500">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest financial transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">{transaction.type}</h3>
                        <p className="text-sm text-gray-600">{transaction.vendor}</p>
                        <p className="text-sm text-gray-500">{transaction.university}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </p>
                      <div className="flex items-center mt-1">
                        {transaction.status === 'completed' ? (
                          <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-yellow-600 mr-1" />
                        )}
                        <span className="text-xs text-gray-500 capitalize">
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Payout Management</CardTitle>
              <CardDescription>Manage vendor payments and commission</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
                    <CreditCard className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <p className="font-medium">Process Payouts</p>
                      <p className="text-xs text-gray-500">Batch process pending</p>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <p className="font-medium">Payout Reports</p>
                      <p className="text-xs text-gray-500">Generate reports</p>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <p className="font-medium">Review Disputes</p>
                      <p className="text-xs text-gray-500">Handle payment issues</p>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
