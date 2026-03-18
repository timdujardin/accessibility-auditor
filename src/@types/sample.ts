export type SampleType = 'structured' | 'random';

export type AuditMode = 'automated' | 'full' | 'both';

export interface SamplePage {
  id: string;
  auditId: string;
  title: string;
  url: string;
  description: string;
  sampleType: SampleType;
  auditMode: AuditMode;
  isTested: boolean;
  sortOrder: number;
}
