import { Meta, StoryObj } from '@storybook/react';
import { FormBusInterruption } from './FormBusInterruption';

const meta: Meta = {
  title: 'forms/BusInterruption',
  component: FormBusInterruption,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof FormBusInterruption>;

export const Default: Story = {
  render: ({ ...args }) => {
    return <FormBusInterruption uid={args.uid} />;
  },
  args: {
    uid: 1,
  },
};
