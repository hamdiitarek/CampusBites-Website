'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function RoleBasedRedirect() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && user) {
      const role = user.role;
      
      if (role === 'student') {
        window.location.href = '/student-dashboard';
      } else if (role === 'vendor') {
        window.location.href = '/vendor-dashboard';
      } else if (role === 'admin') {
        window.location.href = '/admin-dashboard';
      } else if (role === 'super-admin') {
        window.location.href = '/super-admin-dashboard';
      } else {
        // If no role is set, redirect to login for re-authentication
        // This shouldn't happen with new registration flow
        window.location.href = '/login';
      }
    } else if (!loading && !user) {
      // If not authenticated, redirect to login
      window.location.href = '/login';
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>{t('loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return null;
}
