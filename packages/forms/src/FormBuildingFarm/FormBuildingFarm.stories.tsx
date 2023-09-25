import { Meta, StoryObj } from '@storybook/react';
import { FormBuildingFarm } from './FormBuildingFarm';

const meta: Meta = {
  title: 'forms/BuildingFarm',
  component: FormBuildingFarm,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof FormBuildingFarm>;

export const Default: Story = {
  render: ({ ...args }) => {
    return <FormBuildingFarm uid={args.uid} />;
  },
  args: {
    uid: 1,
  },
};
