import { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { BlockButtonProps } from '../../../types/input-types';

const meta: Meta<BlockButtonProps> = {
  title: 'Components/Buttons/Basic Buttons',
  component: Button,
  argTypes: {
    color: {
      options: ['primary', 'secondary', 'primary-block-light'],
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<BlockButtonProps>;

export const Primary: Story = {
  args: {
    'aria-label': 'Primary Button',
    children: 'Primary Button',
    color: 'primary',
  },
};

export const PrimaryBlock: Story = {
  args: {
    'aria-label': 'Primary Button',
    children: 'Primary Block Button',
    color: 'primary',
    block: true,
  },
};

export const PrimaryDisabled: Story = {
  args: {
    'aria-label': 'Primary Button',
    children: 'Primary Button',
    color: 'primary',
    disabled: true,
  },
};

export const Secondary: Story = {
  args: {
    'aria-label': 'Secondary Button',
    children: 'Secondary Button',
    color: 'secondary',
  },
};

export const SecondaryBlock: Story = {
  args: {
    'aria-label': 'Secondary Button',
    block: true,
    children: 'Secondary Block Button',
    color: 'secondary',
  },
};

export const SecondaryDisabled: Story = {
  args: {
    'aria-label': 'Secondary Button',
    children: 'Secondary Button',
    color: 'secondary',
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    'aria-label': 'Error Button',
    children: 'Error Button',
    color: 'primary',
    error: true,
  },
};

export const ErrorBlock: Story = {
  args: {
    'aria-label': 'Error Button',
    block: true,
    children: 'Error Block Button',
    color: 'primary',
    error: true,
  },
};

export const ErrorDisabled: Story = {
  args: {
    'aria-label': 'Error Button',
    children: 'Error Button',
    disabled: true,
    error: true,
  },
};

export const PrimaryBlockLight: Story = {
  args: {
    'aria-label': 'Primary Block Light Button',
    children: 'Primary Block Light',
    disabled: false,
    color: 'primary-block-light',
  },
};

export const PrimaryBlockLightDisabled: Story = {
  args: {
    'aria-label': 'Primary Block Light Button',
    children: 'Primary Block Light',
    disabled: true,
    color: 'primary-block-light',
  },
};
