import React from 'react';

import { flexRender, getCoreRowModel, useReactTable, getFilteredRowModel, getSortedRowModel, Row } from '@tanstack/react-table';
import classnames from 'classnames';

import End from '../../../assets/icons/misc/item-end.svg';
import Connector from '../../../assets/icons/misc/item-connector.svg';
import { useColumnDefinitions } from '../../../hooks/useColumnDefinitions';

import { IRow, TableProps } from '../tables';

export type CustomGroupedTableProps<T extends IRow> = {
  showEmptyTable?: boolean;
} & TableProps<T>;

export function CustomGroupedTable<T extends IRow>({
  columnDefinitions,
  heading,
  data,
  groupBy,
  globalFilter,
  setGlobalFilter,
  sorting,
  setSorting,
  showEmptyTable = false,
}: CustomGroupedTableProps<T>) {
  const groups = groupBy
    ? data
        .map((row) => row[groupBy as keyof T])
        .filter((val) => Boolean(val) && (!globalFilter || globalFilter === val))
        .map(String)
        .sort()
    : [];

  const columns = useColumnDefinitions<T>(columnDefinitions);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility: groupBy ? { [groupBy]: false } : {},
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableGlobalFilter: true,
    globalFilterFn: 'equals',
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
  });

  const renderGroupHeader = (row: Row<T>, idx: number) => {
    const isMatchingFilter = groupBy && globalFilter && idx === 0;
    const isNewGroup = groups.length > 0 && groupBy && !globalFilter && (idx === 0 || groups[idx - 1] !== groups[idx]);

    return (
      (isMatchingFilter || isNewGroup) && (
        <tr key={groups[idx]} className={classnames('h-13.5 bg-blue-240-bg font-medium')}>
          <td colSpan={row.getVisibleCells().length} className={classnames('px-4.5 truncate')} key={groups[idx]}>
            {row
              .getAllCells()
              .filter((cell) => cell.column.id === groupBy)
              ?.map((cell) => flexRender(cell.column.columnDef.cell, cell.getContext()))}
          </td>
        </tr>
      )
    );
  };

  const isGroupEnd = (row: Row<T>, idx: number) => {
    const lastRowIndex = groupBy
      ? groups.lastIndexOf(
          row
            .getAllCells()
            .find((col) => col.column.id === groupBy)
            ?.getValue() as string
        )
      : -1;

    return lastRowIndex === idx;
  };

  const cellPadding = (length: number, idx: number) => {
    return {
      'pl-4.5': idx === 0,
      'pr-4.5': idx === length - 1,
    };
  };

  const hasRecords = table.getRowModel().rows.length > 0;
  const showTable = hasRecords || showEmptyTable;

  return showTable ? (
    <div className={classnames('grid gap-y-1.5')}>
      {heading ? <h2 className={classnames('mx-px my-3 truncate text-lg')}>{heading}</h2> : null}
      <table
        className={classnames(
          'border-1 border-blue-216-border rounded-1.5 table-fixed border',
          'bg-blue-216-border border-separate border-spacing-y-px border-y-0',
          'w-full'
        )}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={classnames('h-13.5 bg-blue-240-bg rounded-t-1.5')}>
              {headerGroup.headers.map((header, headerIdx) => {
                const size = header.getSize();
                const meta = header.column.columnDef.meta as Record<string, unknown>;
                const isAutoSizable = meta?.isAutoSizable;
                return (
                  <th
                    key={header.id}
                    className={classnames(
                      `w-${isAutoSizable ? 'auto' : size}`,
                      'text-fmg-green px-2.25 text-start font-normal',
                      cellPadding(table.getHeaderGroups().length, headerIdx)
                    )}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className={classnames('px-2.25 bg-white')}>
          {table.getRowModel().rows.map((row, idx) => (
            <React.Fragment key={row.id}>
              {renderGroupHeader(row, idx)}
              <tr key={row.id} className={classnames('h-13.5')}>
                {row.getVisibleCells().map((cell, cellIdx) => {
                  const isEndRow = idx === table.getRowModel().rows.length - 1 || isGroupEnd(row, idx);

                  return (
                    <td key={cell.id} className={classnames(`px-2.25`, cellPadding(row.getVisibleCells().length, cellIdx))}>
                      <div className={classnames('flex items-center gap-3')}>
                        {cellIdx === 0 ? (
                          <span className={classnames('w-4.5 scale-y-105')}>{isEndRow ? <End /> : <Connector />}</span>
                        ) : null}
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  ) : null;
}
