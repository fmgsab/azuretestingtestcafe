import { Meta, StoryObj } from '@storybook/react';
import { z, ZodSchema } from 'zod';
import { addRequiredIssues, asRequiredSumInsured, asRequiredSumInsuredGstIncl } from 'models/src/schemas/schema';
import { SumInsuredWidget } from './SumInsuredWidget';
import { StoryForm } from '../../../test/storybook-utils';

const meta: Meta<typeof SumInsuredWidget> = {
  title: 'Components/Form Widgets/Sum Insured',
  component: SumInsuredWidget,
};

export default meta;

type Story = StoryObj<typeof SumInsuredWidget & typeof StoryForm>;

export const Default: Story = {
  render: ({ ...args }) => {
    const schema: ZodSchema = z.object({
      sumInsured: z.object({ gstExclusive: asRequiredSumInsured(), gstInclusive: asRequiredSumInsuredGstIncl() }),
    });

    return (
      <StoryForm {...args} schema={schema} shouldValidateOnLoad>
        <SumInsuredWidget name="sumInsured" question="Sum Insured" required />
      </StoryForm>
    );
  },
  args: {},
};

export const SubLimit: Story = {
  render: ({ optedFor = '', ...args }) => {
    const schema: ZodSchema = z
      .object({
        sumInsured: z.object({ gstExclusive: asRequiredSumInsured(), gstInclusive: asRequiredSumInsuredGstIncl() }),
        [optedFor]: z.boolean(),
      })
      .superRefine((args, ctx) => {
        addRequiredIssues(args[optedFor] === true, ['sumInsured', 'gstExclusive'], args, ctx);
      });

    return (
      <StoryForm {...args} optedFor={optedFor} schema={schema} shouldValidateOnLoad>
        <SumInsuredWidget name="sumInsured" question="Sum Insured" optedFor={optedFor} />
      </StoryForm>
    );
  },
  args: { optedFor: 'hasSumInsured' },
};
