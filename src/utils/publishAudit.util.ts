import type { User } from '@/@types/user';
import type { AuditWizardState, FindingScreenshotDraft } from '@/redux/slices/audit';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabase } from '@/services/api.service';

export interface PublishResult {
  auditId: string;
}

export interface PublishError {
  error: string;
}

type IdMapping = Map<string, string>;

const insertSamplePages = async (
  supabase: SupabaseClient,
  auditId: string,
  state: AuditWizardState,
): Promise<IdMapping | PublishError> => {
  const mapping: IdMapping = new Map();

  if (state.samplePages.length === 0) {
    return mapping;
  }

  const { data, error } = await supabase
    .from('sample_pages')
    .insert(
      state.samplePages.map((sp, i) => ({
        audit_id: auditId,
        title: sp.title,
        url: sp.url,
        description: sp.description,
        sample_type: sp.sampleType,
        audit_mode: sp.auditMode,
        is_tested: sp.isTested,
        sort_order: i,
      })),
    )
    .select('id');

  if (error) {
    return { error: `Failed to insert sample pages: ${error.message}` };
  }

  const insertedPages = data as { id: string }[] | null;
  if (insertedPages) {
    state.samplePages.forEach((sp, i) => {
      if (insertedPages[i]) {
        mapping.set(sp.id, insertedPages[i].id);
      }
    });
  }

  return mapping;
};

const insertTechnologies = async (
  supabase: SupabaseClient,
  auditId: string,
  technologies: string[],
): Promise<PublishError | null> => {
  if (technologies.length === 0) {
    return null;
  }

  const { error } = await supabase
    .from('audit_technologies')
    .insert(technologies.map((techName) => ({ audit_id: auditId, technology_name: techName })));

  if (error) {
    return { error: `Failed to insert technologies: ${error.message}` };
  }

  return null;
};

const insertAuditResults = async (
  supabase: SupabaseClient,
  auditId: string,
  state: AuditWizardState,
  pageIdMapping: IdMapping,
): Promise<IdMapping | PublishError> => {
  const mapping: IdMapping = new Map();

  if (state.auditResults.length === 0) {
    return mapping;
  }

  const { data, error } = await supabase
    .from('audit_results')
    .insert(
      state.auditResults.map((r) => ({
        audit_id: auditId,
        criterion_id: r.criterionId,
        sample_page_id: pageIdMapping.get(r.samplePageId) ?? r.samplePageId,
        outcome: r.outcome,
        observations: r.observations,
      })),
    )
    .select('id');

  if (error) {
    return { error: `Failed to insert audit results: ${error.message}` };
  }

  const insertedResults = data as { id: string }[] | null;
  if (insertedResults) {
    state.auditResults.forEach((r, i) => {
      if (insertedResults[i]) {
        mapping.set(r.id, insertedResults[i].id);
      }
    });
  }

  return mapping;
};

const insertFindings = async (
  supabase: SupabaseClient,
  state: AuditWizardState,
  resultIdMapping: IdMapping,
): Promise<IdMapping | PublishError> => {
  const mapping: IdMapping = new Map();

  if (state.findings.length === 0) {
    return mapping;
  }

  const { data, error } = await supabase
    .from('findings')
    .insert(
      state.findings.map((f) => ({
        audit_result_id: resultIdMapping.get(f.auditResultId) ?? f.auditResultId,
        description: f.description,
        recommendation: f.recommendation,
        priority: f.priority,
        element_selector: f.elementSelector,
        element_html: f.elementHtml,
        from_automated_scan: f.fromAutomatedScan,
        auditor_validated: f.auditorValidated,
        is_unresolvable: f.isUnresolvable,
        alternative_solution: f.alternativeSolution,
      })),
    )
    .select('id');

  if (error) {
    return { error: `Failed to insert findings: ${error.message}` };
  }

  const insertedFindings = data as { id: string }[] | null;
  if (insertedFindings) {
    state.findings.forEach((f, i) => {
      if (insertedFindings[i]) {
        mapping.set(f.id, insertedFindings[i].id);
      }
    });
  }

  return mapping;
};

const decodeDataUrl = (dataUrl: string): { bytes: Uint8Array; contentType: string; ext: string } | null => {
  const base64Data = dataUrl.split(',')[1];
  if (!base64Data) {
    return null;
  }

  const mimeRegex = /data:([^;]+)/;
  const mimeMatch = mimeRegex.exec(dataUrl);
  const contentType = mimeMatch?.[1] ?? 'image/png';
  const ext = contentType.split('/')[1] ?? 'png';

  const binaryStr = atob(base64Data);
  const bytes = new Uint8Array(binaryStr.length);
  for (let j = 0; j < binaryStr.length; j++) {
    bytes[j] = binaryStr.charCodeAt(j);
  }

  return { bytes, contentType, ext };
};

const uploadScreenshots = async (
  supabase: SupabaseClient,
  screenshots: FindingScreenshotDraft[],
  findingIdMapping: IdMapping,
): Promise<void> => {
  for (const screenshot of screenshots) {
    const dbFindingId = findingIdMapping.get(screenshot.findingId) ?? screenshot.findingId;

    if (!screenshot.dataUrl.startsWith('data:')) {
      continue;
    }

    const decoded = decodeDataUrl(screenshot.dataUrl);
    if (!decoded) {
      continue;
    }

    const path = `${dbFindingId}/${Date.now()}.${decoded.ext}`;
    const { error: uploadError } = await supabase.storage
      .from('finding-screenshots')
      .upload(path, decoded.bytes, { contentType: decoded.contentType });

    if (!uploadError) {
      await supabase.from('finding_screenshots').insert({
        finding_id: dbFindingId,
        storage_path: path,
        alt_text: screenshot.altText,
      });
    }
  }
};

const isPublishError = (value: unknown): value is PublishError => {
  return typeof value === 'object' && value !== null && 'error' in value;
};

/**
 * Publishes the full audit wizard state to Supabase, creating all related records
 * (audit, sample pages, technologies, results, findings, screenshots).
 * @param {User} user - The authenticated user performing the publish.
 * @param {AuditWizardState} state - The complete audit wizard Redux state to persist.
 * @returns {Promise<PublishResult | PublishError>} The new audit ID on success, or an error message.
 */
export const publishAudit = async (user: User, state: AuditWizardState): Promise<PublishResult | PublishError> => {
  const supabase = getSupabase();

  const { data, error: auditError } = await supabase
    .from('audits')
    .insert({
      auditor_id: user.id,
      title: state.title,
      commissioner: state.commissioner,
      audit_type: state.auditType,
      audit_scope: state.auditScope,
      accessibility_baseline: state.accessibilityBaseline,
      executive_summary: state.executiveSummary,
      statement_guidance: state.statementGuidance,
      owner_contact_phone: state.ownerContactPhone,
      owner_contact_email: state.ownerContactEmail,
      owner_contact_address: state.ownerContactAddress,
      status: 'in_progress',
    })
    .select('id')
    .single();

  const newAudit = data as { id: string } | null;

  if (auditError || !newAudit) {
    return { error: (auditError as { message: string } | null)?.message ?? 'Failed to create audit' };
  }

  const auditId = newAudit.id;

  const pageMapping = await insertSamplePages(supabase, auditId, state);
  if (isPublishError(pageMapping)) {
    return pageMapping;
  }

  const techError = await insertTechnologies(supabase, auditId, state.technologies);
  if (techError) {
    return techError;
  }

  const resultMapping = await insertAuditResults(supabase, auditId, state, pageMapping);
  if (isPublishError(resultMapping)) {
    return resultMapping;
  }

  const findingMapping = await insertFindings(supabase, state, resultMapping);
  if (isPublishError(findingMapping)) {
    return findingMapping;
  }

  if (state.screenshots.length > 0) {
    await uploadScreenshots(supabase, state.screenshots, findingMapping);
  }

  await supabase.from('audits').update({ status: 'completed' }).eq('id', auditId);

  return { auditId };
};
