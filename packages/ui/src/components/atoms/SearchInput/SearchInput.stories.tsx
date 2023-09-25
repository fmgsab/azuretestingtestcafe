import { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './SearchInput';

export default {
  title: 'Atoms/SearchInput',
  component: SearchInput,
} as Meta<typeof SearchInput>;

type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {};
export const Placeholder: Story = {
  args: {
    placeholder: 'Filter',
  },
};
