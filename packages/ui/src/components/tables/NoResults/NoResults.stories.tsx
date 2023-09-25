import type { Meta, StoryObj } from '@storybook/react';
import { NoResults } from './NoResults';

import File from '../../../assets/icons/18x18/file.svg';
import Calendar from '../../../assets/icons/18x18/calendar-checkless.svg';
import Search from '../../../assets/icons/18x18/search.svg';

const meta = {
  title: 'Components/Tables/NoResults',
  component: NoResults,
  parameters: {
    controls: {
      exclude: ['onClick', 'className'],
    },
  },
} satisfies Meta<typeof NoResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoApplications: Story = {
  args: {
    Icon: File,
    title: 'No Applications',
    description: ['You have no in progress or submitted applications.', 'Use the "+ New Application" button to get started.'],
  },
};

export const NoScheduledLeads: Story = {
  args: {
    Icon: Calendar,
    title: 'No Scheduled Leads',
    description: ["You're all caught up! You have no upcoming Leads.", 'When you do have a Lead scheduled, it will appear here.'],
  },
};

export const NoSearchResults: Story = {
  args: {
    Icon: Search,
    title: 'No results for "sphie"',
    description: ['There are no matching search results.', 'Try using different keywords or checking for typos.'],
  },
};
