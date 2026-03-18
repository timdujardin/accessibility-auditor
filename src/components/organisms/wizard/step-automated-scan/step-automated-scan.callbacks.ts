import type { AxeViolation } from '@/@types/scan';

import type { SamplePage } from './step-automated-scan.types';

type ScanPageFn = (pageId: string, pageTitle: string, url: string) => Promise<{ violations: AxeViolation[] } | null>;
type OnScanCompleteFn = (pageId: string, violations: AxeViolation[]) => void;

/**
 * Scans a single sample page and invokes the completion callback with any violations.
 * @param {SamplePage} page - The sample page to scan.
 * @param {ScanPageFn} scanPage - Async function that performs the scan.
 * @param {OnScanCompleteFn | undefined} onScanComplete - Optional callback invoked with page ID and violations when scan completes.
 * @returns {Promise<void>} Resolves when the scan completes.
 */
export const handleScanPage = async (
  page: SamplePage,
  scanPage: ScanPageFn,
  onScanComplete: OnScanCompleteFn | undefined,
) => {
  const result = await scanPage(page.id, page.title, page.url);
  if (result && onScanComplete) {
    onScanComplete(page.id, result.violations);
  }
};

/**
 * Scans all scannable pages sequentially via the provided callback.
 * @param {SamplePage[]} scannablePages - Array of sample pages to scan.
 * @param {(page: SamplePage) => Promise<void>} scanPageCallback - Async callback invoked for each page.
 * @returns {Promise<void>} Resolves when all pages have been scanned.
 */
export const handleScanAll = async (
  scannablePages: SamplePage[],
  scanPageCallback: (page: SamplePage) => Promise<void>,
) => {
  for (const page of scannablePages) {
    await scanPageCallback(page);
  }
};
