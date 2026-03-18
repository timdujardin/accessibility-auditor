import type { RemediationRow } from '@/utils/prioritization.util';

import { exportRemediationToCsv } from '@/utils/prioritization.util';

/**
 * Invokes the update callback with the new contact data.
 * @param {(data: { ownerContactPhone?: string; ownerContactEmail?: string; ownerContactAddress?: string }) => void} onUpdate - Callback to persist contact changes.
 * @param {{ ownerContactPhone?: string; ownerContactEmail?: string; ownerContactAddress?: string }} data - The updated contact fields.
 * @returns {void}
 */
export const handleContactChange = (
  onUpdate: (data: { ownerContactPhone?: string; ownerContactEmail?: string; ownerContactAddress?: string }) => void,
  data: { ownerContactPhone?: string; ownerContactEmail?: string; ownerContactAddress?: string },
) => {
  onUpdate(data);
};

/**
 * Exports remediation rows to a CSV file and triggers a download.
 * @param {RemediationRow[]} remediationRows - The remediation backlog rows to export.
 * @returns {void}
 */
export const handleExportCsv = (remediationRows: RemediationRow[]) => {
  const csv = exportRemediationToCsv(remediationRows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'remediation-backlog.csv';
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Exports remediation rows to CSV and copies the result to the clipboard.
 * @param {RemediationRow[]} remediationRows - The remediation backlog rows to export.
 * @param {(text: string) => void} copyToClipboard - Function to copy text to the clipboard.
 * @returns {void}
 */
export const handleCopyBacklog = (remediationRows: RemediationRow[], copyToClipboard: (text: string) => void) => {
  const csv = exportRemediationToCsv(remediationRows);
  copyToClipboard(csv);
};
