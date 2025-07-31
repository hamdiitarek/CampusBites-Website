'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/(landing)/components/ui/button';
import { Input } from '@/(landing)/components/ui/input';
import { Label } from '@/(landing)/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Alert, AlertDescription } from '@/(landing)/components/ui/alert';
import { Loader2, Mail, Lock, User as UserIcon, UserCheck, Store, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RegisterFormProps {
  onBackToLogin: () => void;
}

type UserRole = 'student' | 'vendor' | 'admin';

export function RegisterForm({ onBackToLogin }: RegisterFormProps) {
  const { register } = useAuth();
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'role' | 'details'>('role');

  const validateForm = () => {
    if (!name.trim()) {
      setError(t('nameRequired'));
      return false;
    }
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
    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch') || 'Passwords do not match');
      return false;
    }
    if (!selectedRole) {
      setError(t('roleRequired'));
      return false;
    }
    return true;
  };

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setStep('details');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(email, password, name, selectedRole!);
      toast({
        title: t('registrationSuccess') || 'Registration successful!',
        description: t('welcomeMessage') || 'Welcome to CampusBites!',
      });
      
      // Redirect based on role
      window.location.href = selectedRole === 'student' ? `/${language}/student-dashboard` : 
                           selectedRole === 'vendor' ? `/${language}/vendor-dashboard` : 
                           `/${language}/admin-dashboard`;
    } catch (err: unknown) {
      console.error('Registration error:', err);
      if (err && typeof err === 'object' && 'code' in err && err.code === 409) {
        setError(t('emailAlreadyExists') || 'Email already exists');
      } else {
        setError(t('registrationError') || 'Registration failed. Please try again.');
      }
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
          <div className="space-y-3">
            {roleOptions.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.value}
                  className="border rounded-lg p-4 cursor-pointer transition-all hover:border-gray-300"
                  onClick={() => handleRoleSelection(role.value)}
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
            onClick={onBackToLogin}
            variant="outline"
            className="w-full"
          >
            {t('backToLogin')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('createAccount') || 'Create Account'}
        </CardTitle>
        <CardDescription className={isRTL ? 'text-right' : 'text-left'}>
          {t('signUpSubtitle') || `Sign up as a ${selectedRole}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription className={isRTL ? 'text-right' : 'text-left'}>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className={isRTL ? 'text-right block' : ''}>
              {t('fullName') || 'Full Name'}
            </Label>
            <div className="relative">
              <UserIcon className={`absolute top-3 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                id="name"
                type="text"
                placeholder={t('namePlaceholder') || 'Enter your full name'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={isRTL ? 'pr-10 text-right' : 'pl-10'}
                required
              />
            </div>
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className={isRTL ? 'text-right block' : ''}>
              {t('confirmPassword') || 'Confirm Password'}
            </Label>
            <div className="relative">
              <Lock className={`absolute top-3 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('confirmPasswordPlaceholder') || 'Confirm your password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={isRTL ? 'pr-10 text-right' : 'pl-10'}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('createAccount') || 'Create Account'}
          </Button>

          <div className={`text-center text-sm ${isRTL ? 'text-right' : ''}`}>
            {t('alreadyHaveAccount') || 'Already have an account?'}{' '}
            <Button
              type="button"
              variant="link"
              className="px-0"
              onClick={onBackToLogin}
            >
              {t('signIn')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
