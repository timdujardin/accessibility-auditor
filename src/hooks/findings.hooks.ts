'use client';

import type { EvaluationOutcome } from '@/@types/criteria';
import type { FindingPriority } from '@/@types/finding';

import { useCallback, useEffect, useState } from 'react';

import { createClient } from '@/server/api/supabase/client';

export interface AuditResultRow {
  id: string;
  audit_id: string;
  criterion_id: string;
  sample_page_id: string;
  outcome: EvaluationOutcome;
  observations: string;
}

export interface FindingRow {
  id: string;
  audit_result_id: string;
  description: string;
  recommendation: string;
  priority: FindingPriority;
  element_selector: string;
  element_html: string;
  from_automated_scan: boolean;
  auditor_validated: boolean;
  is_unresolvable: boolean;
  alternative_solution: string;
  created_at: string;
}

export interface FindingScreenshotRow {
  id: string;
  finding_id: string;
  storage_path: string;
  alt_text: string;
  uploaded_at: string;
}

/**
 * Fetches and manages audit results, findings, and screenshots from Supabase.
 * Provides CRUD operations for results, findings, and screenshots.
 * @param {string | null} auditId - The audit ID to fetch data for, or null to skip.
 * @returns {{ results: AuditResultRow[], findings: FindingRow[], screenshots: FindingScreenshotRow[], isLoading: boolean, refetch: Function, upsertResult: Function, addFinding: Function, updateFinding: Function, deleteFinding: Function, addScreenshot: Function }} Audit result data and mutation functions.
 */
export const useAuditResults = (auditId: string | null) => {
  const [results, setResults] = useState<AuditResultRow[]>([]);
  const [findings, setFindings] = useState<FindingRow[]>([]);
  const [screenshots, setScreenshots] = useState<FindingScreenshotRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchAll = useCallback(async () => {
    if (!auditId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const { data: resultsData } = await supabase.from('audit_results').select('*').eq('audit_id', auditId);

    const auditResults = resultsData ?? [];
    setResults(auditResults);

    if (auditResults.length > 0) {
      const resultIds = auditResults.map((r) => r.id);
      const { data: findingsData } = await supabase
        .from('findings')
        .select('*')
        .in('audit_result_id', resultIds)
        .order('created_at');

      const allFindings = findingsData ?? [];
      setFindings(allFindings);

      if (allFindings.length > 0) {
        const findingIds = allFindings.map((f) => f.id);
        const { data: screenshotsData } = await supabase
          .from('finding_screenshots')
          .select('*')
          .in('finding_id', findingIds);
        setScreenshots(screenshotsData ?? []);
      }
    }

    setIsLoading(false);
  }, [auditId, supabase]);

  /* eslint-disable react-you-might-not-need-an-effect/no-derived-state, react-hooks/set-state-in-effect -- async data fetching on mount */
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);
  /* eslint-enable react-you-might-not-need-an-effect/no-derived-state, react-hooks/set-state-in-effect */

  const upsertResult = useCallback(
    async (criterionId: string, samplePageId: string, outcome: EvaluationOutcome, observations: string) => {
      if (!auditId) {
        return null;
      }

      const existing = results.find((r) => r.criterion_id === criterionId && r.sample_page_id === samplePageId);

      if (existing) {
        await supabase.from('audit_results').update({ outcome, observations }).eq('id', existing.id);
        setResults((prev) => prev.map((r) => (r.id === existing.id ? { ...r, outcome, observations } : r)));
        return existing.id;
      }

      const { data } = await supabase
        .from('audit_results')
        .insert({ audit_id: auditId, criterion_id: criterionId, sample_page_id: samplePageId, outcome, observations })
        .select('id')
        .single();

      if (data) {
        const newResult: AuditResultRow = {
          id: data.id,
          audit_id: auditId,
          criterion_id: criterionId,
          sample_page_id: samplePageId,
          outcome,
          observations,
        };
        setResults((prev) => [...prev, newResult]);
      }

      return data?.id ?? null;
    },
    [auditId, results, supabase],
  );

  const addFinding = useCallback(
    async (auditResultId: string, finding: Omit<FindingRow, 'id' | 'audit_result_id' | 'created_at'>) => {
      const { data } = await supabase
        .from('findings')
        .insert({ audit_result_id: auditResultId, ...finding })
        .select('*')
        .single();

      if (data) {
        setFindings((prev) => [...prev, data]);
      }

      return data;
    },
    [supabase],
  );

  const updateFinding = useCallback(
    async (findingId: string, updates: Partial<FindingRow>) => {
      await supabase.from('findings').update(updates).eq('id', findingId);
      setFindings((prev) => prev.map((f) => (f.id === findingId ? { ...f, ...updates } : f)));
    },
    [supabase],
  );

  const deleteFinding = useCallback(
    async (findingId: string) => {
      await supabase.from('findings').delete().eq('id', findingId);
      setFindings((prev) => prev.filter((f) => f.id !== findingId));
      setScreenshots((prev) => prev.filter((s) => s.finding_id !== findingId));
    },
    [supabase],
  );

  const addScreenshot = useCallback(
    async (findingId: string, storagePath: string, altText: string) => {
      const { data } = await supabase
        .from('finding_screenshots')
        .insert({ finding_id: findingId, storage_path: storagePath, alt_text: altText })
        .select('*')
        .single();

      if (data) {
        setScreenshots((prev) => [...prev, data]);
      }

      return data;
    },
    [supabase],
  );

  return {
    results,
    findings,
    screenshots,
    isLoading,
    refetch: fetchAll,
    upsertResult,
    addFinding,
    updateFinding,
    deleteFinding,
    addScreenshot,
  };
};
