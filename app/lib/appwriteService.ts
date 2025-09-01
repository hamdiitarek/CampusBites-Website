/**
 * Appwrite Service Layer
 * Provides Firebase-compatible API using Appwrite backend
 */

import { 
  account, 
  databases, 
  storage,
  appwriteConfig,
  client
} from './appwrite';
import { ID, Query, Models } from 'appwrite';
import type { 
  User, 
  Vendor, 
  Order, 
  OrderItem, 
  University, 
  Complaint, 
  Notification,
  UserRole,
  OrderStatus
} from './models';

// ========================================
// Authentication Service
// ========================================

export class AppwriteAuthService {
  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const user = await this.getCurrentUser();
      return { user: session, ...user };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new user account
   */
  async signUp(email: string, password: string, name: string) {
    try {
      const userId = ID.unique();
      const user = await account.create(userId, email, password, name);
      
      // Create session after signup
      await account.createEmailPasswordSession(email, password);
      
      return user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      await account.deleteSession('current');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Send password recovery email
   */
  async resetPassword(email: string) {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string, oldPassword: string) {
    try {
      await account.updatePassword(newPassword, oldPassword);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(name: string) {
    try {
      await account.updateName(name);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any) {
    console.error('Appwrite Auth Error:', error);
    return new Error(error.message || 'Authentication error occurred');
  }
}

// ========================================
// Database Service
// ========================================

export class AppwriteDatabaseService {
  /**
   * Create a new document
   */
  async createDocument(
    collectionId: string, 
    data: any, 
    documentId: string = ID.unique()
  ) {
    try {
      return await databases.createDocument(
        appwriteConfig.databaseId,
        collectionId,
        documentId,
        data
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a document by ID
   */
  async getDocument(collectionId: string, documentId: string) {
    try {
      return await databases.getDocument(
        appwriteConfig.databaseId,
        collectionId,
        documentId
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update a document
   */
  async updateDocument(
    collectionId: string, 
    documentId: string, 
    data: any
  ) {
    try {
      return await databases.updateDocument(
        appwriteConfig.databaseId,
        collectionId,
        documentId,
        data
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(collectionId: string, documentId: string) {
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        collectionId,
        documentId
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * List documents with queries
   */
  async listDocuments(
    collectionId: string, 
    queries: string[] = [],
    limit: number = 25,
    offset: number = 0
  ) {
    try {
      return await databases.listDocuments(
        appwriteConfig.databaseId,
        collectionId,
        [...queries, Query.limit(limit), Query.offset(offset)]
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Subscribe to real-time updates
   */
  subscribeToCollection(
    collectionId: string,
    callback: (payload: any) => void,
    queries: string[] = []
  ) {
    const channel = `databases.${appwriteConfig.databaseId}.collections.${collectionId}.documents`;
    
    return client.subscribe(channel, (response) => {
      callback(response);
    });
  }

  private handleError(error: any) {
    console.error('Appwrite Database Error:', error);
    return new Error(error.message || 'Database error occurred');
  }
}

// ========================================
// User Service
// ========================================

export class AppwriteUserService extends AppwriteDatabaseService {
  /**
   * Create a new user document
   */
  async createUser(userData: Omit<User, 'id'> & { id: string }) {
    return this.createDocument(
      appwriteConfig.usersCollectionId,
      userData,
      userData.id
    );
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<User> {
    const doc = await this.getDocument(appwriteConfig.usersCollectionId, userId);
    return this.mapUserDocument(doc);
  }

  /**
   * Update user
   */
  async updateUser(userId: string, updates: Partial<User>) {
    return this.updateDocument(appwriteConfig.usersCollectionId, userId, updates);
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole) {
    const response = await this.listDocuments(
      appwriteConfig.usersCollectionId,
      [Query.equal('role', role)]
    );
    return response.documents.map(this.mapUserDocument);
  }

  /**
   * Get users by university
   */
  async getUsersByUniversity(universityName: string) {
    const response = await this.listDocuments(
      appwriteConfig.usersCollectionId,
      [Query.equal('universityName', universityName)]
    );
    return response.documents.map(this.mapUserDocument);
  }

  /**
   * Update wallet balance
   */
  async updateWalletBalance(userId: string, amount: number) {
    const user = await this.getUser(userId);
    const newBalance = (user.walletBalance || 0) + amount;
    return this.updateUser(userId, { walletBalance: newBalance });
  }

  private mapUserDocument(doc: Models.Document): User {
    return {
      id: doc.$id,
      fullName: (doc as any).fullName,
      email: (doc as any).email,
      universityId: (doc as any).universityId,
      universityName: (doc as any).universityName,
      phoneNumber: (doc as any).phoneNumber,
      isEmailVerified: (doc as any).isEmailVerified,
      role: (doc as any).role,
      walletBalance: (doc as any).walletBalance || 0,
      profileImageUrl: (doc as any).profileImageUrl
    };
  }
}

// ========================================
// Vendor Service
// ========================================

export class AppwriteVendorService extends AppwriteDatabaseService {
  /**
   * Create a new vendor
   */
  async createVendor(vendorData: Omit<Vendor, 'id'> & { id: string }) {
    return this.createDocument(
      appwriteConfig.vendorsCollectionId,
      vendorData,
      vendorData.id
    );
  }

  /**
   * Get vendor by ID
   */
  async getVendor(vendorId: string): Promise<Vendor> {
    const doc = await this.getDocument(appwriteConfig.vendorsCollectionId, vendorId);
    return this.mapVendorDocument(doc);
  }

  /**
   * Update vendor
   */
  async updateVendor(vendorId: string, updates: Partial<Vendor>) {
    return this.updateDocument(appwriteConfig.vendorsCollectionId, vendorId, updates);
  }

  /**
   * Get vendors by university
   */
  async getVendorsByUniversity(universityName: string, approved: boolean = true) {
    const queries = [Query.equal('universityName', universityName)];
    if (approved) {
      queries.push(Query.equal('isApproved', true));
    }
    
    const response = await this.listDocuments(
      appwriteConfig.vendorsCollectionId,
      queries
    );
    return response.documents.map(this.mapVendorDocument);
  }

  /**
   * Get pending vendors for approval
   */
  async getPendingVendors() {
    const response = await this.listDocuments(
      appwriteConfig.vendorsCollectionId,
      [Query.equal('isApproved', false)]
    );
    return response.documents.map(this.mapVendorDocument);
  }

  private mapVendorDocument(doc: Models.Document): Vendor {
    return {
      id: doc.$id,
      name: (doc as any).name,
      userId: (doc as any).userId,
      universityId: (doc as any).universityId,
      universityName: (doc as any).universityName,
      description: (doc as any).description,
      imageUrl: (doc as any).imageUrl,
      rating: (doc as any).rating || 0,
      reviewCount: (doc as any).reviewCount || 0,
      categories: (doc as any).categories || [],
      isOpen: (doc as any).isOpen || false,
      isApproved: (doc as any).isApproved || false,
      isSuspended: (doc as any).isSuspended || false
    };
  }
}

// ========================================
// Order Service
// ========================================

export class AppwriteOrderService extends AppwriteDatabaseService {
  /**
   * Create a new order
   */
  async createOrder(orderData: Omit<Order, 'id'>) {
    const orderId = ID.unique();
    const orderWithId = { ...orderData, id: orderId };
    return this.createDocument(
      appwriteConfig.ordersCollectionId,
      orderWithId,
      orderId
    );
  }

  /**
   * Get order by ID
   */
  async getOrder(orderId: string): Promise<Order> {
    const doc = await this.getDocument(appwriteConfig.ordersCollectionId, orderId);
    return this.mapOrderDocument(doc);
  }

  /**
   * Update order
   */
  async updateOrder(orderId: string, updates: Partial<Order>) {
    return this.updateDocument(appwriteConfig.ordersCollectionId, orderId, updates);
  }

  /**
   * Get orders by user
   */
  async getOrdersByUser(userId: string) {
    const response = await this.listDocuments(
      appwriteConfig.ordersCollectionId,
      [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
    );
    return response.documents.map(this.mapOrderDocument);
  }

  /**
   * Get orders by vendor
   */
  async getOrdersByVendor(vendorId: string) {
    const response = await this.listDocuments(
      appwriteConfig.ordersCollectionId,
      [Query.equal('vendorId', vendorId), Query.orderDesc('$createdAt')]
    );
    return response.documents.map(this.mapOrderDocument);
  }

  /**
   * Get orders by status
   */
  async getOrdersByStatus(status: OrderStatus) {
    const response = await this.listDocuments(
      appwriteConfig.ordersCollectionId,
      [Query.equal('status', status), Query.orderDesc('$createdAt')]
    );
    return response.documents.map(this.mapOrderDocument);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const updateData: any = { status };
    
    // Add timestamps based on status
    const now = new Date();
    switch (status) {
      case 'confirmed':
        updateData.confirmedAt = now;
        break;
      case 'ready':
        updateData.readyAt = now;
        break;
      case 'completed':
        updateData.completedAt = now;
        break;
      case 'cancelled':
        updateData.cancelledAt = now;
        break;
    }

    return this.updateOrder(orderId, updateData);
  }

  private mapOrderDocument(doc: Models.Document): Order {
    // Helper to create Firebase-compatible timestamp
    const createTimestamp = (dateString: string) => ({
      toDate: () => new Date(dateString),
      seconds: Math.floor(new Date(dateString).getTime() / 1000),
      nanoseconds: 0,
      toMillis: () => new Date(dateString).getTime(),
      toJSON: () => ({ 
        seconds: Math.floor(new Date(dateString).getTime() / 1000), 
        nanoseconds: 0,
        type: 'timestamp'
      }),
      isEqual: (other: any) => new Date(dateString).getTime() === other.toMillis(),
      valueOf: () => new Date(dateString).toISOString()
    });

    return {
      id: doc.$id,
      userId: (doc as any).userId,
      vendorId: (doc as any).vendorId,
      items: (doc as any).items || [],
      total: (doc as any).total,
      status: (doc as any).status,
      paymentMethod: (doc as any).paymentMethod,
      createdAt: createTimestamp(doc.$createdAt),
      confirmedAt: (doc as any).confirmedAt ? createTimestamp((doc as any).confirmedAt) : undefined,
      readyAt: (doc as any).readyAt ? createTimestamp((doc as any).readyAt) : undefined,
      completedAt: (doc as any).completedAt ? createTimestamp((doc as any).completedAt) : undefined,
      cancelledAt: (doc as any).cancelledAt ? createTimestamp((doc as any).cancelledAt) : undefined,
      statusHistory: (doc as any).statusHistory || []
    } as any; // Use any to bypass the interface type checking for extended fields
  }
}

// ========================================
// Service Instances
// ========================================

export const authService = new AppwriteAuthService();
export const userService = new AppwriteUserService();
export const vendorService = new AppwriteVendorService();
export const orderService = new AppwriteOrderService();

// ========================================
// Firebase Compatibility Layer
// ========================================

/**
 * Firebase-compatible timestamp conversion
 */
export const serverTimestamp = () => new Date().toISOString();

/**
 * Firebase-compatible document reference simulation
 */
export const doc = (collectionId: string, documentId?: string) => ({
  collection: collectionId,
  id: documentId || ID.unique(),
  path: `${collectionId}/${documentId || ID.unique()}`
});

/**
 * Firebase-compatible collection reference simulation
 */
export const collection = (collectionId: string) => ({
  id: collectionId,
  path: collectionId
});

/**
 * Firebase-compatible query simulation
 */
export const where = (field: string, operator: string, value: any) => {
  switch (operator) {
    case '==':
      return Query.equal(field, value);
    case '!=':
      return Query.notEqual(field, value);
    case '>':
      return Query.greaterThan(field, value);
    case '>=':
      return Query.greaterThanEqual(field, value);
    case '<':
      return Query.lessThan(field, value);
    case '<=':
      return Query.lessThanEqual(field, value);
    case 'in':
      return Query.equal(field, value);
    case 'array-contains':
      return Query.search(field, value);
    default:
      return Query.equal(field, value);
  }
};

/**
 * Firebase-compatible orderBy simulation
 */
export const orderBy = (field: string, direction: 'asc' | 'desc' = 'asc') => {
  return direction === 'asc' ? Query.orderAsc(field) : Query.orderDesc(field);
};

/**
 * Firebase-compatible limit simulation
 */
export const limit = (count: number) => Query.limit(count);