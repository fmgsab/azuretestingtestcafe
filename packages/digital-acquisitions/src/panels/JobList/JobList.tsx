import React, { useLayoutEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { Row } from '@tanstack/react-table';

import { db } from 'models';
import { now } from '@fmg/utils';
import { FileIcon, NoResults, RowKeyType, SmallFile, Status, Timestamp, useMediaQuery } from '@fmg/ui';
import { ExpandableTable, type ExpandableTableProps, WorkItem as WorkItemCard, UseColumnDefinitionsProps } from '@fmg/ui';
import { mediaQueries } from '@fmg/ui/config/constants';

type WorkItem = {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  completeState: [boolean, string];
};

export type JobListProps = {
  openJob: (id: string | unknown) => void;
  defaultViewMode?: ExpandableTableProps<WorkItem>['defaultViewMode'];
  delay?: number;
};

export function JobList({ openJob, defaultViewMode = 'grid', delay = 0 }: JobListProps) {
  const defaultPageSize = 8;
  const tableRef = useRef(db.table('job'));
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Record<string, string>[]>(Array.from(Array(defaultPageSize)));

  useLayoutEffect(() => {
    if (delay) {
      setIsLoading(true);
      setData(Array.from(Array(defaultPageSize)));
    }

    const timer = setTimeout(() => {
      tableRef.current.toArray().then((result) => {
        setData(result);
        setIsLoading(false);
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const CardViewer = isLoading ? WorkItemCard.Loading : WorkItemCard;

  const formattedData = data.map(({ id, accountName, accountHolder = '', viewed, closed } = {}) => {
    // viewed & closed are ISO dates, not boolean flags
    return {
      id,
      name: accountName,
      description: accountHolder,
      timestamp: viewed,
      completeState: [Boolean(closed), closed ? 'Submitted' : 'In progress'],
    };
  }) as WorkItem[];

  const onRowSelection = async (row: Row<WorkItem>) => {
    const val = row
      .getAllCells()
      .find((cell) => cell.column.id === 'id')
      ?.getValue();
    await tableRef.current.update(val as RowKeyType, { viewed: now() });
    openJob(val);
  };

  const isMatchingMedia = useMediaQuery(mediaQueries.md);
  const extraColumns = isMatchingMedia ? [{ id: 'description', header: 'Contact' }] : [];

  const columnDefinitions = [
    { id: 'id', header: 'id' },
    {
      id: 'name',
      header: 'Account',
      formatValue: (name: string) => (
        <span className={classnames('gap-4.5 flex items-center')}>
          <SmallFile />
          {name}
        </span>
      ),
    },
    ...extraColumns,
    {
      id: 'timestamp',
      header: 'Last Opened',
      size: 37.5,
      formatValue: (date: string) => <Timestamp date={date} />,
      enableGlobalFilter: false,
    }, // tailwind-safelist w-37.5
    {
      id: 'completeState',
      header: 'Status',
      size: 37.5,
      enableGlobalFilter: false,
      formatValue: (state: [boolean, string]) => <Status hasCompleted={state[0]} inProgress={!state[0]} message={state[1]} />,
    }, // tailwind-safelist w-25.5
  ] as UseColumnDefinitionsProps<WorkItem>;

  return (
    <div className={classnames('mt-7.5')}>
      <ExpandableTable<WorkItem>
        CardViewer={CardViewer}
        columnDefinitions={columnDefinitions}
        defaultSorting={[{ id: 'timestamp', desc: true }]}
        onRowSelection={onRowSelection}
        data={formattedData}
        isLoading={isLoading}
        defaultViewMode={defaultViewMode}
        defaultPageSize={defaultPageSize}
        heading="Applications"
        canSwitchViewMode
        canFilter
        canChangeSorting
        NoData={
          <NoResults
            Icon={FileIcon}
            title="No Applications"
            description={['You have no in progress or submitted applications.', 'Use the "+ New Application" button to get started.']}
          />
        }
      />
    </div>
  );
}
