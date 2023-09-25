import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import { Colors } from './Colors';

const meta: Meta<typeof Colors> = {
  title: 'Atoms/Colours/Palette',
  component: Colors,
  parameters: {},
}
export default meta;
type Story = StoryObj<typeof Colors>;

export const Default: Story = {
  args: {}
};
