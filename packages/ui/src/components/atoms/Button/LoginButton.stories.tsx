import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { LoginButton } from './LoginButton';

const defaultAvatarUrl =
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80';

export default {
  title: 'Components/Buttons/Login Button',
  component: LoginButton,
  parameters: {},
} as ComponentMeta<typeof LoginButton>;

const Template: ComponentStory<typeof LoginButton> = (args) => {
  return <LoginButton {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  'aria-label': 'Login button',
  imageUrl: defaultAvatarUrl,
};

export const Disabled = Template.bind({});
Disabled.args = {
  'aria-label': 'Login button',
  disabled: true,
  imageUrl: defaultAvatarUrl,
};

export const Placeholder = Template.bind({});
Placeholder.args = {
  'aria-label': 'Login button',
};
