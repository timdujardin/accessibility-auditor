'use client';

import type { FC } from 'react';

import type { StatusBadgeProps } from './status-badge.types';

import { STATUS_DISPLAY } from '@/../config/audit.config';
import Tag from '@/components/atoms/tag/Tag';
import { toMuiColor } from '@/utils/color.util';

const StatusBadge: FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  const { label, color } = STATUS_DISPLAY[status];

  return <Tag label={label} color={toMuiColor(color)} size={size} />;
};

export default StatusBadge;
