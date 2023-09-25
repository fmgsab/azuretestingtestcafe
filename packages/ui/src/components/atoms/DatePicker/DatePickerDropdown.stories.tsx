import { Meta } from '@storybook/react';
import DatePickerDropdown from './DatePickerDropdown';
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const years = [
  '1999',
  '2000',
  '2001',
  '2002',
  '2003',
  '2004',
  '2005',
  '2006',
  '2007',
  '2008',
  '2009',
  '2010',
  '2011',
  '2012',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
  '2021',
  '2022',
  '2023',
  '2024',
];

const meta: Meta = {
  title: 'Atoms/DatePicker/Dropdown',
  component: DatePickerDropdown,
  args: { className: 'w-[200px]' },
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    controls: {
      include: ['disabled'],
    },
  },
};

export default meta;

export const Month = {
  args: {
    options: months,
    defaultValue: 'September',
    className: 'w-[110px]',
  },
};

export const MonthOpen = {
  args: {
    ...Month.args,
    menuIsOpen: true,
  },
};

export const Year = {
  args: {
    className: 'w-[72px]',
    options: years,
    defaultValue: '1999',
  },
};

export const YearOpen = {
  args: {
    ...Year.args,
    menuIsOpen: true,
  },
};

export const Disabled = {
  args: {
    ...Year.args,
    menuIsOpen: false,
    disabled: true,
  },
};
