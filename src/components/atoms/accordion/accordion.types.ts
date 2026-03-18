import type { SxProps, Theme } from '@/components/atoms/mui.types';
import type { ReactNode, SyntheticEvent } from 'react';

export interface AccordionProps {
  summary: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onChange?: (event: SyntheticEvent, isExpanded: boolean) => void;
  sx?: SxProps<Theme>;
}
