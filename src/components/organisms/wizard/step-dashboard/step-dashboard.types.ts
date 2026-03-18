import type { AuditScope } from '@/@types/audit';

export interface SamplePage {
  id: string;
  title: string;
}

export interface StepDashboardProps {
  auditScope: AuditScope;
  samplePages: SamplePage[];
  onPublish?: () => Promise<void>;
  isPublishing?: boolean;
}
