import { Meta, StoryObj } from '@storybook/react';
import { FormKeyInfo } from './FormKeyInfo';

const meta: Meta = {
  title: 'forms/KeyInfo',
  component: FormKeyInfo,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof FormKeyInfo>;

export const Default: Story = {
  render: ({ ...args }) => {
    return <FormKeyInfo uid={args.uid} />;
  },
  args: {
    uid: 1,
  },
};
