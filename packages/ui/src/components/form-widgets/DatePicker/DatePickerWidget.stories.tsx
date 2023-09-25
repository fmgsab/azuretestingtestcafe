import { z } from 'zod';
import { Meta, StoryObj } from '@storybook/react';
import { StoryForm } from '../../../test/storybook-utils';
import { DatePickerWidget } from './DatePickerWidget';

const meta: Meta = {
  title: 'Components/Form Widgets/DatePicker',
  component: DatePickerWidget,
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
    minDate: {
      control: { type: 'date' },
    },
    maxDate: {
      control: { type: 'date' },
    },
  },
  parameters: {
    controls: {
      include: ['disabled', 'question', 'placeholder', 'size', 'label', 'message', 'requiredMessage', 'minDate', 'maxDate'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof DatePickerWidget & typeof StoryForm>;

export const Default: Story = {
  render: ({ ...args }) => {
    return (
      <StoryForm {...args} mode="all">
        <DatePickerWidget name={args?.name ?? 'startDate'} label={args?.label} />
      </StoryForm>
    );
  },
  args: {
    name: 'startDate',
    label: 'Start Date',
    question: 'Policy Start',
    className: '',
    required: false,
    size: 6,
  },
};

export const Required: Story = {
  ...Default,
  args: {
    ...Default.args,
    required: true,
    message: 'Required Message',
    requiredMessage: 'Date required',
    schema: z.object({
      startDate: z.string(),
    }),
  },
};

const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));

export const YesterdayTomorrow: Story = {
  ...Default,
  args: {
    ...Default.args,
    required: true,
    message: 'Required Message',
    requiredMessage: 'Date required',
    schema: z.object({
      startDate: z.string(),
    }),
    minDate: yesterday,
    maxDate: tomorrow,
  },
};

export const Range22to24: Story = {
  ...Default,
  args: {
    ...Default.args,
    required: true,
    message: 'Required Message',
    requiredMessage: 'Date required',
    schema: z.object({
      startDate: z.string(),
    }),
    minDate: new Date('2022-12-12'),
    maxDate: new Date('2024-01-12'),
  },
};
