import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  addDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type {
  User,
  UserData,
  Vendor,
  VendorData,
  Order,
  OrderData,
  UniversityData,
  OneTimeCode,
  CreateOneTimeCodeRequest,
  OneTimeCodeValidationResult,
  University,
  USER_ROLES,
  ORDER_STATUS,
  COLLECTIONS
} from './models';

// Additional interfaces for enriched data
export interface EnrichedOrderData extends OrderData {
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

export interface ComplaintData {
  id: string;
  userId: string;
  vendorId: string;
  orderId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: Timestamp;
  resolvedAt?: Timestamp;
  resolution?: string;
  adminId?: string;
}

export class SuperAdminService {
  // Get all users with filtering
  static async getAllUsers(
    universityFilter?: string,
    roleFilter?: string,
    searchTerm?: string
  ): Promise<UserData[]> {
    try {
      const constraints: any[] = [];
      
      // Apply filters
      if (universityFilter && universityFilter !== 'all') {
        constraints.push(where('universityName', '==', universityFilter));
      }
      
      if (roleFilter && roleFilter !== 'all') {
        constraints.push(where('role', '==', roleFilter));
      }
      
      // Order by creation date
      constraints.push(orderBy('createdAt', 'desc'));
      
      const q = constraints.length > 0 
        ? query(collection(db, 'users'), ...constraints)
        : query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      
      const snapshot = await getDocs(q);
      let users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];
      
      // Apply search filter in memory (since Firestore doesn't support full-text search)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        users = users.filter(user => 
          user.fullName?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower)
        );
      }
      
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  // Get all vendors
  static async getAllVendors(): Promise<VendorData[]> {
    try {
      const q = query(collection(db, 'vendors'), orderBy('name'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VendorData[];
    } catch (error) {
      console.error('Error fetching vendors:', error);
      return [];
    }
  }

  // Get all universities with user counts
  static async getUniversitiesWithCounts(): Promise<UniversityData[]> {
    try {
      // Get universities
      const universitiesSnapshot = await getDocs(collection(db, 'universities'));
      const universities = universitiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UniversityData[];

      // Get user counts for each university
      const universitiesWithCounts = await Promise.all(
        universities.map(async (university) => {
          // Count students by universityName and role
          const studentsQuery = query(
            collection(db, 'users'),
            where('universityName', '==', university.name),
            where('role', '==', 'student')
          );
          const studentsSnapshot = await getDocs(studentsQuery);
          
          // Count vendors by universityName
          const vendorsQuery = query(
            collection(db, 'users'),
            where('universityName', '==', university.name),
            where('role', '==', 'vendor')
          );
          const vendorsSnapshot = await getDocs(vendorsQuery);
          
          // Count admins by universityName and role
          const adminsQuery = query(
            collection(db, 'users'),
            where('universityName', '==', university.name),
            where('role', '==', 'admin')
          );
          const adminsSnapshot = await getDocs(adminsQuery);

          return {
            ...university,
            studentsCount: studentsSnapshot.size,
            vendorsCount: vendorsSnapshot.size,
            adminsCount: adminsSnapshot.size
          };
        })
      );

      return universitiesWithCounts;
    } catch (error) {
      console.error('Error fetching universities:', error);
      return [];
    }
  }

  // Get recent orders
  static async getRecentOrders(limit_count: number = 50): Promise<OrderData[]> {
    try {
      const q = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        limit(limit_count)
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OrderData[];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  // Get all complaints
  static async getAllComplaints(): Promise<ComplaintData[]> {
    try {
      const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComplaintData[];
    } catch (error) {
      console.error('Error fetching complaints:', error);
      return [];
    }
  }

  // Get dashboard statistics
  static async getDashboardStats() {
    try {
      const [users, vendors, universities, orders, complaints, oneTimeCodes] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'vendors')),
        getDocs(collection(db, 'universities')),
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'complaints')),
        getDocs(collection(db, 'oneTimeCodes'))
      ]);

      // Count users by role
      const usersByRole = users.docs.reduce((acc, doc) => {
        const role = doc.data().role;
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Count orders by status
      const ordersByStatus = orders.docs.reduce((acc, doc) => {
        const status = doc.data().status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Count complaints by status
      const complaintsByStatus = complaints.docs.reduce((acc, doc) => {
        const status = doc.data().status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Count one-time codes
      const activeOneTimeCodes = oneTimeCodes.docs.filter(doc => {
        const data = doc.data();
        return data.isActive && data.expiresAt.toMillis() > Date.now();
      }).length;

      return {
        totalUsers: users.size,
        totalStudents: usersByRole.student || 0,
        totalVendors: vendors.size,
        totalAdmins: usersByRole.admin || 0,
        totalSuperAdmins: usersByRole['super-admin'] || 0,
        totalUniversities: universities.size,
        totalOrders: orders.size,
        totalComplaints: complaints.size,
        totalOneTimeCodes: oneTimeCodes.size,
        activeOneTimeCodes,
        ordersByStatus,
        complaintsByStatus,
        approvedVendors: vendors.docs.filter(doc => doc.data().isApproved).length,
        pendingVendors: vendors.docs.filter(doc => !doc.data().isApproved).length,
        suspendedVendors: vendors.docs.filter(doc => doc.data().isSuspended).length
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalUsers: 0,
        totalStudents: 0,
        totalVendors: 0,
        totalAdmins: 0,
        totalSuperAdmins: 0,
        totalUniversities: 0,
        totalOrders: 0,
        totalComplaints: 0,
        totalOneTimeCodes: 0,
        activeOneTimeCodes: 0,
        ordersByStatus: {},
        complaintsByStatus: {},
        approvedVendors: 0,
        pendingVendors: 0,
        suspendedVendors: 0
      };
    }
  }

  // Update user role
  static async updateUserRole(userId: string, newRole: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  // Suspend/unsuspend user
  static async updateUserStatus(userId: string, isSuspended: boolean): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { isSuspended });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // Approve/reject vendor
  static async updateVendorApproval(vendorId: string, isApproved: boolean): Promise<void> {
    try {
      const vendorRef = doc(db, 'vendors', vendorId);
      await updateDoc(vendorRef, { isApproved });
    } catch (error) {
      console.error('Error updating vendor approval:', error);
      throw error;
    }
  }

  // Delete user (for extreme cases)
  static async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Get user details by ID
  static async getUserDetails(userId: string): Promise<any> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return {
          id: userSnap.id,
          ...userSnap.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  }

  // Get vendor details by ID
  static async getVendorDetails(vendorId: string): Promise<any> {
    try {
      const vendorRef = doc(db, 'vendors', vendorId);
      const vendorSnap = await getDoc(vendorRef);
      
      if (vendorSnap.exists()) {
        return {
          id: vendorSnap.id,
          ...vendorSnap.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      return null;
    }
  }

  // Get university details by ID
  static async getUniversityDetails(universityId: string): Promise<any> {
    try {
      const universityRef = doc(db, 'universities', universityId);
      const universitySnap = await getDoc(universityRef);
      
      if (universitySnap.exists()) {
        return {
          id: universitySnap.id,
          ...universitySnap.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching university details:', error);
      return null;
    }
  }

  // Get enriched orders with user and vendor details
  static async getEnrichedOrders(limit_count: number = 50): Promise<any[]> {
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
              userDetails = await this.getUserDetails(order.userId);
              userCache.set(order.userId, userDetails);
            }
          }
          
          // Get vendor details
          if (order.vendorId) {
            if (vendorCache.has(order.vendorId)) {
              vendorDetails = vendorCache.get(order.vendorId);
            } else {
              vendorDetails = await this.getVendorDetails(order.vendorId);
              vendorCache.set(order.vendorId, vendorDetails);
            }
          }
          
          // Get university details from user
          if (userDetails?.universityId) {
            if (universityCache.has(userDetails.universityId)) {
              universityDetails = universityCache.get(userDetails.universityId);
            } else {
              universityDetails = await this.getUniversityDetails(userDetails.universityId);
              universityCache.set(userDetails.universityId, universityDetails);
            }
          } else if (userDetails?.universityName) {
            // Fallback: if universityName exists but not universityId
            universityDetails = { name: userDetails.universityName };
          }
          
          return {
            ...order,
            userDetails,
            vendorDetails,
            universityDetails
          };
        })
      );
      
      return enrichedOrders;
    } catch (error) {
      console.error('Error fetching enriched orders:', error);
      return [];
    }
  }

  // ========================================
  // One-Time Code Management Functions
  // ========================================

  /**
   * Generate a random code for one-time use
   */
  private static generateCode(): string {
    // Generate a 8-character alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Create a new one-time code
   */
  static async createOneTimeCode(
    request: CreateOneTimeCodeRequest, 
    createdBy: string,
    createdByName?: string
  ): Promise<OneTimeCode> {
    try {
      const code = this.generateCode();
      const now = Timestamp.now();
      const expiresInHours = request.expiresInHours || 168; // Default 7 days
      const expiresAt = Timestamp.fromMillis(now.toMillis() + (expiresInHours * 60 * 60 * 1000));

      const oneTimeCode: OneTimeCode = {
        id: code,
        code: code,
        type: request.type,
        universityId: request.universityId,
        universityName: '',
        createdBy,
        createdAt: now,
        expiresAt,
        isActive: true,
        maxUses: request.maxUses || 1,
        usageCount: 0,
        metadata: {
          createdByName,
          notes: request.notes,
          restrictions: {
            emailDomain: request.emailDomain,
            specificEmail: request.specificEmail
          }
        }
      };

      // Get university name
      const universityDoc = await getDoc(doc(db, 'universities', request.universityId));
      if (universityDoc.exists()) {
        oneTimeCode.universityName = universityDoc.data().name;
      }

      // Save to Firestore
      await setDoc(doc(db, 'oneTimeCodes', code), oneTimeCode);

      return oneTimeCode;
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
      const codeDoc = await getDoc(doc(db, 'oneTimeCodes', code));
      
      if (!codeDoc.exists()) {
        return {
          isValid: false,
          error: 'Code not found'
        };
      }

      const codeData = codeDoc.data() as OneTimeCode;

      // Check if code is active
      if (!codeData.isActive) {
        return {
          isValid: false,
          error: 'Code has been deactivated'
        };
      }

      // Check if code has expired
      if (codeData.expiresAt.toMillis() < Date.now()) {
        return {
          isValid: false,
          error: 'Code has expired'
        };
      }

      // Check if code has reached max uses
      if (codeData.usageCount >= codeData.maxUses) {
        return {
          isValid: false,
          error: 'Code has reached maximum usage limit'
        };
      }

      // Check email restrictions if provided
      if (email && codeData.metadata?.restrictions) {
        const { emailDomain, specificEmail } = codeData.metadata.restrictions;
        
        if (specificEmail && email !== specificEmail) {
          return {
            isValid: false,
            error: 'This code is restricted to a specific email address'
          };
        }
        
        if (emailDomain && !email.endsWith(`@${emailDomain}`)) {
          return {
            isValid: false,
            error: `This code is restricted to ${emailDomain} email addresses`
          };
        }
      }

      // Get university info
      const universityDoc = await getDoc(doc(db, 'universities', codeData.universityId));
      const universityInfo = universityDoc.exists() ? universityDoc.data() as University : undefined;

      return {
        isValid: true,
        code: codeData,
        universityInfo
      };
    } catch (error) {
      console.error('Error validating one-time code:', error);
      return {
        isValid: false,
        error: 'Error validating code'
      };
    }
  }

  /**
   * Use a one-time code (mark as used)
   */
  static async useOneTimeCode(code: string, usedBy: string): Promise<void> {
    try {
      const codeRef = doc(db, 'oneTimeCodes', code);
      const codeDoc = await getDoc(codeRef);
      
      if (!codeDoc.exists()) {
        throw new Error('Code not found');
      }

      const codeData = codeDoc.data() as OneTimeCode;
      
      // Update usage information
      const updates: Partial<OneTimeCode> = {
        usageCount: codeData.usageCount + 1,
        usedAt: Timestamp.now(),
        usedBy
      };

      // If this was the last use, deactivate the code
      if (codeData.usageCount + 1 >= codeData.maxUses) {
        updates.isActive = false;
      }

      await updateDoc(codeRef, updates);
    } catch (error) {
      console.error('Error using one-time code:', error);
      throw error;
    }
  }

  /**
   * Get all one-time codes
   */
  static async getAllOneTimeCodes(): Promise<OneTimeCode[]> {
    try {
      const q = query(collection(db, 'oneTimeCodes'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OneTimeCode[];
    } catch (error) {
      console.error('Error fetching one-time codes:', error);
      return [];
    }
  }

  /**
   * Get active one-time codes
   */
  static async getActiveOneTimeCodes(): Promise<OneTimeCode[]> {
    try {
      const q = query(
        collection(db, 'oneTimeCodes'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      const codes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OneTimeCode[];

      // Filter out expired codes
      return codes.filter(code => code.expiresAt.toMillis() > Date.now());
    } catch (error) {
      console.error('Error fetching active one-time codes:', error);
      return [];
    }
  }

  /**
   * Deactivate a one-time code
   */
  static async deactivateOneTimeCode(codeId: string): Promise<void> {
    try {
      const codeRef = doc(db, 'oneTimeCodes', codeId);
      await updateDoc(codeRef, { isActive: false });
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
      const codeRef = doc(db, 'oneTimeCodes', codeId);
      await deleteDoc(codeRef);
    } catch (error) {
      console.error('Error deleting one-time code:', error);
      throw error;
    }
  }

  /**
   * Get one-time codes by university
   */
  static async getOneTimeCodesByUniversity(universityId: string): Promise<OneTimeCode[]> {
    try {
      const q = query(
        collection(db, 'oneTimeCodes'),
        where('universityId', '==', universityId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OneTimeCode[];
    } catch (error) {
      console.error('Error fetching one-time codes by university:', error);
      return [];
    }
  }

}
