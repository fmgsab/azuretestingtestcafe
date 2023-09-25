import { Meta, StoryObj } from '@storybook/react';
import Button from './ApplicationSummaryButton';

export default {
  title: 'Components/Buttons/Application Summary Button',
  component: Button,
  parameters: {
    controls: {
      include: ['isActive', 'children'],
    },
  },
} as Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Application Summary',
  },
};

export const Active: Story = {
  args: { ...Default.args, isActive: true },
};
