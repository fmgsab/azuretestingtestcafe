import React, { useEffect } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { z, ZodTypeAny } from 'zod';
import { useSectionTable, useSectionStatus } from '../../sections/hooks';
import { SectionItemGroupType } from '../../../db/section-types';
import { ApplicationMenu } from '../ApplicationMenu';
import multiSectionResolver, { sectionBulkModify } from '../../sections/MultiSection/multiSectionResolver';
import FormDisplay from './FormDisplay';
import sections, { jobId, contactId } from './mockDataBusiness';
import statusResolver, { setInitialSelectedId } from './statusResolver';
import { useSnackbar } from '../../overlays/Snackbar/useSnackbar';

const sectionLists = sections.flatMap(({ sectionList }) => sectionList);
const sectionsListNames = sectionLists.map(({ name: sectionName }) => sectionName);

// TODO
// There is a lot of duplicated code between this Storybook story and the Seasonal Risk story; Extract it?
export default {
  title: 'Components/Menus/Business Labels',
  component: ApplicationMenu,
  parameters: {
    controls: {
      include: ['placeholder', 'isOnline', 'set_AsGroup', 'target', 'status', 'setAccount', 'setRisk', 'size'],
      sort: 'alpha',
    },
  },
  argTypes: {
    isOnline: {
      control: { type: 'boolean' },
    },
    set_AsGroup: {
      control: { type: 'boolean' },
      label: 'Set as a group',
    },
    target: {
      options: ['', ...sectionsListNames],
      control: { type: 'select' },
      if: { arg: 'set_AsGroup', truthy: false },
    },
    size: {
      options: ['current', '99', '1'],
      control: { type: 'radio' },
      if: { arg: 'set_AsGroup', truthy: false },
    },
    status: {
      options: ['not started', 'incomplete', 'complete', 'invalid'],
      control: { type: 'radio' },
      if: { arg: 'set_AsGroup', truthy: false },
      label: 'Status',
    },
    setAccount: {
      options: ['all complete', 'all incomplete', 'none started'],
      control: { type: 'radio' },
      if: { arg: 'set_AsGroup' },
    },
    setRisk: {
      options: ['all complete', 'all incomplete', 'none started'],
      control: { type: 'radio' },
      if: { arg: 'set_AsGroup' },
    },
  },
} as ComponentMeta<typeof ApplicationMenu>;

const Template: ComponentStory<typeof ApplicationMenu & z.infer<ZodTypeAny>> = (
  args: SectionItemGroupType & {
    size: string;
    target: string;
    status: string;
    isOnline: boolean;
    setAccount: string;
    setRisk: string;
    set_AsGroup: boolean;
  }
) => {
  const { Container } = useSnackbar('warning', 'Item limit reached');
  const { isOnline, setAccount, setRisk, set_AsGroup, size } = args;
  const sectionItemType = sectionLists.find((s) => s.name === args.target);
  const { selectedSectionId, setSelectedSectionId } = useSectionStatus();
  const table = useSectionTable({ name: args.target, ...sectionItemType });

  useEffect(() => {
    // This runs to set the selected ID to display on "mount"
    // It sets it to be the Dexie table id of the first "section" in the sectionsList
    (async () => {
      await setInitialSelectedId(sections, setSelectedSectionId);
    })();
  }, []);

  if (set_AsGroup) {
    // Invoke status change commands for Account & Risk sections
    statusResolver('Account', setAccount, { sections, jobId, contactId }).then();
    statusResolver('Risk', setRisk, { sections, jobId, contactId }).then();
  } else {
    if (selectedSectionId && typeof selectedSectionId === 'string') {
      multiSectionResolver({ status: args.status, table: table, tableKey: selectedSectionId?.split('_')[1] });
      sectionBulkModify(table, size, sectionItemType).finally();
    }
  }

  return (
    <div className="flex h-[calc(100vh-32px)] w-full">
      <Container />
      <div className="w-90 h-full">
        <ApplicationMenu
          sectionLists={sections}
          placeholder={args.placeholder}
          {...{ jobId, isOnline }}
          replace={() => {}}
          push={() => {}}
        ></ApplicationMenu>
      </div>
      <FormDisplay />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  target: '',
  status: 'not started',
  size: 'current',
  placeholder: 'No items added',
  isOnline: false,
};
