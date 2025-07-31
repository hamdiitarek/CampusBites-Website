'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { account } from '@/lib/appwrite';
import { Models } from 'appwrite';

interface User extends Models.User<Models.Preferences> {
  role?: 'student' | 'vendor' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'student' | 'vendor' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string, oldPassword: string) => Promise<void>;
  updateUserRole: (role: 'student' | 'vendor' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await account.get();
      const userWithRole = {
        ...currentUser,
        role: currentUser.prefs?.role as 'student' | 'vendor' | 'admin' | undefined
      };
      setUser(userWithRole);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    await account.createEmailPasswordSession(email, password);
    const currentUser = await account.get();
    const userWithRole = {
      ...currentUser,
      role: currentUser.prefs?.role as 'student' | 'vendor' | 'admin' | undefined
    };
    setUser(userWithRole);
  };

  const register = async (email: string, password: string, name: string, role: 'student' | 'vendor' | 'admin') => {
    await account.create('unique()', email, password, name);
    await login(email, password);
    // Update user preferences with role
    await updateUserRole(role);
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await account.createRecovery(
      email,
      `${window.location.origin}/reset-password`
    );
  };

  const updatePassword = async (newPassword: string, oldPassword: string) => {
    await account.updatePassword(newPassword, oldPassword);
  };

  const updateUserRole = async (role: 'student' | 'vendor' | 'admin') => {
    await account.updatePrefs({ role });
    if (user) {
      setUser({ ...user, role });
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
    updateUserRole,
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
