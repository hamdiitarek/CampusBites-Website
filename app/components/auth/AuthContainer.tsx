'use client';

import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { RegisterForm } from './RegisterForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type AuthView = 'login' | 'forgot-password' | 'register';

export function AuthContainer() {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const { isRTL, language, t } = useLanguage();
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Set initial view based on current route
  useEffect(() => {
    if (pathname.includes('/signup')) {
      setCurrentView('register');
    } else {
      setCurrentView('login');
    }
  }, [pathname]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      if (user.role) {
        // User is logged in and has a role, redirect to dashboard
        const dashboardUrl = user.role === 'student' ? `/${language}/student-dashboard` : 
                            user.role === 'vendor' ? `/${language}/vendor-dashboard` : 
                            `/${language}/admin-dashboard`;
        window.location.href = dashboardUrl;
      } else {
        // User is logged in but doesn't have a role, redirect to role selection
        window.location.href = `/${language}/select-role`;
      }
    }
  }, [user, loading, language]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is logged in (will redirect in useEffect)
  if (user) {
    return null;
  }

  const handleForgotPassword = () => {
    setCurrentView('forgot-password');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  const handleSignUp = () => {
    setCurrentView('register');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-md w-full space-y-8">
        {currentView === 'login' && (
          <LoginForm
            onForgotPassword={handleForgotPassword}
            onSignUp={handleSignUp}
          />
        )}
        {currentView === 'forgot-password' && (
          <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
        )}
        {currentView === 'register' && (
          <RegisterForm onBackToLogin={handleBackToLogin} />
        )}
      </div>
    </div>
  );
}
