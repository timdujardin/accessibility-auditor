import type { AppDispatch } from '@/redux/store';
import type { ImportedAudit } from '@/utils/earlTransform.util';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { loadImportedAudit } from '@/redux/slices/audit';
import { parseEarlFile } from '@/utils/earlTransform.util';

/**
 * Parses the selected EARL/JSON-LD file and updates the imported audit state.
 * Supports both old step-based and WCAG-EM Report Tool v3 formats.
 * @param {(error: string | null) => void} setParseError - Callback to set parse errors.
 * @param {(audit: ImportedAudit | null) => void} setImportedAudit - Callback to set the parsed audit.
 * @param {FileList | null} files - The file list from the file input.
 * @returns {Promise<void>} Resolves when parsing completes or fails.
 */
export const handleFileSelect = async (
  setParseError: (error: string | null) => void,
  setImportedAudit: (audit: ImportedAudit | null) => void,
  files: FileList | null,
) => {
  if (!files || files.length === 0) {
    return;
  }
  setParseError(null);
  setImportedAudit(null);

  const file = files[0];
  try {
    const text = await file.text();
    const data: unknown = JSON.parse(text);
    const parsed = parseEarlFile(data);
    setImportedAudit(parsed);
  } catch {
    setParseError('Failed to parse the uploaded file. Make sure it is a valid EARL/JSON-LD evaluation file.');
  }
};

/**
 * Loads the parsed audit into Redux state and navigates to the wizard dashboard.
 * @param {ImportedAudit | null} importedAudit - The parsed audit to load.
 * @param {AppDispatch} dispatch - Redux dispatch function.
 * @param {AppRouterInstance} router - Next.js router for navigation.
 */
export const handleImport = (importedAudit: ImportedAudit | null, dispatch: AppDispatch, router: AppRouterInstance) => {
  if (!importedAudit) {
    return;
  }

  dispatch(loadImportedAudit(importedAudit));
  router.push('/audits/new');
};
