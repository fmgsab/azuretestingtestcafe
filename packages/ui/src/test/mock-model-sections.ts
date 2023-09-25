import Dexie, { Table } from 'dexie';

export class MockDB extends Dexie {
  keyInfo!: Table;
  disclosureStatement!: Table;
  house!: Table;
  householdContent!: Table;
  farmBuilding!: Table;

  constructor() {
    super('link_test');
    this.version(1).stores({
      keyInfo: '++id, contactId, jobId, type, name',
      disclosureStatement: '++id, contactId, buildingId',
      house: '++id, contactId, jobId, type, name',
      householdContent: '++id, contactId, jobId, type, name',
      farmBuilding: '++id, contactId, jobId, type, name',
    });
  }
}
