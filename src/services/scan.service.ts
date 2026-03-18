import type { AxeViolation } from '@/@types/scan';

import { apiFetch } from '@/services/api.service';

interface ScanApiResponse {
  violations?: AxeViolation[];
  passes?: number;
  incomplete?: number;
  inapplicable?: number;
  screenshots?: Record<string, string>;
  scannedAt?: string;
}

export interface ScanPageResult {
  violations: AxeViolation[];
  passesCount: number;
  incompleteCount: number;
  inapplicableCount: number;
  screenshots: Record<string, string>;
  scannedAt: string;
}

/**
 * Runs an axe-core accessibility scan on a URL via the API.
 * @param {string} url - The URL of the page to scan.
 * @param {boolean} [captureScreenshots=true] - Whether to capture screenshots during the scan.
 * @returns {Promise<ScanPageResult>} The scan results including violations, passes, and screenshots.
 */
export const scanPage = async (url: string, captureScreenshots = true): Promise<ScanPageResult> => {
  const data = await apiFetch<ScanApiResponse>('/api/scan', {
    method: 'POST',
    body: JSON.stringify({ url, captureScreenshots }),
  });

  return {
    violations: data.violations ?? [],
    passesCount: data.passes ?? 0,
    incompleteCount: data.incomplete ?? 0,
    inapplicableCount: data.inapplicable ?? 0,
    screenshots: data.screenshots ?? {},
    scannedAt: data.scannedAt ?? new Date().toISOString(),
  };
};
