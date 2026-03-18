'use client';

import type { ScanPageResultDraft } from '@/redux/slices/audit';

import { useCallback, useState } from 'react';

import { useAction } from '@/hooks/api.hooks';
import { selectScanResults, setScanResult } from '@/redux/slices/audit';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { scanPage as scanPageService } from '@/services/scan.service';

/**
 * Manages axe-core scanning state for sample pages. Tracks scan results
 * in Redux, the currently scanning page, and any errors.
 * @returns {{ results: Record<string, ScanPageResultDraft>, scanningPageId: string | null, error: ApiError | undefined, scanPage: Function }} Scan state and controls.
 */
export const useScan = () => {
  const dispatch = useAppDispatch();
  const results = useAppSelector(selectScanResults);
  const [scanningPageId, setScanningPageId] = useState<string | null>(null);
  const { action: doScan, error: scanError } = useAction(scanPageService);

  const scanPage = useCallback(
    async (pageId: string, pageTitle: string, url: string) => {
      setScanningPageId(pageId);

      try {
        const data = await doScan(url, true);
        const result: ScanPageResultDraft = {
          pageId,
          pageTitle,
          url,
          violations: data.violations,
          passesCount: data.passesCount,
          incompleteCount: data.incompleteCount,
          inapplicableCount: data.inapplicableCount,
          screenshots: data.screenshots,
          scannedAt: data.scannedAt,
        };

        dispatch(setScanResult(result));
        return result;
      } catch {
        return null;
      } finally {
        setScanningPageId(null);
      }
    },
    [doScan, dispatch],
  );

  return { results, scanningPageId, error: scanError, scanPage };
};
