import { z, ZodSchema } from 'zod';
import { Meta, StoryObj } from '@storybook/react';
import { NumericInputWidget } from './NumericInputWidget';
import { StoryForm } from '../../../test/storybook-utils';
import { asRequiredSumInsured, asRequiredSumInsuredGstIncl } from 'models/src/schemas/schema';

const meta: Meta<typeof NumericInputWidget> = {
  title: 'Components/Form Widgets/NumericInput',
  component: NumericInputWidget,
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
};

export default meta;

type Story = StoryObj<typeof NumericInputWidget & typeof StoryForm>;

export const Default: Story = {
  render: ({ ...args }) => {
    const schema: ZodSchema = z.object({ grossProfit: asRequiredSumInsured(), gstInclusive: asRequiredSumInsuredGstIncl() });

    return (
      <StoryForm {...args} schema={schema} shouldValidateOnLoad>
        <NumericInputWidget name={args.name ?? ''} isSumInsured />
      </StoryForm>
    );
  },
  args: {
    question: 'Gross profit',
    name: 'grossProfit',
  },
};

export const Required: Story = {
  ...Default,
  args: {
    ...Default.args,
    required: true,
    requiredMessage: 'Required',
  },
};
