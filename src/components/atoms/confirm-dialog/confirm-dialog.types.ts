import type { SxProps, Theme } from '@/components/atoms/mui.types';
import type { ReactNode } from 'react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: 'primary' | 'success' | 'error' | 'warning' | 'inherit';
  onConfirm: () => void;
  onCancel: () => void;
  sx?: SxProps<Theme>;
}
