'use client';

import type { UserRole } from '@/@types/user';

import { useMemo } from 'react';

import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import IconButton from '@/components/atoms/icon-button/IconButton';
import Icon from '@/components/atoms/icon/Icon';
import Tag from '@/components/atoms/tag/Tag';
import Text from '@/components/atoms/text/Text';
import Tooltip from '@/components/atoms/tooltip/Tooltip';
import { displayValue, formatDate } from '@/utils/format.util';

export interface UserRow {
  id: string;
  email: string;
  full_name: string;
  organization: string;
  role: UserRole;
  created_at: string;
}

interface UseUserManagementTableOptions {
  currentUserId: string;
  onEditRole: (user: UserRow) => void;
}

const columnHelper = createColumnHelper<UserRow>();

export const useUserManagementTable = (data: UserRow[], options: UseUserManagementTableOptions) => {
  const { currentUserId, onEditRole } = options;

  const columns = useMemo(
    () => [
      columnHelper.accessor('full_name', {
        header: 'Name',
        cell: (info) => <Text fontWeight={600}>{displayValue(info.getValue())}</Text>,
      }),
      columnHelper.accessor('email', { header: 'Email' }),
      columnHelper.accessor('organization', {
        header: 'Organization',
        cell: (info) => displayValue(info.getValue()),
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: (info) => (
          <Tag
            label={info.getValue()}
            size="small"
            color={info.getValue() === 'admin' ? 'secondary' : 'default'}
            sx={{ textTransform: 'capitalize' }}
          />
        ),
      }),
      columnHelper.accessor('created_at', {
        header: 'Joined',
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        meta: { align: 'right' as const },
        cell: (info) => (
          <Tooltip title="Change role">
            <IconButton
              size="small"
              onClick={() => onEditRole(info.row.original)}
              disabled={info.row.original.id === currentUserId}
              aria-label={`Edit role for ${info.row.original.full_name}`}
            >
              <Icon name="Edit" fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      }),
    ],
    [currentUserId, onEditRole],
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table API is intentionally non-memoizable
  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
};
