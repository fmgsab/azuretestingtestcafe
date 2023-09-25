import React, { useLayoutEffect } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { db } from 'models';
import { createJobs } from 'mock-data/jobs';
import { Dashboard } from './Dashboard';

const meta: Meta<typeof Dashboard> = {
  title: 'diga/Pages/Dashboard',
  component: Dashboard,
  parameters: {
    controls: {},
    layout: 'fullscreen',
  },
};

export default meta;

type TemplateProps = {
  sizeAppts: number;
  sizeJobs: number;
  delayAppointmentList: number;
  delayJobList: number;
};

function Template({ sizeAppts = 0, sizeJobs = 0, delayAppointmentList, delayJobList }: TemplateProps) {
  useLayoutEffect(() => {
    const tbl = db.table('job');
    tbl.count().then((cnt) => {
      const offset = sizeJobs - cnt;
      const jobs = offset > 0 ? createJobs(sizeJobs - cnt) : [];
      tbl.bulkPut(jobs);
    });
  }, []);

  return <Dashboard delayAppointmentList={delayAppointmentList} delayJobList={delayJobList} sizeAppts={sizeAppts} />;
}

type Story = StoryObj<typeof Template>;

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    delayAppointmentList: 5000,
    delayJobList: 1000,
    sizeAppts: 10,
    sizeJobs: 10,
  },
  argTypes: {
    sizeAppts: { control: { type: 'range', max: 30 } },
    sizeJobs: { control: { type: 'range', max: 30 } },
    delayAppointmentList: { control: { type: 'number', max: 60000, min: 0, step: 500 } },
    delayJobList: { control: { type: 'number', max: 60000, min: 0, step: 500 } },
  },
};
