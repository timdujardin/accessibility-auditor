import type { IconName } from '@/components/atoms/icon/icon.types';

export const NAV_ITEMS: readonly { label: string; path: string; iconName: IconName }[] = [
  { label: 'Dashboard', path: '/dashboard', iconName: 'Dashboard' },
  { label: 'Audits', path: '/audits', iconName: 'Assignment' },
  { label: 'New Audit', path: '/audits/new', iconName: 'AddCircleOutline' },
  { label: 'Import Audit', path: '/audits/import', iconName: 'FileUpload' },
];

export const ADMIN_NAV_ITEMS: readonly { label: string; path: string; iconName: IconName }[] = [
  { label: 'Admin Overview', path: '/admin', iconName: 'AdminPanelSettings' },
  { label: 'User Management', path: '/admin/users', iconName: 'People' },
];
