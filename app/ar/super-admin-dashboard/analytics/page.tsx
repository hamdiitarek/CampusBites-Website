import { SuperAdminLayout } from '@/components/superAdmin/SuperAdminLayout';
import { AnalyticsManagement } from '@/components/superAdmin/Analytics/AnalyticsManagement';

export default function AnalyticsPage() {
  return (
    <SuperAdminLayout title="Analytics Management">
      <AnalyticsManagement />
    </SuperAdminLayout>
  );
}
