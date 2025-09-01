'use client';

import { useAuth } from '@/contexts/AppwriteAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('student' | 'vendor' | 'admin' | 'super-admin')[];
  redirectTo?: string;
}

export function ProtectedRoute({ children, allowedRoles, redirectTo }: ProtectedRouteProps) {
  const { user, loading, getUserDashboardUrl } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User not authenticated, redirect to login
        router.push(`/${language}/login`);
        return;
      }

      if (!user.role) {
        // User doesn't have a role, redirect to login (should not happen with new flow)
        router.push(`/${language}/login`);
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        // User doesn't have required role, redirect to their appropriate dashboard
        const userDashboardUrl = getUserDashboardUrl(language);
        router.push(userDashboardUrl);
        return;
      }
    }
  }, [user, loading, router, language, allowedRoles, redirectTo, getUserDashboardUrl]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    return null;
  }

  // User is authenticated and has correct role
  return <>{children}</>;
}

