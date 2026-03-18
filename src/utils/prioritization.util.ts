import type { FindingPriority } from '@/@types/finding';

export type ImpactLabel = 'high_priority' | 'warning' | 'best_practice';

/**
 * Maps a finding priority to a human-readable impact label for the remediation backlog.
 * @param {FindingPriority} priority - The finding priority (critical, major, minor, advisory).
 * @returns {ImpactLabel} The corresponding impact label.
 */
export const mapPriorityToImpactLabel = (priority: FindingPriority): ImpactLabel => {
  switch (priority) {
    case 'critical':
    case 'major':
      return 'high_priority';
    case 'minor':
      return 'warning';
    case 'advisory':
      return 'best_practice';
  }
};

export const IMPACT_LABEL_DISPLAY: Record<ImpactLabel, { label: string; color: string }> = {
  high_priority: { label: 'High Priority', color: '#C62828' },
  warning: { label: 'Warning', color: '#F57F17' },
  best_practice: { label: 'Best Practice', color: '#0277BD' },
};

export const PRIORITY_SORT_ORDER: Record<FindingPriority, number> = {
  critical: 0,
  major: 1,
  minor: 2,
  advisory: 3,
};

export const PRINCIPLE_SORT_ORDER: Record<number, number> = {
  1: 0, // Perceivable
  2: 1, // Operable
  3: 2, // Understandable
  4: 3, // Robust
};

export const LEVEL_SORT_ORDER: Record<string, number> = {
  A: 0,
  AA: 1,
  AAA: 2,
};

export interface RemediationRow {
  criterionId: string;
  criterionName: string;
  samplePageTitle: string;
  description: string;
  impactLabel: ImpactLabel;
  priority: FindingPriority;
  principle: number;
  level: string;
}

/**
 * Sorts remediation rows by priority, then WCAG principle, then conformance level.
 * @param {RemediationRow[]} rows - The unsorted remediation rows.
 * @returns {RemediationRow[]} A new sorted array of remediation rows.
 */
export const sortRemediationRows = (rows: RemediationRow[]): RemediationRow[] => {
  return [...rows].sort((a, b) => {
    const impactDiff = PRIORITY_SORT_ORDER[a.priority] - PRIORITY_SORT_ORDER[b.priority];
    if (impactDiff !== 0) {
      return impactDiff;
    }

    const principleDiff = PRINCIPLE_SORT_ORDER[a.principle] - PRINCIPLE_SORT_ORDER[b.principle];
    if (principleDiff !== 0) {
      return principleDiff;
    }

    const levelDiff = (LEVEL_SORT_ORDER[a.level] ?? 99) - (LEVEL_SORT_ORDER[b.level] ?? 99);

    return levelDiff;
  });
};

/**
 * Exports remediation rows as a CSV string with headers.
 * @param {RemediationRow[]} rows - The remediation rows to export.
 * @returns {string} The CSV content including headers and all rows.
 */
export const exportRemediationToCsv = (rows: RemediationRow[]): string => {
  const headers = [
    'Criterion',
    'Criterion Name',
    'Sample Page',
    'Description',
    'Impact',
    'Priority',
    'Principle',
    'Level',
  ];

  const principleNames: Record<number, string> = {
    1: 'Perceivable',
    2: 'Operable',
    3: 'Understandable',
    4: 'Robust',
  };

  const csvRows = rows.map((row) => [
    row.criterionId,
    `"${row.criterionName.replace(/"/g, '""')}"`,
    `"${row.samplePageTitle.replace(/"/g, '""')}"`,
    `"${row.description.replace(/"/g, '""')}"`,
    IMPACT_LABEL_DISPLAY[row.impactLabel].label,
    row.priority,
    principleNames[row.principle] ?? String(row.principle),
    row.level,
  ]);

  return [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
};
