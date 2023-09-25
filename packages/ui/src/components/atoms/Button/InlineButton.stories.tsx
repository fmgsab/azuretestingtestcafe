import { ComponentMeta, ComponentStory } from '@storybook/react';
import AddIcon from '../../../assets/icons/18x18/plus.svg';
import SyncIcon from '../../../assets/icons/18x18/sync.svg';
import HamburgerIcon from '../../../assets/icons/18x18/hamburger.svg';
import React from 'react';
import { InlineButton } from './InlineButton';

export default {
  title: 'Components/Buttons/Inline Buttons',
  component: InlineButton,
  parameters: {},
} as ComponentMeta<typeof InlineButton>;

const Template: ComponentStory<typeof InlineButton> = (args) => {
  const { children, ...rest } = args;
  return <InlineButton {...rest}>{children}</InlineButton>;
};

export const Light = Template.bind({});
Light.args = {
  'aria-label': 'Add Building Area',
  children: 'Add Building Area',
  color: 'light',
  startIcon: <AddIcon />,
};

export const LightDisabled = Template.bind({});
LightDisabled.args = {
  'aria-label': 'Add Building Area',
  children: 'Add Building Area',
  color: 'light',
  disabled: true,
  startIcon: <AddIcon />,
};

export const Secondary = Template.bind({});
Secondary.args = {
  'aria-label': 'Synchronise',
  children: 'Sync',
  color: 'secondary',
  startIcon: <SyncIcon />,
};

export const SecondarySquare = Template.bind({});
SecondarySquare.args = {
  'aria-label': 'Menu button',
  color: 'secondary',
  startIcon: <HamburgerIcon />,
};

export const SecondaryDisabled = Template.bind({});
SecondaryDisabled.args = {
  'aria-label': 'Menu button',
  color: 'secondary',
  disabled: true,
  startIcon: <HamburgerIcon />,
};
