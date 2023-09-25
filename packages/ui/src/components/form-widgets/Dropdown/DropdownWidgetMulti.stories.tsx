import { ComponentMeta, ComponentStory } from '@storybook/react';
import { z, ZodTypeAny } from 'zod';

import { DropdownWidget } from './DropdownWidget';
import { CommonControlType, StoryForm } from '../../../test/storybook-utils';

export default {
  title: 'Components/Form Widgets/Dropdown (Multi-select)',
  component: DropdownWidget,
  parameters: {
    controls: {
      include: ['question', 'label', 'placeholder', 'options', 'disabled', 'size', 'required', 'message', 'noOptionsMessage'],
    },
  },
} as ComponentMeta<typeof DropdownWidget>;

const Template: ComponentStory<typeof DropdownWidget & z.infer<ZodTypeAny>> = (args: CommonControlType & { noOptionsMessage: string }) => {
  const arrayType = z.string({ required_error: args.message }).array();
  const option = args.required
    ? arrayType.nonempty({
        message: args.message,
      })
    : arrayType.optional();
  const schema = args.required ? z.object({ option }) : z.object({ option }).optional();

  const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    if (issue.code === z.ZodIssueCode.invalid_type) {
      if (issue.expected === 'array' && issue.received === 'undefined') {
        return { message: args.message };
      }
    }

    return { message: ctx.defaultError };
  };

  z.setErrorMap(customErrorMap);

  return (
    <StoryForm {...args} schema={schema} noOptionsMessage={() => <>{args.noOptionsMessage}</>}>
      <DropdownWidget name="defaultName" />
    </StoryForm>
  );
};

export const Default = Template.bind({});
Default.args = {
  isMulti: true,
  question: 'Question',
  label: 'Secondary label',
  name: 'option',
  placeholder: 'Placeholder text',
  options: [
    { value: '0', label: 'Auckland' },
    { value: '1', label: 'Christchurch' },
    { value: '2', label: 'Wellington' },
  ],
  noOptionsMessage: 'No results found',
};

export const Scrollable = Template.bind({});
Scrollable.args = {
  ...Default.args,
  options: [
    { value: '0', label: 'Auckland' },
    { value: '1', label: 'Christchurch' },
    { value: '2', label: 'Wellington' },
    { value: '3', label: 'Hamilton' },
    { value: '4', label: 'Tauranga' },
    { value: '5', label: 'Dunedin' },
    { value: '6', label: 'Palmerston North' },
    { value: '7', label: 'Whangārei' },
    { value: '8', label: 'Nelson' },
    { value: '9', label: 'New Plymouth' },
    { value: '10', label: 'Hastings' },
    { value: '11', label: 'Rotorua' },
    { value: '12', label: 'Napier' },
    { value: '13', label: 'Invercargill' },
    { value: '14', label: 'Kapiti Coast' },
    { value: '15', label: 'Whanganui' },
    { value: '16', label: 'Gisborne' },
  ],
};

export const Filled1 = Template.bind({});
Filled1.args = {
  ...Scrollable.args,
  defaultValue: ['6'],
};

export const Filled2 = Template.bind({});
Filled2.args = {
  ...Scrollable.args,
  defaultValue: ['1', '6'],
  size: 8,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const NoData = Template.bind({});
NoData.args = {
  ...Default.args,
  options: [],
};

export const Required = Template.bind({});
Required.args = {
  ...Default.args,
  required: true,
  message: 'required',
};

export const NoSecondaryLabel = Template.bind({});
NoSecondaryLabel.args = {
  ...Default.args,
  label: undefined,
};
