'use client';

import type { FC } from 'react';

import { useCallback, useMemo, useState } from 'react';

import { useToggle } from 'react-use';

import type { StepAutomatedScanProps } from './step-automated-scan.types';

import { getAutomationCoverage } from '@/../config/automation.config';
import Alert from '@/components/atoms/alert/Alert';
import Button from '@/components/atoms/button/Button';
import Collapsible from '@/components/atoms/collapsible/Collapsible';
import ContentCard from '@/components/atoms/content-card/ContentCard';
import Divider from '@/components/atoms/divider/Divider';
import ErrorAlert from '@/components/atoms/error/Error';
import Heading from '@/components/atoms/heading/Heading';
import Icon from '@/components/atoms/icon/Icon';
import LayoutGrid from '@/components/atoms/layout-grid/LayoutGrid';
import Link from '@/components/atoms/link/Link';
import ProgressBar from '@/components/atoms/progress-bar/ProgressBar';
import Spinner from '@/components/atoms/spinner/Spinner';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import ScanProgressCard from '@/components/molecules/scan-progress-card/ScanProgressCard';
import { useScan } from '@/hooks/scan.hooks';
import {
  approveViolation,
  dismissViolation,
  selectApprovedViolationKeys,
  selectDismissedViolationKeys,
} from '@/redux/slices/audit';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { countTotalViolations, getScannablePages } from '@/utils/scan.util';

import { handleScanAll, handleScanPage } from './step-automated-scan.callbacks';

const StepAutomatedScan: FC<StepAutomatedScanProps> = ({
  auditId: _auditId,
  auditScope,
  samplePages,
  onScanComplete,
}) => {
  const dispatch = useAppDispatch();
  const { results, scanningPageId, error, scanPage } = useScan();
  const approvedKeys = useAppSelector(selectApprovedViolationKeys);
  const dismissedKeys = useAppSelector(selectDismissedViolationKeys);
  const [expandedPage, setExpandedPage] = useState<string | null>(null);
  const [expandedViolationGap, setExpandedViolationGap] = useState<string | null>(null);
  const [showCoverage, toggleShowCoverage] = useToggle(true);

  const coverage = useMemo(() => getAutomationCoverage(auditScope), [auditScope]);

  const scannablePages = getScannablePages(samplePages);

  const onScanPage = useCallback(
    (page: { id: string; title: string; url: string; auditMode: string }) =>
      handleScanPage(page, scanPage, onScanComplete),
    [scanPage, onScanComplete],
  );

  const onScanAll = useCallback(() => handleScanAll(scannablePages, onScanPage), [scannablePages, onScanPage]);

  const onApproveViolation = useCallback(
    (violationKey: string) => dispatch(approveViolation(violationKey)),
    [dispatch],
  );

  const onDismissViolation = useCallback(
    (violationKey: string) => dispatch(dismissViolation(violationKey)),
    [dispatch],
  );

  const scannedCount = Object.keys(results).length;
  const totalViolations = countTotalViolations(results);

  return (
    <Wrapper>
      <Heading tag="h2" size="h6" gutterBottom>
        Automated Scan
      </Heading>
      <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 2 }}>
        Run axe-core scans on your sample pages to automatically detect accessibility issues. Results are suggestions —
        review and validate each finding before including it in your report.
      </Text>

      {/* Automation Coverage Summary */}
      <ContentCard variant="outlined" sx={{ marginBlockEnd: 3, backgroundColor: 'action.hover' }}>
        <Wrapper
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          onClick={() => toggleShowCoverage()}
        >
          <Wrapper sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon name="InfoOutlined" color="info" fontSize="small" />
            <Text variant="subtitle2" fontWeight={700}>
              Automation Coverage Gap
            </Text>
          </Wrapper>
          {showCoverage ? <Icon name="ExpandLess" /> : <Icon name="ExpandMore" />}
        </Wrapper>

        <Collapsible in={showCoverage}>
          <Text variant="body2" color="text.secondary" sx={{ marginBlockStart: 1, marginBlockEnd: 2 }}>
            Automated tools like axe-core can only fully verify a small subset of WCAG criteria. Most criteria require
            human judgment for aspects that tools cannot assess.
          </Text>

          <LayoutGrid container spacing={2} sx={{ marginBlockEnd: 2 }}>
            <LayoutGrid size={{ xs: 4 }}>
              <Wrapper sx={{ textAlign: 'center' }}>
                <Heading tag="h4" color="success.main" fontWeight={700}>
                  {coverage.auto}
                </Heading>
                <Text variant="caption" color="text.secondary">
                  Fully automatable
                </Text>
              </Wrapper>
            </LayoutGrid>
            <LayoutGrid size={{ xs: 4 }}>
              <Wrapper sx={{ textAlign: 'center' }}>
                <Heading tag="h4" color="warning.main" fontWeight={700}>
                  {coverage.partial}
                </Heading>
                <Text variant="caption" color="text.secondary">
                  Partially automatable
                </Text>
              </Wrapper>
            </LayoutGrid>
            <LayoutGrid size={{ xs: 4 }}>
              <Wrapper sx={{ textAlign: 'center' }}>
                <Heading tag="h4" fontWeight={700}>
                  {coverage.manual}
                </Heading>
                <Text variant="caption" color="text.secondary">
                  Manual only
                </Text>
              </Wrapper>
            </LayoutGrid>
          </LayoutGrid>

          <ProgressBar
            variant="determinate"
            value={((coverage.auto + coverage.partial * 0.5) / coverage.total) * 100}
            sx={{ blockSize: 10, borderRadius: 5, marginBlockEnd: 1 }}
          />
          <Text variant="caption" color="text.secondary">
            Estimated automation coverage:{' '}
            {Math.round(((coverage.auto + coverage.partial * 0.5) / coverage.total) * 100)}% of {coverage.total}{' '}
            criteria in scope.
            {coverage.manual > 0 && ` ${coverage.manual} criteria require full manual evaluation in Step 5.`}
          </Text>

          <Divider sx={{ marginBlock: 2 }} />

          <Text variant="caption" color="text.secondary">
            Sources:{' '}
            <Link
              href="https://html5accessibility.com/stuff/2025/03/27/mind-the-wcag-automation-gap/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mind the WCAG Automation Gap
            </Link>
            {' · '}
            <Link
              href="https://www.w3.org/WAI/standards-guidelines/act/rules/"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C ACT Rules
            </Link>
          </Text>
        </Collapsible>
      </ContentCard>

      {scannablePages.length === 0 ? (
        <Alert severity="warning">
          No sample pages are configured for automated scanning. Go back to Step 2 and set at least one page to
          &quot;Automated&quot; or &quot;Both&quot; audit mode.
        </Alert>
      ) : (
        <>
          <Wrapper sx={{ display: 'flex', gap: 2, alignItems: 'center', marginBlockEnd: 3 }}>
            <Button
              variant="contained"
              startIcon={scanningPageId ? <Spinner size={20} /> : <Icon name="PlayArrow" />}
              onClick={onScanAll}
              disabled={!!scanningPageId}
            >
              {scanningPageId ? 'Scanning...' : 'Scan All Pages'}
            </Button>
            {scannedCount > 0 && (
              <Text variant="body2" color="text.secondary">
                {scannedCount}/{scannablePages.length} pages scanned — {totalViolations} violations found
              </Text>
            )}
          </Wrapper>

          <ErrorAlert error={error} />

          {scannablePages.map(({ id, title, url, ...rest }) => (
            <ScanProgressCard
              key={id}
              pageId={id}
              title={title}
              url={url}
              result={results[id]}
              isScanning={scanningPageId === id}
              isExpanded={expandedPage === id}
              expandedViolationGap={expandedViolationGap}
              approvedKeys={approvedKeys}
              dismissedKeys={dismissedKeys}
              onScan={() => onScanPage({ id, title, url, ...rest })}
              onToggleExpand={() => setExpandedPage((prev) => (prev === id ? null : id))}
              onToggleViolationGap={setExpandedViolationGap}
              onApproveViolation={onApproveViolation}
              onDismissViolation={onDismissViolation}
            />
          ))}
        </>
      )}
    </Wrapper>
  );
};

export default StepAutomatedScan;
