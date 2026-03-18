'use client';

import type { FC } from 'react';

import { useCallback } from 'react';

import type { StepAuditorSummaryProps } from './step-auditor-summary.types';

import { SCOPE_LABELS_LONG } from '@/../config/audit.config';
import ContentCard from '@/components/atoms/content-card/ContentCard';
import Divider from '@/components/atoms/divider/Divider';
import Heading from '@/components/atoms/heading/Heading';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import ExecutiveSummaryCard from '@/components/molecules/executive-summary-card/ExecutiveSummaryCard';
import { useAuth } from '@/contexts/AuthContext';
import { useAction } from '@/hooks/api.hooks';
import { useLocalAuditResults } from '@/hooks/localAuditResults.hooks';
import { generateSummary } from '@/services/ai.service';
import { countFindingsByPriority, countFindingsByPriorityMap } from '@/utils/findings.util';
import { displayValue, formatDate } from '@/utils/format.util';

const StepAuditorSummary: FC<StepAuditorSummaryProps> = ({
  auditTitle,
  auditScope,
  executiveSummary,
  onSummaryChange,
}) => {
  const { user } = useAuth();
  const { findings } = useLocalAuditResults();
  const { action: doGenerate, status: generateStatus, error: generateError } = useAction(generateSummary);
  const isGenerating = generateStatus === 'loading';
  const aiError = generateError?.message ?? null;

  const handleGenerateSummary = useCallback(async () => {
    try {
      const summary = await doGenerate(auditTitle, SCOPE_LABELS_LONG[auditScope], {
        totalFindings: findings.length,
        findingsByPriority: countFindingsByPriorityMap(findings),
        conformancePercentage: 0,
      });
      onSummaryChange(summary);
    } catch {
      // Error state managed by useAction
    }
  }, [auditTitle, auditScope, findings, onSummaryChange, doGenerate]);

  return (
    <Wrapper>
      <Heading tag="h2" size="h6" gutterBottom>
        Auditor Details & Executive Summary
      </Heading>
      <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 3 }}>
        Review your auditor information and create an executive summary for the audit report.
      </Text>

      <ContentCard variant="outlined" sx={{ marginBlockEnd: 3 }}>
        <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 2 }}>
          Auditor Information
        </Text>
        <Wrapper sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Wrapper>
            <Text variant="body2" color="text.secondary">
              Name
            </Text>
            <Text>{displayValue(user?.fullName)}</Text>
          </Wrapper>
          <Wrapper>
            <Text variant="body2" color="text.secondary">
              Organization
            </Text>
            <Text>{displayValue(user?.organization)}</Text>
          </Wrapper>
          <Wrapper>
            <Text variant="body2" color="text.secondary">
              Email
            </Text>
            <Text>{displayValue(user?.email)}</Text>
          </Wrapper>
          <Wrapper>
            <Text variant="body2" color="text.secondary">
              Date
            </Text>
            <Text>{formatDate(new Date())}</Text>
          </Wrapper>
        </Wrapper>
      </ContentCard>

      <Divider sx={{ marginBlockEnd: 3 }} />

      <ContentCard variant="outlined" sx={{ marginBlockEnd: 3 }}>
        <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 1 }}>
          Audit Overview
        </Text>
        <Wrapper sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Wrapper>
            <Text variant="body2" color="text.secondary">
              Scope
            </Text>
            <Text>{SCOPE_LABELS_LONG[auditScope]}</Text>
          </Wrapper>
          <Wrapper>
            <Text variant="body2" color="text.secondary">
              Total Findings
            </Text>
            <Text>{findings.length}</Text>
          </Wrapper>
          <Wrapper>
            <Text variant="body2" color="text.secondary">
              Critical
            </Text>
            <Text color="error.main">{countFindingsByPriority(findings, 'critical')}</Text>
          </Wrapper>
          <Wrapper>
            <Text variant="body2" color="text.secondary">
              Major
            </Text>
            <Text color="warning.main">{countFindingsByPriority(findings, 'major')}</Text>
          </Wrapper>
        </Wrapper>
      </ContentCard>

      <ExecutiveSummaryCard
        executiveSummary={executiveSummary}
        isGenerating={isGenerating}
        aiError={aiError}
        onSummaryChange={onSummaryChange}
        onGenerate={handleGenerateSummary}
      />
    </Wrapper>
  );
};

export default StepAuditorSummary;
