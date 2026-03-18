'use client';

import type { FC } from 'react';

import { useCallback, useMemo, useState } from 'react';

import type { StepManualReportingProps } from './step-manual-reporting.types';

import { PRINCIPLE_NAMES } from '@/../config/wcag.config';
import Alert from '@/components/atoms/alert/Alert';
import Heading from '@/components/atoms/heading/Heading';
import { SelectFormControl, SelectInput, SelectLabel, SelectOption } from '@/components/atoms/select-input/SelectInput';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import CriterionCard from '@/components/molecules/criterion-card/CriterionCard';
import FindingForm from '@/components/molecules/finding-form/FindingForm';
import { useLocalAuditResults } from '@/hooks/localAuditResults.hooks';
import { groupCriteriaByPrinciple } from '@/utils/wcagMapping.util';

import FindingItem from './FindingItem';
import {
  findingsForResult,
  getResultForCriterion,
  handleAddFinding,
  handleDeleteFinding,
  handleObservationsChange,
  handleOutcomeChange,
  handleScreenshotUpload,
  handleValidateFinding,
  screenshotsForFinding,
} from './step-manual-reporting.callbacks';

const StepManualReporting: FC<StepManualReportingProps> = ({ samplePages, activeCriteria }) => {
  const { results, findings, screenshots, upsertResult, addFinding, updateFinding, deleteFinding, addScreenshot } =
    useLocalAuditResults();

  const [selectedPageId, setSelectedPageId] = useState<string>(samplePages[0]?.id ?? '');

  const getResult = useCallback(
    (criterionId: string) => getResultForCriterion(results, selectedPageId, criterionId),
    [results, selectedPageId],
  );

  const getFindingsForResultCb = useCallback(
    (resultId: string | null) => findingsForResult(findings, resultId),
    [findings],
  );

  const getScreenshots = useCallback(
    (findingId: string) => screenshotsForFinding(screenshots, findingId),
    [screenshots],
  );

  const onOutcomeChange = useCallback(
    (criterionId: string, outcome: Parameters<typeof handleOutcomeChange>[4]) =>
      handleOutcomeChange(results, selectedPageId, upsertResult, criterionId, outcome),
    [results, selectedPageId, upsertResult],
  );

  const onObservationsChange = useCallback(
    (criterionId: string, observations: string) =>
      handleObservationsChange(results, selectedPageId, upsertResult, criterionId, observations),
    [results, selectedPageId, upsertResult],
  );

  const onAddFinding = useCallback(
    async (criterionId: string, values: Parameters<typeof handleAddFinding>[5]) =>
      handleAddFinding(results, selectedPageId, upsertResult, addFinding, criterionId, values),
    [results, selectedPageId, upsertResult, addFinding],
  );

  const onValidateFinding = useCallback(
    (findingId: string) => handleValidateFinding(updateFinding, findingId),
    [updateFinding],
  );

  const onDeleteFinding = useCallback(
    (findingId: string) => handleDeleteFinding(deleteFinding, findingId),
    [deleteFinding],
  );

  const onScreenshotUpload = useCallback(
    async (findingId: string, storagePath: string, altText: string) =>
      handleScreenshotUpload(addScreenshot, findingId, storagePath, altText),
    [addScreenshot],
  );

  const criteriaByPrinciple = useMemo(() => groupCriteriaByPrinciple(activeCriteria), [activeCriteria]);

  if (samplePages.length === 0) {
    return <Alert severity="warning">No sample pages configured. Go back to Step 2 to add pages.</Alert>;
  }

  return (
    <Wrapper>
      <Heading tag="h2" size="h6" gutterBottom>
        Manual Reporting
      </Heading>
      <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 2 }}>
        Evaluate each criterion per sample page. Set the outcome and add findings for failures. Automated scan results
        appear as pre-filled suggestions.
      </Text>

      <SelectFormControl sx={{ marginBlockEnd: 3, minInlineSize: 300 }} size="small">
        <SelectLabel>Sample Page</SelectLabel>
        <SelectInput value={selectedPageId} label="Sample Page" onChange={(e) => setSelectedPageId(e.target.value)}>
          {samplePages.map((page) => (
            <SelectOption key={page.id} value={page.id}>
              {page.title} — {page.url}
            </SelectOption>
          ))}
        </SelectInput>
      </SelectFormControl>

      {Object.entries(PRINCIPLE_NAMES).map(([key, name]) => {
        const principle = Number(key);
        const criteria = criteriaByPrinciple[principle];
        if (criteria.length === 0) {
          return null;
        }

        return (
          <Wrapper key={principle} sx={{ marginBlockEnd: 3 }}>
            <Text variant="subtitle1" fontWeight={700} sx={{ marginBlockEnd: 1 }}>
              {principle}. {name}
            </Text>

            {criteria.map((criterion) => {
              const { outcome, observations, resultId } = getResult(criterion.id);
              const criterionFindings = getFindingsForResultCb(resultId);

              return (
                <CriterionCard
                  key={criterion.id}
                  criterion={criterion}
                  outcome={outcome}
                  observations={observations}
                  findingsCount={criterionFindings.length}
                  onOutcomeChange={(o) => onOutcomeChange(criterion.id, o)}
                  onObservationsChange={(o) => onObservationsChange(criterion.id, o)}
                >
                  {criterionFindings.map((finding) => (
                    <FindingItem
                      key={finding.id}
                      finding={finding}
                      existingScreenshots={getScreenshots(finding.id)}
                      onValidate={onValidateFinding}
                      onDelete={onDeleteFinding}
                      onUpload={onScreenshotUpload}
                    />
                  ))}

                  {outcome === 'failed' && (
                    <Wrapper sx={{ marginBlockStart: 2 }}>
                      <Text variant="subtitle2" sx={{ marginBlockEnd: 1 }}>
                        Add Finding
                      </Text>
                      <FindingForm onSubmit={(values) => onAddFinding(criterion.id, values)} />
                    </Wrapper>
                  )}
                </CriterionCard>
              );
            })}
          </Wrapper>
        );
      })}
    </Wrapper>
  );
};

export default StepManualReporting;
