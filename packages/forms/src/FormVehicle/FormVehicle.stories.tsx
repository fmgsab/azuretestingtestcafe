import { Meta, StoryObj } from '@storybook/react';
import { FormVehicle } from './FormVehicle';
import { db } from 'models/src/@database';
import { contacts100, addresses100 } from 'mock-data';
import { v4 } from 'uuid';

const uid = v4();

async function addContacts({ ...args }) {
  const { drivers, non_drivers } = args;
  const table = db.tables.find((t) => t.name === 'contact');
  if (!table) return;
  table.clear();
  const dataToAdd = [...contacts100.drivers.slice(0, drivers), ...contacts100.nonDrivers.slice(0, non_drivers)];
  await table.bulkAdd(dataToAdd).finally();
}
async function addLocations({ ...args }) {
  const { locations_postal, locations_physical, locations_both } = args;
  const table = db.tables.find((t) => t.name === 'location');
  if (!table) return;
  table.clear();
  table
    .bulkAdd([
      ...addresses100.postal.slice(0, locations_postal ?? 0),
      ...addresses100.physical.slice(0, locations_physical ?? 0),
      ...addresses100.postalPhysical.slice(0, locations_both ?? 0),
    ])
    .finally();
}

const meta: Meta = {
  title: 'forms/Vehicle',
  component: FormVehicle,
  argTypes: {
    drivers: {
      control: { type: 'number', min: 0, max: 15 },
    },
    non_drivers: {
      control: { type: 'number', min: 0, max: 15 },
    },
    locations_postal: {
      control: { type: 'number', min: 0, max: 15 },
    },
    locations_physical: {
      control: { type: 'number', min: 0, max: 15 },
    },
    locations_both: {
      control: { type: 'number', min: 0, max: 15 },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormVehicle>;

export const Default: Story = {
  render: ({ ...args }) => {
    addContacts({ ...args }).finally();
    addLocations({ ...args }).finally();
    return <FormVehicle uid={args.uid} />;
  },
  args: {
    uid: uid,
    drivers: 1,
    non_drivers: 1,
    locations_postal: 1,
    locations_physical: 1,
    locations_both: 1,
  },
};
