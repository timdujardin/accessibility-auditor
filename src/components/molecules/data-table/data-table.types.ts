import type { SxProps, Theme } from '@/components/atoms/mui.types';
import type { Table } from '@tanstack/react-table';

export interface DataTableProps<TData> {
  table: Table<TData>;
  size?: 'small' | 'medium';
  stickyHeader?: boolean;
  maxHeight?: number | string;
  emptyMessage?: string;
  onRowClick?: (row: TData) => void;
  sx?: SxProps<Theme>;
}
