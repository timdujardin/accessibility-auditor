import type { FindingPriority } from '@/@types/finding';

export interface IssueCardProps {
  id: string;
  description: string;
  recommendation: string;
  priority: FindingPriority;
  elementSelector: string;
  elementHtml: string;
  fromAutomatedScan: boolean;
  auditorValidated: boolean;
  onValidate?: (id: string) => void;
  onDelete?: (id: string) => void;
}
