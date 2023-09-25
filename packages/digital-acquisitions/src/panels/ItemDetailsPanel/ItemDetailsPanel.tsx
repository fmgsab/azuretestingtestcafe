import { type Table } from 'dexie';
import React, { useMemo, useState } from 'react';
import { SortingState } from '@tanstack/react-table';
import classnames from 'classnames';

import { mediaQueries } from '@fmg/ui/config/constants';
import { type OptionProps } from '@fmg/ui';

import { type RowKeyType } from '@fmg/ui/src/types/model-type';
import { useMediaQuery } from '@fmg/ui/src/hooks/useMediaQuery';
import { type UseColumnDefinitionsProps } from '@fmg/ui/src/hooks/useColumnDefinitions';
import { useDexieTableData } from '@fmg/ui/src/hooks/useDexieTableData';

import { IRow } from '@fmg/ui/src/components/tables/tables';
import { CustomGroupedTable } from '@fmg/ui/src/components/tables/CustomGroupedTable/CustomGroupedTable';
import TableFilterDropdown from '@fmg/ui/src/components/atoms/Dropdown/TableFilterDropdown';
import { Outline } from '@fmg/ui/src/embellishments/Outline/Outline';

export type ItemSummaryPanelProps = {
  jobId: RowKeyType;
  tableList: { [key: string]: { table: Table; heading: string } };
  canEdit?: boolean; // TODO: to replace with submission status
  labels: {
    action: string;
    description: string;
    coverType: string;
    sumInsured: string;
    excess: string;
  };
  groupBy?: string;
};

type Address = {
  location: string;
};

export function ItemDetailsPanel({ jobId, tableList, canEdit, labels, groupBy = 'location' }: ItemSummaryPanelProps) {
  const [itemTypeFilter, setItemTypeFilter] = useState<string>();
  const [globalFilter, setGlobalFilter] = useState<unknown>();
  const [sorting, setSorting] = useState<SortingState>([{ id: groupBy, desc: false }]);

  const isMatchingMedia = useMediaQuery(mediaQueries.sm);

  // TODO: replace with link
  const onClick = (val: unknown) => {
    // eslint-disable-next-line no-console
    console.log(`Edit action triggered for [${val}]`);
  };

  const extraColumns = isMatchingMedia
    ? [
        {
          id: 'action',
          header: labels.action,
          dataType: 'action',
          value: 'Edit',
          path: 'name',
          onClick,
          maxSize: 18, // tailwind-safelist w-18
          isActionDisabled: !canEdit,
        },
      ]
    : [];

  const columnDefinitions = [
    {
      id: 'name',
      header: labels.description,
    },
    { id: 'coverType', header: labels.coverType, size: 49.5 }, // tailwind-safelist w-49.5
    {
      id: 'sumInsured',
      header: labels.sumInsured,
      dataType: 'currency',
      size: 25.5,
      formatValue: (val: Record<string, number>) => val?.gstExclusive,
    }, // tailwind-safelist w-25.5
    { id: 'excess', header: labels.excess, dataType: 'currency', maxSize: 18 }, // tailwind-safelist w-18
    {
      id: 'location',
      header: 'Address',
      //formatValue: (data: Record<string, string>) => [data.address1, data.address2, data.city, data.postcode].join(', '),
    },
    ...extraColumns,
  ] as UseColumnDefinitionsProps<IRow>;

  const allDataList = useDexieTableData<IRow>({
    tables: Object.values(tableList).map(({ table }) => table),
    keyPath: { jobId },
    columnNames: columnDefinitions.map((def) => def.id),
  });

  const dropDownOptionsItems = {
    placeholder: 'All Items',
    options: Object.keys(allDataList ?? []).sort(),
  };

  const dropDownOptionsLocations = {
    placeholder: 'All Locations',
    options: [
      ...new Set(
        Object.values((allDataList ?? []) as Address[])
          .flat()
          .map((v) => v.location)
          .sort()
      ),
    ],
  };

  const commonProps = useMemo(
    () => ({
      sorting,
      setSorting,
      globalFilter,
      setGlobalFilter,
      groupBy,
      isMatchingMedia,
      canEdit,
    }),
    [sorting, globalFilter, groupBy, isMatchingMedia, canEdit]
  );

  return (
    <div className={classnames('gap-y-4.5 grid')}>
      <div className={classnames('h-10.5 flex items-center justify-between')}>
        <h1 className="text-lg">Items</h1>
        <div className="gap-x-4.5 flex">
          <TableFilterDropdown
            name="allItemTypes"
            onChange={(obj: unknown) => {
              setItemTypeFilter((obj as OptionProps).value as string);
            }}
            options={dropDownOptionsItems}
          />
          <TableFilterDropdown
            name="allLocations"
            onChange={(obj) => {
              setGlobalFilter((obj as OptionProps).value as string);
            }}
            options={dropDownOptionsLocations}
          />
        </div>
      </div>

      <Outline as="section">
        <div className={classnames('p-4.5 gap-y-4.5 grid')}>
          {allDataList
            ? Object.entries(tableList).map(([key, { heading }]) => {
                const data = allDataList?.[key];
                return data && (!itemTypeFilter || itemTypeFilter === key) ? (
                  <CustomGroupedTable key={key} columnDefinitions={columnDefinitions} {...commonProps} data={data} heading={heading} />
                ) : null;
              })
            : null}
        </div>
      </Outline>
    </div>
  );
}
