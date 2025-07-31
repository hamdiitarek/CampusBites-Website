import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Dashboard - CampusBites',
  description: 'Your student dashboard on CampusBites',
};

export default function StudentDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, Student!</h2>
            <p className="text-gray-600">
              This is your student dashboard. Here you can browse menus, place orders, and track your deliveries.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Browse Menus</h3>
                <p className="text-blue-700 text-sm mt-2">Explore food options from campus vendors</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">My Orders</h3>
                <p className="text-green-700 text-sm mt-2">Track your current and past orders</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">Favorites</h3>
                <p className="text-purple-700 text-sm mt-2">Quick access to your favorite meals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
