import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Dropdown } from './Dropdown';

export default {
  title: 'Atoms/Dropdown',
  component: Dropdown,
  args: {
    label: '',
  },
  parameters: {},
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (args) => {
  return <Dropdown {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Options',
  name: 'option',
  placeholder: 'Select',
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
    { value: '150', label: 'Selected option' },
  ],
  defaultValue: '',
  noOptionsMessage: () => <>No results found</>,
};

export const MenuOpen = Template.bind({});
MenuOpen.args = {
  ...Default.args,
  menuIsOpen: true,
};

export const NoOptions = Template.bind({});
NoOptions.args = {
  ...Default.args,
  options: undefined,
};

export const Filled = Template.bind({});
Filled.args = {
  ...Default.args,
  defaultValue: '150',
};

export const Searchable = Template.bind({});
Searchable.args = {
  ...Default.args,
  isSearchable: true,
};

export const SearchableMulti = Template.bind({});
SearchableMulti.args = {
  ...Searchable.args,
  isMulti: true,
};

export const SearchableMultiFilled = Template.bind({});
SearchableMultiFilled.args = {
  ...SearchableMulti.args,
  isMulti: true,
  defaultValue: '150',
};

export const Invalid = Template.bind({});
Invalid.args = {
  ...Filled.args,
  error: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const CustomClass = Template.bind({});
CustomClass.args = {
  ...Default.args,
  className: 'w-full',
};
