import type { AuditScope } from '@/@types/audit';
import type { EarlEvaluation, WcagEmAssertion, WcagEmEvaluation, WcagEmModeObject } from '@/@types/earl';

import { toArray } from '@/@types/earl';

import { WCAG_CRITERIA } from '@/../config/wcag.config';

const CONFORMANCE_LEVEL_MAP: Record<string, string> = {
  'http://www.w3.org/WAI/WCAG2A-Conformance': 'A',
  'http://www.w3.org/WAI/WCAG2AA-Conformance': 'AA',
  'http://www.w3.org/WAI/WCAG2AAA-Conformance': 'AAA',
};

const EARL_OUTCOME_MAP: Record<string, string> = {
  'earl:passed': 'passed',
  'earl:failed': 'failed',
  'earl:inapplicable': 'inapplicable',
  'earl:cantTell': 'cantTell',
  'earl:untested': 'untested',
};

const WCAG_SC_ID_REGEX = /WCAG2[012]?:#?(.+)/;

const CRITERION_ID_REGEX = /^\d+\.\d+\.\d+$/;

/**
 * Reverse lookup from WCAG criterion URL fragment to criterion ID.
 * Built from WCAG_CRITERIA[].url by extracting the filename without .html.
 */
const WCAG_FRAGMENT_TO_ID: Record<string, string> = Object.fromEntries(
  WCAG_CRITERIA.map((c) => {
    const fragment = c.url.split('/').pop()?.replace('.html', '') ?? '';

    return [fragment, c.id];
  }),
);

export interface ImportedAudit {
  title: string;
  commissioner: string;
  evaluator?: string;
  scope: AuditScope;
  conformanceTarget: string;
  accessibilityBaseline: string;
  samplePages: Array<{
    title: string;
    url: string;
    id: string;
  }>;
  results: Array<{
    criterionId: string;
    samplePageId: string;
    outcome: string;
    description: string;
    mode: string;
  }>;
  technologies: Array<{ name: string; url: string }>;
  rawMetadata: unknown;
}

/**
 * Maps old WCAG 2.0 anchor names to criterion IDs.
 * @param {string} anchor - The anchor name from the old format.
 * @returns {string | null} The criterion ID or null if not found.
 */
const wcagAnchorToCriterionId = (anchor: string): string | null => {
  const mapping: Record<string, string> = {
    'text-equiv-all': '1.1.1',
    'media-equiv-av-only-alt': '1.2.1',
    'media-equiv-captions': '1.2.2',
    'media-equiv-audio-desc': '1.2.3',
    'media-equiv-real-time-captions': '1.2.4',
    'media-equiv-audio-desc-only': '1.2.5',
    'content-structure-separation-programmatic': '1.3.1',
    'content-structure-separation-sequence': '1.3.2',
    'content-structure-separation-understanding': '1.3.3',
    'visual-audio-contrast-without-color': '1.4.1',
    'visual-audio-contrast-dis-audio': '1.4.2',
    'visual-audio-contrast-contrast': '1.4.3',
    'visual-audio-contrast-scale': '1.4.4',
    'visual-audio-contrast-text-presentation': '1.4.5',
    'keyboard-operation-keyboard-operable': '2.1.1',
    'keyboard-operation-trapping': '2.1.2',
    'time-limits-required-behaviors': '2.2.1',
    'time-limits-pause': '2.2.2',
    'seizure-does-not-violate': '2.3.1',
    'navigation-mechanisms-skip': '2.4.1',
    'navigation-mechanisms-title': '2.4.2',
    'navigation-mechanisms-focus-order': '2.4.3',
    'navigation-mechanisms-refs': '2.4.4',
    'navigation-mechanisms-mult-loc': '2.4.5',
    'navigation-mechanisms-descriptive': '2.4.6',
    'navigation-mechanisms-focus-visible': '2.4.7',
    'meaning-doc-lang-id': '3.1.1',
    'meaning-other-lang-id': '3.1.2',
    'consistent-behavior-receive-focus': '3.2.1',
    'consistent-behavior-unpredictable-change': '3.2.2',
    'consistent-behavior-consistent-locations': '3.2.3',
    'consistent-behavior-consistent-functionality': '3.2.4',
    'minimize-error-identified': '3.3.1',
    'minimize-error-cues': '3.3.2',
    'minimize-error-suggestions': '3.3.3',
    'minimize-error-reversible': '3.3.4',
    'ensure-compat-parses': '4.1.1',
    'ensure-compat-rsv': '4.1.2',
  };

  return mapping[anchor] ?? null;
};

/**
 * Resolves a test reference string to a WCAG criterion ID.
 * Tries, in order: direct numeric ID, WCAG 2.2 fragment, old WCAG 2.0 anchor.
 * @param {string} testRef - The test reference (e.g., "WCAG22:non-text-content", "WCAG2:text-equiv-all", "1.1.1").
 * @returns {string | null} The resolved criterion ID or null.
 */
const resolveTestId = (testRef: string): string | null => {
  if (CRITERION_ID_REGEX.test(testRef)) {
    return testRef;
  }

  const match = WCAG_SC_ID_REGEX.exec(testRef);
  const fragment = match ? match[1] : testRef;

  if (WCAG_FRAGMENT_TO_ID[fragment]) {
    return WCAG_FRAGMENT_TO_ID[fragment];
  }

  return wcagAnchorToCriterionId(fragment);
};

/**
 * Parses an old-format EARL/JSON-LD evaluation (step-based keys) into a structured audit import object.
 * @param {EarlEvaluation} data - The raw EARL evaluation data from the uploaded file.
 * @returns {ImportedAudit} The parsed audit with sample pages, results, and technologies.
 */
const parseEarlEvaluation = (data: EarlEvaluation): ImportedAudit => {
  const conformanceTarget = CONFORMANCE_LEVEL_MAP[data.step1.step1b] ?? 'AA';

  let scope: AuditScope = 'full_aa';
  if (conformanceTarget === 'AAA') {
    scope = 'full_aaa';
  }

  const samplePages: ImportedAudit['samplePages'] = [];
  const structuredPages = data.step3a['WCAG2:webpagedef'];
  const randomPages = data.step3b['WCAG2:webpagedef'];

  for (const page of [...structuredPages, ...randomPages]) {
    samplePages.push({
      title: page['dct:title'],
      url: page['dct:source'],
      id: page['@id'],
    });
  }

  const results: ImportedAudit['results'] = [];
  for (const assertion of data.step4) {
    const criterionId = resolveTestId(assertion['earl:test']);

    if (!criterionId) {
      continue;
    }

    const outcome = EARL_OUTCOME_MAP[assertion['earl:result']['earl:outcome']] ?? 'untested';

    if (assertion['dct:hasPart']) {
      for (const subAssertion of assertion['dct:hasPart']) {
        const subOutcome = EARL_OUTCOME_MAP[subAssertion['earl:result']['earl:outcome']] ?? 'untested';
        results.push({
          criterionId,
          samplePageId: subAssertion['earl:subject'],
          outcome: subOutcome,
          description: subAssertion['earl:result']['dct:description'],
          mode: subAssertion['earl:mode'],
        });
      }
    } else {
      results.push({
        criterionId,
        samplePageId: assertion['earl:subject'],
        outcome,
        description: assertion['earl:result']['dct:description'],
        mode: assertion['earl:mode'],
      });
    }
  }

  const technologies = data['WCAG2:reliedupondef'].map((tech) => ({
    name: tech['dct:title'],
    url: tech['@id'],
  }));

  return {
    title: data['dct:title'],
    commissioner: data.commissioner,
    scope,
    conformanceTarget,
    accessibilityBaseline: data.step1.step1c,
    samplePages,
    results,
    technologies,
    rawMetadata: data,
  };
};

/**
 * V3 outcome IDs use the same `earl:` prefix but are nested in an object.
 */
const V3_OUTCOME_MAP: Record<string, string> = {
  'earl:passed': 'passed',
  'earl:failed': 'failed',
  'earl:inapplicable': 'inapplicable',
  'earl:cantTell': 'cantTell',
  'earl:untested': 'untested',
};

/**
 * Detects whether the parsed JSON is a WCAG-EM Report Tool v3 evaluation.
 * @param {unknown} data - The raw parsed JSON.
 * @returns {boolean} True if the data matches the v3 format.
 */
const isWcagEmV3Format = (data: unknown): data is WcagEmEvaluation => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  return 'defineScope' in obj && 'auditSample' in obj;
};

/**
 * Resolves the conformance target from the v3 `defineScope.conformanceTarget` string.
 * V3 uses direct level strings like "AA" or full URIs.
 */
const resolveV3ConformanceTarget = (target: string): string => {
  const directLevels = ['A', 'AA', 'AAA'];
  if (directLevels.includes(target)) {
    return target;
  }

  return CONFORMANCE_LEVEL_MAP[target] ?? 'AA';
};

/**
 * Parses a WCAG-EM Report Tool v3 evaluation into a structured audit import object.
 * @param {WcagEmEvaluation} data - The v3 evaluation data.
 * @returns {ImportedAudit} The parsed audit.
 */
const isHttpUrl = (value: string): boolean => /^https?:\/\//.test(value);

/**
 * Resolves the page URL from the v3 page object.
 * Prefers `description` when it is a URL; falls back to `id` when that is a URL.
 */
const resolvePageUrl = (id: string, description: string): string => {
  if (description && isHttpUrl(description)) {
    return description;
  }
  if (isHttpUrl(id)) {
    return id;
  }

  return '';
};

/**
 * Extracts a plain mode string from the v3 mode field.
 * V3 mode can be a string or an object like `{ "@value": "earl:manual" }`.
 */
const resolveMode = (mode: string | WcagEmModeObject | undefined): string => {
  if (mode == null) {
    return 'manual';
  }
  if (typeof mode === 'string') {
    return mode.replace(/^earl:/, '');
  }

  return mode['@value'].replace(/^earl:/, '');
};

const parseWcagEmEvaluation = (data: WcagEmEvaluation): ImportedAudit => {
  const conformanceTarget = resolveV3ConformanceTarget(data.defineScope.conformanceTarget);

  let scope: AuditScope = 'full_aa';
  if (conformanceTarget === 'AAA') {
    scope = 'full_aaa';
  }

  const structuredPages = toArray(data.selectSample.structuredSample);
  const randomPages = toArray(data.selectSample.randomSample);

  const samplePages: ImportedAudit['samplePages'] = [...structuredPages, ...randomPages].map((page) => ({
    id: page.id,
    title: page.title,
    url: resolvePageUrl(page.id, page.description),
  }));

  const knownPageIds = new Set(samplePages.map((p) => p.id));

  const entireSampleResults = new Map<string, { outcome: string; description: string; mode: string }>();
  for (const assertion of data.auditSample) {
    if (knownPageIds.has(assertion.subject.id)) {
      continue;
    }
    const criterionId = resolveTestId(assertion.test.id);
    if (!criterionId) {
      continue;
    }
    const outcome = V3_OUTCOME_MAP[assertion.result.outcome.id] ?? 'untested';
    if (outcome !== 'untested') {
      entireSampleResults.set(criterionId, {
        outcome,
        description: assertion.result.description ?? '',
        mode: resolveMode(assertion.mode),
      });
    }
  }

  const results: ImportedAudit['results'] = [];

  const processAssertion = (assertion: WcagEmAssertion): void => {
    const criterionId = resolveTestId(assertion.test.id);
    if (!criterionId) {
      return;
    }

    const subAssertions = toArray(assertion.hasPart);

    if (subAssertions.length > 0) {
      for (const sub of subAssertions) {
        const subjectId = sub.subject.id;
        if (!knownPageIds.has(subjectId)) {
          continue;
        }

        const subOutcome = V3_OUTCOME_MAP[sub.result.outcome.id] ?? 'untested';
        results.push({
          criterionId,
          samplePageId: subjectId,
          outcome: subOutcome,
          description: sub.result.description ?? '',
          mode: resolveMode(sub.mode),
        });
      }
    } else {
      const subjectId = assertion.subject.id;
      if (!knownPageIds.has(subjectId)) {
        return;
      }

      const outcome = V3_OUTCOME_MAP[assertion.result.outcome.id] ?? 'untested';
      results.push({
        criterionId,
        samplePageId: subjectId,
        outcome,
        description: assertion.result.description ?? '',
        mode: resolveMode(assertion.mode),
      });
    }
  };

  for (const assertion of data.auditSample) {
    processAssertion(assertion);
  }

  const allPageUntestedCriteria = new Set<string>();
  const outcomesByCriterion = new Map<string, string[]>();
  for (const result of results) {
    const list = outcomesByCriterion.get(result.criterionId);
    if (list) {
      list.push(result.outcome);
    } else {
      outcomesByCriterion.set(result.criterionId, [result.outcome]);
    }
  }
  for (const [criterionId, outcomes] of outcomesByCriterion) {
    if (outcomes.every((o) => o === 'untested')) {
      allPageUntestedCriteria.add(criterionId);
    }
  }

  for (const result of results) {
    if (result.outcome === 'untested' && allPageUntestedCriteria.has(result.criterionId)) {
      const entire = entireSampleResults.get(result.criterionId);
      if (entire) {
        result.outcome = entire.outcome;
      }
    }
  }

  const criteriaWithPageResults = new Set(results.map((r) => r.criterionId));
  for (const [criterionId, entireResult] of entireSampleResults) {
    if (criteriaWithPageResults.has(criterionId)) {
      continue;
    }
    for (const page of samplePages) {
      results.push({
        criterionId,
        samplePageId: page.id,
        outcome: entireResult.outcome,
        description: entireResult.description,
        mode: entireResult.mode,
      });
    }
  }

  const technologies = toArray(data.exploreTarget?.technologiesReliedUpon).map((tech) => ({
    name: typeof tech === 'string' ? tech : String(tech),
    url: '',
  }));

  const title = data.reportFindings?.title ?? data.defineScope.scope?.title ?? 'Imported Audit';
  const commissioner = data.reportFindings?.commissioner ?? '';
  const evaluator = data.reportFindings?.evaluator;

  return {
    title,
    commissioner,
    evaluator,
    scope,
    conformanceTarget,
    accessibilityBaseline: data.defineScope.accessibilitySupportBaseline ?? '',
    samplePages,
    results,
    technologies,
    rawMetadata: data,
  };
};

/**
 * Unified entry point for parsing EARL/JSON-LD files.
 * Detects the format (v3 semantic keys vs. old step-based) and delegates.
 * @param {unknown} data - The raw parsed JSON from the uploaded file.
 * @returns {ImportedAudit} The parsed audit data ready to load into Redux state.
 */
export const parseEarlFile = (data: unknown): ImportedAudit => {
  if (isWcagEmV3Format(data)) {
    return parseWcagEmEvaluation(data);
  }

  return parseEarlEvaluation(data as EarlEvaluation);
};

/**
 * Exports audit data into an EARL/JSON-LD structure for interoperability.
 * @param {object} auditData - The audit data to export, including title, sample pages, and assertions.
 * @returns {Record<string, unknown>} The EARL/JSON-LD representation of the audit.
 */
export const exportToEarl = (auditData: {
  title: string;
  summary: string;
  creator: string;
  date: string;
  commissioner: string;
  samplePages: Array<{ title: string; url: string; id: string }>;
  assertions: Array<{
    criterionId: string;
    outcome: string;
    description: string;
    samplePageId: string;
  }>;
}): Record<string, unknown> => {
  return {
    '@type': 'Evaluation',
    '@language': 'en',
    'dct:title': auditData.title,
    'dct:summary': auditData.summary,
    'dct:creator': auditData.creator,
    'dct:date': auditData.date,
    commissioner: auditData.commissioner,
    step3a: {
      '@type': 'Sample',
      'WCAG2:webpagedef': auditData.samplePages.map((page) => ({
        '@type': ['earl:TestSubject', 'sch:WebPage'],
        '@id': page.id,
        'dct:title': page.title,
        'dct:source': page.url,
      })),
    },
    step4: auditData.assertions.map((a) => ({
      '@type': 'earl:Assertion',
      'earl:test': `WCAG2:${a.criterionId}`,
      'earl:subject': a.samplePageId,
      'earl:result': {
        '@type': 'earl:TestResult',
        'earl:outcome': `earl:${a.outcome}`,
        'dct:description': a.description,
      },
      'earl:mode': 'manual',
    })),
  };
};
