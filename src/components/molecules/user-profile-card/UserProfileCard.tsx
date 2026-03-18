'use client';

import type { FC } from 'react';

import type { UserProfileCardProps } from './user-profile-card.types';

import Button from '@/components/atoms/button/Button';
import Icon from '@/components/atoms/icon/Icon';
import Tag from '@/components/atoms/tag/Tag';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';

const UserProfileCard: FC<UserProfileCardProps> = ({ fullName, email, isAdmin, onSignOut }) => {
  return (
    <Wrapper sx={{ padding: 2 }}>
      <Text variant="body2" color="text.secondary" noWrap>
        {fullName}
      </Text>
      <Wrapper sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBlockStart: 0.5 }}>
        <Text variant="caption" color="text.secondary" noWrap>
          {email}
        </Text>
        {isAdmin ? <Tag label="Admin" size="small" color="secondary" /> : null}
      </Wrapper>
      <Button
        variant="outlined"
        size="small"
        startIcon={<Icon name="Logout" />}
        onClick={onSignOut}
        fullWidth
        sx={{ marginBlockStart: 1.5 }}
      >
        Sign Out
      </Button>
    </Wrapper>
  );
};

export default UserProfileCard;
