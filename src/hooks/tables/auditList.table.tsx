'use client';

import type { AuditScope, AuditStatus } from '@/@types/audit';

import { useMemo } from 'react';

import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

import { SCOPE_LABELS_SHORT, STATUS_DISPLAY } from '@/../config/audit.config';
import StatusBadge from '@/components/atoms/status-badge/StatusBadge';
import Tag from '@/components/atoms/tag/Tag';
import Text from '@/components/atoms/text/Text';
import { toMuiColor } from '@/utils/color.util';
import { displayValue, formatDate, humanize } from '@/utils/format.util';

export interface AuditListRow {
  id: string;
  title: string;
  commissioner: string;
  audit_type?: string;
  audit_scope: AuditScope;
  status: AuditStatus;
  created_at: string;
  updated_at: string;
}

interface UseAuditListTableOptions {
  showType?: boolean;
  showCreated?: boolean;
  showUpdated?: boolean;
  useStatusBadge?: boolean;
}

const columnHelper = createColumnHelper<AuditListRow>();

export const useAuditListTable = (data: AuditListRow[], options: UseAuditListTableOptions = {}) => {
  const { showType = false, showCreated = false, showUpdated = true, useStatusBadge = false } = options;

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor('title', {
          header: 'Title',
          cell: (info) => <Text fontWeight={600}>{info.getValue() || 'Untitled Audit'}</Text>,
        }),
        columnHelper.accessor('commissioner', {
          header: 'Commissioner',
          cell: (info) => displayValue(info.getValue()),
        }),
        showType
          ? columnHelper.accessor('audit_type', {
              header: 'Type',
              cell: (info) => humanize(info.getValue() ?? ''),
            })
          : null,
        columnHelper.accessor('audit_scope', {
          header: 'Scope',
          cell: (info) => <Tag label={SCOPE_LABELS_SHORT[info.getValue()]} size="small" variant="outlined" />,
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          cell: (info) =>
            useStatusBadge ? (
              <StatusBadge status={info.getValue()} />
            ) : (
              <Tag
                label={STATUS_DISPLAY[info.getValue()].label}
                size="small"
                color={toMuiColor(STATUS_DISPLAY[info.getValue()].color)}
              />
            ),
        }),
        showCreated
          ? columnHelper.accessor('created_at', {
              header: 'Created',
              cell: (info) => formatDate(info.getValue()),
            })
          : null,
        showUpdated
          ? columnHelper.accessor('updated_at', {
              header: 'Last Updated',
              cell: (info) => formatDate(info.getValue()),
            })
          : null,
      ].filter(Boolean) as ReturnType<typeof columnHelper.accessor>[],
    [showType, showCreated, showUpdated, useStatusBadge],
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table API is intentionally non-memoizable
  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
};
