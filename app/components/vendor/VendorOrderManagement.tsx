'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Button } from '@/(landing)/components/ui/button';
import { Badge } from '@/(landing)/components/ui/badge';
import { Input } from '@/(landing)/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/(landing)/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/(landing)/components/ui/dialog';
import { Label } from '@/(landing)/components/ui/label';
import { Textarea } from '@/(landing)/components/ui/textarea';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Eye,
  Edit,
  Phone,
  User,
  MapPin,
  Calendar,
  Search,
  Filter,
  Timer,
  Package,
  MessageCircle
} from 'lucide-react';
import { AppwriteVendorService } from '@/lib/appwriteVendorService';

interface VendorOrder {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: 'Wallet' | 'Cash';
  createdAt: string;
  customerNote?: string;
  estimatedReadyTime?: string;
}

interface OrderManagementProps {
  orders: VendorOrder[];
  loading?: boolean;
  onOrderUpdate: (orderId: string, status: string) => Promise<void>;
  onRefresh: () => void;
}

// Order status configuration
const ORDER_STATUS_CONFIG = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    label: 'Pending',
    nextActions: ['confirmed', 'cancelled']
  },
  confirmed: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: AlertCircle,
    label: 'Confirmed',
    nextActions: ['ready', 'cancelled']
  },
  ready: {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Package,
    label: 'Ready',
    nextActions: ['completed']
  },
  completed: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    label: 'Completed',
    nextActions: []
  },
  cancelled: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    label: 'Cancelled',
    nextActions: []
  }
};

const ACTION_LABELS = {
  confirmed: 'Confirm Order',
  ready: 'Mark Ready',
  completed: 'Mark Completed',
  cancelled: 'Cancel Order'
};

// Order Status Badge Component
function OrderStatusBadge({ status }: { status: string }) {
  const config = ORDER_STATUS_CONFIG[status as keyof typeof ORDER_STATUS_CONFIG];
  const IconComponent = config.icon;
  
  return (
    <Badge className={`${config.color} border flex items-center gap-1`}>
      <IconComponent size={12} />
      {config.label}
    </Badge>
  );
}

// Order Details Dialog
function OrderDetailsDialog({ order, onStatusUpdate }: { 
  order: VendorOrder; 
  onStatusUpdate: (orderId: string, status: string) => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(order.id, newStatus);
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const config = ORDER_STATUS_CONFIG[order.status];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order #{order.id.slice(-6).toUpperCase()}
            <OrderStatusBadge status={order.status} />
          </DialogTitle>
          <DialogDescription>
            Order placed on {new Date(order.createdAt).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Items */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                    {item.note && (
                      <div className="text-sm text-gray-600 italic">Note: {item.note}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                    <div className="text-sm text-gray-500">{formatCurrency(item.price)} each</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount</span>
              <span className="text-xl font-bold">{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Payment Method</span>
              <span className="text-gray-900">{order.paymentMethod}</span>
            </div>
          </div>

          {/* Customer Note */}
          {order.customerNote && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Customer Note</h4>
              <div className="p-3 bg-blue-50 rounded-lg text-blue-800">
                {order.customerNote}
              </div>
            </div>
          )}

          {/* Status Actions */}
          {config.nextActions.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Update Status</h4>
              <div className="flex gap-2">
                {config.nextActions.map((action) => (
                  <Button
                    key={action}
                    onClick={() => handleStatusUpdate(action)}
                    disabled={isUpdating}
                    variant={action === 'cancelled' ? 'destructive' : 'default'}
                  >
                    {isUpdating ? 'Updating...' : ACTION_LABELS[action as keyof typeof ACTION_LABELS]}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Quick Action Buttons
function QuickActions({ order, onStatusUpdate }: { 
  order: VendorOrder; 
  onStatusUpdate: (orderId: string, status: string) => Promise<void>;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const config = ORDER_STATUS_CONFIG[order.status];

  const handleQuickAction = async (action: string) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(order.id, action);
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (config.nextActions.length === 0) {
    return null;
  }

  const primaryAction = config.nextActions.find(action => action !== 'cancelled');
  
  return (
    <div className="flex items-center gap-2">
      {primaryAction && (
        <Button
          size="sm"
          onClick={() => handleQuickAction(primaryAction)}
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : ACTION_LABELS[primaryAction as keyof typeof ACTION_LABELS]}
        </Button>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <OrderDetailsDialog order={order} onStatusUpdate={onStatusUpdate} />
          <DropdownMenuSeparator />
          {config.nextActions.map((action) => (
            <DropdownMenuItem
              key={action}
              onClick={() => handleQuickAction(action)}
              className={action === 'cancelled' ? 'text-red-600' : ''}
            >
              {ACTION_LABELS[action as keyof typeof ACTION_LABELS]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function VendorOrderManagement({ orders, loading = false, onOrderUpdate, onRefresh }: OrderManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          order.id.toLowerCase().includes(searchLower) ||
          order.items.some(item => item.name.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.total - a.total;
        case 'lowest':
          return a.total - b.total;
        default:
          return 0;
      }
    });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffMs = now.getTime() - orderDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg">Order Management</CardTitle>
            <CardDescription>Manage and track your orders in real-time</CardDescription>
          </div>
          <Button onClick={onRefresh} size="sm">
            <Timer className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders by ID or item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm min-w-[120px]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm min-w-[120px]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Value</option>
            <option value="lowest">Lowest Value</option>
          </select>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters.'
                : 'You don\'t have any orders yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3 sm:flex-1 sm:items-center sm:gap-4">
                  <div className="shrink-0 pt-0.5 text-sm font-mono text-gray-500 sm:min-w-[80px] sm:pt-0">
                    #{order.id.slice(-6).toUpperCase()}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 mb-1">
                      <span className="whitespace-nowrap font-medium text-gray-900">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="whitespace-nowrap font-semibold text-gray-900">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Calendar className="h-3 w-3" />
                        {getTimeAgo(order.createdAt)}
                      </span>
                      <span>{order.paymentMethod}</span>
                      {order.customerNote && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <MessageCircle className="h-3 w-3" />
                          Note
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <OrderStatusBadge status={order.status} />
                  <QuickActions order={order} onStatusUpdate={onOrderUpdate} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}