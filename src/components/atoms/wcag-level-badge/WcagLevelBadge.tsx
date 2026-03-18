'use client';

import type { FC } from 'react';

import type { WcagLevelBadgeProps } from './wcag-level-badge.types';

import Tag from '@/components/atoms/tag/Tag';
import { toMuiColor } from '@/utils/color.util';

import { CONFORMANCE_LEVEL_COLORS } from './wcag-level-badge.constants';

const WcagLevelBadge: FC<WcagLevelBadgeProps> = ({ level, size = 'small' }) => {
  return (
    <Tag
      label={`Level ${level}`}
      color={toMuiColor(CONFORMANCE_LEVEL_COLORS[level])}
      size={size}
      variant="outlined"
      sx={{ fontWeight: 600, minInlineSize: 72 }}
    />
  );
};

export default WcagLevelBadge;
