import type { AuditStatus } from '@/@types/audit';
import type { TagProps } from '@/components/atoms/tag/tag.types';

export interface StatusBadgeProps {
  status: AuditStatus;
  size?: TagProps['size'];
}
