import { ComponentMeta, ComponentStory } from '@storybook/react';
import { z, ZodTypeAny } from 'zod';

import { CommonControlType, StoryForm } from '../../../test/storybook-utils';
import { TextareaWidget } from './TextareaWidget';

export default {
  title: 'Components/Form Widgets/Multiline TextInput',
  component: TextareaWidget,
  parameters: {
    controls: {
      include: [
        'label',
        'question',
        'disabled',
        'pattern',
        'message',
        'required',
        'requiredMessage',
        'maxChars',
        'maxLength',
        'size',
        'placeholder',
      ],
    },
  },
} as ComponentMeta<typeof TextareaWidget>;

const Template: ComponentStory<typeof TextareaWidget & z.infer<ZodTypeAny>> = (args: CommonControlType) => {
  return (
    <StoryForm {...args}>
      <TextareaWidget name="defaultName" />
    </StoryForm>
  );
};

export const Default = Template.bind({});
Default.args = {
  question: 'Label',
  name: 'otherActivities',
  placeholder: 'Optional placeholder text',
  shouldValidateOnLoad: false,
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

export const Required = Template.bind({});
Required.args = {
  ...Default.args,
  required: true,
  message: 'required',
};
Required.parameters = {
  controls: { exclude: ['pattern'] },
};

export const Invalid = Template.bind({});
Invalid.args = {
  ...Default.args,
  defaultValue:
    'Multi-line text fields show all user input at once. Overflow text causes the text field to expand (shifting screen elements downward), and text wraps onto a new line. This text contains restricted special characters such as @, #, $',
  shouldValidateOnLoad: true,
  pattern: '^[,\\w\\s\\.\\(\\)\\-]*$',
  message: 'Restricted special characters',
  requiredMessage: '',
};

export const AlphaOnly = Template.bind({});
AlphaOnly.args = {
  ...Default.args,
  pattern: '^[A-Za-z]*$',
  message: 'Non word characters',
  requiredMessage: 'Required',
};

export const MaxLength = Template.bind({});
MaxLength.args = {
  ...Default.args,
  maxLength: 10,
  requiredMessage: 'Required',
};

export const MaxChars = Template.bind({});
MaxChars.args = {
  ...Default.args,
  maxChars: 10,
  message: 'Exceeded maximum number of characters: 10',
  requiredMessage: 'Required',
};
