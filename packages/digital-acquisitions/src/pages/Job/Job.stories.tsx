import { Meta, StoryObj } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';

import { Job } from './Job';

const meta: Meta<typeof Job> = {
  title: 'diga/Pages/Job',
  component: Job,
  parameters: {
    controls: {},
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    jobId: '292f6d16-54d9-467b-bb4c-531cba90dd2f',
    returnHome: linkTo('diga-pages-dashboard'),
  },
};
