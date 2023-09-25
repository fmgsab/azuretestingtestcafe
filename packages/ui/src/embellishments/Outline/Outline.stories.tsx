import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Outline } from './Outline';

export default {
  title: 'components/Decorators/Outline',
  component: Outline,
  args: {},
  parameters: {},
} as ComponentMeta<typeof Outline>;

const Template: ComponentStory<typeof Outline> = (args) => {
  return (
    <Outline {...args}>
      <div className="h-10">Outline</div>
    </Outline>
  );
};

export const Default = Template.bind({});
Default.args = {};
