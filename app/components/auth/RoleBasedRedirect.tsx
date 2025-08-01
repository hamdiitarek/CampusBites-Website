'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function RoleBasedRedirect() {
  const { user, loading, getUserDashboardUrl } = useAuth();
  const { t, language } = useLanguage();

  useEffect(() => {
    if (!loading && user) {
      // Use the proper dashboard URL method with language support
      const dashboardUrl = getUserDashboardUrl(language);
      window.location.href = dashboardUrl;
    } else if (!loading && !user) {
      // If not authenticated, redirect to login
      window.location.href = `/${language}/login`;
    }
  }, [user, loading, getUserDashboardUrl, language]);

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
