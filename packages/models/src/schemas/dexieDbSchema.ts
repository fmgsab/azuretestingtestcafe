import { z } from 'zod';

export const dataTypeSchema = z.object({
  tableName: z.string(),
  rows: z.array(z.any()).min(0),
});

export const tableTypeSchema = z.object({
  name: z.string(),
  rowCount: z.number(),
  schema: z.string(),
});

export const dexieDbSchema = z.object({
  data: z.object({
    databaseName: z.string(),
    databaseVersion: z.number(),
    tables: z.array(tableTypeSchema),
    data: z.array(dataTypeSchema),
  }),
});

export type DexieDbSchemaType = z.infer<typeof dexieDbSchema>;
