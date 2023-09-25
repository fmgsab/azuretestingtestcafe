import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Count } from './Count';

export default {
  title: 'Atoms/Marker/Count',
  component: Count,
  parameters: {},
} as ComponentMeta<typeof Count>;

const Template: ComponentStory<typeof Count> = (args) => {
  return <Count {...args} />;
};

export const None = Template.bind({});

export const OneDigit = Template.bind({});
OneDigit.args = {
  count: 2,
};

export const Zero = Template.bind({});
Zero.args = {
  count: 0,
};

export const TwoDigits = Template.bind({});
TwoDigits.args = {
  count: 99,
};
