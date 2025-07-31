'use client';

import { SuperAdminLayout } from '@/components/superAdmin/SuperAdminLayout';
import { OrdersManagement } from '@/components/superAdmin/OrderManagement/OrdersManagement';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function OrdersPage() {
  return (
    <ProtectedRoute allowedRoles={['super-admin']}>
      <SuperAdminLayout
        title="Orders Management"
        description="Real-time order monitoring, dispute resolution, and analytics across all universities"
      >
        <OrdersManagement />
      </SuperAdminLayout>
    </ProtectedRoute>
  );
}
