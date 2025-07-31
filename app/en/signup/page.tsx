import { AuthContainer } from '@/components/auth/AuthContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - CampusBites',
  description: 'Create your CampusBites account',
};

export default function SignUpPage() {
  return <AuthContainer />;
}
