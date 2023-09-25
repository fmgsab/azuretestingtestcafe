import { Meta, StoryObj } from '@storybook/react';
import { z, ZodSchema } from 'zod';
import { asRequiredSumInsured, asRequiredSumInsuredGstIncl } from 'models/src/schemas/schema';
import { TwinInputWidget } from './TwinInputWidget';
import { StoryForm } from '../../../test/storybook-utils';

const meta: Meta<typeof TwinInputWidget> = {
  title: 'Components/Form Widgets/Twin Input',
  component: TwinInputWidget,
};

export default meta;

type Story = StoryObj<typeof TwinInputWidget & typeof StoryForm>;

export const Default: Story = {
  render: ({ ...args }) => {
    const schema: ZodSchema = z.object({
      boatLength: z.object({ gstExclusive: asRequiredSumInsured(), gstInclusive: asRequiredSumInsuredGstIncl() }),
    });

    return (
      <StoryForm {...args} schema={schema} shouldValidateOnLoad>
        <TwinInputWidget
          name="boatLength"
          question="Boat Length"
          inputs={[
            { label: 'Metres', name: 'metres', suffix: 'm' },
            { label: 'Feet', name: 'feet', suffix: 'ft' },
          ]}
          conversionFactor={3.28084}
          decimalAccuracy={1}
          required
        />
      </StoryForm>
    );
  },
  args: {},
};
