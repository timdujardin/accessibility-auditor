import type { FindingPriority } from '@/@types/finding';
import type { AuditResultRow, FindingRow, FindingScreenshotRow } from '@/hooks/findings.hooks';

/**
 * Counts the number of findings matching a specific priority level.
 * @param {FindingRow[]} findings - The list of findings to filter.
 * @param {FindingPriority} priority - The priority level to count.
 * @returns {number} The number of findings with the given priority.
 */
export const countFindingsByPriority = (findings: FindingRow[], priority: FindingPriority): number => {
  return findings.filter((f) => f.priority === priority).length;
};

/**
 * Counts all findings grouped by priority level.
 * @param {FindingRow[]} findings - The list of findings to count.
 * @returns {Record<string, number>} A map of priority level to occurrence count.
 */
export const countFindingsByPriorityMap = (findings: FindingRow[]): Record<string, number> => {
  const map: Record<string, number> = { critical: 0, major: 0, minor: 0, advisory: 0 };
  for (const f of findings) {
    map[f.priority] = (map[f.priority] ?? 0) + 1;
  }
  return map;
};

/**
 * Filters findings that have been marked as unresolvable.
 * @param {FindingRow[]} findings - The list of findings to filter.
 * @returns {FindingRow[]} Only the findings flagged as unresolvable.
 */
export const getUnresolvableFindings = (findings: FindingRow[]): FindingRow[] => {
  return findings.filter((f) => f.is_unresolvable);
};

/**
 * Returns low-effort findings (minor or advisory) that can be resolved quickly.
 * @param {FindingRow[]} findings - The list of findings to filter.
 * @param {number} [limit=10] - Maximum number of quick wins to return.
 * @returns {FindingRow[]} The quick-win findings, capped at the limit.
 */
export const getQuickWins = (findings: FindingRow[], limit = 10): FindingRow[] => {
  return findings.filter((f) => f.priority === 'minor' || f.priority === 'advisory').slice(0, limit);
};

/**
 * Finds the audit result for a specific criterion on a specific sample page.
 * @param {AuditResultRow[]} results - The list of audit results to search.
 * @param {string} criterionId - The WCAG criterion identifier.
 * @param {string} samplePageId - The sample page identifier.
 * @returns {AuditResultRow | undefined} The matching result, or undefined if not found.
 */
export const findResultForCriterion = (
  results: AuditResultRow[],
  criterionId: string,
  samplePageId: string,
): AuditResultRow | undefined => {
  return results.find((r) => r.criterion_id === criterionId && r.sample_page_id === samplePageId);
};

/**
 * Returns all findings that belong to a specific audit result.
 * @param {FindingRow[]} findings - The list of findings to filter.
 * @param {string | null} resultId - The audit result ID to match, or null for an empty result.
 * @returns {FindingRow[]} The findings belonging to the given result.
 */
export const getFindingsForResult = (findings: FindingRow[], resultId: string | null): FindingRow[] => {
  if (!resultId) {
    return [];
  }

  return findings.filter((f) => f.audit_result_id === resultId);
};

export interface MappedScreenshot {
  id: string;
  storagePath: string;
  altText: string;
}

/**
 * Returns mapped screenshots for a specific finding.
 * @param {FindingScreenshotRow[]} screenshots - The list of all screenshot rows.
 * @param {string} findingId - The finding ID to filter by.
 * @returns {MappedScreenshot[]} The screenshots belonging to the finding, with renamed fields.
 */
export const getScreenshotsForFinding = (
  screenshots: FindingScreenshotRow[],
  findingId: string,
): MappedScreenshot[] => {
  return screenshots
    .filter((s) => s.finding_id === findingId)
    .map((s) => ({ id: s.id, storagePath: s.storage_path, altText: s.alt_text }));
};

/**
 * Finds an audit result by its unique ID.
 * @param {AuditResultRow[]} results - The list of audit results to search.
 * @param {string} resultId - The result ID to find.
 * @returns {AuditResultRow | undefined} The matching result, or undefined if not found.
 */
export const findResultById = (results: AuditResultRow[], resultId: string): AuditResultRow | undefined => {
  return results.find((r) => r.id === resultId);
};
