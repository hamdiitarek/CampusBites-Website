import { OneTimeCodeSignupForm } from '@/components/auth/OneTimeCodeSignupForm';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Sign Up with Code - CampusBites',
  description: 'Create your vendor or admin account using a one-time code',
};

function SignupContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            CampusBites
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Special Account Registration
          </p>
        </div>
        <OneTimeCodeSignupForm />
      </div>
    </div>
  );
}

export default function SignupWithCodePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
