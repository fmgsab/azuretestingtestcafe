import { Meta, StoryObj } from '@storybook/react';

import { Workspace } from './Workspace';

const meta: Meta<typeof Workspace> = {
  title: 'diga/Workspace/Workspace',
  component: Workspace,
  parameters: {
    controls: {},
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Workspace>;

export const Default: Story = {
  args: {
    jobId: 1,
    id: 1,
    sectionName: 'vehicle',
  },
};
