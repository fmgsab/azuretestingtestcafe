import { Meta, StoryObj } from '@storybook/react';

import CalendarIcon from '../../../../assets/icons/18x18/calendar.svg';
import { DateTime } from './DateTime';

const meta: Meta = {
  title: 'Atoms/Intl/DateTime',
  component: DateTime,
  parameters: {},
} satisfies Meta<typeof DateTime>;
export default meta;

type Story = StoryObj<typeof DateTime>;

export const LongDate: Story = {
  args: {
    date: '2022-12-12',
  },
};

export const MedDate: Story = {
  args: {
    date: '2022-12-12',
    format: 'md',
  },
};

export const TimeOnly: Story = {
  args: {
    date: '2022-12-12T17:05:00',
    format: 'time',
  },
};

export const CustomFormat: Story = {
  args: { ...LongDate.args, format: 'YYYY-MM-DD' },
};

export const CustomIcon: Story = {
  args: { ...LongDate.args, icon: <CalendarIcon /> },
};
