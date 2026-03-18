import type { TestabilityLevel } from '@/@types/criteria';
import type { TagProps } from '@/components/atoms/tag/tag.types';

export interface TestabilityBadgeProps {
  level: TestabilityLevel;
  size?: TagProps['size'];
}
