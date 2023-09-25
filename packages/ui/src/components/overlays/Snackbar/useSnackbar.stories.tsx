import React from 'react';
import { Meta, Story } from '@storybook/react';
import { useSnackbar } from './useSnackbar';
import Button from '../../atoms/Button/Button';

type SnackbarProps = {
  bgColor: 'success' | 'warning' | 'error';
  label: string;
  duration?: number;
};

const Snackbar = ({ bgColor, label, duration }: SnackbarProps) => {
  const { open, Container } = useSnackbar(bgColor, label, duration);

  return (
    <>
      <Container />
      <Button aria-label="snackbar open" color="primary" onClick={open}>
        Open Snackbar
      </Button>
    </>
  );
};

const meta: Meta = {
  title: 'Overlays/useSnackbar',
  component: Snackbar,
  argTypes: {
    bgColor: {
      options: ['success', 'warning', 'error'],
      control: { type: 'radio' },
    },
  },
  parameters: {},
};
export default meta;

const Template: Story<SnackbarProps> = (args) => {
  return <Snackbar {...args} />;
};

export const Success = Template.bind({});
Success.args = { bgColor: 'success', label: 'Success', duration: 5000 };

export const Warning = Template.bind({});
Warning.args = { bgColor: 'warning', label: 'Warning', duration: 5000 };

export const Error = Template.bind({});
Error.args = { bgColor: 'error', label: 'Error' };

export const Truncated = Template.bind({});
Truncated.args = {
  bgColor: 'success',
  label:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  duration: 5000,
};
