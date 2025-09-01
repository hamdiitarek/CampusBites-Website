/**
 * Appwrite Super Admin Service
 * Minimal adapter to provide SuperAdminService functionality using Appwrite backend
 * This service provides the same interface as SuperAdminService but uses Appwrite
 */

import { databases, appwriteConfig } from './appwrite';
import { Query, ID } from 'appwrite';
import type {
  User,
  Vendor,
  Order,
  University,
  OneTimeCode,
  CreateOneTimeCodeRequest,
  OneTimeCodeValidationResult,
  DashboardStats
} from './models';

// Additional types needed for admin functionality
export interface EnrichedOrderData extends Order {
  userDetails?: {
    id: string;
    displayName?: string;
    fullName?: string;
    email?: string;
    universityId?: string;
    universityName?: string;
    role?: string;
  };
  vendorDetails?: {
    id: string;
    name?: string;
    category?: string;
    description?: string;
    isApproved?: boolean;
  };
  universityDetails?: {
    id: string;
    name?: string;
    emailDomain?: string;
  };
}

export class AppwriteSuperAdminService {
  /**
   * Generate a random code for one-time use
   */
  private static generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Get all users with optional filtering
   */
  static async getAllUsers(universityName?: string, role?: string, searchTerm?: string): Promise<User[]> {
    try {
      const queries = [];
      
      if (universityName) {
        queries.push(Query.equal('universityName', universityName));
      }
      
      if (role) {
        queries.push(Query.equal('role', role));
      }

      const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        queries
      );

      let users = result.documents.map(doc => ({
        id: doc.$id,
        fullName: doc.fullName,
        email: doc.email,
        universityId: doc.universityId,
        universityName: doc.universityName,
        phoneNumber: doc.phoneNumber,
        isEmailVerified: doc.isEmailVerified,
        role: doc.role,
        walletBalance: doc.walletBalance,
        profileImageUrl: doc.profileImageUrl,
        fcmToken: doc.fcmToken
        // Note: Skipping createdAt/updatedAt for now due to type mismatch with Timestamp
      })) as User[];

      // Apply search filter if provided (client-side filtering)
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        users = users.filter(user => 
          user.fullName?.toLowerCase().includes(lowerSearchTerm) ||
          user.email?.toLowerCase().includes(lowerSearchTerm) ||
          user.universityId?.toLowerCase().includes(lowerSearchTerm)
        );
      }

      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  /**
   * Get all vendors
   */
  static async getAllVendors(): Promise<Vendor[]> {
    try {
      const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.vendorsCollectionId
      );

      return result.documents.map(doc => ({
        id: doc.$id,
        name: doc.name,
        userId: doc.userId,
        universityId: doc.universityId,
        universityName: doc.universityName,
        description: doc.description,
        imageUrl: doc.imageUrl,
        rating: doc.rating,
        reviewCount: doc.reviewCount,
        categories: doc.categories,
        isOpen: doc.isOpen,
        isApproved: doc.isApproved,
        isSuspended: doc.isSuspended
        // Note: Skipping createdAt/updatedAt for now due to type mismatch with Timestamp
      })) as Vendor[];
    } catch (error) {
      console.error('Error getting all vendors:', error);
      throw error;
    }
  }

  /**
   * Get recent orders
   */
  static async getRecentOrders(limit_count: number = 50): Promise<Order[]> {
    try {
      const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(limit_count)
        ]
      );

      return result.documents.map(doc => ({
        id: doc.$id,
        userId: doc.userId,
        vendorId: doc.vendorId,
        items: doc.items,
        total: doc.total,
        status: doc.status,
        paymentMethod: doc.paymentMethod,
        estimatedReadyTime: doc.estimatedReadyTime,
        completedAt: doc.completedAt
        // Note: Skipping createdAt/updatedAt for now due to type mismatch with Timestamp
      })) as Order[];
    } catch (error) {
      console.error('Error getting recent orders:', error);
      throw error;
    }
  }

  /**
   * Get universities with user counts
   */
  static async getUniversitiesWithCounts(): Promise<any[]> {
    try {
      const universitiesResult = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.universitiesCollectionId
      );

      const universities = [];
      
      for (const uni of universitiesResult.documents) {
        // Get user counts for this university
        const usersResult = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.usersCollectionId,
          [Query.equal('universityName', uni.name)]
        );

        const vendorsResult = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.vendorsCollectionId,
          [Query.equal('universityName', uni.name)]
        );

        universities.push({
          id: uni.$id,
          name: uni.name,
          emailDomain: uni.emailDomain,
          isActive: uni.isActive,
          studentsCount: usersResult.documents.filter(u => u.role === 'student').length,
          vendorsCount: vendorsResult.total,
          adminsCount: usersResult.documents.filter(u => u.role === 'admin').length,
          totalUsers: usersResult.total
          // Note: Skipping createdAt/updatedAt for now due to type mismatch with Timestamp
        });
      }

      return universities;
    } catch (error) {
      console.error('Error getting universities with counts:', error);
      throw error;
    }
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [users, vendors, orders, universities] = await Promise.all([
        databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId),
        databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.vendorsCollectionId),
        databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.ordersCollectionId),
        databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.universitiesCollectionId)
      ]);

      const totalUsers = users.total;
      const totalStudents = users.documents.filter(u => u.role === 'student').length;
      const totalVendors = vendors.total;
      const totalAdmins = users.documents.filter(u => u.role === 'admin').length;
      const totalOrders = orders.total;
      const pendingOrders = orders.documents.filter(o => o.status === 'pending').length;

      // Calculate total revenue from completed orders
      const totalRevenue = orders.documents
        .filter(o => o.status === 'completed')
        .reduce((sum, order) => sum + (order.total || 0), 0);

      return {
        totalUsers,
        totalStudents,
        totalVendors,
        totalAdmins,
        totalUniversities: universities.total,
        totalOrders,
        totalRevenue,
        pendingOrders,
        activeComplaints: 0, // TODO: Implement complaints
        totalOneTimeCodes: 0, // TODO: Implement one-time codes
        activeOneTimeCodes: 0 // TODO: Implement one-time codes
        // Note: Skipping lastUpdated for now due to type mismatch with Timestamp
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Create a one-time code
   */
  static async createOneTimeCode(
    request: CreateOneTimeCodeRequest,
    createdBy: string,
    createdByName?: string
  ): Promise<OneTimeCode> {
    try {
      const code = this.generateCode();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + (request.expiresInHours || 168) * 60 * 60 * 1000);

      const codeData = {
        code,
        type: request.type,
        universityId: request.universityId,
        universityName: '', // Will be filled from university lookup
        createdBy: createdBy,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        isActive: true,
        maxUses: request.maxUses || 1,
        usageCount: 0,
        metadata: {
          createdByName: createdByName,
          notes: request.notes,
          emailDomain: request.emailDomain,
          specificEmail: request.specificEmail
        }
      };

      // Get university name
      const university = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.universitiesCollectionId,
        request.universityId
      );
      codeData.universityName = university.name;

      const result = await databases.createDocument(
        appwriteConfig.databaseId,
        'oneTimeCodes', // Using default collection name
        code,
        codeData
      );

      return {
        id: result.$id,
        code: result.code,
        type: result.type,
        universityId: result.universityId,
        universityName: result.universityName,
        createdBy: result.createdBy,
        createdAt: result.createdAt,
        expiresAt: result.expiresAt,
        isActive: result.isActive,
        maxUses: result.maxUses,
        usageCount: result.usageCount,
        metadata: result.metadata
      };
    } catch (error) {
      console.error('Error creating one-time code:', error);
      throw error;
    }
  }

  /**
   * Validate a one-time code
   */
  static async validateOneTimeCode(code: string, email?: string): Promise<OneTimeCodeValidationResult> {
    try {
      const codeDoc = await databases.getDocument(
        appwriteConfig.databaseId,
        'oneTimeCodes',
        code
      );

      if (!codeDoc.isActive) {
        return { isValid: false, error: 'Code is not active' };
      }

      if (new Date(codeDoc.expiresAt) < new Date()) {
        return { isValid: false, error: 'Code has expired' };
      }

      if (codeDoc.usageCount >= codeDoc.maxUses) {
        return { isValid: false, error: 'Code has been used maximum number of times' };
      }

      // Get university info
      const university = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.universitiesCollectionId,
        codeDoc.universityId
      );

      return {
        isValid: true,
        code: {
          id: codeDoc.$id,
          code: codeDoc.code,
          type: codeDoc.type,
          universityId: codeDoc.universityId,
          universityName: codeDoc.universityName,
          createdBy: codeDoc.createdBy,
          createdAt: codeDoc.createdAt,
          expiresAt: codeDoc.expiresAt,
          isActive: codeDoc.isActive,
          maxUses: codeDoc.maxUses,
          usageCount: codeDoc.usageCount,
          metadata: codeDoc.metadata
        },
        universityInfo: {
          id: university.$id,
          name: university.name,
          emailDomain: university.emailDomain,
          isActive: university.isActive
        }
      };
    } catch (error) {
      if (error.code === 404) {
        return { isValid: false, error: 'Code not found' };
      }
      console.error('Error validating one-time code:', error);
      throw error;
    }
  }

  /**
   * Mark a one-time code as used
   */
  static async useOneTimeCode(code: string, usedBy: string): Promise<void> {
    try {
      const codeDoc = await databases.getDocument(
        appwriteConfig.databaseId,
        'oneTimeCodes',
        code
      );

      await databases.updateDocument(
        appwriteConfig.databaseId,
        'oneTimeCodes',
        code,
        {
          usageCount: codeDoc.usageCount + 1,
          usedBy: usedBy,
          usedAt: new Date().toISOString(),
          isActive: codeDoc.usageCount + 1 >= codeDoc.maxUses ? false : codeDoc.isActive
        }
      );
    } catch (error) {
      console.error('Error using one-time code:', error);
      throw error;
    }
  }

  /**
   * Get all complaints
   */
  static async getAllComplaints(): Promise<any[]> {
    try {
      const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.complaintsCollectionId
      );

      return result.documents.map(doc => ({
        id: doc.$id,
        userId: doc.userId,
        vendorId: doc.vendorId,
        orderId: doc.orderId,
        title: doc.title,
        description: doc.description,
        status: doc.status,
        priority: doc.priority,
        createdAt: doc.$createdAt,
        resolvedAt: doc.resolvedAt,
        resolution: doc.resolution,
        adminId: doc.adminId
      }));
    } catch (error) {
      console.error('Error getting all complaints:', error);
      return []; // Return empty array if complaints collection doesn't exist yet
    }
  }

  /**
   * Update user role
   */
  static async updateUserRole(userId: string, newRole: string): Promise<void> {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        userId,
        { role: newRole }
      );
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  /**
   * Update vendor approval status
   */
  static async updateVendorApproval(vendorId: string, isApproved: boolean): Promise<void> {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.vendorsCollectionId,
        vendorId,
        { isApproved }
      );
    } catch (error) {
      console.error('Error updating vendor approval:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        userId
      );
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Get user details
   */
  static async getUserDetails(userId: string): Promise<User> {
    try {
      const doc = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        userId
      );

      return {
        id: doc.$id,
        fullName: doc.fullName,
        email: doc.email,
        universityId: doc.universityId,
        universityName: doc.universityName,
        phoneNumber: doc.phoneNumber,
        isEmailVerified: doc.isEmailVerified,
        role: doc.role,
        walletBalance: doc.walletBalance,
        profileImageUrl: doc.profileImageUrl,
        fcmToken: doc.fcmToken
        // Note: Skipping createdAt/updatedAt for now due to type mismatch with Timestamp
      };
    } catch (error) {
      console.error('Error getting user details:', error);
      throw error;
    }
  }

  /**
   * Get vendor details
   */
  static async getVendorDetails(vendorId: string): Promise<Vendor> {
    try {
      const doc = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.vendorsCollectionId,
        vendorId
      );

      return {
        id: doc.$id,
        name: doc.name,
        userId: doc.userId,
        universityId: doc.universityId,
        universityName: doc.universityName,
        description: doc.description,
        imageUrl: doc.imageUrl,
        rating: doc.rating,
        reviewCount: doc.reviewCount,
        categories: doc.categories,
        isOpen: doc.isOpen,
        isApproved: doc.isApproved,
        isSuspended: doc.isSuspended
        // Note: Skipping createdAt/updatedAt for now due to type mismatch with Timestamp
      };
    } catch (error) {
      console.error('Error getting vendor details:', error);
      throw error;
    }
  }

  /**
   * Get enriched orders with user and vendor details
   */
  static async getEnrichedOrders(limit_count: number = 50): Promise<EnrichedOrderData[]> {
    try {
      const orders = await this.getRecentOrders(limit_count);
      
      // Create a map to cache user and vendor details to avoid duplicate API calls
      const userCache = new Map();
      const vendorCache = new Map();
      const universityCache = new Map();
      
      const enrichedOrders = await Promise.all(
        orders.map(async (order) => {
          let userDetails = null;
          let vendorDetails = null;
          let universityDetails = null;
          
          // Get user details
          if (order.userId) {
            if (userCache.has(order.userId)) {
              userDetails = userCache.get(order.userId);
            } else {
              try {
                const user = await this.getUserDetails(order.userId);
                userDetails = {
                  id: user.id,
                  fullName: user.fullName,
                  email: user.email,
                  universityId: user.universityId,
                  universityName: user.universityName,
                  role: user.role
                };
                userCache.set(order.userId, userDetails);
              } catch (error) {
                console.warn(`Could not get user details for ${order.userId}:`, error);
              }
            }
          }
          
          // Get vendor details
          if (order.vendorId) {
            if (vendorCache.has(order.vendorId)) {
              vendorDetails = vendorCache.get(order.vendorId);
            } else {
              try {
                const vendor = await this.getVendorDetails(order.vendorId);
                vendorDetails = {
                  id: vendor.id,
                  name: vendor.name,
                  description: vendor.description,
                  isApproved: vendor.isApproved
                };
                vendorCache.set(order.vendorId, vendorDetails);
              } catch (error) {
                console.warn(`Could not get vendor details for ${order.vendorId}:`, error);
              }
            }
          }
          
          return {
            ...order,
            userDetails,
            vendorDetails,
            universityDetails
          } as EnrichedOrderData;
        })
      );
      
      return enrichedOrders;
    } catch (error) {
      console.error('Error getting enriched orders:', error);
      throw error;
    }
  }

  /**
   * Get all one-time codes
   */
  static async getAllOneTimeCodes(): Promise<OneTimeCode[]> {
    try {
      const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        'oneTimeCodes'
      );

      return result.documents.map(doc => ({
        id: doc.$id,
        code: doc.code,
        type: doc.type,
        universityId: doc.universityId,
        universityName: doc.universityName,
        createdBy: doc.createdBy,
        createdAt: doc.createdAt,
        expiresAt: doc.expiresAt,
        usedAt: doc.usedAt,
        usedBy: doc.usedBy,
        isActive: doc.isActive,
        maxUses: doc.maxUses,
        usageCount: doc.usageCount,
        metadata: doc.metadata
      }));
    } catch (error) {
      console.error('Error getting all one-time codes:', error);
      return []; // Return empty array if collection doesn't exist yet
    }
  }

  /**
   * Deactivate a one-time code
   */
  static async deactivateOneTimeCode(codeId: string): Promise<void> {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        'oneTimeCodes',
        codeId,
        { isActive: false }
      );
    } catch (error) {
      console.error('Error deactivating one-time code:', error);
      throw error;
    }
  }

  /**
   * Delete a one-time code
   */
  static async deleteOneTimeCode(codeId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        'oneTimeCodes',
        codeId
      );
    } catch (error) {
      console.error('Error deleting one-time code:', error);
      throw error;
    }
  }
}

// Export as the same name for compatibility
export { AppwriteSuperAdminService as SuperAdminService };
