import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/DashboardHeader';
import { UniversityAdminDashboard } from '@/components/UniversityAdminDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوحة تحكم إدارة الجامعة - كامبوس بايتس',
  description: 'لوحة تحكم إدارة الجامعة الشاملة مع التحليلات المتقدمة',
};

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <DashboardHeader />
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <UniversityAdminDashboard />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
