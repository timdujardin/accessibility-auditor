'use client';

import type { FC } from 'react';

import { useCallback, useMemo, useState } from 'react';

import type { StepDashboardProps } from './step-dashboard.types';

import { getCriteriaForScope } from '@/../config/audit.config';
import Button from '@/components/atoms/button/Button';
import ConfirmDialog from '@/components/atoms/confirm-dialog/ConfirmDialog';
import ContentCard from '@/components/atoms/content-card/ContentCard';
import DonutChart from '@/components/atoms/donut-chart/DonutChart';
import Heading from '@/components/atoms/heading/Heading';
import Icon from '@/components/atoms/icon/Icon';
import LayoutGrid from '@/components/atoms/layout-grid/LayoutGrid';
import ProgressBar from '@/components/atoms/progress-bar/ProgressBar';
import Spinner from '@/components/atoms/spinner/Spinner';
import StatCard from '@/components/atoms/stat-card/StatCard';
import Tag from '@/components/atoms/tag/Tag';
import Text from '@/components/atoms/text/Text';
import VerticalBarChart from '@/components/atoms/vertical-bar-chart/VerticalBarChart';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import DataTable from '@/components/molecules/data-table/DataTable';
import { useLocalAuditResults } from '@/hooks/localAuditResults.hooks';
import { useConformanceOverviewTable } from '@/hooks/tables/conformanceOverview.table';
import { selectSamplePages, selectScanResults } from '@/redux/slices/audit';
import { useAppSelector } from '@/redux/store';
import { getConformanceColor, getConformanceMuiColor, SEMANTIC_COLORS } from '@/utils/color.util';
import { getQuickWins } from '@/utils/findings.util';
import {
  buildConformanceRows,
  buildFindingsForStats,
  buildPageConformanceStats,
  buildPageIdToTitle,
  buildPriorityPieData,
  buildReportByPage,
  calculateDashboardStats,
  getActiveCriteria,
} from '@/utils/reportGeneration.util';

import ReportPreview from './ReportPreview';
import { handleConfirmPublish, handlePublishClick } from './step-dashboard.callbacks';

const StepDashboard: FC<StepDashboardProps> = ({ auditScope, samplePages, onPublish, isPublishing }) => {
  const { results, findings, screenshots } = useLocalAuditResults();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const scanResults = useAppSelector(selectScanResults);
  const reduxSamplePages = useAppSelector(selectSamplePages);

  const criteriaIds = useMemo(() => getCriteriaForScope(auditScope), [auditScope]);
  const activeCriteria = useMemo(() => getActiveCriteria(criteriaIds), [criteriaIds]);

  const conformanceRows = useMemo(
    () => buildConformanceRows(activeCriteria, results, samplePages),
    [activeCriteria, results, samplePages],
  );

  const conformanceTable = useConformanceOverviewTable(conformanceRows, samplePages);

  const pageIdToTitle = useMemo(() => buildPageIdToTitle(samplePages), [samplePages]);

  const findingsForStats = useMemo(
    () => buildFindingsForStats(findings, results, activeCriteria, pageIdToTitle),
    [findings, results, activeCriteria, pageIdToTitle],
  );

  const pageStats = useMemo(
    () => buildPageConformanceStats(conformanceRows, samplePages),
    [conformanceRows, samplePages],
  );

  const stats = useMemo(
    () => calculateDashboardStats(conformanceRows, findingsForStats, pageStats),
    [conformanceRows, findingsForStats, pageStats],
  );

  const { conformancePercentage, findingsByPrinciple, findingsBySamplePage } = stats;

  const pieData = buildPriorityPieData(stats);

  const barData = Object.entries(findingsByPrinciple).map(([name, value]) => ({ name, value }));

  const quickWins = getQuickWins(findings);

  const samplePagesWithUrl = useMemo(
    () => reduxSamplePages.map((p) => ({ id: p.id, title: p.title, url: p.url })),
    [reduxSamplePages],
  );

  const reportPages = useMemo(
    () => buildReportByPage(findings, results, activeCriteria, samplePagesWithUrl, screenshots, scanResults),
    [findings, results, activeCriteria, samplePagesWithUrl, screenshots, scanResults],
  );

  const onPublishClick = useCallback(() => handlePublishClick(setConfirmOpen), []);

  const onConfirmPublish = useCallback(() => handleConfirmPublish(setConfirmOpen, onPublish), [onPublish]);

  return (
    <Wrapper>
      <Wrapper sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: 1 }}>
        <Heading tag="h2" size="h6">
          Audit Dashboard
        </Heading>
        {onPublish ? (
          <Button
            variant="contained"
            color="success"
            startIcon={isPublishing ? <Spinner size={20} color="inherit" /> : <Icon name="CloudUpload" />}
            onClick={onPublishClick}
            disabled={isPublishing}
          >
            {isPublishing ? 'Publishing...' : 'Publish Audit'}
          </Button>
        ) : null}
      </Wrapper>
      <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 3 }}>
        Overview of the audit results. This dashboard will be included in the final report.
      </Text>

      <Text variant="subtitle1" fontWeight={700} sx={{ marginBlockEnd: 1 }}>
        Entire Sample
      </Text>
      <Wrapper sx={{ maxInlineSize: 240, marginBlockEnd: 3 }}>
        <StatCard
          value={`${conformancePercentage}%`}
          label="Conformance"
          color={getConformanceMuiColor(conformancePercentage)}
        />
      </Wrapper>

      {pageStats.length > 1 && (
        <ContentCard sx={{ marginBlockEnd: 3 }}>
          <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 1 }}>
            Page Conformance
          </Text>
          <VerticalBarChart
            data={pageStats.map((p) => ({ name: p.pageTitle, value: p.conformancePercentage }))}
            height={350}
            colorByValue={(item) => getConformanceColor(item.value)}
            yDomain={[0, 100]}
            yUnit="%"
            referenceLines={[{ y: 50, label: '50% minimum', color: SEMANTIC_COLORS.error }]}
            barLabelFormatter={(v: number) => `${v}%`}
            xAxisAngle={-35}
            xAxisHeight={80}
          />
          <Wrapper sx={{ marginBlockStart: 3 }}>
            {pageStats.map((page) => (
              <Wrapper key={page.pageId} sx={{ marginBlockEnd: 2 }}>
                <Text variant="body2" fontWeight={600} sx={{ marginBlockEnd: 0.5 }}>
                  {page.pageTitle}
                </Text>
                <Wrapper sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Tag label={`${page.passed} passed`} size="small" color="success" variant="outlined" />
                  <Tag label={`${page.failed} failed`} size="small" color="error" variant="outlined" />
                  <Tag label={`${page.inapplicable} not present`} size="small" variant="outlined" />
                  {page.cantTell > 0 && (
                    <Tag label={`${page.cantTell} can't tell`} size="small" color="warning" variant="outlined" />
                  )}
                  {page.untested > 0 && <Tag label={`${page.untested} untested`} size="small" variant="outlined" />}
                </Wrapper>
              </Wrapper>
            ))}
          </Wrapper>
        </ContentCard>
      )}

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
                Issues by WCAG Principle
              </Text>
              <VerticalBarChart data={barData} height={250} />
            </ContentCard>
          </LayoutGrid>
        )}
      </LayoutGrid>

      {Object.keys(findingsBySamplePage).length > 0 && (
        <ContentCard sx={{ marginBlockEnd: 3 }}>
          <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 2 }}>
            Sample Page Heatmap
          </Text>
          {Object.entries(findingsBySamplePage)
            .sort(([, a], [, b]) => b - a)
            .map(([pageName, count]) => {
              const maxCount = Math.max(...Object.values(findingsBySamplePage));

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

      <ContentCard sx={{ marginBlockEnd: 3 }}>
        <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 1 }}>
          Conformance Overview
        </Text>
        <DataTable table={conformanceTable} size="small" />
      </ContentCard>

      {quickWins.length > 0 && (
        <ContentCard sx={{ marginBlockEnd: 3 }}>
          <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 1 }}>
            Quick Wins
          </Text>
          <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 2 }}>
            Low-effort findings that can be resolved quickly.
          </Text>
          {quickWins.map((f) => (
            <Wrapper key={f.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBlockEnd: 1 }}>
              <Tag label={f.priority} size="small" variant="outlined" />
              <Text variant="body2">{f.description}</Text>
            </Wrapper>
          ))}
        </ContentCard>
      )}

      <ReportPreview reportPages={reportPages} />

      <ConfirmDialog
        open={confirmOpen}
        title="Publish Audit"
        description="This will publish the audit data to the database. Are you sure you want to continue?"
        confirmLabel="Publish"
        cancelLabel="Cancel"
        confirmColor="success"
        onConfirm={onConfirmPublish}
        onCancel={() => setConfirmOpen(false)}
      />
    </Wrapper>
  );
};

export default StepDashboard;
