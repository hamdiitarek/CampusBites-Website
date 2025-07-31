import { AuthContainer } from '@/components/auth/AuthContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل الدخول - كامبوس بايتس',
  description: 'سجل دخولك إلى حساب كامبوس بايتس',
};

export default function LoginPage() {
  return <AuthContainer />;
}
