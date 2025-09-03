import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/DashboardHeader';
import { VendorDashboard } from '@/components/VendorDashboard';
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
        <VendorDashboard />
      </div>
    </ProtectedRoute>
  );
}
