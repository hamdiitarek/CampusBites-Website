import { SuperAdminLayout } from '@/components/superAdmin/SuperAdminLayout';
import { SupportManagement } from '@/components/superAdmin/Support/SupportManagement';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function SupportPage() {
  return (
    <ProtectedRoute allowedRoles={['super-admin']}>
      <SuperAdminLayout
        title="Support Management"
        description="Manage customer support, tickets, and platform moderation"
      >
        <SupportManagement />
      </SuperAdminLayout>
    </ProtectedRoute>
  );
}
