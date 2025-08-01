import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SuperAdminLayout } from '@/components/superAdmin/SuperAdminLayout';
import { OneTimeCodeManagement } from '@/components/superAdmin/OneTimeCodeManagement/OneTimeCodeManagement';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إدارة رموز الاستخدام الواحد - كامبوس بايتس',
  description: 'إدارة رموز التسجيل للبائعين والمدراء',
};

export default function OneTimeCodeManagementPage() {
  return (
    <ProtectedRoute allowedRoles={['super-admin']}>
      <SuperAdminLayout
        title="إدارة رموز الاستخدام الواحد"
        description="إنشاء وإدارة رموز التسجيل للبائعين والمدراء"
      >
        <OneTimeCodeManagement />
      </SuperAdminLayout>
    </ProtectedRoute>
  );
}
