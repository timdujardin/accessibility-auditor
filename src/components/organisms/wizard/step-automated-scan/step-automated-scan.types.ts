import type { AuditScope } from '@/@types/audit';
import type { AxeViolation } from '@/@types/scan';

export interface SamplePage {
  id: string;
  title: string;
  url: string;
  auditMode: string;
}

export interface StepAutomatedScanProps {
  auditId: string;
  auditScope: AuditScope;
  samplePages: SamplePage[];
  onScanComplete?: (pageId: string, violations: AxeViolation[]) => void;
}
