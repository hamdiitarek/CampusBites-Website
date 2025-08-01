'use client';

import { Suspense } from 'react';
import { RegisterForm } from './RegisterForm';
import { Loader2 } from 'lucide-react';

interface RegisterFormWrapperProps {
  onBackToLogin: () => void;
}

function LoadingFallback() {
  return (
    <div className="w-full max-w-md mx-auto p-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      <p>Loading registration form...</p>
    </div>
  );
}

export function RegisterFormWrapper({ onBackToLogin }: RegisterFormWrapperProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RegisterForm onBackToLogin={onBackToLogin} />
    </Suspense>
  );
}
