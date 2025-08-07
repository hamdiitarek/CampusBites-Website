import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/DashboardHeader';
import { UniversityAdminDashboard } from '@/components/UniversityAdminDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'University Admin Dashboard - CampusBites',
  description: 'Comprehensive university administration dashboard with advanced analytics',
};

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="p-4 lg:p-8">
          <div className="w-full max-w-full focus:outline-none [&_*]:focus:outline-none [&_*]:focus:ring-0">
            <UniversityAdminDashboard />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
