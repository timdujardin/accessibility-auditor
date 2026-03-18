'use client';

import type { AuditScope, AuditStatus } from '@/@types/audit';
import type { EvaluationOutcome } from '@/@types/criteria';
import type { RemediationRow } from '@/utils/prioritization.util';
import type { ConformanceOverviewRow } from '@/utils/reportGeneration.util';
import type { FC } from 'react';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { getCriteriaForScope, PRIORITY_DISPLAY, SCOPE_LABELS_LONG } from '@/../config/audit.config';
import { WCAG_CRITERIA } from '@/../config/wcag.config';
import Button from '@/components/atoms/button/Button';
import ContentCard from '@/components/atoms/content-card/ContentCard';
import DonutChart from '@/components/atoms/donut-chart/DonutChart';
import Heading from '@/components/atoms/heading/Heading';
import Icon from '@/components/atoms/icon/Icon';
import LayoutGrid from '@/components/atoms/layout-grid/LayoutGrid';
import ProgressBar from '@/components/atoms/progress-bar/ProgressBar';
import Spinner from '@/components/atoms/spinner/Spinner';
import StatCard from '@/components/atoms/stat-card/StatCard';
import StatusBadge from '@/components/atoms/status-badge/StatusBadge';
import Tag from '@/components/atoms/tag/Tag';
import Text from '@/components/atoms/text/Text';
import VerticalBarChart from '@/components/atoms/vertical-bar-chart/VerticalBarChart';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import DataTable from '@/components/molecules/data-table/DataTable';
import AppShell from '@/components/organisms/app-shell/AppShell';
import { useAudit } from '@/hooks/audit.hooks';
import { useAuditResults } from '@/hooks/findings.hooks';
import { useConformanceOverviewTable } from '@/hooks/tables/conformanceOverview.table';
import { SEMANTIC_COLORS } from '@/utils/color.util';
import { exportToEarl } from '@/utils/earlTransform.util';
import { slugify } from '@/utils/format.util';
import { exportRemediationToCsv, mapPriorityToImpactLabel, sortRemediationRows } from '@/utils/prioritization.util';
import { calculateDashboardStats, calculateOverallOutcome } from '@/utils/reportGeneration.util';

const ReportPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { audit, samplePages, isLoading: auditLoading } = useAudit(id);
  const { results, findings, isLoading: resultsLoading } = useAuditResults(id);

  const scope = (audit?.audit_scope ?? 'full_aa') as AuditScope;
  const criteriaIds = getCriteriaForScope(scope);
  const activeCriteria = WCAG_CRITERIA.filter((c) => criteriaIds.includes(c.id));

  const conformanceRows = useMemo((): ConformanceOverviewRow[] => {
    return activeCriteria.map((criterion) => {
      const criterionResults = results.filter((r) => r.criterion_id === criterion.id);
      const outcomes: Record<string, EvaluationOutcome> = {};

      for (const page of samplePages) {
        const result = criterionResults.find((r) => r.sample_page_id === page.id);
        outcomes[page.id] = result?.outcome ?? 'untested';
      }

      return {
        criterionId: criterion.id,
        criterionName: criterion.name,
        level: criterion.level,
        principle: criterion.principle,
        outcomes,
        overallOutcome: calculateOverallOutcome(Object.values(outcomes)),
      };
    });
  }, [activeCriteria, results, samplePages]);

  const conformanceTable = useConformanceOverviewTable(conformanceRows, samplePages);

  const pageIdToTitle = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of samplePages) {
      map[p.id] = p.title;
    }
    return map;
  }, [samplePages]);

  const findingsForStats = useMemo(
    () =>
      findings.map((f) => {
        const result = results.find((r) => r.id === f.audit_result_id);
        const criterion = activeCriteria.find((c) => c.id === result?.criterion_id);

        return {
          priority: f.priority,
          principle: criterion?.principle ?? 1,
          samplePageTitle: pageIdToTitle[result?.sample_page_id ?? ''] ?? 'Unknown',
        };
      }),
    [findings, results, activeCriteria, pageIdToTitle],
  );

  const stats = useMemo(
    () => calculateDashboardStats(conformanceRows, findingsForStats),
    [conformanceRows, findingsForStats],
  );

  const remediationRows = useMemo((): RemediationRow[] => {
    const rows: RemediationRow[] = [];
    for (const finding of findings) {
      const result = results.find((r) => r.id === finding.audit_result_id);
      if (!result) {
        continue;
      }
      const criterion = WCAG_CRITERIA.find((c) => c.id === result.criterion_id);
      if (!criterion) {
        continue;
      }
      rows.push({
        criterionId: criterion.id,
        criterionName: criterion.name,
        samplePageTitle: pageIdToTitle[result.sample_page_id] ?? result.sample_page_id,
        description: finding.description,
        impactLabel: mapPriorityToImpactLabel(finding.priority),
        priority: finding.priority,
        principle: criterion.principle,
        level: criterion.level,
      });
    }
    return sortRemediationRows(rows);
  }, [findings, results, pageIdToTitle]);

  const handleExportEarl = () => {
    if (!audit) {
      return;
    }
    const earlData = exportToEarl({
      title: audit.title,
      summary: audit.executive_summary,
      creator: audit.auditor_id,
      date: audit.updated_at,
      commissioner: audit.commissioner,
      samplePages: samplePages.map((p) => ({ title: p.title, url: p.url, id: p.id })),
      assertions: results.map((r) => ({
        criterionId: r.criterion_id,
        outcome: r.outcome,
        description: r.observations,
        samplePageId: r.sample_page_id,
      })),
    });

    const blob = new Blob([JSON.stringify(earlData, null, 2)], { type: 'application/ld+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(audit.title)}-earl.jsonld`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const csv = exportRemediationToCsv(remediationRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (auditLoading || resultsLoading) {
    return (
      <AppShell>
        <Wrapper sx={{ display: 'flex', justifyContent: 'center', paddingBlockStart: 8 }}>
          <Spinner />
        </Wrapper>
      </AppShell>
    );
  }

  if (!audit) {
    return (
      <AppShell>
        <Heading tag="h5" color="text.secondary">
          Audit not found.
        </Heading>
      </AppShell>
    );
  }

  const pieData = Object.entries(stats.findingsByPriority)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => ({
      id: key,
      value: count,
      label: PRIORITY_DISPLAY[key as keyof typeof PRIORITY_DISPLAY].label,
      color: SEMANTIC_COLORS[PRIORITY_DISPLAY[key as keyof typeof PRIORITY_DISPLAY].color],
    }));

  const barData = Object.entries(stats.findingsByPrinciple).map(([name, value]) => ({ name, value }));

  return (
    <AppShell>
      <Wrapper sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBlockEnd: 3 }}>
        <Wrapper>
          <Heading tag="h1" size="h4" gutterBottom>
            {audit.title || 'Audit Report'}
          </Heading>
          <Wrapper sx={{ display: 'flex', gap: 1 }}>
            <Tag label={SCOPE_LABELS_LONG[scope]} color="primary" />
            <StatusBadge status={audit.status as AuditStatus} />
            <Tag label={`${activeCriteria.length} criteria`} variant="outlined" />
          </Wrapper>
        </Wrapper>
        <Wrapper sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Icon name="Download" />} onClick={handleExportCsv}>
            CSV
          </Button>
          <Button variant="outlined" startIcon={<Icon name="Download" />} onClick={handleExportEarl}>
            EARL/JSON-LD
          </Button>
        </Wrapper>
      </Wrapper>

      {/* Stats cards */}
      <LayoutGrid container spacing={3} sx={{ marginBlockEnd: 3 }}>
        <LayoutGrid size={{ xs: 6, md: 3 }}>
          <StatCard value={`${stats.conformancePercentage}%`} label="Conformance" color="primary.main" />
        </LayoutGrid>
        <LayoutGrid size={{ xs: 6, md: 3 }}>
          <StatCard value={stats.passedCriteria} label="Passed" color="success.main" />
        </LayoutGrid>
        <LayoutGrid size={{ xs: 6, md: 3 }}>
          <StatCard value={stats.failedCriteria} label="Failed" color="error.main" />
        </LayoutGrid>
        <LayoutGrid size={{ xs: 6, md: 3 }}>
          <StatCard value={stats.totalFindings} label="Findings" />
        </LayoutGrid>
      </LayoutGrid>

      {/* Charts */}
      <LayoutGrid container spacing={3} sx={{ marginBlockEnd: 3 }}>
        {pieData.length > 0 && (
          <LayoutGrid size={{ xs: 12, md: 6 }}>
            <ContentCard>
              <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 1 }}>
                Issues by Priority
              </Text>
              <DonutChart data={pieData} height={250} />
            </ContentCard>
          </LayoutGrid>
        )}
        {barData.length > 0 && (
          <LayoutGrid size={{ xs: 12, md: 6 }}>
            <ContentCard>
              <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 1 }}>
                Issues by Principle
              </Text>
              <VerticalBarChart data={barData} height={250} />
            </ContentCard>
          </LayoutGrid>
        )}
      </LayoutGrid>

      {/* Sample page heatmap */}
      {Object.keys(stats.findingsBySamplePage).length > 0 && (
        <ContentCard sx={{ marginBlockEnd: 3 }}>
          <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 2 }}>
            Sample Page Heatmap
          </Text>
          {Object.entries(stats.findingsBySamplePage)
            .sort(([, a], [, b]) => b - a)
            .map(([pageName, count]) => {
              const maxCount = Math.max(...Object.values(stats.findingsBySamplePage));

              return (
                <Wrapper key={pageName} sx={{ marginBlockEnd: 1.5 }}>
                  <Wrapper sx={{ display: 'flex', justifyContent: 'space-between', marginBlockEnd: 0.5 }}>
                    <Text variant="body2">{pageName}</Text>
                    <Text variant="body2" fontWeight={600}>
                      {count} issues
                    </Text>
                  </Wrapper>
                  <ProgressBar
                    variant="determinate"
                    value={(count / maxCount) * 100}
                    color="error"
                    sx={{ blockSize: 8, borderRadius: 4 }}
                  />
                </Wrapper>
              );
            })}
        </ContentCard>
      )}

      {/* Executive summary */}
      {audit.executive_summary ? (
        <ContentCard sx={{ marginBlockEnd: 3 }}>
          <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 1 }}>
            Executive Summary
          </Text>
          <Text variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {audit.executive_summary}
          </Text>
        </ContentCard>
      ) : null}

      {/* Conformance table */}
      <ContentCard sx={{ marginBlockEnd: 3 }}>
        <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 1 }}>
          Conformance Overview
        </Text>
        <DataTable table={conformanceTable} size="small" />
      </ContentCard>

      {/* Quick wins */}
      {findings.filter((f) => f.priority === 'minor' || f.priority === 'advisory').length > 0 && (
        <ContentCard>
          <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 1 }}>
            Quick Wins
          </Text>
          {findings
            .filter((f) => f.priority === 'minor' || f.priority === 'advisory')
            .slice(0, 15)
            .map((f) => (
              <Wrapper key={f.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBlockEnd: 1 }}>
                <Tag label={f.priority} size="small" variant="outlined" />
                <Text variant="body2">{f.description}</Text>
              </Wrapper>
            ))}
        </ContentCard>
      )}
    </AppShell>
  );
};

export default ReportPage;
