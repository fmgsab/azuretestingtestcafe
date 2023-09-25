import React, { useEffect } from 'react';
import { z, ZodTypeAny } from 'zod';
import { Meta } from '@storybook/react';
import { SortingState } from '@tanstack/react-table';

import { insuredItems } from 'mock-data';

import { mediaQueries } from '../../../../config/constants';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { CustomGroupedTable } from './CustomGroupedTable';

const selectedAccountId = 20075385;

const meta: Meta<typeof CustomGroupedTable & z.infer<ZodTypeAny>> = {
  title: 'Components/Tables/ItemSummaryTable',
  component: CustomGroupedTable,
  parameters: {
    controls: {
      include: [
        'groupBy',
        'data',
        'address',
        'canEdit',
        'heading',
        'showEmptyTable',
        'labelDescription',
        'labelCoverType',
        'labelSumInsured',
        'labelExcess',
        'labelAction',
      ],
    },
  },
  argTypes: {
    groupBy: {
      control: { type: 'text' },
    },
    address: {
      options: [
        '',
        ...new Set(insuredItems.filter((item) => item.address && item.accountId === selectedAccountId).map((item) => item.address)),
      ],
      control: { type: 'select' },
    },
  },
};

export default meta;

type TemplateProps = z.infer<ZodTypeAny>;

const Template = (args: TemplateProps) => {
  // to be put in the wrapper component
  const [globalFilter, setGlobalFilter] = React.useState();

  useEffect(() => {
    setGlobalFilter(args.address);
  }, [args.address]);

  // const rerender = React.useReducer(() => ({}), {})[1];
  const isMatchingMedia = useMediaQuery(mediaQueries.sm);

  const onClick = args.canEdit
    ? (val: unknown) => {
        // eslint-disable-next-line no-console
        console.log(`Edit action triggered for [${val}]`);
      }
    : undefined;

  const extraColumns = isMatchingMedia
    ? [
        {
          id: 'action',
          header: args.labelAction,
          dataType: 'action',
          value: 'Edit',
          path: 'description',
          // eslint-disable-next-line no-console
          onClick,
          maxSize: 18, // tailwind-safelist w-18
          isActionDisabled: !args.canEdit,
        },
      ]
    : [];

  const columnDefinitions = [
    {
      id: 'description',
      header: args.labelDescription,
    },
    { id: 'coverType', header: args.labelCoverType, size: 49.5 }, // tailwind-safelist w-49.5
    { id: 'sumInsured', header: args.labelSumInsured, dataType: 'currency', size: 25.5 }, // tailwind-safelist w-25.5
    { id: 'excess', header: args.labelExcess, dataType: 'currency', maxSize: 18 }, // tailwind-safelist w-18
    { id: 'address', header: 'Address' },
    ...extraColumns,
  ];

  const [sorting, setSorting] = React.useState<SortingState>([{ id: args.groupBy ? args.groupBy : 'description', desc: false }]);
  return (
    <>
      <br />
      <CustomGroupedTable
        {...args}
        sorting={sorting}
        setSorting={setSorting}
        columnDefinitions={columnDefinitions}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </>
  );
};

export const Default = {
  render: (args: TemplateProps) => <Template {...args} />,
  args: {
    groupBy: 'address',
    canEdit: true,
    heading: '',
    address: '',
    data: insuredItems, //.filter((item) => item.address === '28 Penywern Rd, Clandeboye, Temuka 7986'),
    showEmptyTable: false,
    labelDescription: 'Description',
    labelCoverType: 'Cover Type',
    labelSumInsured: 'Sum Insured',
    labelExcess: 'Excess',
    labelAddress: 'Address',
    labelAction: 'Action',
  },
};

export const GroupedFiltered = {
  ...Default,
  args: {
    ...Default.args,
    heading: 'Vehicles',
    data: insuredItems.filter((item) => item.itemType === 'Vehicle' && item.accountId === selectedAccountId),
  },
};
