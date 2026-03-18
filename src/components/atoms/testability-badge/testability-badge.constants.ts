import type { TestabilityLevel } from '@/@types/criteria';
import type { IconName } from '@/components/atoms/icon/icon.types';
import type { SemanticColor } from '@/utils/color.util';

export const TESTABILITY_DISPLAY: Record<
  TestabilityLevel,
  { label: string; iconName: IconName; color: SemanticColor }
> = {
  auto: { label: 'Fully Automatable', iconName: 'SmartToy', color: 'success' },
  partial: { label: 'Partially Automatable', iconName: 'Tune', color: 'warning' },
  manual: { label: 'Manual Only', iconName: 'Person', color: 'neutral' },
};
