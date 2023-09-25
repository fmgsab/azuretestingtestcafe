import { ReactElement } from 'react';
import classnames from 'classnames';

import { toFormattedDate } from '@fmg/utils';
import CalendarIcon from '../../../../assets/icons/18x18/calendar-checkless.svg';
import TimeIcon from '../../../../assets/icons/18x18/time.svg';
import { formats } from '../constants';

type DateProps = {
  icon?: ReactElement | boolean;
  date: string;
  className?: string;
  format?: string | 'lg' | 'md';
};

export function DateTime({ icon = true, date, className, format = 'lg' }: DateProps) {
  const result = toFormattedDate(date, formats[format] ?? format);

  const Icon = format === 'time' ? TimeIcon : CalendarIcon;

  return (
    <span className={classnames('text-fmg-gray-810 h-4.5 flex items-start gap-1.5', className)}>
      {icon === true ? <Icon className={classnames('fill-fmg-gray-480')} /> : icon || null}
      {result}
    </span>
  );
}
