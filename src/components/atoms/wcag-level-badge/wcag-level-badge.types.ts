import type { ConformanceLevel } from '@/@types/criteria';
import type { TagProps } from '@/components/atoms/tag/tag.types';

export interface WcagLevelBadgeProps {
  level: ConformanceLevel;
  size?: TagProps['size'];
}
