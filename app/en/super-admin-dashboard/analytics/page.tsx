'use client';

import { SuperAdminLayout } from '@/components/superAdmin/SuperAdminLayout';
import { AnalyticsManagement } from '@/components/superAdmin/Analytics/AnalyticsManagement';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={['super-admin']}>
      <SuperAdminLayout
        title="Analytics & Reports"
        description="Comprehensive business intelligence and data analytics"
      >
        <AnalyticsManagement />
      </SuperAdminLayout>
    </ProtectedRoute>
  );
}
