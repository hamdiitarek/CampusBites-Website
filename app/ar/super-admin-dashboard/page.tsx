'use client';

import { SuperAdminDashboard } from '@/components/SuperAdminDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function SuperAdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['super-admin']}>
      <SuperAdminDashboard />
    </ProtectedRoute>
  );
}
