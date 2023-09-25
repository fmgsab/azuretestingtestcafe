import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { createJobs } from 'mock-data/jobs';

import { useColumnDefinitions, UseColumnDefinitionsProps } from '../../../hooks';

import { Sorter, SorterProps } from './Sorter';

const meta = {
  title: 'Components/Tables/Sorter',
  component: Sorter,
  parameters: {
    controls: {
      exclude: ['onClick', 'className'],
    },
  },
  argTypes: {},
} as Meta<typeof Sorter>;

export default meta;

type WorkItemTemplateProps<T> = SorterProps<T> & { columnDefinitions: UseColumnDefinitionsProps<T> };
type Story<T> = StoryObj<WorkItemTemplateProps<T>>;

const WorkItemTemplate = (args: WorkItemTemplateProps<unknown>) => {
  const columns = useColumnDefinitions(args.columnDefinitions);
  const data = createJobs(15);

  const [sorting, setSorting] = React.useState<SortingState>(args.sorting);

  const table = useReactTable({
    enableSortingRemoval: false,
    sortDescFirst: false,
    data,
    columns,
    state: {
      sorting,
      columnVisibility: { id: false },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableGlobalFilter: true,
    globalFilterFn: 'includesString',
    onSortingChange: setSorting,
  });

  const headers = table.getHeaderGroups()[0].headers;
  return (
    <Sorter
      setSorting={args.setSorting ?? setSorting}
      name="Sort"
      headers={headers}
      sorting={sorting}
      menuIsOpen={args.menuIsOpen || undefined}
      placeholder={args.placeholder}
    />
  );
};

export const DefaultOption: Story<unknown> = {
  render: (args) => <WorkItemTemplate {...args} />,
  args: {
    sorting: [{ id: 'timestamp', desc: true }],
    menuIsOpen: false,
    columnDefinitions: [
      { id: 'name', header: 'Account' },
      { id: 'timestamp', header: 'Last Opened', size: 37.5 },
      { id: 'completeState', header: 'Status', size: 37.5 },
    ] as UseColumnDefinitionsProps<unknown>,
  },
};

export const NoDefaultOption: Story<unknown> = {
  render: (args) => <WorkItemTemplate {...args} />,
  args: {
    ...DefaultOption.args,
    placeholder: 'Sort',
    sorting: [],
  },
};
