import type { WcagCriterion } from '@/@types/criteria';
import type { ScreenshotSummary } from '@/@types/finding';
import type { SamplePageSummary } from '@/@types/sample';
import type { FindingRow } from '@/hooks/findings.hooks';

export interface FindingItemProps {
  finding: FindingRow;
  existingScreenshots: ScreenshotSummary[];
  onValidate: (id: string) => void;
  onDelete: (id: string) => void;
  onUpload: (findingId: string, path: string, alt: string) => Promise<void>;
}

export interface StepManualReportingProps {
  samplePages: SamplePageSummary[];
  activeCriteria: WcagCriterion[];
}
