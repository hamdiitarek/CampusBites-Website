'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Button } from '@/(landing)/components/ui/button';
import { Badge } from '@/(landing)/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/(landing)/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  Star,
  Pizza,
  Coffee,
  Utensils,
  Apple,
  ChefHat,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Clock,
  Calendar,
  Filter
} from 'lucide-react';
import { FoodTrendData } from '../../../lib/universityAdminService';

interface FoodTrendsAnalysisProps {
  trends: FoodTrendData[];
  className?: string;
}

export function FoodTrendsAnalysis({ trends, className = "" }: FoodTrendsAnalysisProps) {
  const [sortBy, setSortBy] = useState<'popularity' | 'revenue' | 'trend'>('popularity');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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

  const getTrendBadgeColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'bg-green-100 text-green-800';
      case 'down': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP'
    }).format(amount);
  };

  // Filter and sort trends
  const filteredTrends = trends
    .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularityScore - a.popularityScore;
        case 'revenue':
          return b.revenue - a.revenue;
        case 'trend':
          return Math.abs(b.trendPercentage) - Math.abs(a.trendPercentage);
        default:
          return 0;
      }
    });

  // Get unique categories for filter
  const categories = Array.from(new Set(trends.map(item => item.category)));

  // Calculate summary stats
  const totalItems = trends.length;
  const trendingUp = trends.filter(item => item.trend === 'up').length;
  const trendingDown = trends.filter(item => item.trend === 'down').length;
  const totalRevenue = trends.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className={`space-y-4 md:space-y-6 w-full ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Items</p>
                <p className="text-lg md:text-2xl font-bold">{totalItems}</p>
              </div>
              <ChefHat className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Trending Up</p>
                <p className="text-lg md:text-2xl font-bold text-green-600">{trendingUp}</p>
              </div>
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Trending Down</p>
                <p className="text-lg md:text-2xl font-bold text-red-600">{trendingDown}</p>
              </div>
              <TrendingDown className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Revenue</p>
                <p className="text-lg md:text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
              <span className="text-xs md:text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px] md:w-[200px] text-xs md:text-sm">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: 'popularity' | 'revenue' | 'trend') => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[140px] md:w-[200px] text-xs md:text-sm">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="trend">Trend %</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trends List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base md:text-lg">
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Food Trends Analysis ({filteredTrends.length} items)
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Detailed analysis of food item performance and trends
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="space-y-3 md:space-y-4">
            {filteredTrends.map((item, index) => {
              const TrendIcon = getTrendIcon(item.trend);
              const CategoryIcon = getCategoryIcon(item.category);
              
              return (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-3 sm:gap-4">
                  <div className="flex items-start sm:items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-xs md:text-sm font-medium text-gray-500 w-4 md:w-6">#{index + 1}</span>
                      <CategoryIcon className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm md:text-lg truncate">{item.name}</h3>
                      <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">{item.category}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs md:text-sm space-y-1 sm:space-y-0">
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-500">Orders:</span>
                          <span className="font-medium">{item.totalOrders}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-500">Revenue:</span>
                          <span className="font-medium truncate">{formatCurrency(item.revenue)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          <span className="font-medium">{item.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col lg:flex-row items-center space-x-4 sm:space-x-0 lg:space-x-4 sm:space-y-2 lg:space-y-0 w-full sm:w-auto">
                    {/* Trend Indicator */}
                    <div className="text-center flex-shrink-0">
                      <div className={`flex items-center justify-center ${getTrendColor(item.trend)} mb-1`}>
                        <TrendIcon className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        <span className="text-xs md:text-sm font-medium">
                          {item.trend === 'stable' ? 'Stable' : `${item.trendPercentage > 0 ? '+' : ''}${item.trendPercentage.toFixed(1)}%`}
                        </span>
                      </div>
                      <Badge className={`${getTrendBadgeColor(item.trend)} text-xs`}>
                        {item.trend}
                      </Badge>
                    </div>

                    {/* Popularity Score */}
                    <div className="text-center flex-shrink-0">
                      <div className="text-xs md:text-sm font-medium text-gray-900 mb-1">
                        {item.popularityScore.toFixed(0)}%
                      </div>
                      <div className="w-12 md:w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.popularityScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Peak Hours - Hidden on mobile to save space */}
                    <div className="text-center min-w-[80px] md:min-w-[100px] hidden sm:block">
                      <div className="text-xs text-gray-500 mb-1">Peak Hours</div>
                      <div className="flex items-center justify-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {item.peakHours.slice(0, 2).join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Weekly Comparison */}
                    <div className="text-center flex-shrink-0">
                      <div className="text-xs text-gray-500 mb-1">This Week</div>
                      <div className="text-xs md:text-sm font-medium text-gray-900">
                        {item.thisWeekOrders}
                      </div>
                      <div className="text-xs text-gray-500 hidden md:block">
                        vs {item.lastWeekOrders} last week
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredTrends.length === 0 && (
              <div className="text-center py-8">
                <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No food trends found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
