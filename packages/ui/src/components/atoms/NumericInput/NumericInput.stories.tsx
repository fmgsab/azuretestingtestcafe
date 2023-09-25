import { Meta, StoryObj } from '@storybook/react';
import { NumericInput } from './NumericInput';

const meta: Meta = {
  title: 'Atoms/NumericInput',
  component: NumericInput,
  argTypes: {
    placeholder: {
      control: { type: 'text' },
    },
  },
  args: {},
  parameters: {
    controls: {
      exclude: ['ariaLabel', 'className', 'control', 'defaultChecked', 'defaultValue', 'fieldHandlers', 'options', 'pattern', 'value'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Currency: Story = {
  args: {
    isCurrency: true,
  },
};

export const SumInsured: Story = {
  args: {
    isSumInsured: true,
    placeholder: undefined,
  },
};

export const Suffix: Story = {
  args: {
    suffix: '%',
  },
};
