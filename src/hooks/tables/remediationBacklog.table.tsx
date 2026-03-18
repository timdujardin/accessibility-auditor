'use client';

import type { RemediationRow } from '@/utils/prioritization.util';

import { useMemo } from 'react';

import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { PRINCIPLE_NAMES } from '@/../config/wcag.config';
import Tag from '@/components/atoms/tag/Tag';
import Text from '@/components/atoms/text/Text';
import { IMPACT_LABEL_DISPLAY } from '@/utils/prioritization.util';

const columnHelper = createColumnHelper<RemediationRow>();

export const useRemediationBacklogTable = (data: RemediationRow[]) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor('impactLabel', {
        header: 'Impact',
        cell: (info) => {
          const impact = IMPACT_LABEL_DISPLAY[info.getValue()];

          return (
            <Tag
              label={impact.label}
              size="small"
              sx={{ backgroundColor: impact.color, color: '#fff', fontWeight: 600 }}
            />
          );
        },
      }),
      columnHelper.accessor('criterionId', { header: 'Criterion' }),
      columnHelper.accessor('criterionName', { header: 'Name' }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: (info) => (
          <Text variant="body2" noWrap sx={{ maxInlineSize: 300 }}>
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('principle', {
        header: 'Principle',
        cell: (info) => PRINCIPLE_NAMES[info.getValue()],
      }),
      columnHelper.accessor('level', { header: 'Level' }),
    ],
    [],
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table API is intentionally non-memoizable
  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
};
