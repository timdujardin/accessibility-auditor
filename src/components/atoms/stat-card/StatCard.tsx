import type { FC } from 'react';

import type { StatCardProps } from './stat-card.types';

import ContentCard from '@/components/atoms/content-card/ContentCard';
import Heading from '@/components/atoms/heading/Heading';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';

const StatCard: FC<StatCardProps> = ({ value, label, color, icon }) => {
  return (
    <ContentCard
      contentSx={{ display: 'flex', alignItems: 'center', gap: icon ? 2 : 0, textAlign: icon ? 'left' : 'center' }}
    >
      {icon}
      <Wrapper>
        <Heading tag="h3" color={color}>
          {value}
        </Heading>
        <Text variant="body2" color="text.secondary">
          {label}
        </Text>
      </Wrapper>
    </ContentCard>
  );
};

export default StatCard;
