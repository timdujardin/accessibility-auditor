'use client';

import type { IconName } from '@/components/atoms/icon/icon.types';
import type { FC } from 'react';

import type { ConformanceIconProps } from './conformance-icon.types';

import { OUTCOME_DISPLAY } from '@/../config/audit.config';
import Icon from '@/components/atoms/icon/Icon';
import Tooltip from '@/components/atoms/tooltip/Tooltip';

const OUTCOME_SX: Record<string, { color: string }> = {
  success: { color: 'success.main' },
  error: { color: 'error.main' },
  warning: { color: 'warning.main' },
  neutral: { color: 'text.disabled' },
};

const ConformanceIcon: FC<ConformanceIconProps> = ({ outcome }) => {
  const { label, iconName, color } = OUTCOME_DISPLAY[outcome];

  return (
    <Tooltip title={label}>
      <Icon name={iconName as IconName} sx={OUTCOME_SX[color] ?? {}} fontSize="small" />
    </Tooltip>
  );
};

export default ConformanceIcon;
