import type { EvaluationOutcome } from '@/@types/criteria';
import type { FindingPriority } from '@/@types/finding';
import type { AuditResultRow, FindingRow, FindingScreenshotRow } from '@/hooks/findings.hooks';

import { findResultForCriterion, getFindingsForResult, getScreenshotsForFinding } from '@/utils/findings.util';

/**
 * Invokes the upload callback with the finding ID, storage path, and alt text.
 * @param {string} findingId - The ID of the finding to attach the screenshot to.
 * @param {(findingId: string, path: string, alt: string) => Promise<void>} onUpload - Callback that performs the upload.
 * @param {string} path - The storage path of the uploaded file.
 * @param {string} alt - The alt text for the screenshot.
 * @returns {Promise<void>} The promise returned by the onUpload callback.
 */
export const handleUpload = (
  findingId: string,
  onUpload: (findingId: string, path: string, alt: string) => Promise<void>,
  path: string,
  alt: string,
) => {
  return onUpload(findingId, path, alt);
};

/**
 * Retrieves the outcome, observations, and result ID for a criterion on the selected page.
 * @param {AuditResultRow[]} results - The audit results to search.
 * @param {string} selectedPageId - The ID of the selected sample page.
 * @param {string} criterionId - The WCAG criterion identifier.
 * @returns {{ outcome: EvaluationOutcome; observations: string; resultId: string | null }} The outcome, observations text, and result ID (or null if not found).
 */
export const getResultForCriterion = (
  results: AuditResultRow[],
  selectedPageId: string,
  criterionId: string,
): { outcome: EvaluationOutcome; observations: string; resultId: string | null } => {
  const result = findResultForCriterion(results, criterionId, selectedPageId);

  return {
    outcome: result?.outcome ?? 'untested',
    observations: result?.observations ?? '',
    resultId: result?.id ?? null,
  };
};

/**
 * Returns the findings associated with a given audit result.
 * @param {FindingRow[]} findings - All findings to filter.
 * @param {string | null} resultId - The audit result ID to filter by.
 * @returns {FindingRow[]} The findings for the specified result.
 */
export const findingsForResult = (findings: FindingRow[], resultId: string | null): FindingRow[] => {
  return getFindingsForResult(findings, resultId);
};

/**
 * Returns the screenshots associated with a given finding.
 * @param {FindingScreenshotRow[]} screenshots - All screenshots to filter.
 * @param {string} findingId - The finding ID to filter by.
 * @returns {FindingScreenshotRow[]} The screenshots for the specified finding.
 */
export const screenshotsForFinding = (screenshots: FindingScreenshotRow[], findingId: string) => {
  return getScreenshotsForFinding(screenshots, findingId);
};

/**
 * Updates the evaluation outcome for a criterion while preserving existing observations.
 * @param {AuditResultRow[]} results - The current audit results.
 * @param {string} selectedPageId - The ID of the selected sample page.
 * @param {(criterionId: string, samplePageId: string, outcome: EvaluationOutcome, observations: string) => void} upsertResult - Callback to persist the result.
 * @param {string} criterionId - The WCAG criterion identifier.
 * @param {EvaluationOutcome} outcome - The new evaluation outcome.
 * @returns {void}
 */
export const handleOutcomeChange = (
  results: AuditResultRow[],
  selectedPageId: string,
  upsertResult: (criterionId: string, samplePageId: string, outcome: EvaluationOutcome, observations: string) => void,
  criterionId: string,
  outcome: EvaluationOutcome,
) => {
  const { observations } = getResultForCriterion(results, selectedPageId, criterionId);
  upsertResult(criterionId, selectedPageId, outcome, observations);
};

/**
 * Updates the observations text for a criterion while preserving the existing outcome.
 * @param {AuditResultRow[]} results - The current audit results.
 * @param {string} selectedPageId - The ID of the selected sample page.
 * @param {(criterionId: string, samplePageId: string, outcome: EvaluationOutcome, observations: string) => void} upsertResult - Callback to persist the result.
 * @param {string} criterionId - The WCAG criterion identifier.
 * @param {string} observations - The new observations text.
 * @returns {void}
 */
export const handleObservationsChange = (
  results: AuditResultRow[],
  selectedPageId: string,
  upsertResult: (criterionId: string, samplePageId: string, outcome: EvaluationOutcome, observations: string) => void,
  criterionId: string,
  observations: string,
) => {
  const { outcome } = getResultForCriterion(results, selectedPageId, criterionId);
  upsertResult(criterionId, selectedPageId, outcome, observations);
};

/**
 * Adds a new finding for a criterion, creating an audit result first if none exists.
 * @param {AuditResultRow[]} results - The current audit results.
 * @param {string} selectedPageId - The ID of the selected sample page.
 * @param {(criterionId: string, samplePageId: string, outcome: EvaluationOutcome, observations: string) => string | null} upsertResult - Callback to create or update the result.
 * @param {(resultId: string, finding: Omit<FindingRow, 'id' | 'audit_result_id' | 'created_at'>) => void} addFinding - Callback to add the finding.
 * @param {string} criterionId - The WCAG criterion identifier.
 * @param {Object} values - The finding form values.
 * @param {string} values.description - The finding description.
 * @param {string} values.recommendation - The recommendation text.
 * @param {FindingPriority} values.priority - The finding priority.
 * @param {string} values.elementSelector - The element selector.
 * @param {string} values.elementHtml - The element HTML snippet.
 * @returns {void}
 */
export const handleAddFinding = (
  results: AuditResultRow[],
  selectedPageId: string,
  upsertResult: (
    criterionId: string,
    samplePageId: string,
    outcome: EvaluationOutcome,
    observations: string,
  ) => string | null,
  addFinding: (resultId: string, finding: Omit<FindingRow, 'id' | 'audit_result_id' | 'created_at'>) => void,
  criterionId: string,
  values: {
    description: string;
    recommendation: string;
    priority: FindingPriority;
    elementSelector: string;
    elementHtml: string;
  },
) => {
  let resultId = getResultForCriterion(results, selectedPageId, criterionId).resultId;
  if (!resultId) {
    resultId = upsertResult(criterionId, selectedPageId, 'failed', '');
  }
  if (!resultId) {
    return;
  }

  addFinding(resultId, {
    description: values.description,
    recommendation: values.recommendation,
    priority: values.priority as FindingPriority,
    element_selector: values.elementSelector,
    element_html: values.elementHtml,
    from_automated_scan: false,
    auditor_validated: true,
    is_unresolvable: false,
    alternative_solution: '',
  });
};

/**
 * Marks a finding as auditor-validated.
 * @param {(findingId: string, updates: Partial<FindingRow>) => void} updateFinding - Callback to update the finding.
 * @param {string} findingId - The ID of the finding to validate.
 * @returns {void}
 */
export const handleValidateFinding = (
  updateFinding: (findingId: string, updates: Partial<FindingRow>) => void,
  findingId: string,
) => {
  updateFinding(findingId, { auditor_validated: true });
};

/**
 * Deletes a finding by ID.
 * @param {(findingId: string) => void} deleteFinding - Callback to delete the finding.
 * @param {string} findingId - The ID of the finding to delete.
 * @returns {void}
 */
export const handleDeleteFinding = (deleteFinding: (findingId: string) => void, findingId: string) => {
  deleteFinding(findingId);
};

/**
 * Adds a screenshot to a finding with the given storage path and alt text.
 * @param {(findingId: string, storagePath: string, altText: string) => void} addScreenshot - Callback to add the screenshot.
 * @param {string} findingId - The ID of the finding to attach the screenshot to.
 * @param {string} storagePath - The storage path of the uploaded screenshot.
 * @param {string} altText - The alt text for the screenshot.
 * @returns {void}
 */
export const handleScreenshotUpload = (
  addScreenshot: (findingId: string, storagePath: string, altText: string) => void,
  findingId: string,
  storagePath: string,
  altText: string,
) => {
  addScreenshot(findingId, storagePath, altText);
};
