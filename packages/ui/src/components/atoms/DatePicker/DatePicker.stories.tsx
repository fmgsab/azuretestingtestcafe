import { Meta } from '@storybook/react';
import { DatePicker } from './DatePicker';

const meta: Meta = {
  title: 'Atoms/DatePicker/Picker',
  component: DatePicker,
  args: {},
  argTypes: {
    size: {
      control: { type: 'number' },
    },
    error: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    controls: {
      include: ['size', 'error', 'disabled'],
    },
  },
};

export default meta;

export const Default = {
  args: {},
};

export const Disabled = {
  args: {
    disabled: true,
  },
};

export const Error = {
  args: {
    error: true,
  },
};

export const OpenToPast = {
  args: {
    minDate: new Date('1800-11-01'),
  },
};

export const OpenToFuture = {
  args: {
    minDate: new Date('2100-11-01'),
  },
};
