import { Meta, StoryObj } from '@storybook/react';
import { FormBuildingCommercial } from './FormBuildingCommercial';

const meta: Meta = {
  title: 'forms/BuildingCommercial',
  component: FormBuildingCommercial,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof FormBuildingCommercial>;

export const Default: Story = {
  render: ({ ...args }) => {
    return <FormBuildingCommercial uid={args.uid} />;
  },
  args: {
    uid: 1,
  },
};
