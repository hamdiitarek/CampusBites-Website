'use client';

import { SuperAdminLayout } from '@/components/superAdmin/SuperAdminLayout';
import { UsersManagement } from '@/components/superAdmin/UserManagement/UsersManagement';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function UsersPageAr() {
  return (
    <ProtectedRoute allowedRoles={['super-admin']}>
      <SuperAdminLayout
        title="إدارة المستخدمين"
        description="إدارة شاملة للمستخدمين مع عناصر تحكم وتحليلات متقدمة"
      >
        <UsersManagement />
      </SuperAdminLayout>
    </ProtectedRoute>
  );
}
