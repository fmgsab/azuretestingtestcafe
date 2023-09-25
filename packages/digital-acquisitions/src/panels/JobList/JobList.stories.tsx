import React, { useLayoutEffect } from 'react';
import { z, ZodTypeAny } from 'zod';
import { Meta, StoryObj } from '@storybook/react';

import { db } from 'models';
import { createJobs } from 'mock-data/jobs';
import { JobList, JobListProps } from './JobList';

const meta: Meta<typeof JobList & z.infer<ZodTypeAny>> = {
  title: 'diga/Page Panels/Dashboard/Jobs',
  component: JobList,
  parameters: {
    controls: {},
    layout: 'fullscreen',
  },
};

export default meta;

type TemplateProps = JobListProps & {
  numJobs: number;
  delayMs: number;
};

function Template({ numJobs = 0, delayMs }: TemplateProps) {
  const data = createJobs(numJobs);

  // TODO: To be removed...
  useLayoutEffect(() => {
    const tbl = db.table('job');
    tbl.count().then(() => {
      tbl.clear();
      tbl.bulkPut(data);
    });
  }, [data]);

  return (
    <div className="md:mx-15 mb-4.5 mx-12 xl:mx-auto">
      <div className="h-7.5" />
      {/* eslint-disable-next-line no-console */}
      <JobList openJob={(id: unknown) => console.log(`Open application ${id}`)} delay={delayMs} />
    </div>
  );
}

type Story = StoryObj<typeof Template>;

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    numJobs: 25,
  },
};

export const Delayed: Story = {
  ...Default,
  args: {
    numJobs: 25,
    delayMs: 2000,
  },
};
