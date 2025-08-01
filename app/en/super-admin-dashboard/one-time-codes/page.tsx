import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SuperAdminLayout } from '@/components/superAdmin/SuperAdminLayout';
import { OneTimeCodeManagement } from '@/components/superAdmin/OneTimeCodeManagement/OneTimeCodeManagement';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'One-Time Code Management - CampusBites',
  description: 'Manage one-time signup codes for vendors and admins',
};

export default function OneTimeCodeManagementPage() {
  return (
    <ProtectedRoute allowedRoles={['super-admin']}>
      <SuperAdminLayout
        title="One-Time Code Management"
        description="Create and manage one-time signup codes for vendors and admins"
      >
        <OneTimeCodeManagement />
      </SuperAdminLayout>
    </ProtectedRoute>
  );
}
