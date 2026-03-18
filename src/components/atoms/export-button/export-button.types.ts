import type { IconName } from '@/components/atoms/icon/icon.types';

export interface ExportButtonProps {
  label: string;
  iconName: IconName;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'contained' | 'outlined' | 'text';
}
