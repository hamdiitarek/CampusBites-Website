'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/(landing)/components/ui/button';
import { Input } from '@/(landing)/components/ui/input';
import { Label } from '@/(landing)/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Alert, AlertDescription } from '@/(landing)/components/ui/alert';
import { Loader2, Mail, Lock, UserCheck, Store, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onForgotPassword: () => void;
  onSignUp: () => void;
}

type UserRole = 'student' | 'vendor' | 'admin';

export function LoginForm({ onForgotPassword, onSignUp }: LoginFormProps) {
  const { login, updateUserRole, user } = useAuth();
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'login' | 'role'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Watch for user changes after login to handle automatic redirection
  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role) {
        // User has a role, redirect to appropriate dashboard
        toast({
          title: t('loginSuccess'),
          description: t('redirectingToDashboard') || 'Redirecting to dashboard...',
        });
        
        const dashboardUrl = user.role === 'student' ? `/${language}/student-dashboard` : 
                            user.role === 'vendor' ? `/${language}/vendor-dashboard` : 
                            `/${language}/admin-dashboard`;
        window.location.href = dashboardUrl;
      } else {
        // User doesn't have a role, show role selection
        setStep('role');
      }
    }
  }, [user, isLoggedIn, language, t, toast]);

  const validateForm = () => {
    if (!email) {
      setError(t('emailRequired'));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('emailInvalid'));
      return false;
    }
    if (!password) {
      setError(t('passwordRequired'));
      return false;
    }
    if (password.length < 8) {
      setError(t('passwordMinLength'));
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(email, password);
      setIsLoggedIn(true); // This will trigger the useEffect to check user role
    } catch (err: unknown) {
      console.error('Login error:', err);
      if (err && typeof err === 'object' && 'code' in err && err.code === 401) {
        setError(t('loginError'));
      } else {
        setError(t('networkError'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      setError(t('roleRequired'));
      return;
    }

    setLoading(true);
    try {
      await updateUserRole(selectedRole);
      toast({
        title: t('loginSuccess'),
        description: t('loginSuccess'),
      });
      
      // Redirect based on role
      window.location.href = selectedRole === 'student' ? `/${language}/student-dashboard` : 
                           selectedRole === 'vendor' ? `/${language}/vendor-dashboard` : 
                           `/${language}/admin-dashboard`;
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

  if (step === 'role') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('selectRole')}
          </CardTitle>
          <CardDescription className={isRTL ? 'text-right' : 'text-left'}>
            {t('roleDescription')}
          </CardDescription>
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
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('loginTitle')}
        </CardTitle>
        <CardDescription className={isRTL ? 'text-right' : 'text-left'}>
          {t('loginSubtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription className={isRTL ? 'text-right' : 'text-left'}>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className={isRTL ? 'text-right block' : ''}>
              {t('email')}
            </Label>
            <div className="relative">
              <Mail className={`absolute top-3 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={isRTL ? 'pr-10 text-right' : 'pl-10'}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className={isRTL ? 'text-right block' : ''}>
              {t('password')}
            </Label>
            <div className="relative">
              <Lock className={`absolute top-3 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                id="password"
                type="password"
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={isRTL ? 'pr-10 text-right' : 'pl-10'}
                required
              />
            </div>
          </div>

          <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              type="button"
              variant="link"
              className="px-0 text-sm"
              onClick={onForgotPassword}
            >
              {t('forgotPassword')}
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('signInButton')}
          </Button>

          <div className={`text-center text-sm ${isRTL ? 'text-right' : ''}`}>
            {t('dontHaveAccount')}{' '}
            <Button
              type="button"
              variant="link"
              className="px-0"
              onClick={onSignUp}
            >
              {t('signUp')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
