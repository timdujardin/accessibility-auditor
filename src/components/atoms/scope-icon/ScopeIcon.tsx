import type { FC } from 'react';

import type { ScopeIconProps } from './scope-icon.types';

import Icon from '@/components/atoms/icon/Icon';

import { SCOPE_ICON_MAP } from './scope-icon.constants';

const ScopeIcon: FC<ScopeIconProps> = ({ iconKey, active = false }) => {
  if (!(iconKey in SCOPE_ICON_MAP)) {
    return null;
  }

  return <Icon name={SCOPE_ICON_MAP[iconKey]} sx={{ fontSize: 32 }} color={active ? 'primary' : 'inherit'} />;
};

export default ScopeIcon;
