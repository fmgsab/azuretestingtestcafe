import React from 'react';
import classnames from 'classnames';

import { concat } from '@fmg/utils';

import Button from '../../atoms/Button/Button';
import { Calendar } from '../../atoms/markers/Calendar/Calendar';
import { DateTime } from '../../atoms/intl/DateTime/DateTime';

export type AppointmentProps = {
  name: string;
  date: string;
  location: { addressLine1: string; addressLine2?: string; city: string; postcode: string };
  action: { label?: string; url?: string; onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void };
};

export function Appointment({
  name,
  date,
  location: { addressLine1, addressLine2, city, postcode },
  action: { label = '', onClick },
}: AppointmentProps) {
  return (
    <div
      tabIndex={0}
      className={classnames(
        'p-4.5 gap-4.5 grid grid-cols-[72px_auto]',
        'border-fmg-gray-200 rounded-md border',
        'hover:border-fmg-green focus-visible:border-fmg-green focus-within:border-fmg-green focus-visible:outline-0'
      )}
      id={`appointment-${name}`}
    >
      <Calendar date={date} />
      <span className={classnames('grid')}>
        <span className={classnames('truncate text-lg font-medium')}>{name}</span>
        <DateTime date={date} />
        <DateTime date={date} format="time" />
      </span>
      <span className={classnames('h-10.5 col-span-2 grid', 'text-fmg-gray-810')}>
        <span className={classnames('truncate')}>{concat([addressLine1, addressLine2])}</span>
        <span className={classnames('truncate')}>{concat([city, postcode])}</span>
      </span>
      <Button aria-label={label} onClick={onClick} className={classnames('col-span-2 grid')} color="primary-block-light">
        {label}
      </Button>
    </div>
  );
}

function Loading() {
  return (
    <div
      data-testid="card-loading-skeleton"
      className={classnames('p-4.5 gap-4.5 grid grid-cols-[72px_auto]', 'bg-fmg-gray-60 rounded-md')}
    >
      <span className={classnames('w-18 h-18 bg-loading-dark rounded-md')} />
      <span className={classnames('grid grid-rows-3')}>
        <span className={classnames('h-4.5 bg-loading w-[87px] rounded-md')} />
      </span>
      <span className={classnames('col-span-2 grid gap-1.5')}>
        <span className={classnames('h-4.5 bg-loading w-[264px] rounded-md')} />
        <span className={classnames('h-4.5 bg-loading w-[132px] rounded-md')} />
      </span>
      <span className={classnames('h-10.5 bg-loading-dark col-span-2 rounded-md')} />
    </div>
  );
}

Appointment.Loading = Loading;
