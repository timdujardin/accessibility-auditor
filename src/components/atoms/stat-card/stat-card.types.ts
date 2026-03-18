import type { ReactNode } from 'react';

export interface StatCardProps {
  value: string | number;
  label: string;
  color?: string;
  icon?: ReactNode;
}
