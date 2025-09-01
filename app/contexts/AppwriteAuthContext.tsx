'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { account, databases, appwriteConfig, ID } from '../../lib/appwriteClient';
import { Query } from 'appwrite';
import type { AppwriteUser } from '../../lib/appwriteTypes';
import type { Models } from 'appwrite';

// Extend the User interface for auth-specific properties
interface AuthUser extends Omit<AppwriteUser, '$id' | '$createdAt' | '$updatedAt' | '$permissions'> {
  $id: string; // Appwrite user ID
  uid: string; // Alias for compatibility
  id: string; // Alias for compatibility
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Models.Session>;
  register: (email: string, password: string, name: string, role: 'vendor' | 'admin' | 'super-admin') => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string, oldPassword: string) => Promise<void>;
  updateUserProfile: (updates: Partial<AppwriteUser>) => Promise<void>;
  updateWalletBalance: (amount: number) => Promise<void>;
  getUserDashboardUrl: (language: string) => string;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Cache for user data to avoid repeated database calls
  const userDataCache = React.useRef<Map<string, any>>(new Map());

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is logged in
        const session = await account.getSession('current');
        if (session) {
          await loadUserData(session.userId);
        }
      } catch (error) {
        // No active session
        console.log('No active session');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      setLoading(true);
      
      // Check cache first
      const cachedData = userDataCache.current.get(userId);
      if (cachedData && Date.now() - cachedData.timestamp < 5 * 60 * 1000) { // 5 minutes cache
        setUser(cachedData.data);
        setLoading(false);
        return;
      }

      // Get Appwrite account info
      const accountData = await account.get();
      
      // Get user document from database
      let userData: AppwriteUser | null = null;
      try {
        const userDoc = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.users,
          userId
        );
        userData = userDoc as unknown as AppwriteUser;
      } catch (error) {
        console.log('User document not found in database');
      }

      const authUser: AuthUser = {
        $id: accountData.$id,
        uid: accountData.$id, // Compatibility alias
        id: accountData.$id, // Compatibility alias
        fullName: userData?.fullName || accountData.name || '',
        email: userData?.email || accountData.email || '',
        universityId: userData?.universityId || '',
        universityRef: userData?.universityRef || '',
        phoneNumber: userData?.phoneNumber || '',
        role: userData?.role || 'student',
        walletBalance: userData?.walletBalance || 0,
        profileImageId: userData?.profileImageId || '',
        isActive: userData?.isActive ?? true,
        lastLoginAt: new Date().toISOString(),
        deviceTokens: userData?.deviceTokens || [],
        defaultAddress: userData?.defaultAddress || {
          street: '',
          city: '',
          geo: { lat: 0, lng: 0 }
        },
        lastSeenAt: userData?.lastSeenAt || new Date().toISOString()
      };

      // Cache the data
      userDataCache.current.set(userId, {
        data: authUser,
        timestamp: Date.now()
      });

      setUser(authUser);
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      await loadUserData(session.userId);
      return session;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: 'vendor' | 'admin' | 'super-admin') => {
    try {
      // Create Appwrite account
      const newAccount = await account.create(ID.unique(), email, password, name);
      
      // Create session
      await account.createEmailPasswordSession(email, password);

      // Find university by email domain
      const emailDomain = email.split('@')[1];
      let universityRef = '';
      
      try {
        const universitiesResult = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.collections.universities,
          [Query.equal('emailDomain', emailDomain), Query.limit(1)]
        );
        
        if (universitiesResult.documents.length > 0) {
          universityRef = universitiesResult.documents[0].$id;
        }
      } catch (error) {
        console.warn('Could not find university for email domain:', emailDomain);
      }

      // Create user document in database
      const userDocData = {
        fullName: name,
        email,
        universityId: '', // Will be set when user completes profile
        universityRef,
        phoneNumber: '',
        role: (role as 'student' | 'vendor' | 'admin'),
        walletBalance: 0,
        profileImageId: '',
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        deviceTokens: [],
        defaultAddress: {
          street: '',
          city: '',
          geo: { lat: 0, lng: 0 }
        },
        lastSeenAt: new Date().toISOString()
      };

      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.users,
        newAccount.$id,
        userDocData
      );

      // Load user data
      await loadUserData(newAccount.$id);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      userDataCache.current.clear();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Appwrite password recovery
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string, oldPassword: string) => {
    try {
      await account.updatePassword(newPassword, oldPassword);
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<AppwriteUser>) => {
    if (!user) throw new Error('No authenticated user');
    
    try {
      // Update user document in database
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.users,
        user.$id,
        updates as any
      );
      
      // Clear cache
      userDataCache.current.delete(user.$id);
      
      // Update local user state
      setUser({ ...user, ...updates });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const updateWalletBalance = async (amount: number) => {
    if (!user) throw new Error('No authenticated user');
    
    try {
      // Update wallet balance in database
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.users,
        user.$id,
        { walletBalance: amount }
      );
      
      // Clear cache
      userDataCache.current.delete(user.$id);
      
      // Update local user state
      setUser({ ...user, walletBalance: amount });
    } catch (error) {
      console.error('Update wallet balance error:', error);
      throw error;
    }
  };

  const getUserDashboardUrl = (language: string): string => {
    if (!user?.role) return `/${language}/login`;
    
    switch (user.role) {
      case 'vendor':
        return `/${language}/vendor-dashboard`;
      case 'admin':
        return `/${language}/admin-dashboard`;
      default:
        return `/${language}/login`;
    }
  };

  const refreshUserData = async () => {
    if (!user) return;
    
    // Clear cache and force refresh
    userDataCache.current.delete(user.$id);
    
    try {
      await loadUserData(user.$id);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    updateUserProfile,
    updateWalletBalance,
    getUserDashboardUrl,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
