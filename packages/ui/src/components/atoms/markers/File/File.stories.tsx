import { Meta, StoryObj } from '@storybook/react';

import { File } from './File';

const meta: Meta = {
  title: 'Atoms/Marker/File',
  component: File,
  parameters: {},
} satisfies Meta<typeof File>;
export default meta;

type Story = StoryObj<typeof File>;

export const Default: Story = {};
export const Small: Story = {
  ...Default,
  args: {
    isSmall: true,
  },
};
