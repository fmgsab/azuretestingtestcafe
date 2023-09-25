import { z } from 'zod';
import { Meta, StoryObj } from '@storybook/react';
import { AffixInputWidget } from './AffixInputWidget';
import { StoryForm } from '../../../test/storybook-utils';

const meta: Meta = {
  title: 'Components/Form Widgets/AffixInput',
  component: AffixInputWidget,
  args: {
    prefix: '$',
    id: '01',
    name: 'price',
    question: 'Price',
    placeholder: 'Amount',
    label: '',
    disabled: false,
    size: 4,
    message: 'Invalid format message',
    requiredMessage: 'Price required',
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
      include: [
        'id',
        'name',
        'disabled',
        'question',
        'required',
        'placeholder',
        'size',
        'label',
        'message',
        'requiredMessage',
        'prefix',
        'suffix',
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof AffixInputWidget & typeof StoryForm>;

const numbersOnly = z
  .string()
  .min(1, 'Required')
  .regex(/^[0-9,]+\.?([0-9]+)?$/i, { message: 'Numbers only' });

export const Default: Story = {
  render: ({ prefix, suffix, ...args }) => {
    return (
      <StoryForm {...args} mode="all">
        <AffixInputWidget name={args.name ?? ''} label={args.label} {...{ prefix, suffix }} />
      </StoryForm>
    );
  },
  args: {
    prefix: '$',
  },
};

export const Required: Story = {
  ...Default,
  args: {
    prefix: '$',
    required: true,
    requiredMessage: 'Price required',
  },
};

export const NumbersOnly: Story = {
  ...Default,
  args: {
    prefix: '$',
    required: true,
    requiredMessage: 'Price required',
    schema: z.object({
      price: numbersOnly,
    }),
  },
};

export const SuffixRequiredNumber: Story = {
  ...Default,
  args: {
    prefix: '',
    suffix: 'kg',
    name: 'weight',
    question: 'Weight',
    required: true,
    requiredMessage: 'Price required',
    message: 'Valid number required',
    schema: z.object({
      weight: numbersOnly,
    }),
  },
};
