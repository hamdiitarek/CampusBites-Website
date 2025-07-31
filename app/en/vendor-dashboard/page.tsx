import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vendor Dashboard - CampusBites',
  description: 'Your vendor dashboard on CampusBites',
};

export default function VendorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['vendor']}>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Vendor Dashboard</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Welcome, Food Vendor!</h2>
              <p className="text-gray-600">
                This is your vendor dashboard. Here you can manage your menu, receive orders, and track your sales.
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900">Manage Menu</h3>
                  <p className="text-green-700 text-sm mt-2">Update your offerings and pricing</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">New Orders</h3>
                  <p className="text-blue-700 text-sm mt-2">Receive and process incoming orders</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900">Sales Analytics</h3>
                  <p className="text-purple-700 text-sm mt-2">Monitor your performance and revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
