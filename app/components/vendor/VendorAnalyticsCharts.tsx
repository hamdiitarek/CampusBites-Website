'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Badge } from '@/(landing)/components/ui/badge';
import { Button } from '@/(landing)/components/ui/button';
import { 
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Users,
  DollarSign
} from 'lucide-react';

// Color palette for charts
const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

interface VendorAnalyticsChartsProps {
  popularItems: any[];
  revenueData: any[];
  orderTrends: any[];
  loading?: boolean;
}

// Order Status Distribution Chart
function OrderStatusChart({ data, loading }: { data: any[]; loading?: boolean }) {
  const statusData = [
    { name: 'Completed', value: 65, color: '#10B981' },
    { name: 'Pending', value: 20, color: '#F59E0B' },
    { name: 'Confirmed', value: 10, color: '#3B82F6' },
    { name: 'Cancelled', value: 5, color: '#EF4444' }
  ];

  if (loading) {
    return <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Order Status Distribution
        </CardTitle>
        <CardDescription>Distribution of orders by status</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <RechartsPieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Popular Items Bar Chart
function PopularItemsChart({ data, loading }: { data: any[]; loading?: boolean }) {
  if (loading) {
    return <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />;
  }

  const chartData = data.slice(0, 6).map(item => ({
    name: item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name,
    fullName: item.name,
    totalSold: item.totalSold,
    revenue: item.revenue
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Top Selling Items
        </CardTitle>
        <CardDescription>Most popular items by quantity sold</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, name === 'totalSold' ? 'Units Sold' : 'Revenue']}
              labelFormatter={(label) => {
                const item = chartData.find(d => d.name === label);
                return item ? item.fullName : label;
              }}
            />
            <Bar dataKey="totalSold" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Monthly Revenue Comparison
function MonthlyRevenueChart({ data, loading }: { data: any[]; loading?: boolean }) {
  if (loading) {
    return <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />;
  }

  // Generate mock monthly data for comparison
  const monthlyData = [
    { month: 'Jan', thisYear: 12000, lastYear: 10000 },
    { month: 'Feb', thisYear: 14000, lastYear: 11000 },
    { month: 'Mar', thisYear: 16000, lastYear: 12000 },
    { month: 'Apr', thisYear: 15000, lastYear: 13000 },
    { month: 'May', thisYear: 18000, lastYear: 14000 },
    { month: 'Jun', thisYear: 20000, lastYear: 15000 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Monthly Revenue Comparison
        </CardTitle>
        <CardDescription>This year vs last year</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(Number(value)),
                name === 'thisYear' ? 'This Year' : 'Last Year'
              ]}
            />
            <Legend />
            <Bar dataKey="thisYear" fill="#3B82F6" name="This Year" />
            <Bar dataKey="lastYear" fill="#94A3B8" name="Last Year" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Customer Growth Chart
function CustomerGrowthChart({ loading }: { loading?: boolean }) {
  if (loading) {
    return <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />;
  }

  const growthData = [
    { month: 'Jan', newCustomers: 15, totalCustomers: 85 },
    { month: 'Feb', newCustomers: 22, totalCustomers: 107 },
    { month: 'Mar', newCustomers: 18, totalCustomers: 125 },
    { month: 'Apr', newCustomers: 25, totalCustomers: 150 },
    { month: 'May', newCustomers: 30, totalCustomers: 180 },
    { month: 'Jun', newCustomers: 28, totalCustomers: 208 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Customer Growth
        </CardTitle>
        <CardDescription>New vs total customers over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="totalCustomers" 
              stroke="#3B82F6" 
              strokeWidth={2} 
              name="Total Customers"
            />
            <Line 
              type="monotone" 
              dataKey="newCustomers" 
              stroke="#10B981" 
              strokeWidth={2} 
              name="New Customers"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Performance Overview Cards
function PerformanceMetrics({ loading }: { loading?: boolean }) {
  const metrics = [
    {
      title: 'Revenue Growth',
      value: '+24.5%',
      change: 24.5,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Order Growth',
      value: '+18.2%',
      change: 18.2,
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Customer Growth',
      value: '+32.1%',
      change: 32.1,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  {loading ? (
                    <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <Badge className={`${metric.bgColor} ${metric.color} border-0`}>
                        +{metric.change}%
                      </Badge>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">vs last month</p>
                </div>
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <metric.icon size={24} className={metric.color} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export function VendorAnalyticsCharts({ popularItems, revenueData, orderTrends, loading = false }: VendorAnalyticsChartsProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PerformanceMetrics loading={loading} />
      </motion.div>

      {/* Time Range Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
        <div className="flex items-center gap-2">
          {['7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={selectedTimeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange(range)}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* First Row - Order Status and Popular Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <OrderStatusChart data={[]} loading={loading} />
        <PopularItemsChart data={popularItems} loading={loading} />
      </motion.div>

      {/* Second Row - Monthly Revenue and Customer Growth */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <MonthlyRevenueChart data={revenueData} loading={loading} />
        <CustomerGrowthChart loading={loading} />
      </motion.div>
    </div>
  );
}