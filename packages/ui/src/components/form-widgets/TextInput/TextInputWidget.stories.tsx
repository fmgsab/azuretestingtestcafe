import { ComponentMeta, ComponentStory } from '@storybook/react';
import { z, ZodTypeAny } from 'zod';
import { TextInputWidget } from './TextInputWidget';
import { alpha, alphaNumeric } from '@fmg/utils';
import { CommonControlType, StoryForm } from '../../../test/storybook-utils';

export default {
  title: 'Components/Form Widgets/TextInput',
  component: TextInputWidget,
  args: {
    id: '01',
    name: 'firstName',
    question: 'First name',
    placeholder: 'Optional placeholder text',
    label: undefined,
    disabled: false,
    required: false,
    size: 4,
    requiredMessage: 'Required message',
    message: 'Invalid format message',
  },
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
      include: ['id', 'name', 'disabled', 'question', 'required', 'placeholder', 'size', 'label', 'message', 'requiredMessage'],
    },
  },
} as ComponentMeta<typeof TextInputWidget>;

const Template: ComponentStory<typeof TextInputWidget & z.infer<ZodTypeAny>> = (args: CommonControlType) => {
  return (
    <StoryForm {...args}>
      <TextInputWidget name="firstName" />
    </StoryForm>
  );
};

export const Default = Template.bind({});
Default.args = {};

export const OptedFor = Template.bind({});
OptedFor.args = { optedFor: 'hasValue' };

export const Required = Template.bind({});
Required.args = {
  required: true,
};

export const SecondaryLabel = Template.bind({});
SecondaryLabel.args = {
  label: 'Secondary label, this is a really long label that will push me over the edge.',
};

export const MaxLength = Template.bind({});
MaxLength.args = {
  maxLength: 10,
  label: 'Max length 10 characters',
};

export const Alpha = Template.bind({});
Alpha.args = {
  label: 'A-Z a-z and spaces only',
  pattern: alpha,
  required: true,
};

export const AlphaNumeric = Template.bind({});
AlphaNumeric.args = {
  label: 'A-Z a-z 0-9 and spaces only',
  pattern: alphaNumeric,
  required: true,
};

export const Number = Template.bind({});
Number.args = {
  question: 'Number',
  schema: z.object({ firstName: z.coerce.number({ invalid_type_error: 'Numbers only', required_error: 'required' }) }),
};

export const Email = Template.bind({});
Email.args = {
  schema: z.object({ firstName: z.string().email({ message: 'Incorrect email format' }) }),
  required: true,
};
