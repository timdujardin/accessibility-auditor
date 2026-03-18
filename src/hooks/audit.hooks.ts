'use client';

import type { AuditListRow, AuditRow } from '@/services/audit.service';

import { useCallback, useEffect } from 'react';

import { useGetItem, useGetList } from '@/hooks/api.hooks';
import {
  getAllAudits,
  getAuditFull,
  getAuditsByUser,
  updateAudit as updateAuditService,
} from '@/services/audit.service';

export type { AuditRow, AuditListRow };

/**
 * Fetches and manages a single audit with its sample pages and technologies.
 * @param {string | null} auditId - The audit ID to fetch, or null to skip.
 * @returns {{ audit: AuditRow | null, samplePages: SamplePageRow[], technologies: string[], isLoading: boolean, refetch: Function, updateAudit: Function }} Audit data and controls.
 */
export const useAudit = (auditId: string | null) => {
  const { response, getItem: fetchAudit, status } = useGetItem(getAuditFull);
  const isLoading = status === 'loading' || status === 'idle';

  useEffect(() => {
    if (auditId) {
      fetchAudit(auditId);
    }
  }, [auditId, fetchAudit]);

  const updateAudit = useCallback(
    async (updates: Partial<AuditRow>) => {
      if (!auditId) {
        return;
      }
      await updateAuditService(auditId, updates);
      if (auditId) {
        fetchAudit(auditId);
      }
    },
    [auditId, fetchAudit],
  );

  return {
    audit: response?.audit ?? null,
    samplePages: response?.samplePages ?? [],
    technologies: response?.technologies ?? [],
    isLoading,
    refetch: () => {
      if (auditId) {
        fetchAudit(auditId);
      }
    },
    updateAudit,
  };
};

/**
 * Fetches a list of audits, either all (for admins) or filtered by user.
 * @param {string | null} userId - The user ID to filter by, or null to skip.
 * @param {boolean} [isAdmin=false] - Whether to fetch all audits instead of user-specific ones.
 * @returns {{ audits: AuditListRow[], isLoading: boolean }} The audit list and loading state.
 */
export const useAudits = (userId: string | null, isAdmin = false) => {
  const allAuditsHook = useGetList(getAllAudits);
  const userAuditsHook = useGetList(getAuditsByUser);

  const activeHook = isAdmin ? allAuditsHook : userAuditsHook;
  const isLoading = activeHook.status === 'loading' || activeHook.status === 'idle';

  useEffect(() => {
    if (!userId) {
      return;
    }

    if (isAdmin) {
      allAuditsHook.getList();
    } else {
      userAuditsHook.getList(userId);
    }
  }, [userId, isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps -- only re-fetch when userId/isAdmin changes

  return { audits: activeHook.response ?? [], isLoading };
};
