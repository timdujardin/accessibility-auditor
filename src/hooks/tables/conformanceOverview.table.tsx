'use client';

import type { ConformanceLevel, EvaluationOutcome } from '@/@types/criteria';
import type { SamplePageRef } from '@/@types/sample';
import type { ConformanceOverviewRow } from '@/utils/reportGeneration.util';
import type { ColumnDef } from '@tanstack/react-table';

import { useMemo } from 'react';

import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import ConformanceIcon from '@/components/atoms/conformance-icon/ConformanceIcon';
import WcagLevelBadge from '@/components/atoms/wcag-level-badge/WcagLevelBadge';

const columnHelper = createColumnHelper<ConformanceOverviewRow>();

export const useConformanceOverviewTable = (data: ConformanceOverviewRow[], samplePages: SamplePageRef[]) => {
  const columns = useMemo((): ColumnDef<ConformanceOverviewRow, unknown>[] => {
    const base: ColumnDef<ConformanceOverviewRow, unknown>[] = [
      columnHelper.accessor('criterionId', { header: 'Criterion' }) as ColumnDef<ConformanceOverviewRow, unknown>,
      columnHelper.accessor('criterionName', { header: 'Name' }) as ColumnDef<ConformanceOverviewRow, unknown>,
      columnHelper.accessor('level', {
        header: 'Level',
        cell: (info) => <WcagLevelBadge level={info.getValue() as ConformanceLevel} />,
      }) as ColumnDef<ConformanceOverviewRow, unknown>,
    ];

    for (const page of samplePages) {
      base.push(
        columnHelper.display({
          id: `page-${page.id}`,
          header: page.title,
          meta: { align: 'center' as const },
          cell: (info) => (
            <ConformanceIcon outcome={(info.row.original.outcomes[page.id] ?? 'untested') as EvaluationOutcome} />
          ),
        }) as ColumnDef<ConformanceOverviewRow, unknown>,
      );
    }

    base.push(
      columnHelper.accessor('overallOutcome', {
        header: 'Entire Sample',
        meta: { align: 'center' as const },
        cell: (info) => <ConformanceIcon outcome={info.getValue()} />,
      }) as ColumnDef<ConformanceOverviewRow, unknown>,
    );

    return base;
  }, [samplePages]);

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table API is intentionally non-memoizable
  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
};
