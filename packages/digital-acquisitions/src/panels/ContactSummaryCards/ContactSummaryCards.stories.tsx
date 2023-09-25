import React from 'react';
import { z, ZodTypeAny } from 'zod';
import { Meta, StoryObj } from '@storybook/react';
import { contacts } from 'mock-data';

import { ContactSummaryCards } from './ContactSummaryCards';

const meta: Meta<typeof ContactSummaryCards> = {
  title: 'diga/Page Panels/Application Summary/Contact Summary Cards',
  component: ContactSummaryCards,
  parameters: { layout: 'fullscreen' },
};

export default meta;

const Template = (args: z.infer<ZodTypeAny>) => {
  return (
    <div className="flex h-screen w-full">
      <div className="hidden h-full w-[402px] min-w-[402px] items-center justify-center border-r-2 border-dashed border-[#F5C21B] bg-[#FFEBAA] text-[#F5C21B] lg:flex">
        Section List
      </div>
      <div className="pt-4.5 w-full">
        <div className="px-4.5 xl:px-[120px]">
          <ContactSummaryCards {...args} />
        </div>
      </div>
    </div>
  );
};

type Story = StoryObj<typeof Template>;

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: { data: contacts },
};
