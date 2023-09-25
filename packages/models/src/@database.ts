import Dexie, { Table } from 'dexie';
import { DexieDbSchemaType } from './index';

// eslint-disable-next-line
// @ts-ignore
Dexie.debug = false;

export class Database extends Dexie {
  contact!: Table;
  job!: Table;

  acknowledgement!: Table;
  disclosure!: Table;
  giQuestion!: Table;
  keyInfo!: Table;
  location!: Table;
  businessInfo!: Table;

  // items/risks
  house!: Table;
  content!: Table;
  commercialBuilding!: Table;
  farmBuilding!: Table;
  otherContent!: Table;
  busInterruption!: Table;
  vehicle!: Table;
  watercraft!: Table;
  liability!: Table;
  animal!: Table;
  fleet!: Table;
  specialtyRisk!: Table;
  kiwifruit!: Table;
  orchard!: Table;
  transit!: Table;
  crop!: Table;
  contractWork!: Table;
  livestock!: Table;

  lifeHealthReferral!: Table;

  // test for section list
  TESTanimals!: Table;
  TESTclientInfo!: Table;
  TESTdisclosure!: Table;
  TESTdwellings!: Table;
  TESTvehicles!: Table;

  #formSchema = 'id, jobId, created, updated, viewed';

  exportDbAddon = async () => {
    const { exportDB } = await import('dexie-export-import');

    try {
      const blob = await exportDB(this).catch(() => {
        throw new Error();
      });
      const content = await blob.text();
      return JSON.parse(content) as DexieDbSchemaType;
    } catch (error) {
      throw new Error('error exporting from addon');
    }
  };

  constructor() {
    super('ddc');
    this.version(1).stores({
      job: 'id, leadId, startDate, endDate, created, updated, viewed, closed, requested',
      contact: 'id, jobId, firstName, lastName, dateOfBirth, created, updated, viewed',
      clientInfo: this.#formSchema,
      acknowledgement: this.#formSchema,
      disclosure: this.#formSchema,
      giQuestion: this.#formSchema,
      keyInfo: this.#formSchema,
      location: this.#formSchema,
      businessInfo: this.#formSchema,
      house: this.#formSchema,
      content: this.#formSchema,
      commercialBuilding: this.#formSchema,
      farmBuilding: this.#formSchema,
      otherContent: this.#formSchema,
      busInterruption: this.#formSchema,
      vehicle: this.#formSchema,
      watercraft: this.#formSchema,
      liability: this.#formSchema,
      animal: this.#formSchema,
      fleet: this.#formSchema,
      specialtyRisk: this.#formSchema,
      kiwifruit: this.#formSchema,
      orchard: this.#formSchema,
      transit: this.#formSchema,
      crop: this.#formSchema,
      contractWork: this.#formSchema,
      livestock: this.#formSchema,

      TESTanimals: '++id, contactId, jobId, type, name',
      TESTclientInfo: '++id, contactId, jobId, type, name',
      TESTdisclosure: '++id, contactId, jobId, type, name',
      TESTdwellings: '++id, contactId, jobId, type, name',
      TESTvehicles: '++id, contactId, jobId, type, name',
    });
  }
}

const db = new Database();

export { db };
