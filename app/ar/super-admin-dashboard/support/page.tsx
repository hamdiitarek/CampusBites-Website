import { SuperAdminLayout } from '@/components/superAdmin/SuperAdminLayout';
import { SupportManagement } from '@/components/superAdmin/Support/SupportManagement';

export default function SupportPage() {
  return (
    <SuperAdminLayout
      title="Support Management"
      description="Manage customer support, tickets, and platform moderation"
    >
      <SupportManagement />
    </SuperAdminLayout>
  );
}
