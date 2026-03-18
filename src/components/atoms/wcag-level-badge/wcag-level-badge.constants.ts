import type { ConformanceLevel } from '@/@types/criteria';
import type { SemanticColor } from '@/utils/color.util';

export const CONFORMANCE_LEVEL_COLORS: Record<ConformanceLevel, SemanticColor> = {
  A: 'success',
  AA: 'primary',
  AAA: 'secondary',
};
