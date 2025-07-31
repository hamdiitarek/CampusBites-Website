import { RoleSelection } from '@/components/auth/RoleSelection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'اختر دورك - كامبوس بايتس',
  description: 'اختر دورك في كامبوس بايتس',
};

export default function SelectRolePage() {
  return <RoleSelection />;
}
