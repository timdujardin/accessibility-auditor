import type { FC } from 'react';

import { memo } from 'react';

import type { IconProps } from './icon.types';

import { ICON_REGISTRY } from './icon.generated';

const IconBase: FC<IconProps> = ({ name, accessibleName, ...svgIconProps }) => {
  const MuiIcon = ICON_REGISTRY[name];

  return <MuiIcon {...svgIconProps} aria-label={accessibleName} aria-hidden={!accessibleName} />;
};

const Icon = memo(IconBase);

export default Icon;
