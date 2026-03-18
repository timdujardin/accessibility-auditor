'use client';

import { flexRender } from '@tanstack/react-table';

import type { DataTableProps } from './data-table.types';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@/components/atoms/table/Table';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';

const DataTable = <TData,>({
  table,
  size = 'medium',
  stickyHeader = false,
  maxHeight,
  emptyMessage = 'No data available.',
  onRowClick,
  sx,
}: Readonly<DataTableProps<TData>>) => {
  const rows = table.getRowModel().rows;

  return (
    <TableContainer sx={{ maxBlockSize: maxHeight, ...sx }}>
      <Table size={size} stickyHeader={stickyHeader}>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  align={(header.column.columnDef.meta as { align?: 'center' | 'right' | 'left' } | undefined)?.align}
                  sx={{
                    cursor: header.column.getCanSort() ? 'pointer' : undefined,
                    userSelect: header.column.getCanSort() ? 'none' : undefined,
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <Wrapper sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' ? ' ↑' : null}
                    {header.column.getIsSorted() === 'desc' ? ' ↓' : null}
                  </Wrapper>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} align="center" sx={{ paddingBlock: 4 }}>
                <Text color="text.secondary">{emptyMessage}</Text>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.id}
                hover={!!onRowClick}
                sx={onRowClick ? { cursor: 'pointer' } : undefined}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    align={(cell.column.columnDef.meta as { align?: 'center' | 'right' | 'left' } | undefined)?.align}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
