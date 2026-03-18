import type { AuditType } from '@/@types/audit';

export interface AuditTypeCardProps {
  value: AuditType;
  label: string;
  description: string;
  iconKey: string;
  selected: boolean;
  onSelect: () => void;
}
