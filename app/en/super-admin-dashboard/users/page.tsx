'use client';

import { SuperAdminLayout } from '@/components/superAdmin/SuperAdminLayout';
import { UsersManagement } from '@/components/superAdmin/UserManagement/UsersManagement';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function UsersPage() {
  return (
    <ProtectedRoute allowedRoles={['super-admin']}>
      <SuperAdminLayout
        title="User Management"
        description="Comprehensive user management with advanced controls and analytics"
      >
        <UsersManagement />
      </SuperAdminLayout>
    </ProtectedRoute>
  );
}
