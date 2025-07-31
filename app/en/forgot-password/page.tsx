import { AuthContainer } from '@/components/auth/AuthContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - CampusBites',
  description: 'Reset your CampusBites account password',
};

export default function ForgotPasswordPage() {
  return <AuthContainer />;
}
