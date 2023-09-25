import { Meta, StoryObj } from '@storybook/react';

import { Status } from './Status';

const meta: Meta = {
  title: 'Atoms/Marker/Status',
  component: Status,
  parameters: {},
} satisfies Meta<typeof Status>;
export default meta;

type Story = StoryObj<typeof Status>;

export const NotStarted: Story = {
  args: {
    hasStarted: false,
  },
};
export const Incomplete: Story = {
  args: {
    hasStarted: true,
  },
};

export const InProgress: Story = {
  args: {
    inProgress: true,
  },
};

export const InProgressMessage: Story = {
  args: {
    inProgress: true,
    message: 'In progress',
  },
};

export const Invalid: Story = {
  args: {
    hasStarted: true,
    hasError: true,
  },
};

export const Complete: Story = {
  args: {
    hasStarted: true,
    hasCompleted: true,
  },
};

export const CompleteMessage: Story = {
  args: {
    hasStarted: true,
    hasCompleted: true,
    message: 'Submitted',
  },
};
