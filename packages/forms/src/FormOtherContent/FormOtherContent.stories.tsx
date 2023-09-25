import { Meta, StoryObj } from '@storybook/react';
import { FormOtherContent } from './FormOtherContent';
import { db } from 'models';
import { addresses100, houses, farmBuildings, commercialBuildings } from 'mock-data';
import { v4 } from 'uuid';

const jobId = '292f6d16-54d9-467b-bb4c-531cba90dd2f';

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
  title: 'forms/OtherContents',
  component: FormOtherContent,
  args: {
    jobId,
  },
  argTypes: {},
  loaders: [
    async () => ({
      addLocations: await addMockData('location', [
        ...addresses100.physical.slice(0, 1),
        ...addresses100.postalPhysical.slice(0, 1),
        ...addresses100.postal.slice(0, 1),
      ]),
      addHouses: await addMockData('house', houses),
      addFarmBuildings: await addMockData('farmBuilding', farmBuildings),
      addCommercialBuildings: await addMockData('commercialBuilding', commercialBuildings),
    }),
  ],
};

export default meta;

type Story = StoryObj<typeof FormOtherContent>;

export const Default: Story = {
  render: ({ ...args }) => {
    return <FormOtherContent uid={args.uid} />;
  },
  args: {
    uid: 'd19c9397-45c7-4bd3-9c96-9c0389c3780a',
  },
};
