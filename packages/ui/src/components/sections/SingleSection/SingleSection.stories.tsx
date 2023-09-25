import React from 'react';
import { z, ZodTypeAny } from 'zod';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { db } from 'models';

import { useSectionStatus, useSectionTable } from '../hooks';
import { SectionItemType } from '../../../db/section-types';
import { SingleSection } from './SingleSection';
import multiSectionResolver from "../MultiSection/multiSectionResolver";

const sectionList = [
  { name: 'Client Information', table: db.TESTclientInfo, uid: { contactId: 1 } },
  { name: 'Disclosure Statement', table: db.TESTdisclosure, uid: { contactId: 1 } },
];

export default {
  title: 'Components/Sections/Single Item Sections',
  component: SingleSection,
  parameters: {
    controls: {
      include: ['target', 'status'],
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
} as ComponentMeta<typeof SingleSection>;

const Template: ComponentStory<typeof SingleSection & z.infer<ZodTypeAny>> = (
  args: SectionItemType & { target: string; status: string }
) => {
  const sectionItem = sectionList.find((s) => s.name === args.target);
  const {selectedSectionId} = useSectionStatus();
  const table = useSectionTable({ name: args.target, ...sectionItem });

  if (selectedSectionId && typeof selectedSectionId === 'string') {
    multiSectionResolver({status: args.status, table: table, tableKey: Number(selectedSectionId?.split('_')[1])})
  }

  return (
    <div className="w-90">
      {sectionList.map((section, idx) => (
        <React.Fragment key={idx}>
          <SingleSection {...section} />
        </React.Fragment>
      ))}
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  target: '',
  status: 'not started',
};
