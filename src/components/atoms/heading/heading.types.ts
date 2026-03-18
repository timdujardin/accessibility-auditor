import type { SxProps, Theme } from '@/components/atoms/mui.types';
import type { ReactNode } from 'react';

export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps {
  tag?: HeadingTag;
  size?: HeadingTag;
  gutterBottom?: boolean;
  noWrap?: boolean;
  color?: string;
  fontWeight?: number | string;
  children: ReactNode;
  sx?: SxProps<Theme>;
}
