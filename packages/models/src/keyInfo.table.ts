import { z } from 'zod';
import { Table } from 'dexie';
import { db } from './@database';
import { addRequiredIssues, asOptionalString, asRequiredString } from './schemas/schema';
import { schema as contact } from './contact.table';
export const schema = z
  .object({
    accountType: asRequiredString(),
    accountName: asRequiredString(100),
    companyName: asOptionalString(100),
    accountSegment: asRequiredString(),
    salutation: asRequiredString(100),
    mailName: asRequiredString(100),
    // phone see below
    // email see below
    deliveryPreference: asRequiredString(),
    fmgPost: asRequiredString(),
    fmgAdviceOffers: asRequiredString(),
    needsWelcomePack: asRequiredString(),
    paymentFrequency: asRequiredString(),
    paymentMethod: asRequiredString(),
    shareholderNumber: asOptionalString(10),
  })
  .merge(contact.pick({ email: true, phone: true }))
  .superRefine((args, ctx) => {
    addRequiredIssues(args.accountType && args.accountType !== 'Collective', ['companyName'], args, ctx);
  });

export type FormValues = z.infer<typeof schema>;

export const table: Table<FormValues> = db.keyInfo;
