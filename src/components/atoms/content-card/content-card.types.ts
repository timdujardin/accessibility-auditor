import type { SxProps, Theme } from '@/components/atoms/mui.types';
import type { ReactNode } from 'react';

export interface ContentCardProps {
  children: ReactNode;
  variant?: 'elevation' | 'outlined';
  actionArea?: boolean;
  onClick?: () => void;
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
}
