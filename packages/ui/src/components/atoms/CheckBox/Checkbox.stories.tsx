import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Checkbox } from './Checkbox';

export default {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  args: {
    label: 'Metal Covering',
    name: 'checkbox1',
    disabled: false,
    error: false,
    defaultChecked: false,
    value: 'metal',
  },
  argTypes: {
    error: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    controls: {
      exclude: ['value', 'required', 'id', 'defaultChecked'],
    },
  },
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => {
  return <Checkbox {...args} />;
};

export const Unchecked = Template.bind({});
Unchecked.args = {};

export const Checked = Template.bind({});
Checked.args = { defaultChecked: true };

export const CheckedInvalid = Template.bind({});
CheckedInvalid.args = {
  defaultChecked: true,
  error: true,
};

export const DisabledUnchecked = Template.bind({});
DisabledUnchecked.args = { disabled: true };

export const DisabledChecked = Template.bind({});
DisabledChecked.args = {
  disabled: true,
  defaultChecked: true,
};
