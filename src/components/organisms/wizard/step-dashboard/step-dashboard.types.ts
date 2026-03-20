import type { AuditScope } from '@/@types/audit';
import type { SamplePageRef } from '@/@types/sample';

export interface StepDashboardProps {
  auditScope: AuditScope;
  samplePages: SamplePageRef[];
  onPublish?: () => Promise<void>;
  isPublishing?: boolean;
}
