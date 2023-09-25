import React from 'react';
import classnames from 'classnames';
import { toFormattedDate } from '@fmg/utils';

export function Calendar({ date }: { date: string }) {
  const formatted = toFormattedDate(date, 'D/MMM').toUpperCase();
  const [dateStr, monthStr] = formatted.split('/');
  return (
    <div
      className={classnames('bg-link w-18 h-18 flex shrink-0 flex-col items-center justify-center gap-1 rounded-md font-medium text-white')}
    >
      <span className={classnames('text-xxl-1 grid justify-center font-medium')}>{dateStr}</span>
      <span className={classnames('grid justify-center text-sm font-normal')}>{monthStr}</span>
    </div>
  );
}
