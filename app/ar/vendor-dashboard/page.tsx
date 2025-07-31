import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوحة تحكم المورد - كامبوس بايتس',
  description: 'لوحة تحكم المورد في كامبوس بايتس',
};

export default function VendorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['vendor']}>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 text-right">
                مرحباً بك في لوحة تحكم المورد
              </h1>
              <p className="text-gray-600 text-right">
                هذه لوحة تحكم المورد الخاصة بك. هنا يمكنك إدارة قائمتك واستلام الطلبات وتتبع مبيعاتك.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-green-900 mb-2">إدارة القائمة</h3>
                <p className="text-green-700 text-sm">حدث عروضك وأسعارك</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-blue-900 mb-2">طلبات جديدة</h3>
                <p className="text-blue-700 text-sm">استلم ومعالجة الطلبات الواردة</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-purple-900 mb-2">تحليلات المبيعات</h3>
                <p className="text-purple-700 text-sm">راقب أداءك وإيراداتك</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
