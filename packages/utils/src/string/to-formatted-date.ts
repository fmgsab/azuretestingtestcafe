import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

/**
 * Function to convert an ISODateString to a formatted date string
 * @param date ISODateString
 * @param format dayjs format
 */
export function toFormattedDate(date?: string, format: string = '') {
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format(format) : '';
}

export function date(dt?: string) {
  dayjs.extend(utc);
  dayjs.extend(tz);
  return dayjs(dt).tz('Pacific/Auckland').format();
}

export function now() {
  return date();
}
