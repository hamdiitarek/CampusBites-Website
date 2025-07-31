import { SuperAdminLayout } from '@/components/superAdmin/SuperAdminLayout';
import { SystemAdministration } from '@/components/superAdmin/System/SystemAdministration';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function SystemPage() {
  return (
    <ProtectedRoute allowedRoles={['super-admin']}>
      <SuperAdminLayout
        title="System Administration"
        description="Manage system settings, configurations, and platform infrastructure"
      >
        <SystemAdministration />
      </SuperAdminLayout>
    </ProtectedRoute>
  );
}
