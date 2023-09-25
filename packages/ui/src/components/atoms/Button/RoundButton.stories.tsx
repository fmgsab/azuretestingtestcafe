import { ComponentMeta, ComponentStory } from '@storybook/react';
import ArrowLeftIcon from '../../../assets/icons/18x18/arrow-left.svg';
import React from 'react';
import { RoundButton } from './RoundButton';

export default {
  title: 'Components/Buttons/Round Buttons',
  component: RoundButton,
  parameters: {},
} as ComponentMeta<typeof RoundButton>;

const Template: ComponentStory<typeof RoundButton> = (args) => {
  return <RoundButton {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  'aria-label': 'Back button',
  startIcon: <ArrowLeftIcon />,
};

export const Disabled = Template.bind({});
Disabled.args = {
  'aria-label': 'Back button',
  disabled: true,
  startIcon: <ArrowLeftIcon />,
};
