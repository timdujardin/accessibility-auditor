import type { AuditScope } from '@/@types/audit';

export interface AuditScopeCardProps {
  value: AuditScope;
  label: string;
  description: string;
  criteriaCount: number;
  coveragePercent?: number;
  selected: boolean;
  isAdvanced?: boolean;
  onSelect: () => void;
}
