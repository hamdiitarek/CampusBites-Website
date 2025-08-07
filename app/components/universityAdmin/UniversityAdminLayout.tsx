'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UniversityAdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function UniversityAdminLayout({ 
  children, 
  title = "University Admin Dashboard",
  description = "Comprehensive analytics and management for your campus"
}: UniversityAdminLayoutProps) {
  const { isRTL } = useLanguage();

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {title && (
        <div className="mb-6">
         
        </div>
      )}
      {children}
    </div>
  );
}
