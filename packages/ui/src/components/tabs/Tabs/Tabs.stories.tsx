import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Tabs } from './Tabs';
import { IdEnum } from '../tab-types';

export default {
  title: 'Components/Segmented Control/Text',
  component: Tabs,
  parameters: {},
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = ({ tabs, ...args }) => {
  const [activeId, setActiveId] = useState<IdEnum>('0');

  const tabsWithOnclick = tabs.map((tab, tabIndex) => {
    return {
      ...tab,
      onClick: () => setActiveId(`${tabIndex}` as IdEnum),
    };
  });

  return (
    <div className="h-[100%] w-full py-5">
      <div className="h-[100%] w-[360px]">
        <Tabs {...args} tabs={tabsWithOnclick} activeId={activeId} />
      </div>
    </div>
  );
};

const tabs = [
  {
    title: 'Account',
    onClick: () => {
      return;
    },
  },
  {
    title: 'Items',
    onClick: () => {
      return;
    },
  },
  {
    title: 'Declarations',
    onClick: () => {
      return;
    },
  },
];
export const Default = Template.bind({});
Default.args = {
  tabs: tabs,
  block: true,
};

export const FitContent = Template.bind({});
FitContent.args = {
  tabs: tabs,
};
