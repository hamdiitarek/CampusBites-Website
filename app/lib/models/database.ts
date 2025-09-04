/**
 * Campus Bites - Database Service Utilities (Appwrite)
 * Helper functions for common database operations using Appwrite
 */

import { databases, appwriteConfig } from '../appwrite';
import { ID, Query } from 'appwrite';
import {
  userService,
  vendorService,
  orderService
} from '../appwriteService';
import type {
  User,
  Vendor,
  Order,
  OrderItem,
  University,
  Complaint,
  Notification
} from './index';
import type { 
  UserRole,
  OrderStatus
} from './constants';
import { 
  COLLECTIONS, 
  DEFAULT_VALUES
} from './constants';

// Re-export transaction type if it exists
type Transaction = any; // TODO: Define transaction type if needed

// Define filter interfaces
interface UserFilters {
  role?: UserRole;
  universityName?: string;
  isEmailVerified?: boolean;
}

interface VendorFilters {
  isApproved?: boolean;
  isOpen?: boolean;
  isSuspended?: boolean;
  universityName?: string;
  category?: string;
}

interface OrderFilters {
  status?: OrderStatus;
  vendorId?: string;
  userId?: string;
  paymentMethod?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface PaginatedResponse<T> {
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
// Generic Database Operations
// ========================================

/**
 * Get a single document by ID
 */
export async function getDocumentById<T>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  try {
    const doc = await databases.getDocument(
      appwriteConfig.databaseId,
      getCollectionId(collectionName),
      documentId
    );
    
    return mapDocumentToType<T>(doc);
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    return null;
  }
}

/**
 * Create a new document
 */
export async function createDocument<T>(
  collectionName: string,
  data: Omit<T, 'id'>
): Promise<string> {
  try {
    const docId = ID.unique();
    await databases.createDocument(
      appwriteConfig.databaseId,
      getCollectionId(collectionName),
      docId,
      data
    );
    
    return docId;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Update an existing document
 */
export async function updateDocument<T>(
  collectionName: string,
  documentId: string,
  updates: Partial<T>
): Promise<void> {
  try {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      getCollectionId(collectionName),
      documentId,
      updates
    );
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Delete a document
 */
export async function deleteDocument(
  collectionName: string,
  documentId: string
): Promise<void> {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      getCollectionId(collectionName),
      documentId
    );
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Get multiple documents with optional filtering
 */
export async function getDocuments<T>(
  collectionName: string,
  queries: string[] = []
): Promise<T[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      getCollectionId(collectionName),
      queries
    );
    
    return response.documents.map(mapDocumentToType<T>);
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    return [];
  }
}

// ========================================
// User Operations
// ========================================

export async function getUserById(userId: string): Promise<User | null> {
  return userService.getUser(userId);
}

export async function createUser(userData: Omit<User, 'id'> & { id: string }): Promise<void> {
  await userService.createUser(userData);
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<void> {
  await userService.updateUser(userId, updates);
}

export async function getUsersByFilter(filters: UserFilters): Promise<User[]> {
  const queries: string[] = [];
  
  if (filters.role) {
    queries.push(Query.equal('role', filters.role));
  }
  
  if (filters.universityName) {
    queries.push(Query.equal('universityName', filters.universityName));
  }
  
  if (filters.isEmailVerified !== undefined) {
    queries.push(Query.equal('isEmailVerified', filters.isEmailVerified));
  }
  
  queries.push(Query.orderDesc('$createdAt'));
  
  return getDocuments<User>(COLLECTIONS.USERS, queries);
}

// ========================================
// Vendor Operations
// ========================================

export async function getVendorById(vendorId: string): Promise<Vendor | null> {
  return vendorService.getVendor(vendorId);
}

export async function createVendor(vendorData: Omit<Vendor, 'id'> & { id: string }): Promise<void> {
  await vendorService.createVendor(vendorData);
}

export async function updateVendor(vendorId: string, updates: Partial<Vendor>): Promise<void> {
  await vendorService.updateVendor(vendorId, updates);
}

export async function getVendorsByFilter(filters: VendorFilters): Promise<Vendor[]> {
  const queries: string[] = [];
  
  if (filters.isApproved !== undefined) {
    queries.push(Query.equal('isApproved', filters.isApproved));
  }
  
  if (filters.isOpen !== undefined) {
    queries.push(Query.equal('isOpen', filters.isOpen));
  }
  
  if (filters.isSuspended !== undefined) {
    queries.push(Query.equal('isSuspended', filters.isSuspended));
  }
  
  if (filters.universityName) {
    queries.push(Query.equal('universityName', filters.universityName));
  }
  
  queries.push(Query.orderDesc('$createdAt'));
  
  return getDocuments<Vendor>(COLLECTIONS.VENDORS, queries);
}

// ========================================
// Order Operations
// ========================================

export async function getOrderById(orderId: string): Promise<Order | null> {
  return orderService.getOrder(orderId);
}

export async function createOrder(orderData: Omit<Order, 'id'>): Promise<string> {
  const order = await orderService.createOrder(orderData);
  return order.$id;
}

export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
  await orderService.updateOrder(orderId, updates);
}

export async function getOrdersByFilter(filters: OrderFilters): Promise<Order[]> {
  const queries: string[] = [];
  
  if (filters.status) {
    queries.push(Query.equal('status', filters.status));
  }
  
  if (filters.vendorId) {
    queries.push(Query.equal('vendorId', filters.vendorId));
  }
  
  if (filters.userId) {
    queries.push(Query.equal('userId', filters.userId));
  }
  
  if (filters.paymentMethod) {
    queries.push(Query.equal('paymentMethod', filters.paymentMethod));
  }
  
  if (filters.dateFrom) {
    queries.push(Query.greaterThanEqual('$createdAt', filters.dateFrom.toISOString()));
  }
  
  if (filters.dateTo) {
    queries.push(Query.lessThanEqual('$createdAt', filters.dateTo.toISOString()));
  }
  
  queries.push(Query.orderDesc('$createdAt'));
  
  return getDocuments<Order>(COLLECTIONS.ORDERS, queries);
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  return orderService.getOrdersByUser(userId);
}

export async function getVendorOrders(vendorId: string): Promise<Order[]> {
  return orderService.getOrdersByVendor(vendorId);
}

// ========================================
// University Operations
// ========================================

export async function getUniversityById(universityId: string): Promise<University | null> {
  return getDocumentById<University>(COLLECTIONS.UNIVERSITIES, universityId);
}

export async function getAllUniversities(): Promise<University[]> {
  return getDocuments<University>(COLLECTIONS.UNIVERSITIES, [Query.orderAsc('name')]);
}

export async function createUniversity(universityData: Omit<University, 'id'>): Promise<string> {
  return createDocument<University>(COLLECTIONS.UNIVERSITIES, universityData);
}

// ========================================
// Complaint Operations
// ========================================

export async function getComplaintById(complaintId: string): Promise<Complaint | null> {
  return getDocumentById<Complaint>(COLLECTIONS.COMPLAINTS, complaintId);
}

export async function createComplaint(complaintData: Omit<Complaint, 'id'>): Promise<string> {
  return createDocument<Complaint>(COLLECTIONS.COMPLAINTS, complaintData);
}

export async function updateComplaint(complaintId: string, updates: Partial<Complaint>): Promise<void> {
  return updateDocument<Complaint>(COLLECTIONS.COMPLAINTS, complaintId, updates);
}

export async function getUserComplaints(userId: string): Promise<Complaint[]> {
  return getDocuments<Complaint>(COLLECTIONS.COMPLAINTS, [
    Query.equal('userId', userId),
    Query.orderDesc('$createdAt')
  ]);
}

export async function getVendorComplaints(vendorId: string): Promise<Complaint[]> {
  return getDocuments<Complaint>(COLLECTIONS.COMPLAINTS, [
    Query.equal('vendorId', vendorId),
    Query.orderDesc('$createdAt')
  ]);
}

// ========================================
// Notification Operations
// ========================================

export async function createNotification(notificationData: Omit<Notification, 'id'>): Promise<string> {
  return createDocument<Notification>(COLLECTIONS.NOTIFICATIONS, notificationData);
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  return getDocuments<Notification>(COLLECTIONS.NOTIFICATIONS, [
    Query.equal('userId', userId),
    Query.orderDesc('$createdAt')
  ]);
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  return updateDocument<Notification>(COLLECTIONS.NOTIFICATIONS, notificationId, {
    status: 'read',
    readAt: new Date().toISOString()
  });
}

// ========================================
// Helper Functions
// ========================================

/**
 * Map collection name to Appwrite collection ID
 */
function getCollectionId(collectionName: string): string {
  const collectionMap: Record<string, string> = {
    users: appwriteConfig.usersCollectionId,
    vendors: appwriteConfig.vendorsCollectionId,
    orders: appwriteConfig.ordersCollectionId,
    universities: appwriteConfig.universitiesCollectionId,
    complaints: appwriteConfig.complaintsCollectionId,
    notifications: appwriteConfig.notificationsCollectionId
  };
  
  return collectionMap[collectionName] || collectionName;
}

/**
 * Map Appwrite document to typed object
 */
function mapDocumentToType<T>(doc: any): T {
  const { $id, $createdAt, $updatedAt, ...data } = doc;
  return {
    id: $id,
    ...data,
    createdAt: $createdAt ? new Date($createdAt) : undefined,
    updatedAt: $updatedAt ? new Date($updatedAt) : undefined
  } as T;
}

// ========================================
// Firebase Compatibility Functions
// ========================================

/**
 * Firebase-compatible timestamp
 */
export const Timestamp = {
  now: () => ({
    toDate: () => new Date(),
    seconds: Math.floor(Date.now() / 1000),
    nanoseconds: 0,
    toMillis: () => Date.now(),
    toJSON: () => ({ 
      seconds: Math.floor(Date.now() / 1000), 
      nanoseconds: 0,
      type: 'timestamp'
    }),
    isEqual: (other: any) => Date.now() === other.toMillis(),
    valueOf: () => new Date().toISOString()
  }),
  fromDate: (date: Date) => ({
    toDate: () => date,
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: 0,
    toMillis: () => date.getTime(),
    toJSON: () => ({ 
      seconds: Math.floor(date.getTime() / 1000), 
      nanoseconds: 0,
      type: 'timestamp'
    }),
    isEqual: (other: any) => date.getTime() === other.toMillis(),
    valueOf: () => date.toISOString()
  }),
  fromMillis: (millis: number) => ({
    toDate: () => new Date(millis),
    seconds: Math.floor(millis / 1000),
    nanoseconds: 0,
    toMillis: () => millis,
    toJSON: () => ({ 
      seconds: Math.floor(millis / 1000), 
      nanoseconds: 0,
      type: 'timestamp'
    }),
    isEqual: (other: any) => millis === other.toMillis(),
    valueOf: () => new Date(millis).toISOString()
  })
};

/**
 * Firebase-compatible serverTimestamp
 */
export const serverTimestamp = () => Timestamp.now();

// ========================================
// Search Operations (Basic Implementation)
// ========================================

export async function searchUsers(searchTerm: string, filters?: UserFilters): Promise<User[]> {
  // Get all users and filter client-side (Appwrite search is limited)
  const queries: string[] = [];
  
  if (filters?.role) {
    queries.push(Query.equal('role', filters.role));
  }
  
  if (filters?.universityName) {
    queries.push(Query.equal('universityName', filters.universityName));
  }
  
  const users = await getDocuments<User>(COLLECTIONS.USERS, queries);
  
  return users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

export async function searchVendors(searchTerm: string, filters?: VendorFilters): Promise<Vendor[]> {
  const queries: string[] = [];
  
  if (filters?.universityName) {
    queries.push(Query.equal('universityName', filters.universityName));
  }
  
  if (filters?.isApproved !== undefined) {
    queries.push(Query.equal('isApproved', filters.isApproved));
  }
  
  const vendors = await getDocuments<Vendor>(COLLECTIONS.VENDORS, queries);
  
  return vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
}