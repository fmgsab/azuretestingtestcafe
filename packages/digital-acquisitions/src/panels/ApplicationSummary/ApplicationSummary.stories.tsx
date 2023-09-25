import { Meta, StoryObj } from '@storybook/react';

import { ApplicationSummary } from './ApplicationSummary';

const meta: Meta<typeof ApplicationSummary> = {
  title: 'diga/Page Panels/Application Summary',
  component: ApplicationSummary,
  parameters: {
    controls: {},
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ApplicationSummary>;

export const Default: Story = {
  args: {
    uid: 1,
  },
};
