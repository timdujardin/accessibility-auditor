import type { FC } from 'react';

import type { AuditScopeCardProps } from './audit-scope-card.types';

import ContentCard from '@/components/atoms/content-card/ContentCard';
import Tag from '@/components/atoms/tag/Tag';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';

const AuditScopeCard: FC<AuditScopeCardProps> = ({
  label,
  description,
  criteriaCount,
  coveragePercent,
  selected,
  isAdvanced = false,
  onSelect,
}) => {
  const color = isAdvanced ? 'secondary' : 'primary';

  return (
    <ContentCard
      actionArea
      onClick={onSelect}
      sx={{
        borderColor: selected ? `${color}.main` : undefined,
        borderWidth: selected ? 2 : 1,
        blockSize: '100%',
      }}
      contentSx={{ inlineSize: '100%' }}
    >
      <Wrapper sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: 1 }}>
        <Text variant="subtitle1" fontWeight={700}>
          {label}
        </Text>
        <Tag label={`${criteriaCount} criteria`} size="small" color={selected ? color : 'default'} />
      </Wrapper>
      <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 1 }}>
        {description}
      </Text>
      {coveragePercent !== undefined && (
        <Tag label={`${coveragePercent}% WCAG 2.2 AA coverage`} size="small" variant="outlined" />
      )}
    </ContentCard>
  );
};

export default AuditScopeCard;
