import React from 'react';
import { SuperAdminLayout } from '@/components/superAdmin/SuperAdminLayout';
import { UniversitiesManagement } from '@/components/superAdmin/UniversityManagement/UniversitiesManagement';

export default function UniversitiesPage() {
  return (
    <SuperAdminLayout
      title="Universities Management"
      description="Manage universities, their settings, and monitor user counts across the platform"
    >
      <UniversitiesManagement />
    </SuperAdminLayout>
  );
}
