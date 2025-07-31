import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوحة تحكم المدير - كامبوس بايتس',
  description: 'لوحة تحكم المدير في كامبوس بايتس',
};

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 text-right">
                مرحباً بك في لوحة تحكم المدير
              </h1>
              <p className="text-gray-600 text-right">
                هذه لوحة تحكم المدير الخاصة بك. هنا يمكنك الإشراف على عمليات المنصة وإدارة الموردين ومراقبة معايير الجودة.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-purple-900 mb-2">نظرة عامة على المنصة</h3>
                <p className="text-purple-700 text-sm">راقب نشاط المنصة الإجمالي</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-blue-900 mb-2">إدارة الموردين</h3>
                <p className="text-blue-700 text-sm">وافق على موردي الطعام وأدرهم</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-green-900 mb-2">مراقبة الجودة</h3>
                <p className="text-green-700 text-sm">حافظ على معايير تناول الطعام</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
