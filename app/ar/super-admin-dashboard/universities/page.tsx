import React from 'react';
import { SuperAdminLayout } from '@/components/superAdmin/SuperAdminLayout';
import { UniversitiesManagement } from '@/components/superAdmin/UniversityManagement/UniversitiesManagement';

export default function UniversitiesPage() {
  return (
    <SuperAdminLayout
      title="إدارة الجامعات"
      description="إدارة الجامعات وإعداداتها ومراقبة عدد المستخدمين عبر المنصة"
    >
      <UniversitiesManagement />
    </SuperAdminLayout>
  );
}
