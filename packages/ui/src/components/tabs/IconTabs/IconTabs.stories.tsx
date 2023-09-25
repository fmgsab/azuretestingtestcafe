import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { IconTabs } from './IconTabs';
import GridIcon from '../../../assets/icons/18x18/grid.svg';
import HamburgerIcon from '../../../assets/icons/18x18/hamburger.svg';
import StackIcon from '../../../assets/icons/18x18/stack.svg';
import LocationIcon from '../../../assets/icons/18x18/location.svg';
import { IdEnum } from '../tab-types';

export default {
  title: 'Components/Segmented Control/Icons',
  component: IconTabs,
  parameters: {},
} as ComponentMeta<typeof IconTabs>;

const Template: ComponentStory<typeof IconTabs> = ({ tabs, ...args }) => {
  const [activeId, setActiveId] = useState<IdEnum>('0');

  const tabsWithOnClick = tabs.map((tab, tabIndex) => {
    return {
      ...tab,
      onClick: () => setActiveId(`${tabIndex}` as IdEnum),
    };
  });

  return (
    <div className="h-[100%] flex justify-start items-center">
      <IconTabs {...args} tabs={tabsWithOnClick} activeId={activeId} />
    </div>
  );
};

export const GridList = Template.bind({});
GridList.args = {
  tabs: [
    {
      title: 'Grid',
      icon: <GridIcon />,
      onClick: () => {
        return;
      },
    },
    {
      title: 'List',
      icon: <HamburgerIcon />,
      onClick: () => {
        return;
      },
    },
  ],
};

export const ItemTypeLocation = Template.bind({});
ItemTypeLocation.args = {
  tabs: [
    {
      title: 'Item Type',
      icon: <StackIcon />,
      onClick: () => {
        return;
      },
    },
    {
      title: 'Location',
      icon: <LocationIcon />,
      onClick: () => {
        return;
      },
    },
  ],
};
