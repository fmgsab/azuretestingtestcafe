import { db } from 'models/src/@database';
import { contacts100, addresses100 } from 'mock-data';
async function addContacts({ ...args }) {
  const { drivers, non_drivers } = args;
  const table = db.tables.find((t) => t.name === 'contact');
  if (!table) return;
  table.clear();
  const dataToAdd = [...contacts100.drivers.slice(0, drivers), ...contacts100.nonDrivers.slice(0, non_drivers)];
  table.bulkAdd(dataToAdd).catch().finally();
}
async function addLocations({ ...args }) {
  const { locations_postal, locations_physical, locations_both } = args;
  const table = db.tables.find((t) => t.name === 'location');
  if (!table) return;
  table.clear();
  const dataToAdd = [
    ...addresses100.postal.slice(0, locations_postal ?? 0),
    ...addresses100.physical.slice(0, locations_physical ?? 0),
    ...addresses100.postalPhysical.slice(0, locations_both ?? 0),
  ];
  table.bulkAdd(dataToAdd).catch().finally();
}
export async function usePopulateMockData() {
  await addContacts({ drivers: 2, non_drivers: 2 });
  await addLocations({ locations_postal: 2, locations_physical: 2, locations_both: 2 });
  return null;
}
