import type { AuditScope, AuditStatus } from '@/@types/audit';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabase } from '@/services/api.service';

export interface AuditRow {
  id: string;
  auditor_id: string;
  title: string;
  commissioner: string;
  audit_type: string;
  audit_scope: AuditScope;
  accessibility_baseline: string;
  executive_summary: string;
  statement_guidance: string;
  owner_contact_phone: string;
  owner_contact_email: string;
  owner_contact_address: string;
  status: AuditStatus;
  earl_metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface AuditListRow {
  id: string;
  title: string;
  commissioner: string;
  audit_type?: string;
  audit_scope: AuditScope;
  status: AuditStatus;
  created_at: string;
  updated_at: string;
}

export interface SamplePageRow {
  id: string;
  audit_id: string;
  title: string;
  url: string;
  description: string;
  sample_type: string;
  audit_mode: string;
  is_tested: boolean;
  sort_order: number;
}

/**
 * Fetches the most recently updated audits.
 * @param {SupabaseClient} [supabase] - Optional Supabase client (defaults to browser client).
 * @param {number} [limit=10] - Maximum number of audits to return.
 * @returns {Promise<AuditListRow[]>} The recent audits sorted by last update.
 */
export const getRecentAudits = async (supabase?: SupabaseClient, limit = 10): Promise<AuditListRow[]> => {
  const client = supabase ?? getSupabase();
  const { data } = await client
    .from('audits')
    .select('id, title, commissioner, audit_scope, status, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(limit);

  return (data as AuditListRow[] | null) ?? [];
};

/**
 * Fetches all audits sorted by last update.
 * @param {SupabaseClient} [supabase] - Optional Supabase client (defaults to browser client).
 * @returns {Promise<AuditListRow[]>} All audits in the database.
 */
export const getAllAudits = async (supabase?: SupabaseClient): Promise<AuditListRow[]> => {
  const client = supabase ?? getSupabase();
  const { data } = await client
    .from('audits')
    .select('id, title, commissioner, audit_type, audit_scope, status, created_at, updated_at')
    .order('updated_at', { ascending: false });

  return (data as AuditListRow[] | null) ?? [];
};

/**
 * Fetches all audits belonging to a specific user.
 * @param {string} userId - The auditor's user ID.
 * @param {SupabaseClient} [supabase] - Optional Supabase client (defaults to browser client).
 * @returns {Promise<AuditListRow[]>} The user's audits sorted by last update.
 */
export const getAuditsByUser = async (userId: string, supabase?: SupabaseClient): Promise<AuditListRow[]> => {
  const client = supabase ?? getSupabase();
  const { data } = await client
    .from('audits')
    .select('id, title, commissioner, audit_type, audit_scope, status, created_at, updated_at')
    .eq('auditor_id', userId)
    .order('updated_at', { ascending: false });

  return (data as AuditListRow[] | null) ?? [];
};

/**
 * Fetches a single audit by its ID with all fields.
 * @param {string} id - The audit ID to look up.
 * @param {SupabaseClient} [supabase] - Optional Supabase client (defaults to browser client).
 * @returns {Promise<AuditRow | null>} The audit row, or null if not found.
 */
export const getAuditById = async (id: string, supabase?: SupabaseClient): Promise<AuditRow | null> => {
  const client = supabase ?? getSupabase();
  const { data } = await client.from('audits').select('*').eq('id', id).single();

  return data as AuditRow | null;
};

/**
 * Fetches all sample pages for an audit, ordered by sort order.
 * @param {string} auditId - The audit ID to fetch pages for.
 * @param {SupabaseClient} [supabase] - Optional Supabase client (defaults to browser client).
 * @returns {Promise<SamplePageRow[]>} The sample pages belonging to the audit.
 */
export const getSamplePages = async (auditId: string, supabase?: SupabaseClient): Promise<SamplePageRow[]> => {
  const client = supabase ?? getSupabase();
  const { data } = await client.from('sample_pages').select('*').eq('audit_id', auditId).order('sort_order');

  return (data as SamplePageRow[] | null) ?? [];
};

/**
 * Updates the status of an audit (e.g. draft, in_progress, completed).
 * @param {string} id - The audit ID to update.
 * @param {AuditStatus} status - The new status value.
 * @returns {Promise<void>}
 */
export const updateAuditStatus = async (id: string, status: AuditStatus): Promise<void> => {
  const supabase = getSupabase();
  await supabase.from('audits').update({ status }).eq('id', id);
};

/**
 * Partially updates an audit's fields.
 * @param {string} id - The audit ID to update.
 * @param {Partial<AuditRow>} updates - The fields to update.
 * @returns {Promise<void>}
 */
export const updateAudit = async (id: string, updates: Partial<AuditRow>): Promise<void> => {
  const supabase = getSupabase();
  await supabase.from('audits').update(updates).eq('id', id);
};

/**
 * Fetches an audit and its sample pages in a single parallel query.
 * @param {string} id - The audit ID.
 * @param {SupabaseClient} [supabase] - Optional Supabase client (defaults to browser client).
 * @returns {Promise<{ audit: AuditRow | null; samplePages: SamplePageRow[] }>} The audit and its pages.
 */
export const getAuditWithPages = async (
  id: string,
  supabase?: SupabaseClient,
): Promise<{ audit: AuditRow | null; samplePages: SamplePageRow[] }> => {
  const client = supabase ?? getSupabase();
  const [{ data: auditData }, { data: pagesData }] = await Promise.all([
    client.from('audits').select('*').eq('id', id).single(),
    client.from('sample_pages').select('*').eq('audit_id', id).order('sort_order'),
  ]);

  return {
    audit: auditData as AuditRow | null,
    samplePages: (pagesData as SamplePageRow[] | null) ?? [],
  };
};

/**
 * Fetches an audit with its sample pages and technologies in a single parallel query.
 * @param {string} auditId - The audit ID.
 * @param {SupabaseClient} [supabase] - Optional Supabase client (defaults to browser client).
 * @returns {Promise<{ audit: AuditRow | null; samplePages: SamplePageRow[]; technologies: string[] }>} The full audit data.
 */
export const getAuditFull = async (
  auditId: string,
  supabase?: SupabaseClient,
): Promise<{
  audit: AuditRow | null;
  samplePages: SamplePageRow[];
  technologies: string[];
}> => {
  const client = supabase ?? getSupabase();
  const [{ data: auditData }, { data: pagesData }, { data: techData }] = await Promise.all([
    client.from('audits').select('*').eq('id', auditId).single(),
    client.from('sample_pages').select('*').eq('audit_id', auditId).order('sort_order'),
    client.from('audit_technologies').select('technology_name').eq('audit_id', auditId),
  ]);

  return {
    audit: auditData as AuditRow | null,
    samplePages: (pagesData as SamplePageRow[] | null) ?? [],
    technologies: ((techData as { technology_name: string }[] | null) ?? []).map((t) => t.technology_name),
  };
};
