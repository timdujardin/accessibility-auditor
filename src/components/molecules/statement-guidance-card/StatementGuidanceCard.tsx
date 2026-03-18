'use client';

import type { FC } from 'react';

import type { StatementGuidanceCardProps } from './statement-guidance-card.types';

import Link from '@/components/atoms/link/Link';
import TextInput from '@/components/atoms/text-input/TextInput';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';

const StatementGuidanceCard: FC<StatementGuidanceCardProps> = ({ guidanceText, onGuidanceChange }) => {
  return (
    <>
      <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 1 }}>
        Statement Guidance
      </Text>
      <TextInput
        fullWidth
        multiline
        minRows={6}
        value={guidanceText}
        onChange={(e) => onGuidanceChange(e.target.value)}
      />

      <Wrapper sx={{ display: 'flex', gap: 2, marginBlockStart: 2, flexWrap: 'wrap' }}>
        <Link href="https://www.w3.org/WAI/planning/statements/" target="_blank" rel="noopener noreferrer">
          W3C Statement Generator (EN)
        </Link>
        <Link href="https://assistant.accessibility.belgium.be/" target="_blank" rel="noopener noreferrer">
          Belgian Statement Generator (NL)
        </Link>
        <Link href="https://www.w3.org/WAI/policies/" target="_blank" rel="noopener noreferrer">
          W3C Laws & Policies
        </Link>
      </Wrapper>
    </>
  );
};

export default StatementGuidanceCard;
