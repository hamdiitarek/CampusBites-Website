import { SuperAdminLayout } from '@/components/superAdmin/SuperAdminLayout';
import { SystemAdministration } from '@/components/superAdmin/System/SystemAdministration';

export default function SystemPage() {
  return (
    <SuperAdminLayout
      title="System Administration"
      description="Manage system settings, configurations, and platform infrastructure"
    >
      <SystemAdministration />
    </SuperAdminLayout>
  );
}
