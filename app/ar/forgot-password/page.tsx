import { AuthContainer } from '@/components/auth/AuthContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'نسيت كلمة المرور - كامبوس بايتس',
  description: 'إعادة تعيين كلمة المرور لحساب كامبوس بايتس',
};

export default function ForgotPasswordPage() {
  return <AuthContainer />;
}
