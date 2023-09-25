import { ComponentMeta, ComponentStory } from '@storybook/react';

import Plus from '../../../assets/icons/18x18/plus.svg';
import Remove from '../../../assets/icons/18x18/close.svg';
import { SectionItem } from './SectionItem';

export default {
  title: 'Components/Sections/Item Container',
  component: SectionItem,
  parameters: {
    controls: {
      include: ['title', 'className', 'hasStarted', 'hasCompleted', 'hasError', 'isActive', 'isDisabled', 'isGroup', 'count'],
    },
  },
} as ComponentMeta<typeof SectionItem>;

const Template: ComponentStory<typeof SectionItem> = (args) => {
  return <SectionItem {...args} />;
};

export const NotStarted = Template.bind({});
NotStarted.args = {
  title: 'Section',
  className: 'w-90',
};

export const Incomplete = Template.bind({});
Incomplete.args = {
  ...NotStarted.args,
  hasStarted: true,
};

export const Invalid = Template.bind({});
Invalid.args = {
  ...Incomplete.args,
  hasError: true,
};

export const Complete = Template.bind({});
Complete.args = {
  ...Incomplete.args,
  hasCompleted: true,
};

export const Active = Template.bind({});
Active.args = {
  ...Complete.args,
  isActive: true,
};

export const ItemType = Template.bind({});
ItemType.args = {
  ...Complete.args,
  isGroup: true,
  count: 2,
  children: (
    <SectionItem.Action data-testid="add-action" className="hover:bg-blue-240-active">
      <>
        Add
        <Plus />
      </>
    </SectionItem.Action>
  ),
};

export const ItemTypeActive = Template.bind({});
ItemTypeActive.args = {
  ...ItemType.args,
  isActive: true,
};

const RemoveAction = (
  <SectionItem.Action data-testid="remove-action" className="hover:bg-blue-240-hover-10 flex w-[30px] justify-center">
    <Remove />
  </SectionItem.Action>
);
export const SubItem = Template.bind({});
SubItem.args = {
  ...Complete.args,
  children: RemoveAction,
};

export const SubItemDisabled = Template.bind({});
SubItemDisabled.args = {
  ...SubItem.args,
  isDisabled: true,
};

export const SubItemActive = Template.bind({});
SubItemActive.args = {
  ...SubItem.args,
  isActive: true,
  children: RemoveAction,
};
