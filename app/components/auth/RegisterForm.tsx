'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/(landing)/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Alert, AlertDescription } from '@/(landing)/components/ui/alert';
import { Input } from '@/(landing)/components/ui/input';
import { Label } from '@/(landing)/components/ui/label';
import { Key, ExternalLink, Info, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { SuperAdminService } from '@/lib/appwriteSuperAdminService';

interface RegisterFormProps {
  onBackToLogin: () => void;
}

export function RegisterForm({ onBackToLogin }: RegisterFormProps) {
  const { t, isRTL, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'validate' | 'register'>('validate');
  
  // Form state
  const [oneTimeCode, setOneTimeCode] = useState('');
  const [validatedCodeData, setValidatedCodeData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Check for code in URL parameters and auto-validate
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setOneTimeCode(codeFromUrl.toUpperCase());
      setShowSignupForm(true);
      // Auto-validate the code
      validateCodeFromUrl(codeFromUrl.toUpperCase());
    }
  }, [searchParams]);

  const validateCodeFromUrl = async (code: string) => {
    setLoading(true);
    setError('');

    try {
      const result = await SuperAdminService.validateOneTimeCode(code);
      
      if (result.isValid && result.code) {
        setValidatedCodeData(result.code);
        setStep('register');
      } else {
        setError(result.error || 'Invalid code from URL');
      }
    } catch (error) {
      setError('Failed to validate code from URL. Please try again.');
      console.error('Code validation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowSignupForm = () => {
    setShowSignupForm(true);
    setError('');
  };

  const handleBackToInfo = () => {
    setShowSignupForm(false);
    setStep('validate');
    setOneTimeCode('');
    setValidatedCodeData(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  const handleValidateCode = async () => {
    if (!oneTimeCode.trim()) {
      setError('Please enter a one-time code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await SuperAdminService.validateOneTimeCode(oneTimeCode);
      
      if (result.isValid && result.code) {
        setValidatedCodeData(result.code);
        setStep('register');
      } else {
        setError(result.error || 'Invalid code');
      }
    } catch (error) {
      setError('Failed to validate code. Please try again.');
      console.error('Code validation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create the user account using the register method from AuthContext
      await register(
        formData.email,
        formData.password,
        formData.name,
        validatedCodeData.role
      );

      // Mark the one-time code as used
      await SuperAdminService.useOneTimeCode(oneTimeCode, formData.email);

      // Redirect based on role
      const dashboardRoute = validatedCodeData.role === 'admin' 
        ? `/${language}/admin-dashboard`
        : `/${language}/vendor-dashboard`;
      
      router.push(dashboardRoute);
    } catch (error: any) {
      setError(error.message || 'Failed to create account. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show information view when not in signup form mode
  if (!showSignupForm) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle>Account Registration</CardTitle>
          <CardDescription>
            Registration requires a one-time code from your administrator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Vendors and Admins:</strong> Please use the one-time code provided by your super administrator to create your account.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">How to Register:</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside text-gray-600">
              <li>Get a one-time code from your super administrator</li>
              <li>Click the button below to go to the special signup page</li>
              <li>Enter your code and complete the registration</li>
              <li>Your account will be automatically configured</li>
            </ol>
          </div>
          
          <Button 
            onClick={handleShowSignupForm}
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Sign Up with One-Time Code
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onBackToLogin}
            className="w-full"
          >
            Back to Login
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Don't have a code? Contact your super administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show one-time code signup form
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Key className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle>
          {step === 'validate' ? 'Validate Your Code' : 'Complete Registration'}
        </CardTitle>
        <CardDescription>
          {step === 'validate' 
            ? 'Enter your one-time code to continue'
            : `Creating ${validatedCodeData?.role} account for ${validatedCodeData?.universityName}`
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'validate' ? (
          // Code validation step
          <>
            <div className="space-y-2">
              <Label htmlFor="oneTimeCode">One-Time Code</Label>
              <Input
                id="oneTimeCode"
                type="text"
                placeholder="Enter your code"
                value={oneTimeCode}
                onChange={(e) => setOneTimeCode(e.target.value.toUpperCase())}
                disabled={loading}
              />
            </div>
            
            <Button 
              onClick={handleValidateCode}
              disabled={loading || !oneTimeCode.trim()}
              className="w-full"
            >
              {loading ? 'Validating...' : 'Validate Code'}
            </Button>
          </>
        ) : (
          // Registration step
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  disabled={loading}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleRegister}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </>
        )}
        
        <Button 
          variant="ghost" 
          onClick={step === 'validate' ? handleBackToInfo : () => setStep('validate')}
          className="w-full"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {step === 'validate' ? 'Back to Information' : 'Back to Code Validation'}
        </Button>
      </CardContent>
    </Card>
  );
}