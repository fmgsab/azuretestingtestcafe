import { Meta, StoryObj } from '@storybook/react';
import { ActionItem, SubHeader, SubHeaderProps } from './SubHeader';

const meta: Meta<typeof SubHeader> = {
  title: 'Layout/SubHeader',
  component: SubHeader,
  parameters: {
    controls: { exclude: ['actionItems'], include: ['longTitle', 'text'] },
  },
  argTypes: {
    longTitle: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SubHeader>;

export const Default: Story = {
  render: (args: SubHeaderProps) => {
    args.text = args.longTitle ? longTitleText : args.text;
    return <SubHeader {...args} />;
  },
  args: {
    text: 'Sub Header',
  },
};

export const Actions1: Story = {
  ...Default,
  args: {
    ...Default.args,
    actionItems: [<ActionItem />],
  },
};

export const Actions2: Story = {
  ...Default,
  args: {
    ...Default.args,
    actionItems: [<ActionItem />, <ActionItem />],
  },
};

const longTitleText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Utern do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
