'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Models } from 'appwrite';
import { authService, userService } from '@/lib/appwriteService';
import type { User, UserRole } from '@/lib/models';
import { USER_ROLES } from '@/lib/models';

// Extend the User interface for auth-specific properties
interface AuthUser extends User {
  uid: string; // Appwrite Auth UID (maps to id in User model)
  fcmToken?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, name: string, role: 'vendor' | 'admin' | 'super-admin') => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string, oldPassword: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  updateWalletBalance: (amount: number) => Promise<void>;
  getUserDashboardUrl: (language: string) => string;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AppwriteAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Cache for user data to avoid repeated database calls
  const userDataCache = React.useRef<Map<string, any>>(new Map());

  useEffect(() => {
    // Check for existing session on mount
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        await loadUserData(currentUser.$id);
      }
    } catch (error) {
      console.error('Auth state check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      // Check cache first
      if (userDataCache.current.has(userId)) {
        const cachedData = userDataCache.current.get(userId);
        setUser(cachedData);
        return;
      }

      // Load from database
      const userData = await userService.getUser(userId);
      const authUser: AuthUser = {
        ...userData,
        uid: userId
      };

      // Cache the data
      userDataCache.current.set(userId, authUser);
      setUser(authUser);
    } catch (error) {
      console.error('Failed to load user data:', error);
      // If user document doesn't exist, create a basic one
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          const basicUser: Omit<User, 'id'> & { id: string } = {
            id: currentUser.$id,
            fullName: currentUser.name || '',
            email: currentUser.email,
            universityId: '',
            universityName: '',
            phoneNumber: '',
            isEmailVerified: currentUser.emailVerification,
            role: 'student',
            walletBalance: 0,
            profileImageUrl: ''
          };

          await userService.createUser(basicUser);
          const authUser: AuthUser = { ...basicUser, uid: currentUser.$id };
          setUser(authUser);
        }
      } catch (createError) {
        console.error('Failed to create user document:', createError);
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await authService.signIn(email, password);
      await loadUserData(result.user.$id);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'vendor' | 'admin' | 'super-admin'
  ) => {
    try {
      setLoading(true);
      const result = await authService.signUp(email, password, name);
      
      // Create user document in database
      const userData: Omit<User, 'id'> & { id: string } = {
        id: result.$id,
        fullName: name,
        email: email,
        universityId: '',
        universityName: extractUniversityFromEmail(email),
        phoneNumber: '',
        isEmailVerified: false,
        role: role as UserRole,
        walletBalance: 0,
        profileImageUrl: ''
      };

      await userService.createUser(userData);
      await loadUserData(result.$id);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      userDataCache.current.clear();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const updatePassword = async (newPassword: string, oldPassword: string) => {
    try {
      await authService.updatePassword(newPassword, oldPassword);
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    try {
      // Update in database
      await userService.updateUser(user.uid, updates);

      // Update profile name in auth if provided
      if (updates.fullName) {
        await authService.updateProfile(updates.fullName);
      }

      // Update local state and cache
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      userDataCache.current.set(user.uid, updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const updateWalletBalance = async (amount: number) => {
    if (!user) throw new Error('No user logged in');

    try {
      await userService.updateWalletBalance(user.uid, amount);
      await refreshUserData();
    } catch (error) {
      throw error;
    }
  };

  const refreshUserData = async () => {
    if (!user) return;

    try {
      // Clear cache and reload
      userDataCache.current.delete(user.uid);
      await loadUserData(user.uid);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const getUserDashboardUrl = (language: string): string => {
    if (!user) return `/${language}/login`;

    const baseUrl = `/${language}`;
    
    switch (user.role) {
      case USER_ROLES.VENDOR:
        return `${baseUrl}/vendor-dashboard`;
      case USER_ROLES.ADMIN:
        return `${baseUrl}/admin-dashboard`;
      case USER_ROLES.SUPER_ADMIN:
        return `${baseUrl}/super-admin-dashboard`;
      case USER_ROLES.STUDENT:
      default:
        return `${baseUrl}/student-dashboard`;
    }
  };

  // Helper function to extract university name from email domain
  const extractUniversityFromEmail = (email: string): string => {
    const domain = email.split('@')[1];
    switch (domain) {
      case 'students.eui.edu.eg':
        return 'Egypt University of Informatics';
      case 'guc.edu.eg':
        return 'German University in Cairo';
      default:
        return '';
    }
  };

  const value: AuthContextType = {
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
    refreshUserData
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

// Export for compatibility
export { AppwriteAuthProvider as AuthProvider };