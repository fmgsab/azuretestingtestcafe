import { z } from 'zod';
import { Table } from 'dexie';
import { db } from './@database';

export const schema = z.object({
  contactId: z.string(),
  operations: z.string().optional(),
  trunover: z.string().optional(),
  operatingModel: z.string().optional(),
  productionType: z.string().optional(),
  productionUnits: z.object({ units: z.string(), metric: z.string() }),
  operatingProps: z.object({ situationOfRisk: z.string(), description: z.string() }),
  ownership: z.string(),
  premSize: z.object({ hec: z.string(), sqm: z.string() }),
  numEmployees: z.object({ full: z.string(), part: z.string(), casual: z.string() }),
});

export type FormValues = z.infer<typeof schema>;

export const table: Table<FormValues> = db.businessInfo;
