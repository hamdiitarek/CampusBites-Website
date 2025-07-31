'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { cn } from '@/lib/utils';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function SuperAdminLayout({ children, title, description }: SuperAdminLayoutProps) {
  const { isRTL } = useLanguage();

  return (
    <div className={cn('min-h-screen bg-background', isRTL ? 'font-arabic' : 'font-inter')}>
      <DashboardHeader />
      
      <div className="flex">
        {/* Sidebar */}
        <div className={cn(
          'hidden lg:block w-64 border-r bg-card',
          isRTL ? 'border-l border-r-0' : 'border-r'
        )}>
          <SuperAdminSidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full">
            {(title || description) && (
              <div className="border-b bg-card">
                <div className="px-6 py-4">
                  {title && (
                    <h1 className="text-2xl font-bold text-foreground mb-1">
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p className="text-muted-foreground">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
