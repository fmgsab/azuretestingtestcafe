import classnames from 'classnames';

import { concat, toFormattedDate } from '@fmg/utils';
import { CalendarIcon, NoResults, type UseColumnDefinitionsProps, useMediaQuery, useQueryServiceContext } from '@fmg/ui';
import { ExpandableTable, type ExpandableTableProps, Appointment as AppointmentCard } from '@fmg/ui';
import { mediaQueries } from '@fmg/ui/config/constants';
import React from 'react';

type Nullish = string | null;

type Appointment = {
  location: { addressLine1?: Nullish; addressLine2?: Nullish; city?: Nullish; postcode?: Nullish };
  fullAddress: string;
  name: string;
  date: string;
};

type AppointmentListProps = {
  defaultViewMode?: ExpandableTableProps<Appointment>['defaultViewMode'];
  createJob: (id: string | unknown) => void;
};

const formatName = ({ firstName, middleName, lastName, preferredName }: Record<string, string | null>) => {
  if (preferredName) {
    return concat([preferredName, lastName], ' ');
  }

  return concat([firstName, middleName, lastName], ' ');
};

const formatAddress = (location: Appointment['location']) => {
  return concat(Object.values(location), ', ');
};

export function AppointmentList({ createJob, defaultViewMode = 'grid' }: AppointmentListProps) {
  const { getLeads } = useQueryServiceContext();
  const { data, isLoading, isSuccess, ...rest } = getLeads();
  console.log({ data, isLoading, isSuccess, rest });

  const defaultPageSize = 8;
  const CardViewer = isLoading ? AppointmentCard.Loading : AppointmentCard;

  const formattedData =
    (isLoading
      ? Array.from(Array(defaultPageSize)).map(() => ({
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
      : data
    )?.map(
      ({ firstName, lastName, preferredName = '', middleName, addressLine1, addressLine2, city, postcode, appointmentStart: date }) => {
        return {
          location: { addressLine1, addressLine2, city, postcode },
          fullAddress: formatAddress({ addressLine1, addressLine2, city, postcode }),
          name: formatName({ firstName, middleName, lastName, preferredName }),
          date,
        };
      }
    ) ?? ([] as Appointment[]);
  const isMatchingMedia = useMediaQuery(mediaQueries.md);

  const handleOnClick = (val: unknown) => {
    createJob(val);
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
      path: 'leadId',
      onClick: handleOnClick,
      size: 40, // tailwind-safelist w-40
      enableSorting: false,
    },
  ] as UseColumnDefinitionsProps<Appointment>;

  return (
    <div className={classnames('mt-15')}>
      <ExpandableTable<Appointment>
        CardViewer={CardViewer}
        columnDefinitions={columnDefinitions}
        defaultSorting={[{ id: 'date', desc: false }]}
        data={formattedData}
        defaultPageSize={defaultPageSize}
        defaultViewMode={defaultViewMode}
        heading="Appointment Made Leads"
        canSwitchViewMode
        isLoading={isLoading}
        NoData={
          <NoResults
            Icon={CalendarIcon}
            title="No Scheduled Leads"
            description={["You're all caught up! You have no upcoming Leads.", 'When you do have a Lead scheduled, it will appear here.']}
          />
        }
      />
    </div>
  );
}
