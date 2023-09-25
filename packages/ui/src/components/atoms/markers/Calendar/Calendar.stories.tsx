import { Meta, StoryObj } from '@storybook/react';

import { Calendar } from './Calendar';

const meta: Meta = {
  title: 'Atoms/Marker/Calendar',
  component: Calendar,
  parameters: {},
} satisfies Meta<typeof Calendar>;
export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {
    date: '2022-12-12',
  },
};
