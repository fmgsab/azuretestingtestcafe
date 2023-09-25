import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import classnames from 'classnames';

import { Appointment } from './Appointment';

const meta: Meta = {
  title: 'Components/Cards/Appointment',
  component: Appointment,
  parameters: {
    controls: {
      exclude: ['action.onClick'],
    },
  },
} satisfies Meta<typeof Appointment>;
export default meta;

type Story = StoryObj<typeof Appointment>;

function handleOnClick(event: React.MouseEvent<HTMLButtonElement>) {
  // eslint-disable-next-line no-console
  console.log('New Application launched at ' + new Date(event.timeStamp));
}

export const Default: Story = {
  render: (args) => {
    return (
      <div className={classnames('w-[300px]')}>
        <Appointment {...args} />
      </div>
    );
  },
  args: {
    name: 'Kent Bailey',
    date: '2022-12-12T12:45:00',
    location: { addressLine1: '448 Pa Valley Road', addressLine2: '', city: 'Eketāhuna', postcode: '4993' },
    action: { label: '+ New Application', onClick: handleOnClick },
  },
};

export const LongName: Story = {
  ...Default,
  args: {
    ...Default.args,
    name: 'Longfirstname Longlastname',
  },
};

export const Loading: Story = {
  render: () => (
    <div className={classnames('w-[300px]')}>
      <Appointment.Loading />
    </div>
  ),
};
