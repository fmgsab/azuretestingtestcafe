import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import classnames from 'classnames';

import { WorkItem } from './WorkItem';

const meta: Meta = {
  title: 'Components/Cards/WorkItem',
  component: WorkItem,
  parameters: {
    controls: {
      exclude: ['action.onClick'],
    },
  },
} satisfies Meta<typeof WorkItem>;
export default meta;

type Story = StoryObj<typeof WorkItem>;

export const InProgress: Story = {
  render: (args) => {
    return (
      <div className={classnames('w-[300px]')}>
        <WorkItem
          {...args}
          onClick={() => {
            // eslint-disable-next-line no-console
            console.log(`Application for ${args.name} re-opened`);
          }}
        />
      </div>
    );
  },
  args: {
    name: 'Bonham & Sons',
    description: 'Kent Bailey',
    timestamp: '2022-12-12T12:45:00',
    completeState: [false, 'In progress'],
  },
};

export const Submitted: Story = {
  ...InProgress,
  args: {
    ...InProgress.args,
    completeState: [true, 'Submitted'],
  },
};

export const Loading: Story = {
  render: () => (
    <div className={classnames('w-[300px]')}>
      <WorkItem.Loading />
    </div>
  ),
};
