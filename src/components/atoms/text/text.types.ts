import type { SxProps, Theme } from '@/components/atoms/mui.types';
import type { ElementType, ReactNode } from 'react';

export type TextVariant = 'body1' | 'body2' | 'subtitle1' | 'subtitle2' | 'caption' | 'overline';

export interface TextProps {
  variant?: TextVariant;
  color?: string;
  fontWeight?: number | string;
  noWrap?: boolean;
  children: ReactNode;
  component?: ElementType;
  sx?: SxProps<Theme>;
}
