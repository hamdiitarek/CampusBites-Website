/**
 * Campus Bites - Database Constants
 * Enums and constant values used across the application
 */

// ========================================
// User Role Constants
// ========================================

export const USER_ROLES = {
  STUDENT: 'student',
  VENDOR: 'vendor', 
  ADMIN: 'admin',
  SUPER_ADMIN: 'super-admin'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// ========================================
// Order Status Constants
// ========================================

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// ========================================
// Payment Method Constants
// ========================================

export const PAYMENT_METHODS = {
  WALLET: 'Wallet',
  CASH: 'Cash'
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

// ========================================
// Complaint Status Constants
// ========================================

export const COMPLAINT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
} as const;

export type ComplaintStatus = typeof COMPLAINT_STATUS[keyof typeof COMPLAINT_STATUS];

// ========================================
// Notification Type Constants
// ========================================

export const NOTIFICATION_TYPES = {
  ORDER: 'order',
  PAYMENT: 'payment',
  PROMOTION: 'promotion',
  SYSTEM: 'system',
  COMPLAINT: 'complaint'
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// ========================================
// Notification Status Constants
// ========================================

export const NOTIFICATION_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed'
} as const;

export type NotificationStatus = typeof NOTIFICATION_STATUS[keyof typeof NOTIFICATION_STATUS];

// ========================================
// Transaction Type Constants
// ========================================

export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  ORDER_PAYMENT: 'order_payment',
  REFUND: 'refund',
  ADMIN_ADJUSTMENT: 'admin_adjustment'
} as const;

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

// ========================================
// Transaction Status Constants
// ========================================

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
} as const;

export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];

// ========================================
// Priority Levels
// ========================================

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

export type PriorityLevel = typeof PRIORITY_LEVELS[keyof typeof PRIORITY_LEVELS];

// ========================================
// Firestore Collection Names
// ========================================

export const COLLECTIONS = {
  USERS: 'users',
  VENDORS: 'vendors',
  ORDERS: 'orders',
  UNIVERSITIES: 'universities',
  COMPLAINTS: 'complaints',
  NOTIFICATIONS: 'notifications',
  TRANSACTIONS: 'transactions',
  REVIEWS: 'reviews',
  ANALYTICS: 'analytics'
} as const;

// ========================================
// Vendor Subcollections
// ========================================

export const VENDOR_SUBCOLLECTIONS = {
  MENU: 'menu',
  ORDERS: 'orders'
} as const;

// ========================================
// University Domain Mappings
// ========================================

export const UNIVERSITY_DOMAINS = {
  'students.eui.edu.eg': 'Egypt University of Informatics',
  'guc.edu.eg': 'German University in Cairo'
} as const;

// ========================================
// Default Values
// ========================================

export const DEFAULT_VALUES = {
  WALLET_BALANCE: 0,
  VENDOR_RATING: 0,
  REVIEW_COUNT: 0,
  ITEM_POPULARITY: 0,
  PAGINATION_LIMIT: 20,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ORDER_TIMEOUT_MINUTES: 30,
  NOTIFICATION_EXPIRY_DAYS: 30
} as const;

// ========================================
// Validation Rules
// ========================================

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  PHONE_NUMBER_LENGTH: 11,
  MAX_ITEM_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_COMPLAINT_TITLE_LENGTH: 200,
  MAX_COMPLAINT_DESCRIPTION_LENGTH: 1000,
  MIN_RATING: 1,
  MAX_RATING: 5,
  MAX_QUANTITY: 99
} as const;

// ========================================
// Error Messages
// ========================================

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  INVALID_DATA: 'The provided data is invalid',
  NETWORK_ERROR: 'Network error occurred. Please try again',
  UNKNOWN_ERROR: 'An unknown error occurred',
  INSUFFICIENT_BALANCE: 'Insufficient wallet balance',
  ORDER_NOT_FOUND: 'Order not found',
  VENDOR_NOT_FOUND: 'Vendor not found',
  USER_NOT_FOUND: 'User not found',
  INVALID_EMAIL_DOMAIN: 'Email domain not supported',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  VENDOR_NOT_APPROVED: 'Vendor is not approved',
  VENDOR_SUSPENDED: 'Vendor account is suspended',
  ORDER_ALREADY_CANCELLED: 'Order is already cancelled',
  ORDER_CANNOT_BE_CANCELLED: 'Order cannot be cancelled at this stage'
} as const;

// ========================================
// Success Messages
// ========================================

export const SUCCESS_MESSAGES = {
  ORDER_PLACED: 'Order placed successfully',
  ORDER_UPDATED: 'Order updated successfully',
  ORDER_CANCELLED: 'Order cancelled successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  VENDOR_APPROVED: 'Vendor approved successfully',
  VENDOR_SUSPENDED: 'Vendor suspended successfully',
  COMPLAINT_SUBMITTED: 'Complaint submitted successfully',
  COMPLAINT_RESOLVED: 'Complaint resolved successfully',
  NOTIFICATION_SENT: 'Notification sent successfully',
  PAYMENT_PROCESSED: 'Payment processed successfully'
} as const;
