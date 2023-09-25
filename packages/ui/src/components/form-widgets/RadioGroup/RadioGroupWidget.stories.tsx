import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { z, ZodRawShape, ZodTypeAny } from 'zod';
import { RadioGroupWidget } from './RadioGroupWidget';
import { CommonControlType, StoryForm, StringType } from '../../../test/storybook-utils';
import { useEffect, useState } from 'react';

export default {
  title: 'Components/Form Widgets/RadioGroup',
  component: RadioGroupWidget,
  parameters: {
    controls: {
      include: ['label', 'question', 'disabled', 'message', 'required', 'cols', 'defaultValue'],
    },
  },
  argTypes: {
    cols: {
      options: [1, 2, 3, 4],
      control: { type: 'radio' },
    },
    defaultValue: {
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof RadioGroupWidget>;

const Template: ComponentStory<typeof RadioGroupWidget & z.infer<ZodTypeAny>> = (args: CommonControlType) => {
  return (
    <StoryForm {...args}>
      <RadioGroupWidget name="user" />
    </StoryForm>
  );
};

export const Default = Template.bind({});
Default.args = {
  question: 'Label',
  name: 'user',
  options: [
    { label: 'Option 1', value: 'Option 1' },
    { label: 'Option 2', value: 'Option 2' },
    { label: 'Option 3', value: 'Option 3' },
  ],
};

export const Toggled = Template.bind({});
Toggled.args = {
  ...Default.args,
  defaultValue: 'Option 2',
};

export const DisabledUntoggled = Template.bind({});
DisabledUntoggled.args = {
  ...Default.args,
  disabled: true,
};

export const DisabledToggled = Template.bind({});
DisabledToggled.args = {
  ...Toggled.args,
  disabled: true,
};

export const Required = Template.bind({});
Required.args = {
  ...Default.args,
  required: true,
  message: 'Required',
};

export const Wrapped = Template.bind({});
Wrapped.args = {
  ...Default.args,
  options: [
    ...Default.args.options,
    { label: 'Option 4', value: 'Option 4' },
    { label: 'Option 5', value: 'Option 5' },
    { label: 'Option 6', value: 'Option 6' },
  ],
  cols: 3,
};

export const WrappedRequired = Template.bind({});
WrappedRequired.args = {
  ...Wrapped.args,
  required: true,
  message: 'Required',
};

export const MultiQuestions: ComponentStory<typeof RadioGroupWidget & z.infer<ZodTypeAny>> = (args: {
  questions: Partial<CommonControlType>[];
}) => {
  const [shouldValidateOnLoad, setShouldValidateOnLoad] = useState<boolean>(false);
  const fieldShape = args.questions.reduce((acc, { name = '', required = false, message = '' }) => {
    const stringType = new StringType(name).asRequired((required && false) || true, message).build();
    return { ...acc, ...stringType };
  }, {});

  const schema = z.object(fieldShape as ZodRawShape);

  useEffect(() => {
    setShouldValidateOnLoad(true);
  }, [args.questions]);

  useEffect(() => {
    setShouldValidateOnLoad(false);
  }, []);

  return (
    <StoryForm pattern={''} message={''} maxChars={0} shouldValidateOnLoad={shouldValidateOnLoad} schema={schema}>
      {args.questions.map((question) => {
        return <RadioGroupWidget {...question} name={question.name || ''} key={question.name} />;
      })}
    </StoryForm>
  );
};
MultiQuestions.parameters = {
  controls: {
    include: ['questions'],
  },
};
MultiQuestions.args = {
  questions: [
    {
      question: 'Question 1',
      name: 'question1',
      required: true,
      message: 'required',
      options: [
        ...Default.args.options,
        { label: 'Option 4', value: 'Option 4' },
        { label: 'Option 5', value: 'Option 5' },
        { label: 'Option 6', value: 'Option 6' },
      ],
      cols: 3,
    },
    {
      question: 'Question 2',
      name: 'question2',
      required: false,
      message: '',
      options: [
        ...Default.args.options,
        { label: 'Option 4', value: 'Option 4' },
        { label: 'Option 5', value: 'Option 5' },
        { label: 'Option 6', value: 'Option 6' },
      ],
      cols: 3,
    },
  ],
};
