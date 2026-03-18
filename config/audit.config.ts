import type { AuditScope, AuditStatus } from '@/@types/audit';
import type { EvaluationOutcome } from '@/@types/criteria';
import type { FindingPriority } from '@/@types/finding';
import type { SemanticColor } from '@/utils/color.util';

import { WCAG_CRITERIA } from './wcag.config';

const QUICK_AUDIT_CRITERIA: string[] = [
  '1.1.1',
  '1.2.1',
  '1.2.2',
  '1.2.3',
  '1.3.4',
  '1.3.5',
  '1.4.3',
  '1.4.4',
  '1.4.5',
  '2.1.1',
  '2.4.1',
  '2.4.2',
  '2.4.3',
  '2.4.4',
  '2.4.7',
  '2.5.8',
  '3.1.1',
];

const TYPICAL_AUDIT_CRITERIA: string[] = [
  ...QUICK_AUDIT_CRITERIA,
  '1.2.5',
  '1.3.1',
  '1.3.2',
  '1.4.1',
  '1.4.2',
  '1.4.11',
  '2.2.2',
  '2.4.6',
  '3.1.2',
  '3.3.1',
  '3.3.8',
];

const FULL_AA_AUDIT_CRITERIA: string[] = WCAG_CRITERIA.filter((c) => c.level === 'A' || c.level === 'AA').map(
  (c) => c.id,
);

const FULL_AAA_AUDIT_CRITERIA: string[] = WCAG_CRITERIA.map((c) => c.id);

const SCOPE_CRITERIA_MAP: Record<AuditScope, string[]> = {
  quick: QUICK_AUDIT_CRITERIA,
  typical: TYPICAL_AUDIT_CRITERIA,
  full_aa: FULL_AA_AUDIT_CRITERIA,
  full_aaa: FULL_AAA_AUDIT_CRITERIA,
};

/**
 * Returns the list of WCAG criterion IDs included in a given audit scope.
 * @param {AuditScope} scope - The audit scope tier (quick, typical, full_aa, full_aaa).
 * @returns {string[]} The criterion IDs for the given scope.
 */
export const getCriteriaForScope = (scope: AuditScope): string[] => {
  return SCOPE_CRITERIA_MAP[scope];
};

export const SCOPE_LABELS_SHORT: Record<AuditScope, string> = {
  quick: 'Quick',
  typical: 'Typical',
  full_aa: 'Full AA',
  full_aaa: 'Full AAA',
};

export const SCOPE_LABELS_LONG: Record<AuditScope, string> = {
  quick: 'Quick Audit',
  typical: 'Typical Audit',
  full_aa: 'Full Audit (AA)',
  full_aaa: 'Full Audit (AAA)',
};

export const STATUS_DISPLAY: Record<AuditStatus, { label: string; color: SemanticColor }> = {
  draft: { label: 'Draft', color: 'neutral' },
  in_progress: { label: 'In Progress', color: 'warning' },
  completed: { label: 'Completed', color: 'success' },
};

export const OUTCOME_DISPLAY: Record<EvaluationOutcome, { label: string; iconName: string; color: SemanticColor }> = {
  passed: { label: 'Passed', iconName: 'CheckCircle', color: 'success' },
  failed: { label: 'Failed', iconName: 'Cancel', color: 'error' },
  inapplicable: { label: 'Not applicable', iconName: 'RemoveCircleOutline', color: 'neutral' },
  cantTell: { label: 'Cannot tell', iconName: 'HelpOutline', color: 'warning' },
  untested: { label: 'Not tested', iconName: 'RadioButtonUnchecked', color: 'neutral' },
};

export const PRIORITY_DISPLAY: Record<FindingPriority, { label: string; color: SemanticColor }> = {
  critical: { label: 'Critical', color: 'error' },
  major: { label: 'Major', color: 'warning' },
  minor: { label: 'Minor', color: 'info' },
  advisory: { label: 'Advisory', color: 'neutral' },
};
