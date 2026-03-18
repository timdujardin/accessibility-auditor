import type { ReactNode } from 'react';

export interface NavItemProps {
  label: string;
  path: string;
  icon: ReactNode;
  selected: boolean;
  onClick: () => void;
}
