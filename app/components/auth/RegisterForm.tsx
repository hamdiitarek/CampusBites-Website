'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/(landing)/components/ui/button';
import { Input } from '@/(landing)/components/ui/input';
import { Label } from '@/(landing)/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Alert, AlertDescription } from '@/(landing)/components/ui/alert';
import { Loader2, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface RegisterFormProps {
  onBackToLogin: () => void;
}

type UserRole = 'student' | 'vendor' | 'admin' | 'super-admin';

export function RegisterForm({ onBackToLogin }: RegisterFormProps) {
  const { register, getUserDashboardUrl } = useAuth();
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Default to student role for new registrations
      await register(email, password, name, 'student');
      toast({
        title: t('registrationSuccess') || 'Registration successful!',
        description: t('welcomeMessage') || 'Welcome to CampusBites!',
      });
      
      // AuthContainer will handle the redirect automatically when user state updates
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

  return (
    <Card className={`w-full max-w-md mx-auto ${isRTL ? 'font-arabic' : 'font-inter'}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-start">
          {t('createAccount') || 'Create Account'}
        </CardTitle>
        <CardDescription className="text-start">
          {t('signUpSubtitle') || 'Create your CampusBites account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-start">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="block text-start">
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
                className={`text-start ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="block text-start">
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
                className={`text-start ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                dir="ltr"
                style={isRTL ? { textAlign: 'right' } : {}}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="block text-start">
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
                className={`text-start ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="block text-start">
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
                className={`text-start ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full btn-icon-rtl" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin icon-before" />}
            {t('createAccount') || 'Create Account'}
          </Button>

          <div className="text-center">
            <span className="text-sm">{t('alreadyHaveAccount') || 'Already have an account?'}</span>{' '}
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
