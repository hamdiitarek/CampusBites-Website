'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/(landing)/components/ui/button';
import { Avatar, AvatarFallback } from '@/(landing)/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/(landing)/components/ui/dropdown-menu';
import { LogOut, User, Settings, ChevronDown, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import { EmailDisplay, PhoneDisplay, UniversityIdDisplay } from './RTLText';

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const { language, isRTL, t } = useLanguage();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push(`/${language}/login`);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      student: t('studentRole') || 'Student',
      vendor: t('vendorRole') || 'Vendor', 
      admin: t('adminRole') || 'Admin',
      'super-admin': t('superAdminRole') || 'Super Admin'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      student: 'bg-blue-100 text-blue-800',
      vendor: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800',
      'super-admin': 'bg-yellow-100 text-yellow-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getInitials = (name: string | null) => {
    const displayName = user.fullName || name;
    if (!displayName) return 'U';
    return displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return null;

  return (
    <div className={`bg-white shadow-sm border-b border-gray-200 px-4 py-3 ${isRTL ? 'font-arabic' : 'font-inter'}`}>
      <div className="max-w-full mx-auto flex items-center justify-between">
        {/* Logo/Title - positioned based on language direction */}
         <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent ${isRTL ? 'mr-3' : 'ml-3'}`}>
              CampusBites
            </span>
          </div>

        {/* User info and actions - positioned based on language direction */}
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
          {/* User info */}
          <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-sm font-medium text-gray-900">
                {user.fullName || user.email}
              </p>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role || '')}`}>
                  {getRoleDisplayName(user.role || '')}
                </span>
                {user.walletBalance !== undefined && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    <Wallet className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {formatCurrency(user.walletBalance, 'EGP', language)}
                  </span>
                )}
              </div>
              {user.universityName && (
                <p className="text-xs text-gray-500 mt-1">
                  {user.universityName}
                </p>
              )}
            </div>
          </div>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3 w-3 absolute -bottom-1 -right-1 bg-white rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={`w-64 ${isRTL ? 'font-arabic' : 'font-inter'}`} align="end" forceMount>
              <div className={`flex items-center justify-start p-3 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user.fullName || user.email}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    <EmailDisplay email={user.email || ''} />
                  </p>
                  {user.universityId && (
                    <p className="text-xs text-gray-500">
                      <span>{isRTL ? 'رقم الجامعة:' : 'University ID:'}</span>{' '}
                      <UniversityIdDisplay universityId={user.universityId} />
                    </p>
                  )}
                  {user.phoneNumber && (
                    <p className="text-xs text-gray-500">
                      <PhoneDisplay phone={user.phoneNumber} />
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role || '')} w-fit`}>
                      {getRoleDisplayName(user.role || '')}
                    </span>
                    {user.walletBalance !== undefined && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <Wallet className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {formatCurrency(user.walletBalance, 'EGP', language)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span>{t('profile') || 'Profile'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span>{t('settings') || 'Settings'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span>{t('logout') || 'Logout'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
