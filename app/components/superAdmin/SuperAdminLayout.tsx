'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Button } from '@/(landing)/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/(landing)/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function SuperAdminLayout({ children, title, description }: SuperAdminLayoutProps) {
  const { isRTL } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={cn('h-screen flex flex-col bg-background overflow-hidden', isRTL ? 'font-arabic' : 'font-inter')}>
      {/* Fixed Header with Mobile Menu Button */}
      <div className="dashboard-fixed-header relative">
        {/* Mobile Menu Button */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "absolute top-1/2 -translate-y-1/2 z-50 lg:hidden hover:bg-gray-100",
                isRTL ? "right-2" : "left-2"
              )}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side={isRTL ? "right" : "left"} 
            className="w-72 p-0 border-0 [&>button]:hidden"
            onInteractOutside={() => setSidebarOpen(false)}
          >
            <SheetTitle className="sr-only">
              {isRTL ? 'قائمة المشرف العام' : 'Super Admin Navigation'}
            </SheetTitle>
            <div className="flex flex-col h-full bg-card">
              <div className={cn(
                "flex items-center justify-between p-4 border-b",
                isRTL ? "flex-row-reverse" : ""
              )}>
                <h2 className="text-lg font-semibold">
                  {isRTL ? 'المشرف العام' : 'Super Admin'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SuperAdminSidebar onNavigate={() => setSidebarOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Mobile Header */}
        <div className={cn(
          "lg:hidden w-full",
          isRTL ? "pr-12" : "pl-12"
        )}>
          <DashboardHeader />
        </div>        {/* Desktop Header */}
        <div className="hidden lg:block w-full">
          <DashboardHeader />
        </div>
      </div>
      
      {/* Main Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar - Hidden on mobile, shown on large screens */}
        <div className={cn(
          'hidden lg:flex lg:flex-col w-72 border-r bg-card dashboard-sidebar',
          isRTL ? 'border-l border-r-0' : 'border-r'
        )}>
          <SuperAdminSidebar />
        </div>

        {/* Scrollable Main Content */}
        <div className="dashboard-main-content">
          {/* Fixed Page Header */}
          {(title || description) && (
            <div className="flex-shrink-0 border-b bg-card shadow-sm">
              <div className="px-4 lg:px-6 py-4">
                {title && (
                  <h1 className="text-xl lg:text-2xl font-bold text-foreground mb-1">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-sm lg:text-base text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Scrollable Content Area */}
          <div className="dashboard-scrollable-area dashboard-scroll">
            <div className="p-4 lg:p-6 pb-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
