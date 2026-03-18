import type { AxeViolation } from '@/@types/scan';

export interface ViolationListItemProps {
  violation: AxeViolation;
  violationKey: string;
  isGapExpanded: boolean;
  isApproved: boolean;
  isDismissed: boolean;
  screenshots?: Record<string, string>;
  onToggleGap: (key: string | null) => void;
  onApprove?: (violationKey: string) => void;
  onDismiss?: (violationKey: string) => void;
}
