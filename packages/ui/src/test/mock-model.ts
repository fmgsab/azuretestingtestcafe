import { z } from 'zod';
import Dexie, { Table } from 'dexie';

export const schema = z.object({
  name: z.string().max(255),
  age: z.number().superRefine((data, ctx) => {
    if (data >= 18) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Required',
        received: 'undefined',
        path: ['driverLicenseNo'],
      });
    }
  }),
  statementDelivery: z.set(z.string()).optional(),
  driverLicenseNo: z.string().optional(),
  isCloseFriend: z.boolean().optional(),
  email: z.string().default(''),
});

export type FormValues = z.infer<typeof schema>;

export class MockDB extends Dexie {
  friends!: Table<Partial<FormValues>>;
  car!: Table<Partial<FormValues>>;
  statementDelivery!: Table<Partial<FormValues>>;

  constructor(name: string, customSchema: Record<string, string>) {
    super(name);
    this.version(1).stores(customSchema);
  }
}
