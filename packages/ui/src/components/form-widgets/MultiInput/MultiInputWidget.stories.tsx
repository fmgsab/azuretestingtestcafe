import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { z, ZodTypeAny } from 'zod';
import { MultiInputWidget } from './MultiInputWidget';
import { CommonControlType } from '../../../test/storybook-utils';
import { FormProviderWrapper } from '../../../providers/FormProviderWrapper';
import { TextInput } from '../../atoms/TextInput/TextInput';
import Dropdown from '../../atoms/Dropdown/Dropdown';
import { DropdownProps } from '../Dropdown/DropdownWidget';

export default {
  title: 'Components/Form Widgets/MultiInput',
  component: MultiInputWidget,
  args: {
    required: false,
    sizes: [4, 8, 4, 4, 4],
  },
  argTypes: {
    required: {
      control: {
        type: 'radio',
        options: [true, false]
      }
    }
  },
  parameters: {
    controls: {
      include: ['question', 'required', 'dropDownOptions'],
    },
  },
} as ComponentMeta<typeof MultiInputWidget>;

const Template: ComponentStory<typeof MultiInputWidget & z.infer<ZodTypeAny>> = (
  args: CommonControlType & { dropDownOptionsCover: DropdownProps; dropDownOptionsValuation: DropdownProps }
) => {
  const schema = args.required
    ? z.object({
        type: z.string().regex(/^[A-Za-z]+$/i, { message: 'Incorrect pattern' }),
        details: z.object({ value: z.string(), label: z.string() }),
      })
    : z.object({
        firstName: z
          .string()
          .regex(/^[A-Za-z]+$/i, { message: 'Incorrect pattern' })
          .optional(),
        option: z.object({ value: z.string(), label: z.string() }).optional(),
      });

  type FormValues = z.infer<typeof schema>;

  const onSubmit = (value: FormValues): void => console.log(value);

  return (
    <FormProviderWrapper model={{ schema }} uid={'1'} onSubmit={() => onSubmit({})}>
      <MultiInputWidget name="multinput-group" {...args}>
        <TextInput name="type" label="Type"></TextInput>
        <TextInput name="details" label="Details"></TextInput>
        <TextInput name="value" label="Value"></TextInput>
        <Dropdown {...args.dropDownOptionsCover} name="cover"></Dropdown>
        <Dropdown {...args.dropDownOptionsValuation} name="valuation"></Dropdown>
      </MultiInputWidget>
    </FormProviderWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  question: 'Specified Contents',
  dropDownOptionsCover: {
    label: 'Cover',
    name: 'cover',
    placeholder: 'Select',
    options: [
      { value: '', label: 'Select' },
      { value: '10', label: 'Option one' },
      { value: '20', label: 'Option two' },
      { value: '30', label: 'Option three' },
    ],
  },
  dropDownOptionsValuation: {
    label: 'Valuation',
    name: 'valuation',
    placeholder: 'Select',
    options: [
      { value: '', label: 'Select' },
      { value: '10', label: 'Option one' },
      { value: '20', label: 'Option two' },
      { value: '30', label: 'Option three' },
    ],
  },
};

export const Required = Template.bind({});
Required.args = {
  ...Default.args,
  required: true,
  dropDownOptions: {
    label: 'Secondary label',
    name: 'option',
    placeholder: 'Placeholder text',
    options: [
      { value: '', label: 'Placeholder text' },
      { value: '10', label: 'Option one' },
      { value: '20', label: 'Option two' },
      { value: '30', label: 'Option three' },
    ],
  },
};
