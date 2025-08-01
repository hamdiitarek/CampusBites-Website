/**
 * Campus Bites - Models Export
 * Main export file for all database models, constants, validators, and utilities
 */

// Re-export everything from models
export * from './models/index';
export * from './models/constants';
export * from './models/validators';
export * from './models/database';

// Import types for local utility functions
import type { User, Order, Vendor, OrderItem, Notification } from './models/index';
import { USER_ROLES, ORDER_STATUS, UNIVERSITY_DOMAINS } from './models/constants';
import type { UserRole, OrderStatus } from './models/constants';

// ========================================
// Type Guards
// ========================================

/**
 * Type guard to check if a user is a student
 */
export const isStudent = (user: User): boolean => {
  return user.role === USER_ROLES.STUDENT;
};

/**
 * Type guard to check if a user is a vendor
 */
export const isVendor = (user: User): boolean => {
  return user.role === USER_ROLES.VENDOR;
};

/**
 * Type guard to check if a user is an admin
 */
export const isAdmin = (user: User): boolean => {
  return user.role === USER_ROLES.ADMIN;
};

/**
 * Type guard to check if a user is a super admin
 */
export const isSuperAdmin = (user: User): boolean => {
  return user.role === USER_ROLES.SUPER_ADMIN;
};

/**
 * Type guard to check if an order is pending
 */
export const isPendingOrder = (order: Order): boolean => {
  return order.status === ORDER_STATUS.PENDING;
};

/**
 * Type guard to check if an order is completed
 */
export const isCompletedOrder = (order: Order): boolean => {
  return order.status === ORDER_STATUS.COMPLETED;
};

/**
 * Type guard to check if an order can be cancelled
 */
export const canCancelOrder = (order: Order): boolean => {
  return order.status === ORDER_STATUS.PENDING || order.status === ORDER_STATUS.CONFIRMED;
};

/**
 * Type guard to check if a vendor is approved and open
 */
export const isVendorAvailable = (vendor: Vendor): boolean => {
  return vendor.isApproved && vendor.isOpen && !vendor.isSuspended;
};

// ========================================
// Utility Functions
// ========================================

/**
 * Calculate order total from items
 */
export const calculateOrderTotal = (items: OrderItem[]): number => {
  return items.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    const customizationsTotal = item.customizations ? 
      Object.values(item.customizations).reduce((sum, price) => sum + price, 0) * item.quantity : 0;
    return total + itemTotal + customizationsTotal;
  }, 0);
};

/**
 * Format currency value
 */
export const formatCurrency = (amount: number, currency: string = 'EGP'): string => {
  return `${amount.toFixed(2)} ${currency}`;
};

/**
 * Get university name from email domain
 */
export const getUniversityFromEmail = (email: string): string | null => {
  const domain = email.split('@')[1];
  return domain && UNIVERSITY_DOMAINS[domain as keyof typeof UNIVERSITY_DOMAINS] || null;
};

/**
 * Generate order display ID
 */
export const generateOrderDisplayId = (orderId: string): string => {
  return `#${orderId.slice(-6).toUpperCase()}`;
};

/**
 * Check if user has permission for action
 */
export const hasPermission = (user: User, action: string, resource?: any): boolean => {
  // Basic permission check - can be extended based on requirements
  switch (action) {
    case 'create_order':
      return isStudent(user);
    case 'manage_orders':
      return isVendor(user) || isAdmin(user) || isSuperAdmin(user);
    case 'approve_vendor':
      return isAdmin(user) || isSuperAdmin(user);
    case 'suspend_user':
      return isAdmin(user) || isSuperAdmin(user);
    case 'view_analytics':
      return isVendor(user) || isAdmin(user) || isSuperAdmin(user);
    case 'manage_universities':
      return isSuperAdmin(user);
    default:
      return false;
  }
};

/**
 * Get display name for order status
 */
export const getOrderStatusDisplayName = (status: OrderStatus): string => {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return 'Pending';
    case ORDER_STATUS.CONFIRMED:
      return 'Confirmed';
    case ORDER_STATUS.READY:
      return 'Ready for Pickup';
    case ORDER_STATUS.COMPLETED:
      return 'Completed';
    case ORDER_STATUS.CANCELLED:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

/**
 * Get display name for user role
 */
export const getUserRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case USER_ROLES.STUDENT:
      return 'Student';
    case USER_ROLES.VENDOR:
      return 'Vendor';
    case USER_ROLES.ADMIN:
      return 'Admin';
    case USER_ROLES.SUPER_ADMIN:
      return 'Super Admin';
    default:
      return 'Unknown';
  }
};

/**
 * Check if notification has expired
 */
export const isNotificationExpired = (notification: Notification): boolean => {
  if (!notification.expiresAt) return false;
  return notification.expiresAt.toDate() < new Date();
};

/**
 * Format timestamp to human readable string
 */
export const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return 'N/A';
  
  // Handle Firestore Timestamp
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (timestamp: any): string => {
  if (!timestamp) return 'N/A';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatTimestamp(timestamp);
};
