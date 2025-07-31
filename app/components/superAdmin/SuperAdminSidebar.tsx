'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Button } from '@/(landing)/components/ui/button';
import { ScrollArea } from '@/(landing)/components/ui/scroll-area';
import { 
  LayoutDashboard,
  Users,
  Store,
  GraduationCap,
  ShoppingCart,
  DollarSign,
  FileText,
  Settings,
  BarChart3,
  HeadphonesIcon,
  Shield,
  Bell,
  Activity,
  TrendingUp,
  Database,
  CreditCard,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

interface SuperAdminSidebarProps {
  className?: string;
}

const navigation = [
  {
    name: 'Dashboard',
    nameAr: 'لوحة التحكم',
    href: '/super-admin-dashboard',
    icon: LayoutDashboard,
    description: 'Overview and statistics',
    descriptionAr: 'نظرة عامة وإحصائيات'
  },
  {
    category: 'User Management',
    categoryAr: 'إدارة المستخدمين',
    items: [
      {
        name: 'All Users',
        nameAr: 'جميع المستخدمين',
        href: '/super-admin-dashboard/users',
        icon: Users,
        description: 'Manage all platform users',
        descriptionAr: 'إدارة جميع مستخدمي المنصة'
      },
      {
        name: 'Vendors',
        nameAr: 'البائعون',
        href: '/super-admin-dashboard/vendors',
        icon: Store,
        description: 'Vendor management and approval',
        descriptionAr: 'إدارة وموافقة البائعين'
      },
      {
        name: 'Universities',
        nameAr: 'الجامعات',
        href: '/super-admin-dashboard/universities',
        icon: GraduationCap,
        description: 'University settings and management',
        descriptionAr: 'إعدادات وإدارة الجامعات'
      }
    ]
  },
  {
    category: 'Operations',
    categoryAr: 'العمليات',
    items: [
      {
        name: 'Orders',
        nameAr: 'الطلبات',
        href: '/super-admin-dashboard/orders',
        icon: ShoppingCart,
        description: 'Order monitoring and management',
        descriptionAr: 'مراقبة وإدارة الطلبات'
      },
      {
        name: 'Finance',
        nameAr: 'المالية',
        href: '/super-admin-dashboard/finance',
        icon: DollarSign,
        description: 'Revenue and financial oversight',
        descriptionAr: 'الإيرادات والرقابة المالية'
      },
      {
        name: 'Analytics',
        nameAr: 'التحليلات',
        href: '/super-admin-dashboard/analytics',
        icon: BarChart3,
        description: 'Business intelligence and reports',
        descriptionAr: 'ذكاء الأعمال والتقارير'
      }
    ]
  },
  {
    category: 'Platform Management',
    categoryAr: 'إدارة المنصة',
    items: [
      {
        name: 'Content',
        nameAr: 'المحتوى',
        href: '/super-admin-dashboard/content',
        icon: FileText,
        description: 'Content and announcement management',
        descriptionAr: 'إدارة المحتوى والإعلانات'
      },
      {
        name: 'Support',
        nameAr: 'الدعم',
        href: '/super-admin-dashboard/support',
        icon: HeadphonesIcon,
        description: 'Customer support and moderation',
        descriptionAr: 'دعم العملاء والإشراف'
      },
      {
        name: 'System',
        nameAr: 'النظام',
        href: '/super-admin-dashboard/system',
        icon: Settings,
        description: 'System administration and settings',
        descriptionAr: 'إدارة النظام والإعدادات'
      }
    ]
  },
  {
    category: 'Security & Monitoring',
    categoryAr: 'الأمان والمراقبة',
    items: [
      {
        name: 'Security',
        nameAr: 'الأمان',
        href: '/super-admin-dashboard/security',
        icon: Shield,
        description: 'Security monitoring and access control',
        descriptionAr: 'مراقبة الأمان وتحكم الوصول'
      },
      {
        name: 'Activity Logs',
        nameAr: 'سجلات النشاط',
        href: '/super-admin-dashboard/logs',
        icon: Activity,
        description: 'System and user activity logs',
        descriptionAr: 'سجلات نشاط النظام والمستخدمين'
      },
      {
        name: 'Alerts',
        nameAr: 'التنبيهات',
        href: '/super-admin-dashboard/alerts',
        icon: AlertTriangle,
        description: 'System alerts and notifications',
        descriptionAr: 'تنبيهات النظام والإشعارات'
      }
    ]
  }
];

export function SuperAdminSidebar({ className }: SuperAdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isRTL } = useLanguage();

  const handleNavigation = (href: string) => {
    const basePath = isRTL ? '/ar' : '/en';
    router.push(`${basePath}${href}`);
  };

  const isActive = (href: string) => {
    const currentPath = pathname.replace(/^\/[a-z]{2}/, ''); // Remove language prefix
    return currentPath === href || (href !== '/super-admin-dashboard' && currentPath.startsWith(href));
  };

  return (
    <div className={cn('pb-12 min-h-screen', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-primary mr-3" />
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Super Admin
              </h2>
              <p className="text-xs text-muted-foreground">
                {isRTL ? 'أعلى صلاحية' : 'Highest Authority'}
              </p>
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-1">
              {navigation.map((section, index) => (
                <div key={index}>
                  {section.category ? (
                    // Category section
                    <div className="pb-2">
                      <h3 className="mb-2 px-4 text-sm font-semibold tracking-tight text-muted-foreground">
                        {isRTL ? section.categoryAr : section.category}
                      </h3>
                      <div className="space-y-1">
                        {section.items?.map((item) => (
                          <Button
                            key={item.href}
                            variant={isActive(item.href) ? 'secondary' : 'ghost'}
                            className={cn(
                              'w-full justify-start h-auto py-2 px-4',
                              isActive(item.href) && 'bg-muted font-medium',
                              isRTL && 'flex-row-reverse text-right'
                            )}
                            onClick={() => handleNavigation(item.href)}
                          >
                            <item.icon className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                            <div className={cn('flex flex-col items-start', isRTL && 'items-end')}>
                              <span className="text-sm">
                                {isRTL ? item.nameAr : item.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {isRTL ? item.descriptionAr : item.description}
                              </span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Single item
                    <Button
                      variant={isActive(section.href!) ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start h-auto py-2 px-4',
                        isActive(section.href!) && 'bg-muted font-medium',
                        isRTL && 'flex-row-reverse text-right'
                      )}
                      onClick={() => handleNavigation(section.href!)}
                    >
                      <section.icon className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                      <div className={cn('flex flex-col items-start', isRTL && 'items-end')}>
                        <span className="text-sm">
                          {isRTL ? section.nameAr : section.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {isRTL ? section.descriptionAr : section.description}
                        </span>
                      </div>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
