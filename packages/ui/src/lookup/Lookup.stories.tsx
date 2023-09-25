import { StoryObj, Meta } from '@storybook/react';
import { Lookup } from './Lookup';

const meta: Meta<typeof Lookup> = {
  title: 'Data/Lookup/Lookup',
  component: Lookup,
  parameters: {},
};
export default meta;
type Story = StoryObj<typeof Lookup>;

export const Default: Story = {
  args: {},
};
