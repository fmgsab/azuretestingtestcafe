import React, { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import './DatePicker.css';
import CalendarIcon from '../../../assets/icons/18x18/calendar-checkless.svg';
import ArrowLeftIcon from '../../../assets/icons/18x18/arrow-left.svg';
import ArrowRightIcon from '../../../assets/icons/18x18/arrow-right.svg';
import { InputProps } from '../../../types';
import { useSaveField } from '../../../hooks';
import { AffixInput } from '../AffixInput/AffixInput';
import DatePickerDropdown from './DatePickerDropdown';

const monthsFull = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type DatePickerProps = InputProps & {
  onClick?: () => React.SyntheticEvent<HTMLElement, Event>;
  onChange?: (e: unknown) => void;
  minDate?: string | Date;
  maxDate?: string | Date;
  value?: string;
};

const CustomDateInput = forwardRef<HTMLInputElement, DatePickerProps>(function Input({ ...props }, ref: React.Ref<HTMLInputElement>) {
  return <AffixInput ref={ref} {...props} isNumeric={false} suffix={<CalendarIcon onClick={props.onClick} />} />;
});

const farMin = new Date(new Date().setFullYear(1800));
const farMax = new Date(new Date().setFullYear(2200));

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function Input(
  { size = 6, name, value, disabled, minDate = farMin, maxDate = farMax, onChange, placeholder = 'dd/mm/yyyy', ...props },
  ref
) {
  const minDateObject = new Date(minDate);
  const maxDateObject = new Date(maxDate);

  const saveField = useSaveField();
  const pickerOnchange = (val: Date) => {
    const date = val?.toISOString();
    onChange?.(date);
    saveField({ name, value: date });
  };

  const openToDate =
    minDateObject.valueOf() > Date.now() ? minDateObject : maxDateObject.valueOf() < Date.now() ? maxDateObject : new Date();

  return (
    <div className={`form-control w-grid-${size} relative`}>
      {/* eslint-disable-next-line*/}
      {/* @ts-ignore*/}
      <ReactDatePicker
        {...props}
        ref={ref}
        name={name}
        strictParsing
        error={props.error}
        disabled={disabled}
        calendarStartDay={1}
        minDate={minDateObject}
        maxDate={maxDateObject}
        dateFormat={['dd/MM/yyyy', 'd/M/yyyy', 'dd/M/yyyy', 'd/MM/yyyy']}
        showPopperArrow={false}
        onChange={pickerOnchange}
        openToDate={value ? new Date(value) : openToDate}
        placeholderText={placeholder}
        calendarClassName="fmg-calendar"
        selected={value ? new Date(value) : ''}
        renderCustomHeader={({ ...props }: CustomDateHeaderProps) => CustomDateHeader({ ...props, minDateObject, maxDateObject })}
        // Datepicker only passes certain props (handlers) to the customInput - anything else must be passed manually
        customInput={<CustomDateInput name={name} size={size} error={props.error} />}
        // placeholderText gets passed to the custom input as "placeholder"
      />
    </div>
  );
});

type CustomDateHeaderProps = {
  date: Date;
  months: string[];
  changeYear: (v: string) => void;
  changeMonth: (v: number) => void;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
  years: string[];
  minDateObject: Date;
  maxDateObject: Date;
};
function CustomDateHeader({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  minDateObject,
  maxDateObject,
}: CustomDateHeaderProps) {
  const { minYear, maxYear } = getMinMaxYears(minDateObject, maxDateObject);
  const years = getYears({ minYear, maxYear });
  const monthsList = getMonths(date, minDateObject, maxDateObject);

  return (
    <div className="text-text m-0 flex justify-between gap-2">
      <DateButton icon={<ArrowLeftIcon />} onClick={decreaseMonth} disabled={prevMonthButtonDisabled} />
      <DatePickerDropdown
        name=""
        value={getMonth(date, monthsList)}
        // eslint-disable-next-line
        // @ts-ignore
        onChange={({ value }) => {
          changeMonth(monthsFull.indexOf(`${value}`));
        }}
        options={monthsList}
        className="w-[110px]"
        data-testid="month-dropdown"
      />
      <DatePickerDropdown
        name=""
        value={`${date.getFullYear()}`}
        // eslint-disable-next-line
        // @ts-ignore
        onChange={({ value }) => {
          changeYear(`${value}`);
          const newYearObject = getNewYear(date, value);
          const newMonthsList = getMonths(newYearObject, minDateObject, maxDateObject);
          changeMonth(monthsFull.indexOf(getMonth(newYearObject, newMonthsList)));
        }}
        options={years}
        className="w-[76px]"
        data-testid="year-dropdown"
      />
      <DateButton icon={<ArrowRightIcon />} onClick={increaseMonth} disabled={nextMonthButtonDisabled} />
    </div>
  );
}

type DateButtonProps = {
  icon: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
};

function DateButton({ icon, ...props }: DateButtonProps) {
  return (
    <button
      {...props}
      type="button"
      className={[
        'flex h-[36px] w-[36px] items-center justify-center rounded text-inherit',
        'border-field-border border bg-white',
        'hover:bg-field-bg',
        'active:bg-field-bg-hover',
        'disabled:text-disabled-content',
        'focus-visible:border-fmg-green focus-visible:bg-white focus-visible:outline-0',
      ].join(' ')}
    >
      {icon}
    </button>
  );
}

function getMonth(date: Date, monthsList: string[]) {
  const dateMonth = monthsFull[date.getMonth()];
  return monthsList?.includes(dateMonth) ? monthsFull[date.getMonth()] : monthsList[0];
}

function getYears({ minYear, maxYear }: { minYear: string | number; maxYear: string | number }) {
  const min = Number(minYear);
  const max = Number(maxYear);
  const diff = Math.abs(max - min);
  return new Array(diff + 1)
    .fill('')
    .map((_, index) => {
      return `${min + index}`;
    })
    .reverse();
}

function getMinMaxYears(min: Date, max: Date) {
  return { minYear: min.getFullYear(), maxYear: max.getFullYear() };
}

function getMonths(selectedDate: Date, minDateObject: Date, maxDateObject: Date) {
  const displayYear = selectedDate.getFullYear();
  const outMonths = [];

  if (displayYear === maxDateObject.getFullYear() && displayYear === minDateObject.getFullYear()) {
    // get the months from min to max month
    for (let i = minDateObject.getMonth(); i <= maxDateObject.getMonth(); i++) {
      outMonths.push(monthsFull[i]);
    }
    return outMonths;
  }

  if (displayYear === maxDateObject.getFullYear()) {
    // get all the months up until the month of the selectedDate
    for (let i = 0; i <= maxDateObject.getMonth(); i++) {
      outMonths.push(monthsFull[i]);
    }
    return outMonths;
  }

  if (displayYear === minDateObject.getFullYear()) {
    // get all the months from the selectedDate
    for (let i = minDateObject.getMonth(); i <= 11; i++) {
      outMonths.push(monthsFull[i]);
    }
    return outMonths;
  }

  return monthsFull;
}

function getNewYear(date: Date, year: string | number | undefined) {
  const newYear = new Date(date);
  newYear.setFullYear(Number(year));
  return new Date(newYear);
}
