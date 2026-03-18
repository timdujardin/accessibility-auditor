import type { AuditScope } from '@/@types/audit';

export interface StepAuditorSummaryProps {
  auditTitle: string;
  auditScope: AuditScope;
  executiveSummary: string;
  onSummaryChange: (summary: string) => void;
}
