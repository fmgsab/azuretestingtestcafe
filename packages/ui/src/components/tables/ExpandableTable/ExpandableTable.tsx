import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import classnames from 'classnames';

import { type SortDirection, type Row, type SortingState } from '@tanstack/react-table';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';
import { flexRender, useReactTable } from '@tanstack/react-table';

import { useColumnDefinitions } from '../../../hooks';

import ArrowUp from '../../../assets/icons/12x12/arrow-up.svg';
import ArrowDown from '../../../assets/icons/12x12/arrow-down.svg';
import GridIcon from '../../../assets/icons/18x18/grid.svg';
import HamburgerIcon from '../../../assets/icons/18x18/hamburger.svg';
import SearchIcon from '../../../assets/icons/18x18/search.svg';

import IconTabs from '../../tabs/IconTabs/IconTabs';
import { IdEnum } from '../../tabs/tab-types';
import { FlexGridContainer } from '../../grids/FlexGridContainer';
import { SearchInput } from '../../atoms/SearchInput/SearchInput';

import { type IRow, type TableProps, type CardViewer } from '../tables';
import { PageSize } from '../PageSize/PageSize';
import { Sorter } from '../Sorter/Sorter';
import { NoResults } from '../NoResults/NoResults';

const ViewModes = ['grid', 'table'] as const;
const ViewModeEnum = z.enum(ViewModes);
export type ViewModeType = z.infer<typeof ViewModeEnum>;

export type ExpandableTableProps<T extends IRow> = {
  defaultPageSize: number;
  defaultViewMode: ViewModeType;
  defaultSorting: TableProps<T>['sorting'];
  canSwitchViewMode?: boolean;
  canFilter?: boolean;
  canChangeSorting?: boolean;
  CardViewer: CardViewer<T>;
  NoData: React.ReactNode;
  onRowSelection?: (args: Row<T>) => void;
  isLoading?: boolean;
} & Pick<TableProps<T>, 'columnDefinitions' | 'heading' | 'data'>;

export function ExpandableTable<T extends IRow>({
  CardViewer,
  NoData,
  columnDefinitions,
  heading,
  data,
  defaultPageSize = 0,
  defaultViewMode = 'grid',
  canSwitchViewMode = false,
  defaultSorting,
  onRowSelection,
  canFilter = false,
  canChangeSorting = false,
  isLoading,
}: ExpandableTableProps<T>) {
  const [mode, setMode] = useState<ViewModeType>(defaultViewMode);
  const [globalFilter, setGlobalFilter] = useState<unknown>();
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting);

  const columns = useColumnDefinitions<T>(columnDefinitions);
  const action = columnDefinitions
    .filter((col) => [col.dataType].includes('action'))
    .reduce((acc, col) => ({ ...acc, label: col.value, onClick: col.onClick }), {});

  const table = useReactTable({
    enableSortingRemoval: false,
    enableSorting: !isLoading,
    sortDescFirst: false,
    data,
    columns,
    initialState: {
      sorting: defaultSorting,
      pagination: { pageSize: defaultPageSize || data.length, pageIndex: 0 },
    },
    state: {
      sorting,
      globalFilter,
      columnVisibility: { id: false },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableGlobalFilter: true,
    globalFilterFn: 'includesString',
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
  });

  const currPageSize = table.getState().pagination.pageSize;

  const visibleRows = table.getRowModel().rows;
  const allRows = table.getFilteredRowModel().rows;

  const cellPadding = (length: number, idx: number) => ({ 'pl-4.5': idx === 0, 'pr-4.5': idx === length - 1 });

  const tabs = [
    { title: 'Grid', icon: <GridIcon />, onClick: () => setMode('grid') },
    { title: 'List', icon: <HamburgerIcon />, onClick: () => setMode('table') },
  ];

  const scrollTo = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (currPageSize > defaultPageSize) scrollTo.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [currPageSize, defaultPageSize]);

  const headerGroups = table.getHeaderGroups();
  return (
    <div className={classnames('mx-auto grid max-w-[1254px] gap-y-6', { 'animate-pulse': isLoading })}>
      <div className={classnames('min-h-10.5 gap-4.5 flex flex-wrap items-center justify-between')}>
        {heading ? <h2 className={classnames('h-6 truncate text-lg font-medium')}>{heading}</h2> : null}
        <div className={classnames('flex gap-3')}>
          {canChangeSorting && (
            <Sorter
              name="sorter"
              headers={headerGroups.map((group) => group.headers).flat()}
              sorting={sorting}
              setSorting={setSorting}
              disabled={isLoading}
            />
          )}
          {canFilter && <SearchInput setValue={setGlobalFilter} disabled={isLoading} />}
          {canSwitchViewMode && <IconTabs tabs={tabs} activeId={String(ViewModes.indexOf(mode)) as IdEnum} />}
        </div>
      </div>
      {render()}
    </div>
  );

  function render() {
    if (!data?.length) return <div className={classnames('mb-9')}>{NoData}</div>;
    if (!allRows?.length && globalFilter) {
      return (
        <div className={classnames('mb-9')}>
          <NoResults
            Icon={SearchIcon}
            title={`No results for "${globalFilter}"`}
            description={['There are no matching search results.', 'Try using different keywords or checking for typos.']}
          />
        </div>
      );
    }

    return (
      <>
        {mode === 'table' ? (
          <table className={classnames('w-full table-fixed', { 'animate-loaded': !isLoading })}>
            <thead className={classnames('h-13.5')}>
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, headerIdx) => {
                    const headerColumn = header.column;
                    const size = header.getSize();
                    const meta = headerColumn.columnDef.meta as Record<string, unknown>;
                    const isAutoSizable = meta?.isAutoSizable;
                    const sort = headerColumn.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        className={classnames(
                          `w-${isAutoSizable ? 'auto' : size}`,
                          'px-2.25 bg-fmg-gray-50 text-start font-medium',
                          cellPadding(table.getHeaderGroups().length, headerIdx),
                          { 'rounded-md': [0, headerGroup.headers.length - 1].includes(headerIdx) }
                        )}
                      >
                        <div
                          onClick={headerColumn.getToggleSortingHandler()}
                          className={classnames('h-7.5 group flex w-fit items-center gap-3 rounded-md p-1.5', {
                            'hover:bg-fmg-gray-300 cursor-pointer select-none': headerColumn.getCanSort(),
                            hidden: isLoading,
                          })}
                        >
                          {flexRender(headerColumn.columnDef.header, header.getContext())}
                          {renderSortIcon(headerColumn.getCanSort() && sort, 'group-hover:hidden')}
                          {renderSortIcon(sort || 'asc', classnames('hidden', { 'group-hover:block': headerColumn.getCanSort() }))}
                        </div>
                        <div className={classnames({ 'h-4.5 w-30 bg-loading-dark block rounded-md': isLoading })} />
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className={classnames('px-2.25 bg-white')}>
              <tr className={classnames('h-1.5')} />
              {visibleRows.map((row, rowIdx) => (
                <React.Fragment key={row.id}>
                  <tr
                    key={row.id}
                    onClick={() => onRowSelection?.(row)}
                    className={classnames('h-13.5 hover:bg-fmg-gray-50', {
                      'cursor-pointer': onRowSelection != null && !isLoading,
                      'cursor-not-allowed': isLoading,
                    })}
                  >
                    {row.getVisibleCells().map((cell, cellIdx) => {
                      const size = cell.column.getSize();
                      // tailwind-safelist w-15, w-30, w-60
                      return (
                        <td key={cell.id} className={classnames(`px-2.25 w-${size}`, cellPadding(row.getVisibleCells().length, cellIdx))}>
                          <div className={classnames('flex items-center gap-3', { hidden: isLoading })}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                          <div
                            className={classnames(`w-${[30, 15, 0].filter((el) => el < size / 2)[0] * ((rowIdx % 2) + 1)}`, {
                              'h-4.5 bg-loading block rounded-md': isLoading,
                            })}
                          />
                        </td>
                      );
                    })}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <FlexGridContainer
            data={visibleRows.map((row) => row.original)}
            render={(props, idx) => <CardViewer {...props} action={action} onClick={() => onRowSelection?.(visibleRows[idx])} />}
            minColWidth={300}
            containerClasses={classnames({ 'animate-loaded': !isLoading })}
          />
        )}
        <div ref={scrollTo} className={classnames('flex w-full justify-center py-9', { hidden: defaultPageSize === 0 })}>
          <PageSize
            isLoading={isLoading}
            className={classnames('w-64.5')}
            size={visibleRows.length}
            totalSize={allRows.length}
            onClick={() => table.setPageSize(currPageSize + defaultPageSize)}
          />
        </div>
      </>
    );
  }
}

function renderSortIcon(order: SortDirection | false, className: string) {
  if (!order) return null;

  const config = {
    asc: { Icon: ArrowUp, 'aria-label': 'Ascending' },
    desc: { Icon: ArrowDown, 'aria-label': 'Descending' },
  };

  const { Icon, ...props } = config[order];

  return (
    <span className={classnames('bg-fmg-gray-230 group-hover:bg-fmg-gray-300 delay h-6 w-6 rounded-md p-1.5', className)} {...props}>
      <Icon className={classnames('fill-fmg-gray-720')} />
    </span>
  );
}
