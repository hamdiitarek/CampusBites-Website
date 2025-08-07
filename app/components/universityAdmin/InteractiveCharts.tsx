'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Button } from '@/(landing)/components/ui/button';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar,
  Users,
  ShoppingCart,
  DollarSign
} from 'lucide-react';

interface DrilldownData {
  name: string;
  value: number;
  revenue?: number;
  orders?: number;
  subData?: DrilldownData[];
}

interface InteractiveChartsProps {
  data: DrilldownData[];
  title: string;
  type: 'bar' | 'pie' | 'line';
  valueFormatter?: (value: number) => string;
  onDataPointClick?: (data: DrilldownData) => void;
}

export function InteractiveCharts({
  data,
  title,
  type,
  valueFormatter = (value) => value.toString(),
  onDataPointClick
}: InteractiveChartsProps) {
  const [currentLevel, setCurrentLevel] = useState<{
    data: DrilldownData[];
    breadcrumb: string[];
  }>({
    data,
    breadcrumb: [title]
  });

  const handleDataClick = (clickedData: any) => {
    // Find the full data object
    const fullData = currentLevel.data.find(item => item.name === clickedData.name);
    
    if (fullData && fullData.subData && fullData.subData.length > 0) {
      setCurrentLevel({
        data: fullData.subData,
        breadcrumb: [...currentLevel.breadcrumb, fullData.name]
      });
    }
    
    if (onDataPointClick && fullData) {
      onDataPointClick(fullData);
    }
  };

  const navigateUp = (index: number) => {
    if (index === 0) {
      setCurrentLevel({
        data,
        breadcrumb: [title]
      });
    } else {
      // Navigate to a specific level in breadcrumb
      let targetData = data;
      for (let i = 1; i <= index; i++) {
        const nextItem = targetData.find(item => item.name === currentLevel.breadcrumb[i]);
        if (nextItem && nextItem.subData) {
          targetData = nextItem.subData;
        }
      }
      setCurrentLevel({
        data: targetData,
        breadcrumb: currentLevel.breadcrumb.slice(0, index + 1)
      });
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={currentLevel.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={valueFormatter} />
              <Tooltip formatter={(value) => [valueFormatter(Number(value)), 'Value']} />
              <Bar 
                dataKey="value" 
                fill="#0088FE" 
                cursor="pointer"
                onClick={handleDataClick}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={currentLevel.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${valueFormatter(value)}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                onClick={handleDataClick}
                cursor="pointer"
              >
                {currentLevel.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [valueFormatter(Number(value)), 'Value']} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={currentLevel.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={valueFormatter} />
              <Tooltip formatter={(value) => [valueFormatter(Number(value)), 'Value']} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0088FE" 
                strokeWidth={2}
                dot={{ cursor: 'pointer' }}
                onClick={handleDataClick}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const canDrillDown = currentLevel.data.some(item => item.subData && item.subData.length > 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {currentLevel.breadcrumb.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateUp(currentLevel.breadcrumb.length - 2)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {currentLevel.breadcrumb[currentLevel.breadcrumb.length - 1]}
            </CardTitle>
            
            {/* Breadcrumb Navigation */}
            {currentLevel.breadcrumb.length > 1 && (
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                {currentLevel.breadcrumb.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <button
                      onClick={() => navigateUp(index)}
                      className="hover:text-blue-600 hover:underline"
                    >
                      {crumb}
                    </button>
                    {index < currentLevel.breadcrumb.length - 1 && <span>/</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
          
          {canDrillDown && (
            <div className="text-sm text-gray-500">
              Click on data points to drill down
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {renderChart()}
        
        {/* Data Summary */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {currentLevel.data.length}
            </div>
            <div className="text-sm text-gray-500">Categories</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {valueFormatter(currentLevel.data.reduce((sum, item) => sum + item.value, 0))}
            </div>
            <div className="text-sm text-gray-500">Total Value</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {valueFormatter(Math.max(...currentLevel.data.map(item => item.value)))}
            </div>
            <div className="text-sm text-gray-500">Highest</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {valueFormatter(currentLevel.data.reduce((sum, item) => sum + item.value, 0) / currentLevel.data.length)}
            </div>
            <div className="text-sm text-gray-500">Average</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Multi-Chart Dashboard with Drill-down
export function DrilldownDashboard() {
  // Sample hierarchical data
  const revenueData: DrilldownData[] = [
    {
      name: 'Fast Food',
      value: 45000,
      subData: [
        { 
          name: 'Burger King', 
          value: 25000,
          subData: [
            { name: 'Whopper', value: 15000 },
            { name: 'Chicken Burger', value: 8000 },
            { name: 'Fries', value: 2000 }
          ]
        },
        { 
          name: 'McDonald\'s', 
          value: 20000,
          subData: [
            { name: 'Big Mac', value: 12000 },
            { name: 'McNuggets', value: 5000 },
            { name: 'McFlurry', value: 3000 }
          ]
        }
      ]
    },
    {
      name: 'Healthy Food',
      value: 35000,
      subData: [
        { 
          name: 'Salad Bar', 
          value: 20000,
          subData: [
            { name: 'Caesar Salad', value: 8000 },
            { name: 'Greek Salad', value: 7000 },
            { name: 'Quinoa Bowl', value: 5000 }
          ]
        },
        { 
          name: 'Smoothie Corner', 
          value: 15000,
          subData: [
            { name: 'Green Smoothie', value: 6000 },
            { name: 'Protein Shake', value: 5000 },
            { name: 'Fruit Bowl', value: 4000 }
          ]
        }
      ]
    },
    {
      name: 'Beverages',
      value: 20000,
      subData: [
        { name: 'Coffee Shop', value: 12000 },
        { name: 'Juice Bar', value: 8000 }
      ]
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <InteractiveCharts
        data={revenueData}
        title="Revenue by Category"
        type="bar"
        valueFormatter={formatCurrency}
      />
      
      <InteractiveCharts
        data={revenueData}
        title="Category Distribution"
        type="pie"
        valueFormatter={formatCurrency}
      />
    </div>
  );
}
