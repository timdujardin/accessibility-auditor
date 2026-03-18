import type { ScanPageResultDraft } from '@/redux/slices/audit';

export interface ScanProgressCardProps {
  pageId: string;
  title: string;
  url: string;
  result?: ScanPageResultDraft;
  isScanning: boolean;
  isExpanded: boolean;
  expandedViolationGap: string | null;
  approvedKeys: string[];
  dismissedKeys: string[];
  onScan: () => void;
  onToggleExpand: () => void;
  onToggleViolationGap: (key: string | null) => void;
  onApproveViolation: (violationKey: string) => void;
  onDismissViolation: (violationKey: string) => void;
}
