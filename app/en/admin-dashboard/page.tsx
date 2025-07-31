import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - CampusBites',
  description: 'Your admin dashboard on CampusBites',
};

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Welcome, Administrator!</h2>
              <p className="text-gray-600">
                This is your admin dashboard. Here you can oversee platform operations, manage vendors, and monitor quality standards.
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900">Platform Overview</h3>
                  <p className="text-purple-700 text-sm mt-2">Monitor overall platform activity</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Vendor Management</h3>
                  <p className="text-blue-700 text-sm mt-2">Approve and manage food vendors</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900">Quality Control</h3>
                  <p className="text-green-700 text-sm mt-2">Maintain dining standards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
