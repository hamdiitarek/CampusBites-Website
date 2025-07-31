import { AuthContainer } from '@/components/auth/AuthContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إنشاء حساب - كامبوس بايتس',
  description: 'أنشئ حساب كامبوس بايتس الخاص بك',
};

export default function SignUpPage() {
  return <AuthContainer />;
}
