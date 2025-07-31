'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function SelectRolePage() {
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

      if (user.role) {
        // User has a role, redirect to their dashboard
        const dashboardUrl = getUserDashboardUrl(language);
        router.push(dashboardUrl);
        return;
      } else {
        // User doesn't have a role (shouldn't happen with new flow)
        // Redirect back to login
        router.push(`/${language}/login`);
        return;
      }
    }
  }, [user, loading, router, language, getUserDashboardUrl]);

  // Show loading while checking authentication and redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
