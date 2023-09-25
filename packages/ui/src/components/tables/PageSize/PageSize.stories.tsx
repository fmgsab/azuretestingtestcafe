import type { Meta, StoryObj } from '@storybook/react';
import { PageSize } from './PageSize';

const meta = {
  title: 'Components/Tables/PageSize',
  component: PageSize,
  parameters: {
    controls: {
      exclude: ['onClick', 'className'],
    },
  },
  argTypes: {
    size: { control: { type: 'range', min: 1 } },
    totalSize: { control: { type: 'range', min: 1 } },
  },
} satisfies Meta<typeof PageSize>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 8,
    totalSize: 16,
    label: 'Load More',
    className: 'w-64.5',
    onClick: () => console.log('Load more clicked!'),
  },
};
