import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Radio } from './Radio';

export default {
  title: 'Atoms/Radio',
  component: Radio,
  args: {
    label: '',
  },
  parameters: {},
} as ComponentMeta<typeof Radio>;

const Template: ComponentStory<typeof Radio> = (args) => {
  return <Radio {...args} />;
};

export const Untoggled = Template.bind({});
Untoggled.args = {
  label: 'First name',
  name: 'firstName',
};

export const Toggled = Template.bind({});
Toggled.args = {
  ...Untoggled.args,
  defaultChecked: true,
};

export const Invalid = Template.bind({});
Invalid.args = {
  ...Untoggled.args,
  defaultChecked: true,
  error: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Untoggled.args,
  disabled: true,
};

export const DisabledToggled = Template.bind({});
DisabledToggled.args = {
  ...Toggled.args,
  disabled: true,
};
