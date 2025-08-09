/**
 * Campus Bites - Database Service Utilities
 * Helper functions for common database operations
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryConstraint,
  Timestamp
} from 'firebase/firestore';
import { db } from '../appwrite';
import type {
  User,
  Vendor,
  Order,
  OrderItem,
  University,
  Complaint,
  Notification,
  Transaction,
  PaginatedResponse,
  UserFilters,
  OrderFilters,
  VendorFilters
} from './index';
import { COLLECTIONS, DEFAULT_VALUES } from './constants';

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
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Create a new document
 */
export async function createDocument<T>(
  collectionName: string,
  data: Omit<T, 'id'> & { createdAt?: Timestamp; updatedAt?: Timestamp }
): Promise<string> {
  try {
    const timestamp = Timestamp.now();
    const docData = {
      ...data,
      createdAt: data.createdAt || timestamp,
      updatedAt: data.updatedAt || timestamp
    };
    
    const docRef = await addDoc(collection(db, collectionName), docData);
    return docRef.id;
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
  updates: Partial<T> & { updatedAt?: Timestamp }
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(docRef, updateData);
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
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Get multiple documents with optional filtering, sorting, and pagination
 */
export async function getDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  lastDoc?: DocumentSnapshot
): Promise<T[]> {
  try {
    let queryConstraints = [...constraints];
    
    if (lastDoc) {
      queryConstraints.push(startAfter(lastDoc));
    }
    
    const q = query(collection(db, collectionName), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Get paginated documents
 */
export async function getPaginatedDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  pageSize: number = DEFAULT_VALUES.PAGINATION_LIMIT,
  lastDoc?: DocumentSnapshot
): Promise<PaginatedResponse<T> & { lastDoc?: DocumentSnapshot }> {
  try {
    const queryConstraints = [
      ...constraints,
      limit(pageSize + 1) // Get one extra to check if there's a next page
    ];
    
    if (lastDoc) {
      queryConstraints.push(startAfter(lastDoc));
    }
    
    const q = query(collection(db, collectionName), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    const hasNext = querySnapshot.docs.length > pageSize;
    const documents = querySnapshot.docs.slice(0, pageSize);
    
    return {
      data: documents.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[],
      pagination: {
        page: 1, // This would need to be calculated based on actual implementation
        limit: pageSize,
        total: 0, // Would need separate count query
        hasNext,
        hasPrev: !!lastDoc
      },
      lastDoc: documents[documents.length - 1]
    };
  } catch (error) {
    console.error(`Error getting paginated documents from ${collectionName}:`, error);
    throw error;
  }
}

// ========================================
// User Operations
// ========================================

export async function getUserById(userId: string): Promise<User | null> {
  return getDocumentById<User>(COLLECTIONS.USERS, userId);
}

export async function createUser(userData: Omit<User, 'id'>): Promise<string> {
  return createDocument<User>(COLLECTIONS.USERS, {
    ...userData,
    walletBalance: userData.walletBalance || DEFAULT_VALUES.WALLET_BALANCE,
    isEmailVerified: userData.isEmailVerified || false
  });
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<void> {
  return updateDocument<User>(COLLECTIONS.USERS, userId, updates);
}

export async function getUsersByFilter(filters: UserFilters): Promise<User[]> {
  const constraints: QueryConstraint[] = [];
  
  if (filters.role) {
    constraints.push(where('role', '==', filters.role));
  }
  
  if (filters.universityName) {
    constraints.push(where('universityName', '==', filters.universityName));
  }
  
  if (filters.isEmailVerified !== undefined) {
    constraints.push(where('isEmailVerified', '==', filters.isEmailVerified));
  }
  
  constraints.push(orderBy('createdAt', 'desc'));
  
  return getDocuments<User>(COLLECTIONS.USERS, constraints);
}

// ========================================
// Vendor Operations
// ========================================

export async function getVendorById(vendorId: string): Promise<Vendor | null> {
  return getDocumentById<Vendor>(COLLECTIONS.VENDORS, vendorId);
}

export async function createVendor(vendorData: Omit<Vendor, 'id'>): Promise<string> {
  return createDocument<Vendor>(COLLECTIONS.VENDORS, {
    ...vendorData,
    rating: vendorData.rating || DEFAULT_VALUES.VENDOR_RATING,
    reviewCount: vendorData.reviewCount || DEFAULT_VALUES.REVIEW_COUNT,
    isOpen: vendorData.isOpen ?? true,
    isApproved: vendorData.isApproved ?? false,
    isSuspended: vendorData.isSuspended ?? false
  });
}

export async function updateVendor(vendorId: string, updates: Partial<Vendor>): Promise<void> {
  return updateDocument<Vendor>(COLLECTIONS.VENDORS, vendorId, updates);
}

export async function getVendorsByFilter(filters: VendorFilters): Promise<Vendor[]> {
  const constraints: QueryConstraint[] = [];
  
  if (filters.isApproved !== undefined) {
    constraints.push(where('isApproved', '==', filters.isApproved));
  }
  
  if (filters.isOpen !== undefined) {
    constraints.push(where('isOpen', '==', filters.isOpen));
  }
  
  if (filters.isSuspended !== undefined) {
    constraints.push(where('isSuspended', '==', filters.isSuspended));
  }
  
  if (filters.universityName) {
    constraints.push(where('universityName', '==', filters.universityName));
  }
  
  if (filters.category) {
    constraints.push(where('categories', 'array-contains', filters.category));
  }
  
  constraints.push(orderBy('createdAt', 'desc'));
  
  return getDocuments<Vendor>(COLLECTIONS.VENDORS, constraints);
}

// ========================================
// Order Operations
// ========================================

export async function getOrderById(orderId: string): Promise<Order | null> {
  return getDocumentById<Order>(COLLECTIONS.ORDERS, orderId);
}

export async function createOrder(orderData: Omit<Order, 'id'>): Promise<string> {
  // Enrich order items with category information before creating the order
  const enrichedOrderData = {
    ...orderData,
    items: await enrichOrderItemsWithCategories(orderData.vendorId, orderData.items)
  };
  
  return createDocument<Order>(COLLECTIONS.ORDERS, enrichedOrderData);
}

/**
 * Enrich order items with category information from vendor menu
 */
async function enrichOrderItemsWithCategories(vendorId: string, items: OrderItem[]): Promise<OrderItem[]> {
  try {
    // Get vendor menu structure
    const menuRef = collection(db, COLLECTIONS.VENDORS, vendorId, 'menu');
    const menuSnapshot = await getDocs(menuRef);
    
    // Build category mapping
    const itemCategoryMap = new Map<string, string>();
    
    menuSnapshot.docs.forEach(doc => {
      const menuData = doc.data();
      
      // Search through all categories in the menu
      for (const [categoryName, categoryData] of Object.entries(menuData)) {
        if (categoryData && typeof categoryData === 'object' && categoryData.Name) {
          // This is a category object, search within its items
          for (const [itemKey, itemData] of Object.entries(categoryData)) {
            if (itemKey !== 'Name' && itemKey !== 'CID' && itemData && typeof itemData === 'object') {
              const itemInfo = itemData as any;
              const category = itemInfo.Category || categoryData.Name || categoryName;
              
              // Map by item ID and name for flexible matching
              if (itemKey) itemCategoryMap.set(itemKey, category);
              if (itemInfo.Name) itemCategoryMap.set(itemInfo.Name, category);
              if (itemInfo.id) itemCategoryMap.set(itemInfo.id, category);
            }
          }
        }
      }
    });
    
    // Enrich items with category information
    return items.map(item => ({
      ...item,
      category: item.category || 
                itemCategoryMap.get(item.id) || 
                itemCategoryMap.get(item.name) || 
                'Other'
    }));
    
  } catch (error) {
    console.error('Error enriching order items with categories:', error);
    // Return items with default category if enrichment fails
    return items.map(item => ({
      ...item,
      category: item.category || 'Other'
    }));
  }
}

export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
  return updateDocument<Order>(COLLECTIONS.ORDERS, orderId, updates);
}

export async function getOrdersByFilter(filters: OrderFilters): Promise<Order[]> {
  const constraints: QueryConstraint[] = [];
  
  if (filters.status) {
    constraints.push(where('status', '==', filters.status));
  }
  
  if (filters.vendorId) {
    constraints.push(where('vendorId', '==', filters.vendorId));
  }
  
  if (filters.paymentMethod) {
    constraints.push(where('paymentMethod', '==', filters.paymentMethod));
  }
  
  if (filters.dateFrom || filters.dateTo) {
    if (filters.dateFrom) {
      constraints.push(where('createdAt', '>=', Timestamp.fromDate(filters.dateFrom)));
    }
    if (filters.dateTo) {
      constraints.push(where('createdAt', '<=', Timestamp.fromDate(filters.dateTo)));
    }
  }
  
  constraints.push(orderBy('createdAt', 'desc'));
  
  return getDocuments<Order>(COLLECTIONS.ORDERS, constraints);
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const constraints = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ];
  
  return getDocuments<Order>(COLLECTIONS.ORDERS, constraints);
}

export async function getVendorOrders(vendorId: string): Promise<Order[]> {
  const constraints = [
    where('vendorId', '==', vendorId),
    orderBy('createdAt', 'desc')
  ];
  
  return getDocuments<Order>(COLLECTIONS.ORDERS, constraints);
}

// ========================================
// University Operations
// ========================================

export async function getUniversityById(universityId: string): Promise<University | null> {
  return getDocumentById<University>(COLLECTIONS.UNIVERSITIES, universityId);
}

export async function getAllUniversities(): Promise<University[]> {
  const constraints = [orderBy('name', 'asc')];
  return getDocuments<University>(COLLECTIONS.UNIVERSITIES, constraints);
}

export async function createUniversity(universityData: Omit<University, 'id'>): Promise<string> {
  return createDocument<University>(COLLECTIONS.UNIVERSITIES, {
    ...universityData,
    isActive: universityData.isActive ?? true
  });
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
  const constraints = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ];
  
  return getDocuments<Complaint>(COLLECTIONS.COMPLAINTS, constraints);
}

export async function getVendorComplaints(vendorId: string): Promise<Complaint[]> {
  const constraints = [
    where('vendorId', '==', vendorId),
    orderBy('createdAt', 'desc')
  ];
  
  return getDocuments<Complaint>(COLLECTIONS.COMPLAINTS, constraints);
}

// ========================================
// Notification Operations
// ========================================

export async function createNotification(notificationData: Omit<Notification, 'id'>): Promise<string> {
  return createDocument<Notification>(COLLECTIONS.NOTIFICATIONS, notificationData);
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  const constraints = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ];
  
  return getDocuments<Notification>(COLLECTIONS.NOTIFICATIONS, constraints);
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  return updateDocument<Notification>(COLLECTIONS.NOTIFICATIONS, notificationId, {
    status: 'read',
    readAt: Timestamp.now()
  });
}

// ========================================
// Transaction Operations
// ========================================

export async function createTransaction(transactionData: Omit<Transaction, 'id'>): Promise<string> {
  return createDocument<Transaction>(COLLECTIONS.TRANSACTIONS, transactionData);
}

export async function updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<void> {
  return updateDocument<Transaction>(COLLECTIONS.TRANSACTIONS, transactionId, updates);
}

export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  const constraints = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ];
  
  return getDocuments<Transaction>(COLLECTIONS.TRANSACTIONS, constraints);
}

// ========================================
// Search Operations
// ========================================

/**
 * Search users by name or email
 */
export async function searchUsers(searchTerm: string, filters?: UserFilters): Promise<User[]> {
  // Note: Firestore doesn't support full-text search natively
  // This is a basic implementation that should be enhanced with
  // a proper search solution like Algolia or Elasticsearch
  
  const constraints: QueryConstraint[] = [];
  
  if (filters?.role) {
    constraints.push(where('role', '==', filters.role));
  }
  
  if (filters?.universityName) {
    constraints.push(where('universityName', '==', filters.universityName));
  }
  
  constraints.push(orderBy('fullName'));
  
  const users = await getDocuments<User>(COLLECTIONS.USERS, constraints);
  
  // Client-side filtering for search term
  return users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

/**
 * Search vendors by name or description
 */
export async function searchVendors(searchTerm: string, filters?: VendorFilters): Promise<Vendor[]> {
  const constraints: QueryConstraint[] = [];
  
  if (filters?.universityName) {
    constraints.push(where('universityName', '==', filters.universityName));
  }
  
  if (filters?.isApproved !== undefined) {
    constraints.push(where('isApproved', '==', filters.isApproved));
  }
  
  constraints.push(orderBy('name'));
  
  const vendors = await getDocuments<Vendor>(COLLECTIONS.VENDORS, constraints);
  
  // Client-side filtering for search term
  return vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

// ========================================
// Batch Operations
// ========================================

/**
 * Update multiple documents in a batch
 */
export async function batchUpdateDocuments<T>(
  collectionName: string,
  updates: { id: string; data: Partial<T> }[]
): Promise<void> {
  try {
    // Note: This would use Firestore batch operations in a real implementation
    // For now, we'll do sequential updates
    for (const update of updates) {
      await updateDocument(collectionName, update.id, update.data);
    }
  } catch (error) {
    console.error(`Error in batch update for ${collectionName}:`, error);
    throw error;
  }
}
