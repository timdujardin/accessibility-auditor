import type { ReportFinding, ReportPageGroup } from '@/utils/reportGeneration.util';

export interface ReportPreviewProps {
  reportPages: ReportPageGroup[];
}

export interface ReportFindingCardProps {
  finding: ReportFinding;
}
