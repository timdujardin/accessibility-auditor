import type { FC } from 'react';

import type { AuditTypeCardProps } from './audit-type-card.types';

import ContentCard from '@/components/atoms/content-card/ContentCard';
import ScopeIcon from '@/components/atoms/scope-icon/ScopeIcon';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';

const AuditTypeCard: FC<AuditTypeCardProps> = ({ label, description, iconKey, selected, onSelect }) => {
  return (
    <ContentCard
      actionArea
      onClick={onSelect}
      sx={{
        borderColor: selected ? 'primary.main' : undefined,
        borderWidth: selected ? 2 : 1,
      }}
      contentSx={{ textAlign: 'center', paddingBlock: 3 }}
    >
      <Wrapper>
        <ScopeIcon iconKey={iconKey} active={selected} />
      </Wrapper>
      <Text variant="subtitle1" fontWeight={600} sx={{ marginBlockStart: 1 }}>
        {label}
      </Text>
      <Text variant="caption" color="text.secondary">
        {description}
      </Text>
    </ContentCard>
  );
};

export default AuditTypeCard;
