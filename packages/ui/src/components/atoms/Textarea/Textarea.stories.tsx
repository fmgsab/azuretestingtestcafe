import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Textarea } from './Textarea';

export default {
  title: 'Atoms/Textarea',
  component: Textarea,
  args: { 'data-testid': 'textarea' },
  parameters: {},
} as ComponentMeta<typeof Textarea>;

const Template: ComponentStory<typeof Textarea> = (args) => {
  return <Textarea {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  name: 'firstName',
  pattern: String(/[a-zA-Z]/),
  size: 6,
};

export const Filled2Lines = Template.bind({});
Filled2Lines.args = {
  ...Default.args,
  defaultValue: 'Multi-line text fields show all user input at once. Overflow text causes the text ...',
};

export const Filled4Lines = Template.bind({});
Filled4Lines.args = {
  ...Default.args,
  defaultValue:
    'Multi-line text fields show all user input at once. Overflow text causes the text field to expand (shifting screen elements downward), and text wraps onto a new line.',
};

export const FixedSized = Template.bind({});
FixedSized.args = {
  ...Default.args,
  autosize: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const Invalid = Template.bind({});
Invalid.args = {
  ...Filled4Lines.args,
  error: true,
};

export const Placeholder = Template.bind({});
Placeholder.args = {
  ...Placeholder.args,
  placeholder: 'Placeholder',
};

export const PlaceholderDisabled = Template.bind({});
PlaceholderDisabled.args = {
  ...Placeholder.args,
  disabled: true,
};
