import type { EvaluationOutcome, WcagCriterion } from '@/@types/criteria';
import type { FindingPriority } from '@/@types/finding';
import type { SamplePageRef, SamplePageSummary } from '@/@types/sample';
import type { AuditResultRow, FindingRow, FindingScreenshotRow } from '@/hooks/findings.hooks';
import type { ScanPageResultDraft } from '@/redux/slices/audit';

import { PRIORITY_DISPLAY } from '@/../config/audit.config';
import { PRINCIPLE_NAMES, WCAG_CRITERIA } from '@/../config/wcag.config';
import { SEMANTIC_COLORS } from '@/utils/color.util';

export interface ConformanceOverviewRow {
  criterionId: string;
  criterionName: string;
  level: string;
  principle: number;
  outcomes: Record<string, EvaluationOutcome>;
  overallOutcome: EvaluationOutcome;
}

interface DashboardStats {
  totalCriteria: number;
  passedCriteria: number;
  failedCriteria: number;
  untestedCriteria: number;
  inapplicableCriteria: number;
  totalFindings: number;
  findingsByPriority: Record<FindingPriority, number>;
  findingsByPrinciple: Record<string, number>;
  findingsBySamplePage: Record<string, number>;
  conformancePercentage: number;
}

/**
 * Determines the overall conformance outcome from a list of per-page outcomes.
 * @param {EvaluationOutcome[]} outcomes - The evaluation outcomes across sample pages.
 * @returns {EvaluationOutcome} The aggregated outcome (failed if any failed, passed if all passed, etc.).
 */
export const calculateOverallOutcome = (outcomes: EvaluationOutcome[]): EvaluationOutcome => {
  if (outcomes.some((o) => o === 'failed')) {
    return 'failed';
  }
  if (outcomes.some((o) => o === 'cantTell')) {
    return 'cantTell';
  }

  const onlyPassedOrInapplicable = outcomes.every((o) => o === 'passed' || o === 'inapplicable');

  if (onlyPassedOrInapplicable && outcomes.some((o) => o === 'passed')) {
    return 'passed';
  }
  if (onlyPassedOrInapplicable && outcomes.every((o) => o === 'inapplicable')) {
    return 'inapplicable';
  }

  return 'untested';
};

/**
 * Calculates all dashboard statistics from conformance rows and findings.
 * Conformance rate = average of per-page conformance percentages.
 * Falls back to (passed + inapplicable) / total criteria when no page stats are provided.
 * @param {ConformanceOverviewRow[]} conformanceRows - The per-criterion conformance data.
 * @param {Array<{ priority: FindingPriority; principle: number; samplePageTitle: string }>} findings - The findings with priority, principle, and page info.
 * @param {PageConformanceStats[]} [pageConformanceStats] - Pre-calculated per-page stats used to average the conformance rate.
 * @returns {DashboardStats} Aggregated stats including conformance percentage, counts by priority/principle/page.
 */
export const calculateDashboardStats = (
  conformanceRows: ConformanceOverviewRow[],
  findings: Array<{ priority: FindingPriority; principle: number; samplePageTitle: string }>,
  pageConformanceStats?: PageConformanceStats[],
): DashboardStats => {
  const stats: DashboardStats = {
    totalCriteria: conformanceRows.length,
    passedCriteria: 0,
    failedCriteria: 0,
    untestedCriteria: 0,
    inapplicableCriteria: 0,
    totalFindings: findings.length,
    findingsByPriority: { critical: 0, major: 0, minor: 0, advisory: 0 },
    findingsByPrinciple: {},
    findingsBySamplePage: {},
    conformancePercentage: 0,
  };

  for (const row of conformanceRows) {
    switch (row.overallOutcome) {
      case 'passed':
        stats.passedCriteria++;
        break;
      case 'failed':
        stats.failedCriteria++;
        break;
      case 'inapplicable':
        stats.inapplicableCriteria++;
        break;
      default:
        stats.untestedCriteria++;
    }
  }

  if (pageConformanceStats && pageConformanceStats.length > 0) {
    const sum = pageConformanceStats.reduce((acc, p) => acc + p.conformancePercentage, 0);
    stats.conformancePercentage = Math.round(sum / pageConformanceStats.length);
  } else {
    stats.conformancePercentage =
      stats.totalCriteria > 0
        ? Math.round(((stats.passedCriteria + stats.inapplicableCriteria) / stats.totalCriteria) * 100)
        : 0;
  }

  for (const finding of findings) {
    stats.findingsByPriority[finding.priority]++;

    const principleName = PRINCIPLE_NAMES[finding.principle] ?? `Principle ${finding.principle}`;
    stats.findingsByPrinciple[principleName] = (stats.findingsByPrinciple[principleName] ?? 0) + 1;

    stats.findingsBySamplePage[finding.samplePageTitle] =
      (stats.findingsBySamplePage[finding.samplePageTitle] ?? 0) + 1;
  }

  return stats;
};

/**
 * Filters the full WCAG criteria list to only those matching the given IDs.
 * @param {string[]} criteriaIds - The criterion IDs included in the audit scope.
 * @returns {WcagCriterion[]} The matching WCAG criterion objects.
 */
export const getActiveCriteria = (criteriaIds: string[]): WcagCriterion[] => {
  return WCAG_CRITERIA.filter((c) => criteriaIds.includes(c.id));
};

/**
 * Builds the conformance overview rows for the dashboard table.
 * @param {WcagCriterion[]} activeCriteria - The WCAG criteria in scope.
 * @param {AuditResultRow[]} results - The audit results per criterion and page.
 * @param {SamplePageRef[]} samplePages - The sample pages with id and title.
 * @returns {ConformanceOverviewRow[]} One row per criterion with per-page outcomes and overall outcome.
 */
export const buildConformanceRows = (
  activeCriteria: WcagCriterion[],
  results: AuditResultRow[],
  samplePages: SamplePageRef[],
): ConformanceOverviewRow[] => {
  return activeCriteria.map((criterion) => {
    const criterionResults = results.filter((r) => r.criterion_id === criterion.id);
    const outcomes: Record<string, EvaluationOutcome> = {};

    for (const page of samplePages) {
      const result = criterionResults.find((r) => r.sample_page_id === page.id);
      outcomes[page.id] = result?.outcome ?? 'untested';
    }

    const outcomeValues = Object.values(outcomes);
    const overallOutcome = calculateOverallOutcome(outcomeValues);

    return {
      criterionId: criterion.id,
      criterionName: criterion.name,
      level: criterion.level,
      principle: criterion.principle,
      outcomes,
      overallOutcome,
    };
  });
};

interface PageConformanceStats {
  pageId: string;
  pageTitle: string;
  passed: number;
  failed: number;
  inapplicable: number;
  untested: number;
  cantTell: number;
  total: number;
  conformancePercentage: number;
}

/**
 * Builds per-sample-page conformance statistics from the conformance overview rows.
 * Conformance rate per page = (passed + inapplicable) / total criteria in scope.
 * @param {ConformanceOverviewRow[]} conformanceRows - The per-criterion conformance data.
 * @param {SamplePageRef[]} samplePages - The sample pages with id and title.
 * @returns {PageConformanceStats[]} One entry per page with outcome counts and conformance percentage.
 */
export const buildPageConformanceStats = (
  conformanceRows: ConformanceOverviewRow[],
  samplePages: SamplePageRef[],
): PageConformanceStats[] => {
  return samplePages.map((page) => {
    let passed = 0;
    let failed = 0;
    let inapplicable = 0;
    let untested = 0;
    let cantTell = 0;

    for (const row of conformanceRows) {
      const outcome = row.outcomes[page.id] ?? 'untested';
      switch (outcome) {
        case 'passed':
          passed++;
          break;
        case 'failed':
          failed++;
          break;
        case 'inapplicable':
          inapplicable++;
          break;
        case 'cantTell':
          cantTell++;
          break;
        default:
          untested++;
      }
    }

    const total = conformanceRows.length;
    const conformancePercentage = total > 0 ? Math.round(((passed + inapplicable) / total) * 100) : 0;

    return {
      pageId: page.id,
      pageTitle: page.title,
      passed,
      failed,
      inapplicable,
      untested,
      cantTell,
      total,
      conformancePercentage,
    };
  });
};

interface FindingStatEntry {
  priority: FindingPriority;
  principle: number;
  samplePageTitle: string;
}

/**
 * Maps raw findings to stat entries with resolved principle and sample page title.
 * @param {FindingRow[]} findings - The raw findings from local state.
 * @param {AuditResultRow[]} results - The audit results to resolve criterion info.
 * @param {WcagCriterion[]} activeCriteria - The WCAG criteria in scope for principle lookup.
 * @param {Record<string, string>} pageIdToTitle - Map from sample page ID to display title.
 * @returns {FindingStatEntry[]} Findings enriched with principle number and page title.
 */
export const buildFindingsForStats = (
  findings: FindingRow[],
  results: AuditResultRow[],
  activeCriteria: WcagCriterion[],
  pageIdToTitle: Record<string, string>,
): FindingStatEntry[] => {
  return findings.map((f) => {
    const result = results.find((r) => r.id === f.audit_result_id);
    const criterion = activeCriteria.find((c) => c.id === result?.criterion_id);

    return {
      priority: f.priority,
      principle: criterion?.principle ?? 1,
      samplePageTitle: pageIdToTitle[result?.sample_page_id ?? ''] ?? 'Unknown',
    };
  });
};

interface PieChartEntry {
  id: string;
  value: number;
  label: string;
  color: string;
}

/**
 * Builds pie chart data entries from dashboard stats, filtering out zero-count priorities.
 * @param {DashboardStats} stats - The calculated dashboard statistics.
 * @returns {PieChartEntry[]} Pie chart entries with id, value, label, and color.
 */
export const buildPriorityPieData = (stats: DashboardStats): PieChartEntry[] => {
  return Object.entries(stats.findingsByPriority)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => ({
      id: key,
      value: count,
      label: PRIORITY_DISPLAY[key as keyof typeof PRIORITY_DISPLAY].label,
      color: SEMANTIC_COLORS[PRIORITY_DISPLAY[key as keyof typeof PRIORITY_DISPLAY].color],
    }));
};

/**
 * Creates a lookup map from sample page ID to display title.
 * @param {SamplePageRef[]} samplePages - The sample pages with id and title.
 * @returns {Record<string, string>} Map of page ID to page title.
 */
export const buildPageIdToTitle = (samplePages: SamplePageRef[]): Record<string, string> => {
  const map: Record<string, string> = {};
  for (const p of samplePages) {
    map[p.id] = p.title;
  }
  return map;
};

interface ReportScreenshot {
  src: string;
  alt: string;
}

export interface ReportFinding {
  id: string;
  criterionId: string;
  criterionName: string;
  level: string;
  priority: FindingPriority;
  description: string;
  recommendation: string;
  elementSelector: string;
  elementHtml: string;
  fromAutomatedScan: boolean;
  auditorValidated: boolean;
  screenshots: ReportScreenshot[];
}

export interface ReportPageGroup {
  pageId: string;
  pageTitle: string;
  pageUrl: string;
  findings: ReportFinding[];
}

/**
 * Collects screenshots for a finding from manual uploads and automated scan data.
 * @param {FindingRow} finding - The finding to collect screenshots for.
 * @param {FindingScreenshotRow[]} allScreenshots - All manual screenshot rows.
 * @param {string} pageId - The sample page ID for scan result lookup.
 * @param {Record<string, ScanPageResultDraft>} scanResults - Automated scan results keyed by page ID.
 * @returns {ReportScreenshot[]} Merged list of manual and scan screenshots.
 */
const collectScreenshots = (
  finding: FindingRow,
  allScreenshots: FindingScreenshotRow[],
  pageId: string,
  scanResults: Record<string, ScanPageResultDraft>,
): ReportScreenshot[] => {
  const shots: ReportScreenshot[] = [];

  const manualShots = allScreenshots.filter((s) => s.finding_id === finding.id);
  for (const s of manualShots) {
    shots.push({ src: s.storage_path, alt: s.alt_text || 'Screenshot for finding' });
  }

  if (finding.from_automated_scan && finding.element_selector && pageId in scanResults) {
    const suffix = `__${finding.element_selector}`;
    for (const [key, base64] of Object.entries(scanResults[pageId].screenshots)) {
      if (key.endsWith(suffix)) {
        shots.push({ src: `data:image/png;base64,${base64}`, alt: `Scan screenshot of ${finding.element_selector}` });
      }
    }
  }

  return shots;
};

/**
 * Groups findings by sample page and enriches each with criterion info and screenshots.
 * @param {FindingRow[]} findings - All findings from the audit.
 * @param {AuditResultRow[]} results - Audit results linking findings to criteria and pages.
 * @param {WcagCriterion[]} activeCriteria - WCAG criteria in scope.
 * @param {SamplePageSummary[]} samplePages - Sample pages with id, title, and url.
 * @param {FindingScreenshotRow[]} screenshots - Manual finding screenshots.
 * @param {Record<string, ScanPageResultDraft>} scanResults - Automated scan results keyed by page ID.
 * @returns {ReportPageGroup[]} Findings grouped per sample page with enriched data.
 */
export const buildReportByPage = (
  findings: FindingRow[],
  results: AuditResultRow[],
  activeCriteria: WcagCriterion[],
  samplePages: SamplePageSummary[],
  screenshots: FindingScreenshotRow[],
  scanResults: Record<string, ScanPageResultDraft>,
): ReportPageGroup[] => {
  const criteriaMap = new Map(activeCriteria.map((c) => [c.id, c]));
  const resultMap = new Map(results.map((r) => [r.id, r]));

  const groups: ReportPageGroup[] = samplePages.map((page) => ({
    pageId: page.id,
    pageTitle: page.title,
    pageUrl: page.url,
    findings: [],
  }));

  const groupMap = new Map(groups.map((g) => [g.pageId, g]));

  for (const finding of findings) {
    const result = resultMap.get(finding.audit_result_id);
    if (!result) {
      continue;
    }

    const group = groupMap.get(result.sample_page_id);
    if (!group) {
      continue;
    }

    const criterion = criteriaMap.get(result.criterion_id);

    group.findings.push({
      id: finding.id,
      criterionId: result.criterion_id,
      criterionName: criterion?.name ?? result.criterion_id,
      level: criterion?.level ?? '',
      priority: finding.priority,
      description: finding.description,
      recommendation: finding.recommendation,
      elementSelector: finding.element_selector,
      elementHtml: finding.element_html,
      fromAutomatedScan: finding.from_automated_scan,
      auditorValidated: finding.auditor_validated,
      screenshots: collectScreenshots(finding, screenshots, result.sample_page_id, scanResults),
    });
  }

  return groups.filter((g) => g.findings.length > 0);
};
