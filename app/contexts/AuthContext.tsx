'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface User {
  uid: string;
  email: string | null;
  name: string | null;
  role?: 'student' | 'vendor' | 'admin' | 'super-admin';
  fullName?: string;
  phoneNumber?: string;
  universityId?: string;
  universityName?: string;
  isEmailVerified?: boolean;
  walletBalance?: number;
  fcmToken?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (email: string, password: string, name: string, role: 'student' | 'vendor' | 'admin' | 'super-admin') => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string, oldPassword: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  updateWalletBalance: (amount: number) => Promise<void>;
  getUserDashboardUrl: (language: string) => string;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cache for user data to avoid repeated Firestore calls
  const userDataCache = React.useRef<Map<string, any>>(new Map());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Set basic user info immediately for faster UI response
          const basicUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            isEmailVerified: firebaseUser.emailVerified,
          };
          setUser(basicUser);
          // Don't set loading to false yet - wait for complete data
          
          // Check cache first
          const cachedData = userDataCache.current.get(firebaseUser.uid);
          if (cachedData && Date.now() - cachedData.timestamp < 5 * 60 * 1000) { // 5 minutes cache
            const fullUser: User = {
              ...basicUser,
              ...cachedData.data
            };
            setUser(fullUser);
            setLoading(false); // Now we have complete data
            return;
          }
          
          // Fetch from Firestore only if not cached or cache expired
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          
          if (userData) {
            // Cache the data
            userDataCache.current.set(firebaseUser.uid, {
              data: userData,
              timestamp: Date.now()
            });
            
            const fullUser: User = {
              ...basicUser,
              name: firebaseUser.displayName || userData.fullName || null,
              role: userData.role as 'student' | 'vendor' | 'admin' | 'super-admin' | undefined,
              fullName: userData.fullName,
              phoneNumber: userData.phoneNumber,
              universityId: userData.universityId,
              universityName: userData.universityName,
              isEmailVerified: userData.isEmailVerified || firebaseUser.emailVerified,
              walletBalance: userData.walletBalance || 0,
              fcmToken: userData.fcmToken,
              createdAt: userData.createdAt
            };
            setUser(fullUser);
            setLoading(false); // Set loading to false after complete data
          } else {
            // No user data in Firestore, keep basic user and stop loading
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          // Still set basic user info even if Firestore fails
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            isEmailVerified: firebaseUser.emailVerified,
          });
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // User state will be updated by onAuthStateChanged - no need to do anything else here
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: 'student' | 'vendor' | 'admin' | 'super-admin') => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with name (displayName is the correct Firebase property)
      await updateProfile(result.user, { displayName: name });
      
      // Store minimal user data in Firestore for faster initial load
      const userData = {
        email,
        fullName: name,
        role,
        isEmailVerified: false,
        walletBalance: 0,
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'users', result.user.uid), userData);
      
      // Cache the data immediately
      userDataCache.current.set(result.user.uid, {
        data: userData,
        timestamp: Date.now()
      });
      
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    // User state will be updated by onAuthStateChanged
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updatePassword = async (newPassword: string, oldPassword: string) => {
    if (!auth.currentUser) throw new Error('No authenticated user');
    
    // First re-authenticate with old password
    await signInWithEmailAndPassword(auth, auth.currentUser.email!, oldPassword);
    
    // Then update password
    await firebaseUpdatePassword(auth.currentUser, newPassword);
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!auth.currentUser) throw new Error('No authenticated user');
    
    // Update profile in Firestore
    await updateDoc(doc(db, 'users', auth.currentUser.uid), updates);
    
    // Clear cache
    userDataCache.current.delete(auth.currentUser.uid);
    
    // Update local user state
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const updateWalletBalance = async (amount: number) => {
    if (!auth.currentUser) throw new Error('No authenticated user');
    
    // Update wallet balance in Firestore
    await updateDoc(doc(db, 'users', auth.currentUser.uid), { walletBalance: amount });
    
    // Clear cache
    userDataCache.current.delete(auth.currentUser.uid);
    
    // Update local user state
    if (user) {
      setUser({ ...user, walletBalance: amount });
    }
  };

  const getUserDashboardUrl = (language: string): string => {
    if (!user?.role) return `/${language}/login`;
    
    switch (user.role) {
      case 'student':
        return `/${language}/student-dashboard`;
      case 'vendor':
        return `/${language}/vendor-dashboard`;
      case 'admin':
        return `/${language}/admin-dashboard`;
      case 'super-admin':
        return `/${language}/super-admin-dashboard`;
      default:
        return `/${language}/login`;
    }
  };

  const refreshUserData = async () => {
    if (!auth.currentUser) return;
    
    // Clear cache and force refresh
    userDataCache.current.delete(auth.currentUser.uid);
    
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const userData = userDoc.data();
      
      if (userData && user) {
        // Cache the fresh data
        userDataCache.current.set(auth.currentUser.uid, {
          data: userData,
          timestamp: Date.now()
        });
        
        const refreshedUser: User = {
          ...user,
          role: userData.role as 'student' | 'vendor' | 'admin' | 'super-admin' | undefined,
          fullName: userData.fullName,
          phoneNumber: userData.phoneNumber,
          universityId: userData.universityId,
          universityName: userData.universityName,
          isEmailVerified: userData.isEmailVerified || auth.currentUser.emailVerified,
          walletBalance: userData.walletBalance || 0,
          fcmToken: userData.fcmToken,
          createdAt: userData.createdAt
        };
        setUser(refreshedUser);
      }
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
