'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/(landing)/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Alert, AlertDescription } from '@/(landing)/components/ui/alert';
import { Loader2, UserCheck, Store, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'student' | 'vendor' | 'admin';

export function RoleSelection() {
  const { user } = useAuth();
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      setError(t('roleRequired'));
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement role update functionality when needed
      toast({
        title: t('roleUpdated') || 'Role updated successfully!',
        description: t('redirectingToDashboard') || 'Redirecting to your dashboard...',
      });
      
      // Redirect based on role
      setTimeout(() => {
        window.location.href = selectedRole === 'student' ? `/${language}/student-dashboard` : 
                             selectedRole === 'vendor' ? `/${language}/vendor-dashboard` : 
                             `/${language}/admin-dashboard`;
      }, 1000);
    } catch (err: unknown) {
      console.error('Role update error:', err);
      setError(t('networkError'));
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: 'student' as UserRole,
      label: t('studentRole'),
      description: t('studentRoleDesc'),
      icon: UserCheck,
      color: 'text-blue-600'
    },
    {
      value: 'vendor' as UserRole,
      label: t('vendorRole'),
      description: t('vendorRoleDesc'),
      icon: Store,
      color: 'text-green-600'
    },
    {
      value: 'admin' as UserRole,
      label: t('adminRole'),
      description: t('adminRoleDesc'),
      icon: Shield,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('selectRole')}
          </CardTitle>
          <CardDescription className={isRTL ? 'text-right' : 'text-left'}>
            {t('roleDescription')}
          </CardDescription>
          {user && (
            <div className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('welcomeBack') || 'Welcome back'}, {user.name}!
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription className={isRTL ? 'text-right' : 'text-left'}>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            {roleOptions.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.value}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedRole === role.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRole(role.value)}
                >
                  <div className={`flex items-start space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Icon className={`w-6 h-6 mt-1 ${role.color}`} />
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <h3 className="font-semibold">{role.label}</h3>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            onClick={handleRoleSelection}
            className="w-full"
            disabled={!selectedRole || loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('continue')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
