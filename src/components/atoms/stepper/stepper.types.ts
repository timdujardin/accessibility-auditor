import type { SxProps, Theme } from '@/components/atoms/mui.types';

export interface StepItem {
  label: string;
}

export interface StepperProps {
  steps: StepItem[];
  activeStep: number;
  sx?: SxProps<Theme>;
}
