'use client';

import type { FC } from 'react';

import type { ExecutiveSummaryCardProps } from './executive-summary-card.types';

import Alert from '@/components/atoms/alert/Alert';
import Button from '@/components/atoms/button/Button';
import Icon from '@/components/atoms/icon/Icon';
import Spinner from '@/components/atoms/spinner/Spinner';
import TextInput from '@/components/atoms/text-input/TextInput';
import Text from '@/components/atoms/text/Text';

const ExecutiveSummaryCard: FC<ExecutiveSummaryCardProps> = ({
  executiveSummary,
  isGenerating,
  aiError,
  onSummaryChange,
  onGenerate,
}) => {
  return (
    <>
      <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 1 }}>
        Executive Summary
      </Text>

      <Button
        variant="outlined"
        startIcon={isGenerating ? <Spinner size={18} /> : <Icon name="AutoAwesome" />}
        onClick={onGenerate}
        disabled={isGenerating}
        sx={{ marginBlockEnd: 2 }}
      >
        {isGenerating ? 'Generating...' : 'Generate with AI'}
      </Button>

      {aiError ? (
        <Alert severity="warning" sx={{ marginBlockEnd: 2 }}>
          {aiError}
        </Alert>
      ) : null}

      <TextInput
        fullWidth
        multiline
        minRows={8}
        value={executiveSummary}
        onChange={(e) => onSummaryChange(e.target.value)}
        placeholder="Write or generate an executive summary for this accessibility audit report..."
      />
    </>
  );
};

export default ExecutiveSummaryCard;
