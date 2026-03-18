import type { FindingPriority } from '@/@types/finding';
import type { TagProps } from '@/components/atoms/tag/tag.types';

export interface PriorityChipProps {
  priority: FindingPriority;
  size?: TagProps['size'];
}
