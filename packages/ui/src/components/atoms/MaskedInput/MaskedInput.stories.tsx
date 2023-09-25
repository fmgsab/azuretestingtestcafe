import { Meta, StoryObj } from '@storybook/react';
import { TextInputProps } from '../../../types';
import { MaskedInput } from './MaskedInput';

export default {
  title: 'Atoms/MaskedInput',
  component: MaskedInput,
  args: { size: 6 },
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
} as Meta<TextInputProps>;

type Story = StoryObj<TextInputProps>;

export const Default: Story = {
  render: (args) => <MaskedInput {...args} />,
};

export const Mobile: Story = {
  render: (args) => <MaskedInput phoneType={'Mobile'} {...args} />,
};

export const Home: Story = {
  render: (args) => <MaskedInput phoneType={'Home'} {...args} />,
};

export const Work: Story = {
  render: (args) => <MaskedInput phoneType={'Work'} {...args} />,
};
