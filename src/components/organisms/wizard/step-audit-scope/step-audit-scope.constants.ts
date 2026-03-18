import type { AuditType } from '@/@types/audit';

export interface AuditTypeOption {
  value: AuditType;
  label: string;
  description: string;
  icon: string;
}

export const AUDIT_TYPE_OPTIONS: AuditTypeOption[] = [
  { value: 'web', label: 'Web Accessibility', description: 'Websites and web applications', icon: 'Language' },
  { value: 'design', label: 'Design Accessibility', description: 'Design files and prototypes', icon: 'Palette' },
  {
    value: 'document',
    label: 'Document Accessibility',
    description: 'PDF, Word, and other documents',
    icon: 'Description',
  },
  {
    value: 'native_app',
    label: 'Native App Accessibility',
    description: 'iOS and Android applications',
    icon: 'PhoneIphone',
  },
];
