import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/DashboardHeader';
import { VendorDashboard } from '@/components/VendorDashboard';
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
        <VendorDashboard />
      </div>
    </ProtectedRoute>
  );
}
