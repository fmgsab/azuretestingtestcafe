import { ComponentMeta, ComponentStory } from '@storybook/react';
import { z, ZodTypeAny } from 'zod';

import { DropdownWidget } from './DropdownWidget';
import { CommonControlType, StoryForm } from '../../../test/storybook-utils';

export default {
  title: 'Components/Form Widgets/Dropdown',
  component: DropdownWidget,
  parameters: {
    controls: {
      include: ['question', 'label', 'placeholder', 'options', 'disabled', 'size', 'required', 'message', 'noOptionsMessage'],
    },
  },
} as ComponentMeta<typeof DropdownWidget>;

const Template: ComponentStory<typeof DropdownWidget & z.infer<ZodTypeAny>> = (args: CommonControlType & { noOptionsMessage: string }) => {
  return (
    <StoryForm {...args} noOptionsMessage={() => <>{args.noOptionsMessage}</>}>
      <DropdownWidget name="defaultName" />
    </StoryForm>
  );
};

export const Default = Template.bind({});
Default.args = {
  question: 'Question',
  label: 'Secondary label',
  name: 'option',
  placeholder: 'Placeholder text',
  options: [
    { value: '10', label: 'Option one' },
    { value: '20', label: 'Option two' },
    { value: '30', label: 'Option three' },
  ],
  noOptionsMessage: 'No results found',
};

export const MenuOpen = Template.bind({});
MenuOpen.args = {
  ...Default.args,
  menuIsOpen: true,
};

export const Scrollable = Template.bind({});
Scrollable.args = {
  ...Default.args,
  options: [
    { value: '10', label: 'Option one' },
    { value: '20', label: 'Option two' },
    { value: '30', label: 'Option three' },
    { value: '40', label: 'Option four' },
    { value: '50', label: 'Option five' },
    { value: '60', label: 'Option six' },
    { value: '70', label: 'Option seven' },
    { value: '80', label: 'Option eight' },
    { value: '90', label: 'Option nine' },
    { value: '100', label: 'Option ten' },
    { value: '110', label: 'Option eleven' },
    { value: '120', label: 'Option twelve' },
    { value: '130', label: 'Option thirteen' },
    { value: '140', label: 'Option fourteen' },
  ],
};

export const Filled = Template.bind({});
Filled.args = {
  ...Default.args,
  options: [
    { value: '10', label: 'Option one' },
    { value: '15', label: 'Selected option' },
    { value: '20', label: 'Option two' },
    { value: '30', label: 'Option three' },
  ],
  defaultValue: '15',
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
  noOptionsMessage: 'No data',
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
