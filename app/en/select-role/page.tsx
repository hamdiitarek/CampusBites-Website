import { RoleSelection } from '@/components/auth/RoleSelection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Select Role - CampusBites',
  description: 'Choose your role on CampusBites',
};

export default function SelectRolePage() {
  return <RoleSelection />;
}
