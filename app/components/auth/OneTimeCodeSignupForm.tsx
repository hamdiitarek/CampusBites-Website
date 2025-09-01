'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/(landing)/components/ui/button';
import { Input } from '@/(landing)/components/ui/input';
import { Label } from '@/(landing)/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Alert, AlertDescription } from '@/(landing)/components/ui/alert';
import { Loader2, Mail, Lock, User as UserIcon, Key, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SuperAdminService } from '@/lib/superAdminService';
import type { OneTimeCodeValidationResult } from '@/lib/models';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface OneTimeCodeSignupFormProps {
  onBackToLogin?: () => void;
}

export function OneTimeCodeSignupForm({ onBackToLogin }: OneTimeCodeSignupFormProps) {
  const { getUserDashboardUrl } = useAuth();
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get code from URL parameter if present
  const urlCode = searchParams.get('code');

  // Form states
  const [step, setStep] = useState<'code' | 'registration'>('code');
  const [code, setCode] = useState(urlCode || '');
  const [codeValidation, setCodeValidation] = useState<OneTimeCodeValidationResult | null>(null);
  
  // Registration form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [universityId, setUniversityId] = useState('');
  
  // Loading states
  const [validatingCode, setValidatingCode] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');

  // Auto-validate code if provided in URL
  useEffect(() => {
    if (urlCode) {
      handleValidateCode(urlCode);
    }
  }, [urlCode]);

  const handleValidateCode = async (codeToValidate?: string) => {
    const codeValue = codeToValidate || code;
    if (!codeValue) {
      setError('Please enter a code');
      return;
    }

    try {
      setValidatingCode(true);
      setError('');
      
      const validation = await SuperAdminService.validateOneTimeCode(codeValue, email);
      
      if (validation.isValid && validation.code) {
        setCodeValidation(validation);
        setUniversityId(validation.code.universityId);
        setStep('registration');
        
        toast({
          title: 'Code Valid',
          description: `Ready to create ${validation.code.type} account for ${validation.universityInfo?.name}`,
        });
      } else {
        setError(validation.error || 'Invalid code');
      }
    } catch (error) {
      console.error('Error validating code:', error);
      setError('Error validating code. Please try again.');
    } finally {
      setValidatingCode(false);
    }
  };

  const validateRegistrationForm = () => {
    if (!name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateRegistrationForm() || !codeValidation?.code) {
      return;
    }

    // Validate email against code restrictions if any
    const emailValidation = await SuperAdminService.validateOneTimeCode(code, email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Email not allowed for this code');
      return;
    }

    try {
      setRegistering(true);

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName: name });

      // Create user document in Firestore
      const userData = {
        email,
        fullName: name,
        phoneNumber: phoneNumber || '',
        universityId: codeValidation.code.universityId,
        universityName: codeValidation.code.universityName,
        role: codeValidation.code.type,
        isEmailVerified: false,
        walletBalance: 0,
        createdAt: new Date().toISOString(),
        createdViaOneTimeCode: true,
        oneTimeCodeUsed: code
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      // Mark the one-time code as used
      await SuperAdminService.useOneTimeCode(code, user.uid);

      toast({
        title: 'Account Created',
        description: `Your ${codeValidation.code.type} account has been created successfully!`,
      });

      // Redirect to appropriate dashboard
      const dashboardUrl = getUserDashboardUrl(language);
      router.push(dashboardUrl);
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setRegistering(false);
    }
  };

  if (step === 'code') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle>Enter One-Time Code</CardTitle>
          <CardDescription>
            Enter the one-time signup code provided to you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="code">One-Time Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="Enter 8-character code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={8}
              className="font-mono text-center text-lg tracking-wider"
            />
          </div>
          
          <Button 
            onClick={() => handleValidateCode()}
            disabled={validatingCode || !code}
            className="w-full"
          >
            {validatingCode ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              'Validate Code'
            )}
          </Button>
          
          {onBackToLogin && (
            <Button variant="ghost" onClick={onBackToLogin} className="w-full">
              Back to Login
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>
          Complete your {codeValidation?.code?.type} registration for{' '}
          <strong>{codeValidation?.universityInfo?.name}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegistration} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Alert>
            <Building2 className="h-4 w-4" />
            <AlertDescription>
              Your account will be linked to <strong>{codeValidation?.universityInfo?.name}</strong> 
              {' '}as a <strong>{codeValidation?.code?.type}</strong>
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            {codeValidation?.code?.metadata?.restrictions?.emailDomain && (
              <p className="text-sm text-gray-500">
                Must use {codeValidation.code.metadata.restrictions.emailDomain} email
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+20 XXX XXX XXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={registering}
            className="w-full"
          >
            {registering ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              `Create ${codeValidation?.code?.type} Account`
            )}
          </Button>
          
          <Button 
            type="button"
            variant="ghost" 
            onClick={() => setStep('code')}
            className="w-full"
          >
            Back to Code Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
