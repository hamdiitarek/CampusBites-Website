import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوحة تحكم المدير - كامبوس بايتس',
  description: 'لوحة تحكم المدير في كامبوس بايتس',
};

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50 p-8 rtl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-right">لوحة تحكم المدير</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-right">مرحباً، مدير!</h2>
            <p className="text-gray-600 text-right">
              هذه لوحة تحكم المدير الخاصة بك. هنا يمكنك الإشراف على عمليات المنصة وإدارة الموردين ومراقبة معايير الجودة.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 text-right">نظرة عامة على المنصة</h3>
                <p className="text-purple-700 text-sm mt-2 text-right">راقب نشاط المنصة الإجمالي</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 text-right">إدارة الموردين</h3>
                <p className="text-blue-700 text-sm mt-2 text-right">وافق على موردي الطعام وأدرهم</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 text-right">مراقبة الجودة</h3>
                <p className="text-green-700 text-sm mt-2 text-right">حافظ على معايير تناول الطعام</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
