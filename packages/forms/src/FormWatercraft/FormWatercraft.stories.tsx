import { Meta, StoryObj } from '@storybook/react';
import { FormWatercraft } from './FormWatercraft';

const meta: Meta = {
  title: 'forms/Watercraft',
  component: FormWatercraft,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof FormWatercraft>;

export const Default: Story = {
  render: ({ ...args }) => {
    return <FormWatercraft uid={args.uid} />;
  },
  args: {
    uid: 1,
  },
};
