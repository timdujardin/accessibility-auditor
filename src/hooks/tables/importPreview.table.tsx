'use client';

import { useMemo } from 'react';

import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { OUTCOME_DISPLAY } from '@/../config/audit.config';
import Tag from '@/components/atoms/tag/Tag';
import Text from '@/components/atoms/text/Text';
import { toMuiColor } from '@/utils/color.util';
import { displayValue } from '@/utils/format.util';

export interface ImportResultRow {
  criterionId: string;
  outcome: string;
  description: string;
}

const columnHelper = createColumnHelper<ImportResultRow>();

export const useImportPreviewTable = (data: ImportResultRow[]) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor('criterionId', { header: 'Criterion' }),
      columnHelper.accessor('outcome', {
        header: 'Outcome',
        cell: (info) => (
          <Tag
            label={info.getValue()}
            size="small"
            color={toMuiColor(OUTCOME_DISPLAY[info.getValue() as keyof typeof OUTCOME_DISPLAY].color)}
          />
        ),
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: (info) => (
          <Text variant="body2" noWrap sx={{ maxInlineSize: 300 }}>
            {displayValue(info.getValue())}
          </Text>
        ),
      }),
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
