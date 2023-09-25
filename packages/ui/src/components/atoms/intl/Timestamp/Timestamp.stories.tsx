import { Meta, StoryObj } from '@storybook/react';

import { Timestamp } from './Timestamp';

const meta: Meta = {
  title: 'Atoms/Intl/Timestamp',
  component: Timestamp,
  parameters: {},
} satisfies Meta<typeof Timestamp>;
export default meta;

type Story = StoryObj<typeof Timestamp>;

export const Default: Story = {
  args: {
    date: '2022-12-12',
  },
};

export const Verbose: Story = {
  args: {
    date: '2022-12-12',
    verbose: true,
  },
};

export const LastOpened: Story = {
  ...Default,
  args: {
    ...Default.args,
    action: 'last opened',
  },
};

export const LastOpenedVerbose: Story = {
  ...LastOpened,
  args: {
    ...LastOpened.args,
    verbose: true,
  },
};
