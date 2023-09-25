import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TextInput } from './TextInput';

export default {
  title: 'Atoms/TextInput',
  component: TextInput,
  args: {},
  argTypes: {
    size: {
      control: { type: 'number' },
    },
    error: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    controls: {
      exclude: [
        'ariaLabel',
        'className',
        'control',
        'defaultChecked',
        'defaultValue',
        'fieldHandlers',
        'label',
        'options',
        'pattern',
        'value',
      ],
    },
  },
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = (args) => {
  return <TextInput {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  id: '01',
  name: 'firstName',
  placeholder: 'Optional placeholder text',
  disabled: false,
  error: false,
  size: 6,
};
