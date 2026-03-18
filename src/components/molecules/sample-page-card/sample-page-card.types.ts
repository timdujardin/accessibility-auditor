import type { AuditMode, SampleType } from '@/@types/sample';

export interface SamplePageCardProps {
  title: string;
  url: string;
  sampleType: SampleType;
  auditMode: AuditMode;
  index: number;
  onUpdate: (index: number, updates: Record<string, unknown>) => void;
  onRemove: (index: number) => void;
}
