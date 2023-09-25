import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { z, ZodTypeAny } from 'zod';

import { db } from 'models';

import { useSectionTable, useSectionStatus } from '../hooks';
import { SectionItemGroupType } from '../../../db/section-types';
import { MultiSection } from './MultiSection';
import multiSectionResolver from './multiSectionResolver';

const sectionList = [
  { name: 'Animals', table: db.TESTanimals, uid: { contactId: 1, jobId: 1, type: 'animals' }, isGroup: true },
  { name: 'Vehicles', table: db.TESTvehicles, uid: { contactId: 1, jobId: 1, type: 'vehicles' }, isGroup: true },
  { name: 'Dwellings', table: db.TESTdwellings, uid: { contactId: 1, jobId: 1, type: 'dwellings' }, isGroup: true },
];

export default {
  title: 'Components/Sections/Multi Item Sections',
  component: MultiSection,
  parameters: {
    controls: {
      include: ['target', 'status', 'placeholder'],
    },
  },
  argTypes: {
    target: {
      options: sectionList.map(({ name: sectionName }) => sectionName),
      control: { type: 'select' },
    },
    status: {
      options: ['not started', 'incomplete', 'complete', 'invalid'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof MultiSection>;

const Template: ComponentStory<typeof MultiSection & z.infer<ZodTypeAny>> = (
  args: SectionItemGroupType & { target: string; status: string }
) => {
  const sectionItemType = sectionList.find((s) => s.name === args.target);
  const { selectedSectionId } = useSectionStatus();
  const table = useSectionTable({ name: args.target, ...sectionItemType });

  if (selectedSectionId && typeof selectedSectionId === 'string') {
    multiSectionResolver({ status: args.status, table: table, tableKey: Number(selectedSectionId?.split('_')[1]) });
  }

  return (
    <div className="w-90">
      {sectionList.map((section, idx) => (
        <React.Fragment key={idx}>
          <MultiSection {...section} placeholder={args.placeholder} sectionLists={[]} />
        </React.Fragment>
      ))}
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  target: '',
  status: 'not started',
  placeholder: 'No items added',
};
