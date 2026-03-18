import type { ScanPageResultDraft } from '@/redux/slices/audit';

interface SamplePageWithAuditMode {
  id: string;
  auditMode: string;
}

/**
 * Filters sample pages to only those eligible for automated scanning.
 * @param {T[]} pages - The sample pages with audit mode information.
 * @returns {T[]} Pages with audit mode set to "automated" or "both".
 */
export const getScannablePages = <T extends SamplePageWithAuditMode>(pages: T[]): T[] => {
  return pages.filter((p) => p.auditMode === 'automated' || p.auditMode === 'both');
};

/**
 * Counts the total number of violations across all scanned pages.
 * @param {Record<string, ScanPageResult>} results - The scan results keyed by page ID.
 * @returns {number} The total violation count across all pages.
 */
export const countTotalViolations = (results: Record<string, ScanPageResultDraft>): number => {
  return Object.values(results).reduce((sum, r) => sum + r.violations.length, 0);
};
