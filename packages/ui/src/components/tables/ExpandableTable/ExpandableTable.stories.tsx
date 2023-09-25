import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import classnames from 'classnames';

import { leads, createWorkItemData } from 'mock-data';
import { toFormattedDate } from '@fmg/utils';

import { IRow } from '../tables';
import { UseColumnDefinitionsProps, useMediaQuery } from '../../../hooks';
import { mediaQueries } from '../../../../config/constants';
import { ExpandableTable, ExpandableTableProps } from './ExpandableTable';

import File from '../../../assets/icons/18x18/file.svg';
import Calendar from '../../../assets/icons/18x18/calendar-checkless.svg';

import { Appointment as AppointmentCard } from '../../cards/Appointment/Appointment';
import { WorkItem as WorkItemCard } from '../../cards/WorkItem/WorkItem';
import { Timestamp } from '../../atoms/intl/Timestamp/Timestamp';
import { Status } from '../../atoms/markers/Status/Status';
import { SmallFile } from '../../atoms/markers/File/File';
import { NoResults } from '../NoResults/NoResults';

const meta = {
  title: 'Components/Tables/ExpandableTable',
  component: ExpandableTable,
  parameters: {
    layout: 'fullscreen',
    controls: {
      exclude: ['CardViewer'],
    },
  },
  argTypes: {},
} satisfies Meta<typeof ExpandableTable>;

export default meta;

interface Appointment extends IRow {
  location: { addressLine1: string; addressLine2: string | null; city: string; postcode?: string };
  name: string;
  date: string;
}

const formatName = ({ firstName, middleName, lastName, preferredName }: Record<string, string | null>) => {
  if (preferredName) {
    return [preferredName, lastName].filter(Boolean).join(' ');
  }

  return [firstName, middleName, lastName].filter(Boolean).join(' ');
};

const formatAddress = (location: Appointment['location']) => {
  return Object.values(location).filter(Boolean).join(', ');
};

const AppointmentTemplate = (args: ExpandableTableProps<Appointment>) => {
  // const rerender = React.useReducer(() => ({}), {})[1];
  const isMatchingMedia = useMediaQuery(mediaQueries.md);

  const onClick = (val: unknown) => {
    // eslint-disable-next-line no-console
    console.log(`New application launch triggered for [${val}]`);
  };

  const extraColumns = isMatchingMedia ? [{ id: 'fullAddress', header: 'Address' }] : [];

  const columnDefinitions = [
    {
      id: 'name',
      header: 'Contact',
    },
    // tailwind-safelist w-49.5
    { id: 'date', header: 'Date & Time', size: 49.5, formatValue: (date: string) => toFormattedDate(date, 'DD MMMM YYYY, h:mma') },
    ...extraColumns,
    {
      id: 'action',
      header: 'Action',
      dataType: 'action',
      value: '+ New Application',
      path: 'name',
      // eslint-disable-next-line no-console
      onClick,
      size: 40, // tailwind-safelist w-40
      enableSorting: false,
    },
  ] as UseColumnDefinitionsProps<Appointment>;

  const Card = args.isLoading ? AppointmentCard.Loading : args.CardViewer;
  const data = args.isLoading
    ? Array.from(Array(args.defaultPageSize)).map(() => ({
        firstName: '',
        lastName: '',
        preferredName: '',
        middleName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postcode: '',
        appointmentStart: '',
      }))
    : args.data;

  return (
    <div className="md:mx-15 mb-4.5 mx-12 xl:mx-auto">
      <div className="h-15" />
      <ExpandableTable
        {...args}
        data={data as Appointment[]}
        CardViewer={Card}
        columnDefinitions={columnDefinitions}
        defaultSorting={[{ id: 'date', desc: false }]}
      />
    </div>
  );
};

const leadsData: Appointment[] = leads.map(
  ({
    firstName,
    lastName,
    preferredName = '',
    middleName,
    addressLine1,
    addressLine2,
    city,
    postCode: postcode,
    appointmentStart: date,
  }) => {
    return {
      location: { addressLine1, addressLine2, city, postcode },
      fullAddress: formatAddress({ addressLine1, addressLine2, city, postcode }),
      name: formatName({ firstName, middleName, lastName, preferredName }),
      date,
    };
  }
);

const CardViewer = ({ name, date, location }: Appointment) => {
  return (
    <div className="border-fmg-gray-200 grid border" data-testid="card">
      <span>{name}</span>
      <span>{toFormattedDate(date)}</span>
      <span>{formatAddress(location)}</span>
    </div>
  );
};

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // eslint-disable-next-line
  // @ts-ignore
  render: (args) => <AppointmentTemplate {...args} />,
  args: {
    CardViewer,
    NoData: (
      <NoResults
        Icon={Calendar}
        title="No Scheduled Leads"
        description={["You're all caught up! You have no upcoming Leads.", 'When you do have a Lead scheduled, it will appear here.']}
      />
    ),
    data: leadsData,
    heading: 'Appointment Made Leads',
    defaultViewMode: 'grid',
    canSwitchViewMode: false,
    defaultPageSize: 0,
    isLoading: false,
    columnDefinitions: [],
    defaultSorting: [],
  },
  parameters: {
    controls: {
      exclude: ['CardViewer', 'NoData', 'defaultViewMode', 'labels', 'canSwitchViewMode', 'defaultPageSize'],
    },
  },
};

export const Default5: Story = {
  ...Default,
  args: { ...Default.args, data: leadsData.slice(0, 5) },
};

export const Appointment: Story = {
  ...Default,
  args: {
    ...Default.args,
    CardViewer: AppointmentCard,
  },
};

export const AppointmentTop8: Story = {
  ...Appointment,
  args: {
    ...Appointment.args,
    defaultPageSize: 8,
  },
  parameters: {
    controls: {
      exclude: ['CardViewer', 'defaultViewMode', 'labels', 'canSwitchViewMode'],
    },
  },
};

export const AppointmentList: Story = {
  ...Appointment,
  args: {
    ...Appointment.args,
    defaultViewMode: 'table',
  },
};

export const AppointmentListTop8: Story = {
  ...AppointmentTop8,
  args: {
    ...AppointmentTop8.args,
    defaultViewMode: 'table',
  },
};

export const SwitchApptTop8: Story = {
  ...AppointmentTop8,
  args: {
    ...AppointmentTop8.args,
    canSwitchViewMode: true,
  },
  parameters: {
    controls: {
      exclude: ['CardViewer', 'defaultViewMode', 'labels'],
    },
  },
};

interface WorkItem extends IRow {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  completeState: [boolean, string];
}

const WorkItemTemplate = (args: ExpandableTableProps<WorkItem>) => {
  // const rerender = React.useReducer(() => ({}), {})[1];
  const isMatchingMedia = useMediaQuery(mediaQueries.md);

  const extraColumns = isMatchingMedia ? [{ id: 'description', header: 'Contact' }] : [];

  const columnDefinitions = [
    { id: 'id', header: 'id' },
    {
      id: 'name',
      header: 'Account',
      formatValue: (name: string) => (
        <span className={classnames('gap-4.5 flex items-center truncate')}>
          <SmallFile />
          <span className={classnames('truncate')}>{name}</span>
        </span>
      ),
    },
    ...extraColumns,
    // tailwind-safelist w-37.5
    {
      id: 'timestamp',
      header: 'Last Opened',
      size: 37.5,
      formatValue: (date: string) => <Timestamp date={date} />,
      enableGlobalFilter: false,
    },
    {
      id: 'completeState',
      header: 'Status',
      size: 37.5,
      formatValue: (state: [boolean, string]) => <Status hasCompleted={state[0]} inProgress={!state[0]} message={state[1]} />,
      enableGlobalFilter: false,
    }, // tailwind-safelist w-25.5
  ] as UseColumnDefinitionsProps<WorkItem>;

  const Card = args.isLoading ? WorkItemCard.Loading : args.CardViewer;
  const data = args.isLoading
    ? Array.from(Array(args.defaultPageSize)).map(() => ({
        id: '',
        name: '',
        description: '',
        timestamp: '',
        completeState: [],
      }))
    : args.data;

  return (
    <div className="md:mx-15 mb-4.5 mx-12 xl:mx-auto">
      <div className="h-15" />
      <ExpandableTable<WorkItem>
        {...args}
        data={data as WorkItem[]}
        CardViewer={Card}
        columnDefinitions={columnDefinitions}
        defaultSorting={[{ id: 'timestamp', desc: true }]}
      />
    </div>
  );
};

const workItemData = createWorkItemData(35);

export const WorkItem: Story = {
  ...Default,
  // eslint-disable-next-line
  // @ts-ignore
  render: (args) => <WorkItemTemplate {...args} />,
  args: {
    ...Default.args,
    heading: 'Applications',
    data: workItemData,
    CardViewer: WorkItemCard,
    NoData: (
      <NoResults
        Icon={File}
        title="No Applications"
        description={['You have no in progress or submitted applications.', 'Use the "+ New Application" button to get started.']}
      />
    ),
    isLoading: false,
    columnDefinitions: [],
    defaultSorting: [],
    defaultViewMode: 'grid',
  },
};

export const WorkItemTop8: Story = {
  ...WorkItem,
  args: {
    ...WorkItem.args,
    defaultPageSize: 8,
  },
  parameters: {
    controls: {
      exclude: ['CardViewer', 'NoData', 'defaultViewMode', 'labels', 'canSwitchViewMode'],
    },
  },
};

export const WorkItemList: Story = {
  ...WorkItem,
  args: {
    ...WorkItem.args,
    defaultViewMode: 'table',
  },
};

export const WorkItemListTop8: Story = {
  ...WorkItemTop8,
  args: {
    ...WorkItemTop8.args,
    defaultViewMode: 'table',
  },
};

export const WorkItemListFilterTop8: Story = {
  ...WorkItemListTop8,
  args: {
    ...WorkItemListTop8.args,
    canFilter: true,
  },
};

export const WorkItemFilterChangeSortTop8: Story = {
  ...WorkItemListFilterTop8,
  args: {
    ...WorkItemListFilterTop8.args,
    defaultViewMode: 'grid',
    canChangeSorting: true,
  },
};

export const SwitchWorkItemFilterChangeSortTop8: Story = {
  ...WorkItemFilterChangeSortTop8,
  args: {
    ...WorkItemFilterChangeSortTop8.args,
    canSwitchViewMode: true,
  },
  parameters: {
    controls: {
      exclude: ['CardViewer', 'defaultViewMode', 'labels'],
    },
  },
};
