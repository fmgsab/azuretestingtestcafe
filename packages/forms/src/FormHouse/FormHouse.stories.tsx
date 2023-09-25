import { Meta, StoryObj } from '@storybook/react';
import { FormHouse } from './FormHouse';

const meta: Meta = {
  title: 'forms/House',
  component: FormHouse,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof FormHouse>;

export const Default: Story = {
  render: ({ ...args }) => {
    return <FormHouse uid={args.uid} />;
  },
  args: {
    uid: 1,
  },
};
