'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/(landing)/components/ui/button';
import { Input } from '@/(landing)/components/ui/input';
import { Label } from '@/(landing)/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Alert, AlertDescription } from '@/(landing)/components/ui/alert';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const { resetPassword } = useAuth();
  const { t, isRTL } = useLanguage();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError(t('emailRequired'));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('emailInvalid'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail()) return;

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      console.error('Reset password error:', err);
      if (err && typeof err === 'object' && 'code' in err && err.code === 404) {
        setError(t('emailInvalid'));
      } else {
        setError(t('resetPasswordError'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className={`flex items-center justify-center mb-4`}>
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className={`text-2xl font-bold text-center ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('resetEmailSent')}
          </CardTitle>
          <CardDescription className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('resetEmailSent')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onBackToLogin}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
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
          {t('forgotPasswordTitle')}
        </CardTitle>
        <CardDescription className={isRTL ? 'text-right' : 'text-left'}>
          {t('forgotPasswordSubtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                autoFocus
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('sendResetEmail')}
          </Button>

          <Button
            type="button"
            onClick={onBackToLogin}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('backToLogin')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
