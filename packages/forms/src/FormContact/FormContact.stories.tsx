import { Meta, StoryObj } from '@storybook/react';
import { FormContact } from './FormContact';
import { db } from 'models';

const meta: Meta<typeof FormContact> = {
  title: 'Forms/Contact',
  component: FormContact,
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof FormContact>;

export const Default: Story = {
  // loaders: [
  //   async () => ({
  //     delete: await db.delete().then(async () => await db.open()),
  //   }),
  // ],

  render: (args) => {
    return (
      <div className="p-8">
        <FormContact {...args} />
      </div>
    );
  },
  args: {
    autoComplete: 'auto',
  },
};
