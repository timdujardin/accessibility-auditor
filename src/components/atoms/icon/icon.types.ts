import type { SvgIconProps } from '@mui/material/SvgIcon';

import type { IconName } from './icon.generated';

export type { IconName };

export interface IconProps extends Omit<SvgIconProps, 'children'> {
  name: IconName;
  accessibleName?: string;
}
