'use client';

import type { EvaluationOutcome } from '@/@types/criteria';
import type { AuditResultRow, FindingRow, FindingScreenshotRow } from '@/hooks/findings.hooks';
import type { FindingDraft } from '@/redux/slices/audit';

import { useCallback, useMemo } from 'react';

import {
  addFinding as addFindingAction,
  addScreenshot as addScreenshotAction,
  deleteFinding as deleteFindingAction,
  selectAuditResults,
  selectFindings,
  selectScreenshots,
  updateFinding as updateFindingAction,
  upsertAuditResult,
} from '@/redux/slices/audit';
import { useAppDispatch, useAppSelector } from '@/redux/store';

const toResultRow = (
  draft: { id: string; criterionId: string; samplePageId: string; outcome: EvaluationOutcome; observations: string },
  auditId: string,
): AuditResultRow => {
  return {
    id: draft.id,
    audit_id: auditId,
    criterion_id: draft.criterionId,
    sample_page_id: draft.samplePageId,
    outcome: draft.outcome,
    observations: draft.observations,
  };
};

const toFindingRow = (draft: FindingDraft): FindingRow => {
  return {
    id: draft.id,
    audit_result_id: draft.auditResultId,
    description: draft.description,
    recommendation: draft.recommendation,
    priority: draft.priority,
    element_selector: draft.elementSelector,
    element_html: draft.elementHtml,
    from_automated_scan: draft.fromAutomatedScan,
    auditor_validated: draft.auditorValidated,
    is_unresolvable: draft.isUnresolvable,
    alternative_solution: draft.alternativeSolution,
    created_at: draft.createdAt,
  };
};

const toScreenshotRow = (draft: {
  id: string;
  findingId: string;
  dataUrl: string;
  altText: string;
}): FindingScreenshotRow => {
  return {
    id: draft.id,
    finding_id: draft.findingId,
    storage_path: draft.dataUrl,
    alt_text: draft.altText,
    uploaded_at: new Date().toISOString(),
  };
};

/**
 * Provides audit results, findings, and screenshots from local Redux state
 * instead of Supabase. Used during the wizard flow before publishing.
 * @returns {{ results: AuditResultRow[], findings: FindingRow[], screenshots: FindingScreenshotRow[], isLoading: boolean, refetch: Function, upsertResult: Function, addFinding: Function, updateFinding: Function, deleteFinding: Function, addScreenshot: Function }} Local audit data and mutation functions matching the Supabase hook interface.
 */
export const useLocalAuditResults = () => {
  const rawResults = useAppSelector(selectAuditResults);
  const rawFindings = useAppSelector(selectFindings);
  const rawScreenshots = useAppSelector(selectScreenshots);
  const auditId = useAppSelector((s) => s.audit.savedAuditId) ?? '';
  const dispatch = useAppDispatch();

  const results: AuditResultRow[] = useMemo(
    () => rawResults.map((r) => toResultRow(r, auditId)),
    [rawResults, auditId],
  );

  const findings: FindingRow[] = useMemo(() => rawFindings.map(toFindingRow), [rawFindings]);

  const screenshots: FindingScreenshotRow[] = useMemo(() => rawScreenshots.map(toScreenshotRow), [rawScreenshots]);

  const upsertResult = useCallback(
    (criterionId: string, samplePageId: string, outcome: EvaluationOutcome, observations: string): string | null => {
      dispatch(upsertAuditResult({ criterionId, samplePageId, outcome, observations }));
      const existing = rawResults.find((r) => r.criterionId === criterionId && r.samplePageId === samplePageId);

      return existing?.id ?? null;
    },
    [dispatch, rawResults],
  );

  const addFinding = useCallback(
    (auditResultId: string, finding: Omit<FindingRow, 'id' | 'audit_result_id' | 'created_at'>) => {
      dispatch(
        addFindingAction({
          auditResultId,
          finding: {
            description: finding.description,
            recommendation: finding.recommendation,
            priority: finding.priority,
            elementSelector: finding.element_selector,
            elementHtml: finding.element_html,
            fromAutomatedScan: finding.from_automated_scan,
            auditorValidated: finding.auditor_validated,
            isUnresolvable: finding.is_unresolvable,
            alternativeSolution: finding.alternative_solution,
          },
        }),
      );
    },
    [dispatch],
  );

  const updateFinding = useCallback(
    (findingId: string, updates: Partial<FindingRow>) => {
      const camelUpdates: Partial<FindingDraft> = {};
      if (updates.description !== undefined) {
        camelUpdates.description = updates.description;
      }
      if (updates.recommendation !== undefined) {
        camelUpdates.recommendation = updates.recommendation;
      }
      if (updates.priority !== undefined) {
        camelUpdates.priority = updates.priority;
      }
      if (updates.element_selector !== undefined) {
        camelUpdates.elementSelector = updates.element_selector;
      }
      if (updates.element_html !== undefined) {
        camelUpdates.elementHtml = updates.element_html;
      }
      if (updates.from_automated_scan !== undefined) {
        camelUpdates.fromAutomatedScan = updates.from_automated_scan;
      }
      if (updates.auditor_validated !== undefined) {
        camelUpdates.auditorValidated = updates.auditor_validated;
      }
      if (updates.is_unresolvable !== undefined) {
        camelUpdates.isUnresolvable = updates.is_unresolvable;
      }
      if (updates.alternative_solution !== undefined) {
        camelUpdates.alternativeSolution = updates.alternative_solution;
      }
      dispatch(updateFindingAction({ findingId, updates: camelUpdates }));
    },
    [dispatch],
  );

  const deleteFinding = useCallback(
    (findingId: string) => {
      dispatch(deleteFindingAction(findingId));
    },
    [dispatch],
  );

  const addScreenshot = useCallback(
    (findingId: string, storagePath: string, altText: string) => {
      dispatch(
        addScreenshotAction({
          id: crypto.randomUUID(),
          findingId,
          dataUrl: storagePath,
          altText,
        }),
      );
    },
    [dispatch],
  );

  return {
    results,
    findings,
    screenshots,
    isLoading: false,
    refetch: () => {},
    upsertResult,
    addFinding,
    updateFinding,
    deleteFinding,
    addScreenshot,
  };
};
