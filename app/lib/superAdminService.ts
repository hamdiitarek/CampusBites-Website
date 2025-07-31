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
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserData {
  uid: string;
  email: string;
  fullName: string;
  role: 'student' | 'vendor' | 'admin' | 'super-admin';
  universityName: string;
  universityId: string;
  isEmailVerified: boolean;
  walletBalance: number;
  createdAt: string;
  phoneNumber?: string;
  profileImageUrl?: string;
}

export interface VendorData {
  id: string;
  name: string;
  userId: string;
  universityId: string;
  universityName: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  isOpen: boolean;
  isApproved: boolean;
  isSuspended: boolean;
}

export interface OrderData {
  id: string;
  userId: string;
  vendorId: string;
  items: any[];
  total: number;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: string;
  createdAt: Timestamp;
  // Enriched data (optional)
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

export interface UniversityData {
  id: string;
  name: string;
  emailDomain: string;
  studentsCount?: number;
  vendorsCount?: number;
  adminsCount?: number;
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
        constraints.push(where('universityId', '==', universityFilter));
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
        uid: doc.id,
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
          // Count students
          const studentsQuery = query(
            collection(db, 'users'),
            where('universityId', '==', university.id),
            where('role', '==', 'student')
          );
          const studentsSnapshot = await getDocs(studentsQuery);
          
          // Count vendors
          const vendorsQuery = query(
            collection(db, 'vendors'),
            where('universityId', '==', university.id)
          );
          const vendorsSnapshot = await getDocs(vendorsQuery);
          
          // Count admins
          const adminsQuery = query(
            collection(db, 'users'),
            where('universityId', '==', university.id),
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
      const [users, vendors, universities, orders, complaints] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'vendors')),
        getDocs(collection(db, 'universities')),
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'complaints'))
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

      return {
        totalUsers: users.size,
        totalStudents: usersByRole.student || 0,
        totalVendors: vendors.size,
        totalAdmins: usersByRole.admin || 0,
        totalSuperAdmins: usersByRole['super-admin'] || 0,
        totalUniversities: universities.size,
        totalOrders: orders.size,
        totalComplaints: complaints.size,
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
}
