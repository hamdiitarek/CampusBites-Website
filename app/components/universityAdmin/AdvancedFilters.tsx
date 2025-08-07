'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../(landing)/components/ui/card';
import { Button } from '../../(landing)/components/ui/button';
import { Input } from '../../(landing)/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../(landing)/components/ui/select';
import { Badge } from '../../(landing)/components/ui/badge';
import { Calendar } from '../../(landing)/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../(landing)/components/ui/popover';
import { 
  Filter, 
  Calendar as CalendarIcon, 
  X, 
  Save, 
  RotateCcw,
  ChevronDown,
  Search
} from 'lucide-react';
import { format } from 'date-fns';

export interface FilterConfig {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  timePeriod: '7d' | '30d' | '90d';
  categories: string[];
  vendors: string[];
  orderStatus: string[];
  priceRange: {
    min: number;
    max: number;
  };
  searchTerm: string;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterConfig) => void;
  availableCategories: string[];
  availableVendors: string[];
  availableStatuses: string[];
  savedFilters?: { name: string; config: FilterConfig }[];
  onSaveFilter?: (name: string, config: FilterConfig) => void;
}

export function AdvancedFilters({
  onFiltersChange,
  availableCategories,
  availableVendors,
  availableStatuses,
  savedFilters = [],
  onSaveFilter
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [saveFilterName, setSaveFilterName] = useState('');
  
  // Draft filters (local state while editing)
  const [draftFilters, setDraftFilters] = useState<FilterConfig>({
    dateRange: { from: null, to: null },
    timePeriod: '30d',
    categories: [],
    vendors: [],
    orderStatus: [],
    priceRange: { min: 0, max: 1000 },
    searchTerm: ''
  });

  // Applied filters (what's actually being used)
  const [appliedFilters, setAppliedFilters] = useState<FilterConfig>({
    dateRange: { from: null, to: null },
    timePeriod: '30d',
    categories: [],
    vendors: [],
    orderStatus: [],
    priceRange: { min: 0, max: 1000 },
    searchTerm: ''
  });

  const updateDraftFilters = (newFilters: Partial<FilterConfig>) => {
    const updatedFilters = { ...draftFilters, ...newFilters };
    setDraftFilters(updatedFilters);
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    onFiltersChange(draftFilters);
    setIsOpen(false); // Auto-close the filters panel after applying
  };

  const clearFilters = () => {
    const clearedFilters: FilterConfig = {
      dateRange: { from: null, to: null },
      timePeriod: '30d',
      categories: [],
      vendors: [],
      orderStatus: [],
      priceRange: { min: 0, max: 1000 },
      searchTerm: ''
    };
    setDraftFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const removeArrayFilter = (type: keyof FilterConfig, value: string) => {
    const currentArray = draftFilters[type] as string[];
    updateDraftFilters({
      [type]: currentArray.filter(item => item !== value)
    });
  };

  const addArrayFilter = (type: keyof FilterConfig, value: string) => {
    const currentArray = draftFilters[type] as string[];
    if (!currentArray.includes(value)) {
      updateDraftFilters({
        [type]: [...currentArray, value]
      });
    }
  };

  const loadSavedFilter = (config: FilterConfig) => {
    setDraftFilters(config);
    setAppliedFilters(config);
    onFiltersChange(config);
    setIsOpen(false);
  };

  const saveCurrentFilter = () => {
    if (saveFilterName.trim() && onSaveFilter) {
      onSaveFilter(saveFilterName.trim(), appliedFilters);
      setSaveFilterName('');
    }
  };

  // Check if there are pending changes
  const hasChanges = JSON.stringify(draftFilters) !== JSON.stringify(appliedFilters);

  const activeFilterCount = 
    // Show time period as active only if it's not default AND no custom date range is set
    (appliedFilters.dateRange.from ? 1 : (appliedFilters.timePeriod !== '30d' ? 1 : 0)) +
    appliedFilters.categories.length +
    appliedFilters.vendors.length +
    appliedFilters.orderStatus.length +
    (appliedFilters.searchTerm ? 1 : 0) +
    (appliedFilters.priceRange.min > 0 || appliedFilters.priceRange.max < 1000 ? 1 : 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 transition-all duration-200"
          >
            <Filter className="h-4 w-4" />
            Advanced Filters
            {activeFilterCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              </motion.div>
            )}
            {hasChanges && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
              >
                <Badge variant="default" className="ml-1 bg-orange-500 text-white">
                  Pending
                </Badge>
              </motion.div>
            )}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </Button>
        </motion.div>
        
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </motion.div>
        )}
      </div>

      {/* Active Filters Display */}
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <motion.div 
              className="flex flex-wrap gap-2"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
          {/* Show custom date range if set, otherwise show time period if not default */}
          {appliedFilters.dateRange.from ? (
            <Badge variant="secondary" className="flex items-center gap-1">
              Custom Range: {format(appliedFilters.dateRange.from, 'MMM dd')}
              {appliedFilters.dateRange.to && ` - ${format(appliedFilters.dateRange.to, 'MMM dd')}`}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  const newFilters = { ...appliedFilters, dateRange: { from: null, to: null } };
                  setAppliedFilters(newFilters);
                  setDraftFilters(newFilters);
                  onFiltersChange(newFilters);
                }}
              />
            </Badge>
          ) : appliedFilters.timePeriod !== '30d' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Time: {appliedFilters.timePeriod === '7d' ? 'Last 7 days' : 'Last 90 days'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  const newFilters = { ...appliedFilters, timePeriod: '30d' as const };
                  setAppliedFilters(newFilters);
                  setDraftFilters(newFilters);
                  onFiltersChange(newFilters);
                }}
              />
            </Badge>
          )}
          
          {appliedFilters.categories.map(category => (
            <Badge key={category} variant="secondary" className="flex items-center gap-1">
              Category: {category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  const newCategories = appliedFilters.categories.filter(c => c !== category);
                  const newFilters = { ...appliedFilters, categories: newCategories };
                  setAppliedFilters(newFilters);
                  setDraftFilters(newFilters);
                  onFiltersChange(newFilters);
                }}
              />
            </Badge>
          ))}
          
          {appliedFilters.vendors.map(vendor => (
            <Badge key={vendor} variant="secondary" className="flex items-center gap-1">
              Vendor: {vendor}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  const newVendors = appliedFilters.vendors.filter(v => v !== vendor);
                  const newFilters = { ...appliedFilters, vendors: newVendors };
                  setAppliedFilters(newFilters);
                  setDraftFilters(newFilters);
                  onFiltersChange(newFilters);
                }}
              />
            </Badge>
          ))}
          
          {appliedFilters.orderStatus.map(status => (
            <Badge key={status} variant="secondary" className="flex items-center gap-1">
              Status: {status}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  const newStatus = appliedFilters.orderStatus.filter(s => s !== status);
                  const newFilters = { ...appliedFilters, orderStatus: newStatus };
                  setAppliedFilters(newFilters);
                  setDraftFilters(newFilters);
                  onFiltersChange(newFilters);
                }}
              />
            </Badge>
          ))}
          
          {appliedFilters.searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{appliedFilters.searchTerm}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  const newFilters = { ...appliedFilters, searchTerm: '' };
                  setAppliedFilters(newFilters);
                  setDraftFilters(newFilters);
                  onFiltersChange(newFilters);
                }}
              />
            </Badge>
          )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.04, 0.62, 0.23, 0.98],
              opacity: { duration: 0.3 }
            }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ 
                duration: 0.3,
                delay: 0.1,
                ease: "easeOut"
              }}
            >
              <Card className="border-2 border-gray-200 shadow-lg mt-2">
                <CardHeader>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                  >
                    <CardTitle className="flex items-center justify-between">
                      <span>Filter Options</span>
                      <div className="flex items-center gap-2">
                        {onSaveFilter && (
                          <motion.div 
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3, delay: 0.25 }}
                          >
                            <Input
                              placeholder="Filter name"
                              value={saveFilterName}
                              onChange={(e) => setSaveFilterName(e.target.value)}
                              className="w-32"
                            />
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button size="sm" onClick={saveCurrentFilter}>
                                <Save className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </CardTitle>
                  </motion.div>
                </CardHeader>
          
                <CardContent className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Search Term */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.25 }}
                    >
                      <label className="text-sm font-medium mb-2 block">Search</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search orders, vendors, items..."
                          value={draftFilters.searchTerm}
                          onChange={(e) => updateDraftFilters({ searchTerm: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </motion.div>

                    {/* Time Period */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <label className="text-sm font-medium mb-2 block">Time Period</label>
                      {draftFilters.dateRange.from && (
                        <motion.p 
                          className="text-xs text-amber-600 mb-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          ⚠️ Custom date range will override these preset options
                        </motion.p>
                      )}
                      <div className="flex gap-2">
                <Button
                  type="button"
                  variant={draftFilters.timePeriod === '7d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateDraftFilters({ timePeriod: '7d' })}
                  disabled={!!(draftFilters.dateRange.from)}
                >
                  Last 7 days
                </Button>
                <Button
                  type="button"
                  variant={draftFilters.timePeriod === '30d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateDraftFilters({ timePeriod: '30d' })}
                  disabled={!!(draftFilters.dateRange.from)}
                >
                  Last 30 days
                </Button>
                <Button
                  type="button"
                  variant={draftFilters.timePeriod === '90d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateDraftFilters({ timePeriod: '90d' })}
                  disabled={!!(draftFilters.dateRange.from)}
                >
                  Last 90 days
                </Button>
              </div>
                    </motion.div>

            {/* Custom Date Range */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Custom Date Range</label>
                {draftFilters.dateRange.from && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => updateDraftFilters({ dateRange: { from: null, to: null } })}
                    className="text-xs h-6"
                  >
                    Clear Range
                  </Button>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-2">Override time period with specific dates</p>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 justify-start">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {draftFilters.dateRange.from ? format(draftFilters.dateRange.from, 'MMM dd, yyyy') : 'From date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={draftFilters.dateRange.from || undefined}
                      onSelect={(date) => updateDraftFilters({ 
                        dateRange: { ...draftFilters.dateRange, from: date || null } 
                      })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 justify-start">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {draftFilters.dateRange.to ? format(draftFilters.dateRange.to, 'MMM dd, yyyy') : 'To date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={draftFilters.dateRange.to || undefined}
                      onSelect={(date) => updateDraftFilters({ 
                        dateRange: { ...draftFilters.dateRange, to: date || null } 
                      })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Show reminder to apply filters when dates are selected */}
              {(draftFilters.dateRange.from || draftFilters.dateRange.to) && hasChanges && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center text-sm text-blue-700">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span className="font-medium">
                      {draftFilters.dateRange.from && draftFilters.dateRange.to 
                        ? 'Custom date range selected.' 
                        : draftFilters.dateRange.from 
                        ? 'Start date selected.' 
                        : 'End date selected.'
                      }
                    </span>
                    <span className="ml-1">Click "Apply Filters" to update data.</span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Categories */}
              <div>
                <label className="text-sm font-medium mb-2 block">Categories</label>
                <Select onValueChange={(value) => addArrayFilter('categories', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vendors */}
              <div>
                <label className="text-sm font-medium mb-2 block">Vendors</label>
                <Select onValueChange={(value) => addArrayFilter('vendors', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendors" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVendors.map(vendor => (
                      <SelectItem key={vendor} value={vendor}>
                        {vendor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Order Status */}
              <div>
                <label className="text-sm font-medium mb-2 block">Order Status</label>
                <Select onValueChange={(value) => addArrayFilter('orderStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStatuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Price Range (EGP)</label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  placeholder="Min"
                  value={draftFilters.priceRange.min}
                  onChange={(e) => updateDraftFilters({
                    priceRange: { ...draftFilters.priceRange, min: Number(e.target.value) }
                  })}
                  className="w-24"
                />
                <span>to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={draftFilters.priceRange.max}
                  onChange={(e) => updateDraftFilters({
                    priceRange: { ...draftFilters.priceRange, max: Number(e.target.value) }
                  })}
                  className="w-24"
                />
              </div>
            </div>

            {/* Saved Filters */}
            {savedFilters.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Saved Filters</label>
                <div className="flex flex-wrap gap-2">
                  {savedFilters.map((savedFilter, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => loadSavedFilter(savedFilter.config)}
                    >
                      {savedFilter.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
                  </motion.div>

            {/* Apply/Cancel Buttons */}
            <motion.div 
              className="flex items-center justify-end gap-3 pt-4 border-t"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  variant="outline" 
                  onClick={() => setDraftFilters(appliedFilters)}
                  disabled={!hasChanges}
                >
                  Cancel
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: hasChanges ? 1.05 : 1 }}
                whileTap={{ scale: hasChanges ? 0.95 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  onClick={applyFilters}
                  disabled={!hasChanges}
                  className={`min-w-[120px] transition-all duration-300 ${
                    hasChanges 
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-lg' 
                      : ''
                  }`}
                >
                  <motion.span
                    animate={hasChanges ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ 
                      duration: 2, 
                      repeat: hasChanges ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    Apply Filters
                  </motion.span>
                  {hasChanges && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <Badge variant="secondary" className="ml-2 bg-white text-blue-600">
                        {draftFilters.dateRange?.from && draftFilters.dateRange?.to ? 'Dates' : 'Changes'}
                      </Badge>
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
