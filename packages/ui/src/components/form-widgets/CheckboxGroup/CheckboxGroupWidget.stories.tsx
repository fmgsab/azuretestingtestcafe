import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';
import { FormProviderWrapper } from '../../../providers/FormProviderWrapper';
import { CheckboxGroupProps, CheckboxGroupWidget } from './CheckboxGroupWidget';

const meta: Meta<typeof CheckboxGroupWidget> = {
  title: 'Components/Form Widgets/CheckboxGroup',
  component: CheckboxGroupWidget,
  args: {
    required: false,
  },
  argTypes: { error: { control: 'boolean' } },
  parameters: {
    controls: {
      include: ['cols', 'size', 'disabled', 'name', 'question', 'required', 'options'],
    },
  },
  tags: ['autodocs'],
};

export default meta;

const schema = z.object({
  statementDelivery: z.set(z.string()).optional(),
});

const schemaRequired = z.object({
  statementDelivery: z
    .set(z.string(), { required_error: 'At least one option is required' })
    .nonempty({ message: 'At least one option is required' }),
});

type Story = StoryObj<CheckboxGroupProps>;

export const Basic: Story = {
  render: (args: CheckboxGroupProps) => {
    return (
      <FormProviderWrapper
        model={{ schema: args.required ? schemaRequired : schema }}
        onSubmit={() => {
          return;
        }}
        uid={1}
      >
        <CheckboxGroupWidget {...args} />
        {args.required && <button className="btn btn-primary h-[40px] min-h-[40px] w-[100px]">Submit</button>}
      </FormProviderWrapper>
    );
  },

  args: {
    cols: 3,
    disabled: false,
    error: true,
    name: 'statementDelivery',
    question: 'Statement delivery',
    required: true,
    size: 6,
    options: [
      { id: 'post', label: 'Post', value: 'post' },
      { id: 'email', label: 'Email', value: 'email' },
      { id: 'declined', label: 'Declined', value: 'declined' },
    ],
    value: [],
  },
};
