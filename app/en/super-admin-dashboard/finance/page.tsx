'use client';

import { SuperAdminLayout } from '@/components/superAdmin/SuperAdminLayout';
import { FinanceManagement } from '@/components/superAdmin/FinanceManagement/FinanceManagement';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function FinancePage() {
  return (
    <ProtectedRoute allowedRoles={['super-admin']}>
      <SuperAdminLayout
        title="Financial Management"
        description="Revenue tracking, commission management, and financial oversight"
      >
        <FinanceManagement />
      </SuperAdminLayout>
    </ProtectedRoute>
  );
}
