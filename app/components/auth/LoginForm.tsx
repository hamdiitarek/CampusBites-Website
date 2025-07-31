'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/(landing)/components/ui/button';
import { Input } from '@/(landing)/components/ui/input';
import { Label } from '@/(landing)/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Alert, AlertDescription } from '@/(landing)/components/ui/alert';
import { Loader2, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export function LoginForm({ onForgotPassword, onSignUp }: LoginFormProps) {
  const { login, user, getUserDashboardUrl } = useAuth();
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      // User state will be updated by onAuthStateChanged and redirect will happen in useEffect
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

  return (
    <Card className={`w-full max-w-md mx-auto ${isRTL ? 'font-arabic' : 'font-inter'}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-start">
          {t('loginTitle')}
        </CardTitle>
        <CardDescription className="text-start">
          {t('loginSubtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-start">
                {error}
              </AlertDescription>
            </Alert>
          )}

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

          <div className="btn-group-rtl justify-between items-center">
            <Button
              type="button"
              variant="link"
              className="px-0 text-sm"
              onClick={onForgotPassword}
            >
              {t('forgotPassword')}
            </Button>
          </div>

          <Button type="submit" className="w-full btn-icon-rtl" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin icon-before" />}
            {t('signInButton')}
          </Button>

          <div className="text-center">
            <span className="text-sm">{t('dontHaveAccount')}</span>{' '}
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
