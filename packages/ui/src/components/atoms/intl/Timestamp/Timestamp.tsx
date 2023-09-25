import classnames from 'classnames';
import { concat, toFormattedDate } from '@fmg/utils';
import { formats } from '../constants';

type TimestampProps = {
  date: string;
  action?: string;
  className?: string;
  verbose?: boolean;
  dateFormat?: string | 'lg' | 'md';
  timeFormat?: string;
};

export function Timestamp({
  date,
  className,
  action,
  verbose = false,
  dateFormat = formats.lg,
  timeFormat = formats.time,
}: TimestampProps) {
  const today = toFormattedDate(undefined, dateFormat);
  const dateOnly = toFormattedDate(date, dateFormat);
  const timeOnly = toFormattedDate(date, timeFormat);

  const dateTimeParts = () => {
    const isToday = today === dateOnly;
    if (verbose) {
      return [dateOnly, timeOnly];
    }

    return [isToday ? 'today' : dateOnly, isToday ? timeOnly : ''];
  };

  const formatted = concat([action, concat(dateTimeParts(), ' at ')], ' ').replace(/^([a-z])/g, (_, letter) => letter.toUpperCase());

  return <span className={classnames(className)}>{formatted}</span>;
}
