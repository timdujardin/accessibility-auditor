'use client';

import type { RemediationRow } from '@/utils/prioritization.util';
import type { FC } from 'react';

import { useCallback, useMemo } from 'react';

import { useCopyToClipboard } from 'react-use';

import type { StepNextStepsProps } from './step-next-steps.types';

import { WCAG_CRITERIA } from '@/../config/wcag.config';
import Alert from '@/components/atoms/alert/Alert';
import ContentCard from '@/components/atoms/content-card/ContentCard';
import ExportButton from '@/components/atoms/export-button/ExportButton';
import Heading from '@/components/atoms/heading/Heading';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import ContactFormCard from '@/components/molecules/contact-form-card/ContactFormCard';
import DataTable from '@/components/molecules/data-table/DataTable';
import StatementGuidanceCard from '@/components/molecules/statement-guidance-card/StatementGuidanceCard';
import { useLocalAuditResults } from '@/hooks/localAuditResults.hooks';
import { useRemediationBacklogTable } from '@/hooks/tables/remediationBacklog.table';
import { findResultById, getUnresolvableFindings } from '@/utils/findings.util';
import { mapPriorityToImpactLabel, sortRemediationRows } from '@/utils/prioritization.util';

import { handleContactChange, handleCopyBacklog, handleExportCsv } from './step-next-steps.callbacks';
import { DEFAULT_STATEMENT_GUIDANCE } from './step-next-steps.constants';

const StepNextSteps: FC<StepNextStepsProps> = ({
  statementGuidance,
  ownerContactPhone,
  ownerContactEmail,
  ownerContactAddress,
  onUpdate,
}) => {
  const { results, findings } = useLocalAuditResults();
  const [clipboardState, copyToClipboard] = useCopyToClipboard();

  const guidanceText = statementGuidance || DEFAULT_STATEMENT_GUIDANCE;

  const onContactChange = useCallback(
    (data: { ownerContactPhone?: string; ownerContactEmail?: string; ownerContactAddress?: string }) =>
      handleContactChange(onUpdate, data),
    [onUpdate],
  );

  const remediationRows = useMemo((): RemediationRow[] => {
    const rows: RemediationRow[] = [];
    for (const { audit_result_id, description, priority } of findings) {
      const result = findResultById(results, audit_result_id);
      if (!result) {
        continue;
      }
      const criterion = WCAG_CRITERIA.find((c) => c.id === result.criterion_id);
      if (!criterion) {
        continue;
      }

      const { id, name, principle, level } = criterion;
      rows.push({
        criterionId: id,
        criterionName: name,
        samplePageTitle: result.sample_page_id,
        description,
        impactLabel: mapPriorityToImpactLabel(priority),
        priority,
        principle,
        level,
      });
    }
    return sortRemediationRows(rows);
  }, [findings, results]);

  const remediationTable = useRemediationBacklogTable(remediationRows);

  const unresolvableFindings = getUnresolvableFindings(findings);

  const onExportCsv = useCallback(() => handleExportCsv(remediationRows), [remediationRows]);

  const onCopyBacklog = useCallback(
    () => handleCopyBacklog(remediationRows, copyToClipboard),
    [remediationRows, copyToClipboard],
  );

  return (
    <Wrapper>
      <Heading tag="h2" size="h6" gutterBottom>
        Next Steps & Remediation
      </Heading>
      <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 3 }}>
        Post-audit guidance for the client, including accessibility statement requirements, a remediation backlog, and
        handling of unresolvable issues.
      </Text>

      {/* Section A: Accessibility Statement */}
      <ContentCard variant="outlined" sx={{ marginBlockEnd: 3 }}>
        <Text variant="subtitle1" fontWeight={700} sx={{ marginBlockEnd: 2 }}>
          A. Accessibility Statement
        </Text>

        <ContactFormCard
          ownerContactPhone={ownerContactPhone}
          ownerContactEmail={ownerContactEmail}
          ownerContactAddress={ownerContactAddress}
          onContactChange={onContactChange}
        />

        <StatementGuidanceCard
          guidanceText={guidanceText}
          onGuidanceChange={(text) => onUpdate({ statementGuidance: text })}
        />
      </ContentCard>

      {/* Section B: Remediation Backlog */}
      <ContentCard variant="outlined" sx={{ marginBlockEnd: 3 }}>
        <Wrapper sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: 2 }}>
          <Text variant="subtitle1" fontWeight={700}>
            B. Remediation Backlog
          </Text>
          <Wrapper sx={{ display: 'flex', gap: 1 }}>
            <ExportButton
              label={clipboardState.value ? 'Copied!' : 'Copy'}
              iconName="ContentCopy"
              onClick={onCopyBacklog}
            />
            <ExportButton label="Export CSV" iconName="Download" onClick={onExportCsv} />
          </Wrapper>
        </Wrapper>

        <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 1 }}>
          Sorted by: (1) Impact — high priority / warning / best practice, (2) Principle — POUR, (3) Conformance level —
          A, AA, AAA.
        </Text>

        {remediationRows.length === 0 ? (
          <Alert severity="info">No findings to display in the backlog.</Alert>
        ) : (
          <DataTable table={remediationTable} size="small" stickyHeader maxHeight={500} />
        )}
      </ContentCard>

      {/* Section C: Unresolvable Issues */}
      <ContentCard variant="outlined">
        <Text variant="subtitle1" fontWeight={700} sx={{ marginBlockEnd: 1 }}>
          C. Unresolvable Issues
        </Text>
        <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 2 }}>
          Flag findings that cannot be resolved (e.g., third-party dependencies) and document the alternative solution
          provided. These should be included in the Accessibility Statement.
        </Text>

        <Alert severity="info" sx={{ marginBlockEnd: 2 }}>
          <Text variant="body2">
            <strong>Examples of alternatives:</strong>
          </Text>
          <Text variant="body2" component="ul" sx={{ marginBlock: 0.5, paddingInlineStart: 2 }}>
            <li>
              &quot;Several videos use YouTube. As an alternative, the videos are provided as MP4 files on our
              server.&quot;
            </li>
            <li>
              &quot;Our website links to GitHub for input. As an alternative, an e-mail address is included for
              providing input.&quot;
            </li>
          </Text>
        </Alert>

        {unresolvableFindings.length === 0 ? (
          <Text variant="body2" color="text.secondary">
            No findings have been marked as unresolvable. You can flag findings in Step 5 (Manual Reporting).
          </Text>
        ) : (
          unresolvableFindings.map(({ id, description, alternative_solution }) => (
            <ContentCard
              key={id}
              variant="outlined"
              sx={{ marginBlockEnd: 1 }}
              contentSx={{ paddingBlockEnd: '12px !important' }}
            >
              <Text variant="body2" fontWeight={600}>
                {description}
              </Text>
              <Text variant="body2" color="text.secondary" sx={{ marginBlockStart: 0.5 }}>
                <strong>Alternative:</strong> {alternative_solution || 'No alternative documented yet.'}
              </Text>
            </ContentCard>
          ))
        )}
      </ContentCard>
    </Wrapper>
  );
};

export default StepNextSteps;
