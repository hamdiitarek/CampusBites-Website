'use client';

import { SuperAdminLayout } from '@/components/superAdmin/SuperAdminLayout';
import { VendorsManagement } from '@/components/superAdmin/VendorManagement/VendorsManagement';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function VendorsPage() {
  return (
    <ProtectedRoute allowedRoles={['super-admin']}>
      <SuperAdminLayout
        title="Vendor Management"
        description="Comprehensive vendor oversight, approval workflow, and performance monitoring"
      >
        <VendorsManagement />
      </SuperAdminLayout>
    </ProtectedRoute>
  );
}
