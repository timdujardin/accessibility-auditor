'use client';

import type { FC } from 'react';

import type { PriorityChipProps } from './priority-chip.types';

import { PRIORITY_DISPLAY } from '@/../config/audit.config';
import Tag from '@/components/atoms/tag/Tag';
import { toMuiColor } from '@/utils/color.util';

const PriorityChip: FC<PriorityChipProps> = ({ priority, size = 'small' }) => {
  const { label, color } = PRIORITY_DISPLAY[priority];

  return <Tag label={label} color={toMuiColor(color)} size={size} />;
};

export default PriorityChip;
