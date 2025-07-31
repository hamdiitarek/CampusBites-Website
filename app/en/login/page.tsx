import { AuthContainer } from '@/components/auth/AuthContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - CampusBites',
  description: 'Sign in to your CampusBites account',
};

export default function LoginPage() {
  return <AuthContainer />;
}
