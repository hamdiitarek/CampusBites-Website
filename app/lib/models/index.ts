/**
 * Campus Bites - Database Models
 * TypeScript interfaces and types for Firestore collections
 * Based on database.md architecture
 */

import { Timestamp } from 'firebase/firestore';
import type {
  UserRole,
  OrderStatus,
  PaymentMethod,
  ComplaintStatus,
  NotificationType,
  NotificationStatus,
  TransactionType,
  TransactionStatus,
  PriorityLevel
} from './constants';

// ========================================
// Order Models
// ========================================

export interface CustomizationOption {
  [optionName: string]: number; // Option name: additional price
}

export interface OrderItem {
  id: string;                  // Menu item ID
  name: string;                // Item name
  price: number;               // Item price
  quantity: number;            // Quantity ordered
  note?: string;               // Special instructions
  customizations?: CustomizationOption; // Selected customizations
  category?: string;           // Food category (for analytics)
}

// ========================================
// Core User Management Models
// ========================================

export interface User {
  id: string;                    // Firebase Auth UID
  fullName: string;              // User's full name
  email: string;                 // University email address
  universityId: string;          // Student/Staff ID
  universityName: string;        // University name for filtering
  phoneNumber?: string;          // Contact number
  isEmailVerified: boolean;      // Email verification status
  role: UserRole;               // User role
  walletBalance: number;        // Digital wallet balance (EGP)
  profileImageUrl?: string;     // Profile picture URL
  fcmToken?: string;            // Firebase Cloud Messaging token
  createdAt?: Timestamp;        // Account creation date
  updatedAt?: Timestamp;        // Last update timestamp
}

// Legacy interface for backward compatibility
export interface UserData extends User {}

// ========================================
// University Models
// ========================================

export interface University {
  id: string;                   // University identifier
  name: string;                 // Full university name
  nameAr?: string;             // Arabic university name
  emailDomain: string;         // Email domain for validation
  city?: string;               // University city
  cityAr?: string;             // Arabic city name
  address?: string;            // University address
  addressAr?: string;          // Arabic address
  phone?: string;              // Contact phone
  website?: string;            // University website
  isActive: boolean;           // University status
  createdAt?: Timestamp;       // Registration date
  updatedAt?: Timestamp;       // Last update
}

// University with user counts (for admin dashboards)
export interface UniversityData extends University {
  studentsCount: number;       // Number of students
  vendorsCount: number;        // Number of vendors
  adminsCount: number;         // Number of admins
  totalUsers: number;          // Total user count
}

// ========================================
// Vendor Models
// ========================================

export interface Vendor {
  id: string;                  // Vendor document ID (matches user ID)
  name: string;                // Business name
  userId: string;              // Reference to user document
  universityId: string;        // University association
  universityName: string;      // University name for filtering
  description: string;         // Business description
  imageUrl?: string;           // Vendor logo/image
  rating: number;              // Average rating (0-5)
  reviewCount: number;         // Total number of reviews
  categories: string[];        // Food categories offered
  isOpen: boolean;             // Current operational status
  isApproved: boolean;         // Admin approval status
  isSuspended: boolean;        // Suspension status
  createdAt?: Timestamp;       // Vendor registration date
  updatedAt?: Timestamp;       // Last update
}

// Legacy interface for backward compatibility
export interface VendorData extends Vendor {}

// ========================================
// Menu Models
// ========================================

export interface MenuItem {
  id: string;                  // Item ID
  Name: string;                // Item name
  Description: string;         // Item description
  Price: number;               // Price in EGP
  ImagePath?: string;          // Firebase Storage path
  Popularity: number;          // Popularity score for ranking
  Category: string;            // Category reference
  IsAvailable: boolean;        // Availability status
  CustomizationOptions?: CustomizationOption; // Add-ons and modifications
}

export interface MenuCategory {
  Name: string;                // Display name of category
  CID: number;                 // Category ID for ordering
  items: { [itemId: string]: MenuItem }; // Items in this category
}

export interface VendorMenu {
  [categoryName: string]: MenuCategory;
}

// ========================================
// Order Models
// ========================================

export interface Order {
  id: string;                  // Order ID
  userId: string;              // Customer ID
  vendorId: string;            // Vendor ID
  items: OrderItem[];          // Array of ordered items
  total: number;               // Total order amount
  status: OrderStatus;         // Order status
  paymentMethod: PaymentMethod; // Payment method used
  createdAt: Timestamp;        // Order creation time
  updatedAt?: Timestamp;       // Last status update
  estimatedReadyTime?: Timestamp; // Estimated completion time
  completedAt?: Timestamp;     // Actual completion time
}

// Legacy interface for backward compatibility
export interface OrderData extends Order {}

// Enhanced order with additional details (for admin views)
export interface EnrichedOrder extends Order {
  customerName?: string;       // Customer full name
  vendorName?: string;         // Vendor business name
  universityName?: string;     // University name
  customerDetails?: Pick<User, 'fullName' | 'email' | 'phoneNumber'>;
  vendorDetails?: Pick<Vendor, 'name' | 'description' | 'rating'>;
  universityDetails?: Pick<University, 'name' | 'city'>;
}

// ========================================
// Complaint Models
// ========================================

export interface Complaint {
  id: string;                  // Complaint ID
  userId: string;              // Customer ID
  vendorId: string;            // Vendor ID
  orderId?: string;            // Related order ID (optional)
  title: string;               // Complaint title
  description: string;         // Detailed description
  status: ComplaintStatus;     // Complaint status
  priority?: 'low' | 'medium' | 'high'; // Priority level
  createdAt: Timestamp;        // Creation time
  resolvedAt?: Timestamp;      // Resolution time
  resolution?: string;         // Resolution description
  adminId?: string;            // Resolving admin ID
  attachments?: string[];      // File attachment URLs
}

// ========================================
// Notification Models
// ========================================

export interface Notification {
  id: string;                  // Notification ID
  userId: string;              // Target user ID
  title: string;               // Notification title
  body: string;                // Notification content
  type: NotificationType;      // Notification category
  status: NotificationStatus;  // Delivery status
  data?: Record<string, any>;  // Additional payload data
  createdAt: Timestamp;        // Creation time
  readAt?: Timestamp;          // Read timestamp
  expiresAt?: Timestamp;       // Expiration date
}

// ========================================
// Transaction Models
// ========================================

export interface Transaction {
  id: string;                  // Transaction ID
  userId: string;              // User ID
  type: TransactionType;       // Transaction type
  amount: number;              // Amount in EGP
  description: string;         // Transaction description
  status: TransactionStatus;   // Transaction status
  orderId?: string;            // Related order ID (if applicable)
  paymentMethod?: string;      // Payment method used
  externalTransactionId?: string; // External payment gateway ID
  createdAt: Timestamp;        // Transaction timestamp
  completedAt?: Timestamp;     // Completion timestamp
  metadata?: Record<string, any>; // Additional transaction data
}

// ========================================
// Review Models
// ========================================

export interface Review {
  id: string;                  // Review ID
  userId: string;              // Reviewer ID
  vendorId: string;            // Vendor ID
  orderId: string;             // Related order ID
  rating: number;              // Rating (1-5)
  comment?: string;            // Review text
  isPublic: boolean;           // Visibility setting
  createdAt: Timestamp;        // Review timestamp
  updatedAt?: Timestamp;       // Last edit timestamp
}

// ========================================
// Analytics Models
// ========================================

export interface OrderAnalytics {
  date: string;                // Date (YYYY-MM-DD)
  totalOrders: number;         // Total orders count
  totalRevenue: number;        // Total revenue
  averageOrderValue: number;   // Average order value
  completionRate: number;      // Order completion rate
  vendorId?: string;           // Vendor ID (for vendor-specific analytics)
  universityId?: string;       // University ID (for university-specific analytics)
}

export interface VendorAnalytics {
  vendorId: string;            // Vendor ID
  period: string;              // Analytics period
  totalOrders: number;         // Total orders
  totalRevenue: number;        // Total revenue
  averageRating: number;       // Average rating
  topSellingItems: string[];   // Most popular items
  peakHours: number[];         // Busiest hours
  customerRetentionRate: number; // Retention rate
}

// ========================================
// One-Time Code Models
// ========================================

export interface OneTimeCode {
  id: string;                  // Code ID (the actual code)
  code: string;                // The verification code (6-8 digits/chars)
  type: 'vendor' | 'admin';    // Type of account this code creates
  universityId: string;        // University this code is linked to
  universityName: string;      // University name for display
  createdBy: string;           // Super admin who created the code
  createdAt: Timestamp;        // Creation timestamp
  expiresAt: Timestamp;        // Expiration timestamp
  usedAt?: Timestamp;          // When the code was used (if used)
  usedBy?: string;             // User ID who used the code
  isActive: boolean;           // Whether the code is still active
  maxUses: number;             // Maximum number of times it can be used (default: 1)
  usageCount: number;          // How many times it has been used
  metadata?: {                 // Additional metadata
    createdByName?: string;    // Name of super admin who created it
    notes?: string;            // Any notes about the code
    restrictions?: {           // Additional restrictions
      emailDomain?: string;    // Restrict to specific email domain
      specificEmail?: string;  // Restrict to specific email
    };
  };
}

export interface CreateOneTimeCodeRequest {
  type: 'vendor' | 'admin';
  universityId: string;
  expiresInHours?: number;     // Hours until expiration (default: 168 = 7 days)
  maxUses?: number;            // Maximum uses (default: 1)
  notes?: string;              // Optional notes
  emailDomain?: string;        // Optional email domain restriction
  specificEmail?: string;      // Optional specific email restriction
}

export interface OneTimeCodeValidationResult {
  isValid: boolean;
  code?: OneTimeCode;
  error?: string;
  universityInfo?: University;
}

// ========================================
// Admin Dashboard Models
// ========================================

export interface DashboardStats {
  totalUsers: number;          // Total user count
  totalStudents: number;       // Student count
  totalVendors: number;        // Vendor count
  totalAdmins: number;         // Admin count
  totalUniversities: number;   // University count
  totalOrders: number;         // Total orders
  totalRevenue: number;        // Total revenue
  pendingOrders: number;       // Pending orders count
  activeComplaints: number;    // Open complaints count
  totalOneTimeCodes: number;   // Total one-time codes created
  activeOneTimeCodes: number;  // Active (unused) one-time codes
  period?: string;             // Stats period
  lastUpdated?: Timestamp;     // Last calculation time
}

// ========================================
// API Response Models
// ========================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ========================================
// Filter and Query Models
// ========================================

export interface UserFilters {
  role?: UserRole;
  universityName?: string;
  isEmailVerified?: boolean;
  searchTerm?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  vendorId?: string;
  universityName?: string;
  paymentMethod?: PaymentMethod;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

export interface VendorFilters {
  isApproved?: boolean;
  isOpen?: boolean;
  isSuspended?: boolean;
  universityName?: string;
  category?: string;
  searchTerm?: string;
}

// ========================================
// Form Models (for create/update operations)
// ========================================

export interface CreateUserRequest {
  fullName: string;
  email: string;
  universityId: string;
  universityName: string;
  phoneNumber?: string;
  role: UserRole;
  password: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
}

export interface CreateVendorRequest {
  name: string;
  description: string;
  categories: string[];
  imageUrl?: string;
}

export interface UpdateVendorRequest {
  name?: string;
  description?: string;
  categories?: string[];
  imageUrl?: string;
  isOpen?: boolean;
}

export interface CreateOrderRequest {
  vendorId: string;
  items: Omit<OrderItem, 'id'>[];
  paymentMethod: PaymentMethod;
  note?: string;
}

// ========================================
// Export all models (no need to re-export, they're already exported above)
// ========================================
