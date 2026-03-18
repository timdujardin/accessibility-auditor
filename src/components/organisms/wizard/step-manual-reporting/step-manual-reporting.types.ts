import type { WcagCriterion } from '@/@types/criteria';
import type { FindingRow } from '@/hooks/findings.hooks';

export interface SamplePage {
  id: string;
  title: string;
  url: string;
}

export interface FindingItemProps {
  finding: FindingRow;
  existingScreenshots: { id: string; storagePath: string; altText: string }[];
  onValidate: (id: string) => void;
  onDelete: (id: string) => void;
  onUpload: (findingId: string, path: string, alt: string) => Promise<void>;
}

export interface StepManualReportingProps {
  samplePages: SamplePage[];
  activeCriteria: WcagCriterion[];
}
