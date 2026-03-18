'use client';

import type { FC } from 'react';

import type { TestabilityBadgeProps } from './testability-badge.types';

import Icon from '@/components/atoms/icon/Icon';
import Tag from '@/components/atoms/tag/Tag';
import { toMuiColor } from '@/utils/color.util';

import { TESTABILITY_DISPLAY } from './testability-badge.constants';

const TestabilityBadge: FC<TestabilityBadgeProps> = ({ level, size = 'small' }) => {
  const { label, iconName, color } = TESTABILITY_DISPLAY[level];

  return <Tag icon={<Icon name={iconName} />} label={label} color={toMuiColor(color)} size={size} variant="outlined" />;
};

export default TestabilityBadge;
