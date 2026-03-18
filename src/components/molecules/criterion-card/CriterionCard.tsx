'use client';

import type { ConformanceLevel, EvaluationOutcome } from '@/@types/criteria';
import type { FC } from 'react';

import { useState } from 'react';

import type { CriterionCardProps } from './criterion-card.types';

import Accordion from '@/components/atoms/accordion/Accordion';
import ConformanceIcon from '@/components/atoms/conformance-icon/ConformanceIcon';
import Link from '@/components/atoms/link/Link';
import { SelectFormControl, SelectInput, SelectLabel, SelectOption } from '@/components/atoms/select-input/SelectInput';
import TextInput from '@/components/atoms/text-input/TextInput';
import Text from '@/components/atoms/text/Text';
import WcagLevelBadge from '@/components/atoms/wcag-level-badge/WcagLevelBadge';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import { pluralize } from '@/utils/format.util';

const CriterionCard: FC<CriterionCardProps> = ({
  criterion,
  outcome,
  observations,
  findingsCount,
  onOutcomeChange,
  onObservationsChange,
  children,
}) => {
  const { id, name, level, description, url } = criterion;
  const [expanded, setExpanded] = useState(outcome === 'failed');

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      summary={
        <Wrapper sx={{ display: 'flex', alignItems: 'center', gap: 1.5, inlineSize: '100%' }}>
          <ConformanceIcon outcome={outcome} />
          <Text variant="subtitle2" fontWeight={600} sx={{ minInlineSize: 48 }}>
            {id}
          </Text>
          <Text variant="body2" sx={{ flexGrow: 1 }}>
            {name}
          </Text>
          <WcagLevelBadge level={level as ConformanceLevel} />
          {findingsCount > 0 && (
            <Text variant="caption" color="error.main" fontWeight={600}>
              {pluralize(findingsCount, 'issue')}
            </Text>
          )}
        </Wrapper>
      }
      sx={{ '&:before': { display: 'none' } }}
    >
      <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 2 }}>
        {description}{' '}
        <Link href={url} target="_blank" rel="noopener noreferrer" variant="body2">
          Understanding {id}
        </Link>
      </Text>

      <Wrapper sx={{ display: 'flex', gap: 2, marginBlockEnd: 2 }}>
        <SelectFormControl size="small" sx={{ minInlineSize: 160 }}>
          <SelectLabel>Outcome</SelectLabel>
          <SelectInput
            value={outcome}
            label="Outcome"
            onChange={(e) => onOutcomeChange(e.target.value as EvaluationOutcome)}
          >
            <SelectOption value="untested">Not tested</SelectOption>
            <SelectOption value="passed">Passed</SelectOption>
            <SelectOption value="failed">Failed</SelectOption>
            <SelectOption value="inapplicable">Not applicable</SelectOption>
            <SelectOption value="cantTell">Cannot tell</SelectOption>
          </SelectInput>
        </SelectFormControl>
        <TextInput
          label="Observations"
          size="small"
          fullWidth
          multiline
          minRows={1}
          value={observations}
          onChange={(e) => onObservationsChange(e.target.value)}
        />
      </Wrapper>

      {children}
    </Accordion>
  );
};

export default CriterionCard;
