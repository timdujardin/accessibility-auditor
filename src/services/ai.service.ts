import { apiFetch } from '@/services/api.service';

interface SummaryStats {
  totalFindings: number;
  findingsByPriority: Record<string, number>;
  conformancePercentage: number;
}

interface SummaryResponse {
  summary: string;
}

/**
 * Generates an AI-powered executive summary for an audit via the API.
 * @param {string} auditTitle - The title of the audit.
 * @param {string} auditScope - The human-readable scope label.
 * @param {SummaryStats} stats - The audit statistics (findings count, conformance, etc.).
 * @returns {Promise<string>} The generated executive summary text.
 */
export const generateSummary = async (auditTitle: string, auditScope: string, stats: SummaryStats): Promise<string> => {
  const data = await apiFetch<SummaryResponse>('/api/ai/summary', {
    method: 'POST',
    body: JSON.stringify({ auditTitle, auditScope, stats }),
  });

  return data.summary;
};
