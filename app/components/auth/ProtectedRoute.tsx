'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('student' | 'vendor' | 'admin')[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = ['student', 'vendor', 'admin'],
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { t, language } = useLanguage();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated, redirect to login
        window.location.href = `/${language}${redirectTo}`;
        return;
      }

      if (user.role && !allowedRoles.includes(user.role)) {
        // User doesn't have the required role
        window.location.href = `/${language}/unauthorized`;
        return;
      }

      if (!user.role) {
        // User doesn't have a role set, redirect to role selection
        window.location.href = `/${language}/select-role`;
        return;
      }
    }
  }, [user, loading, allowedRoles, redirectTo, language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (user.role && !allowedRoles.includes(user.role)) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
