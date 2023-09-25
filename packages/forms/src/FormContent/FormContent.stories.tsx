import { Meta, StoryObj } from '@storybook/react';
import { FormContent } from './FormContent';
import { db } from 'models';
import { addresses100 } from 'mock-data';
import { v4 } from 'uuid';

const jobId = '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b';

async function addMockData(tableName: string, data: object[]) {
  const table = db.tables.find((t) => t.name === tableName);

  if (!table) return;

  const count = await table.count();
  if (count) return;

  data.map(async (row) => {
    await db.table(tableName).add({ id: v4(), jobId, ...row });
  });
}

const meta: Meta = {
  title: 'forms/HouseholdContents',
  component: FormContent,
  argTypes: {},
  loaders: [
    async () => ({
      addLocations: await addMockData('location', [...addresses100.physical.slice(0, 3), ...addresses100.postalPhysical.slice(0, 3)]),
    }),
  ],
};

export default meta;

type Story = StoryObj<typeof FormContent>;

export const Default: Story = {
  render: ({ ...args }) => {
    return <FormContent uid={args.uid} />;
  },
  args: {
    uid: 'e19c9397-45c7-4bd3-9c96-9c0389c3780a',
  },
};
