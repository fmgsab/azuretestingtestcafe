import { z } from 'zod';
import { Table } from 'dexie';
import { db } from './@database';
import {
  asEmail,
  asKey,
  asOptionalString,
  asPosInteger,
  asRequiredArray,
  asRequiredString,
  asString,
  required,
  toOptional,
  toRequired,
} from './schemas/schema';

export const schema = z.object({
  accident: z
    .object(
      {
        key: asKey(),
        date: toRequired(asString().datetime()).refine((val) => new Date(Date.parse(val)) < new Date(), {
          message: 'Cannot be a future date',
        }),
        description: asRequiredString(4000),
        type: asRequiredString(),
      },
      required
    )
    .array(),
  hasAccidents: asRequiredString(),
  address: asRequiredString(),
  email: z
    .object({
      address: asOptionalString(),
      notProvided: toOptional(z.boolean()),
      noEmail: toOptional(z.boolean()),
      declined: toOptional(z.boolean()),
    })
    .superRefine((val, ctx) => {
      if (!val.noEmail && !val.declined && !val.notProvided) {
        if (!val.address) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Email required`,
            path: ['address'],
          });
        }

        if (!asEmail().safeParse(val.address).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid email`,
            path: ['address'],
          });
        }
      }
    }),
  firstName: asRequiredString(100),
  lastName: asRequiredString(100),
  hasLostLicence: asRequiredString(),
  lossOfLicence: z
    .object(
      {
        key: asKey(),
        date: toRequired(asString().datetime()).refine((val) => new Date(Date.parse(val)) < new Date(), {
          message: 'Cannot be a future date',
        }),
        demeritPoints: asPosInteger(5000, true),
        fine: asOptionalString(100),
        length: asPosInteger(5000, false),
        description: asRequiredString(4000),
        offence: asRequiredString(),
      },
      required
    )
    .array(),
  licenceType: asRequiredString(),
  middleName: z
    .object({
      name: asOptionalString(100),
      hasNoMiddleName: toOptional(z.boolean()),
    })
    .superRefine((val, ctx) => {
      if (!val.hasNoMiddleName && !val.name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Required`,
          path: ['name'],
        });
      }
    }),
  phone: z
    .object({
      type: asRequiredString(),
      number: asRequiredString(30),
    })
    .superRefine((val, ctx) => {
      if (
        (val.type === '' && !/^\d{2}[-. (]*\d{3}[-. (]*\d{4}$/.test(val.number)) ||
        (val.type === 'Mobile' && !/^\d{3}[-. (]*\d{3}[-. (]*\d{3}[-. (]*\d{0,2}$/.test(val.number)) ||
        (val.type === 'Work' && !/^\d{2}[-. (]*\d{3}[-. (]*\d{4}[-. (]*(x\d{1,5})?$/.test(val.number)) ||
        (val.type === 'Home' && !/^\d{2}[-. (]*\d{3}[-. (]*\d{4}$/.test(val.number))
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid ${val.type.toLowerCase()} number`,
          path: ['number'],
        });
      }
    }),
  preferredName: asOptionalString(30),
  roles: asRequiredArray(asRequiredString()).superRefine((val, ctx) => {
    if (
      val.filter((element) =>
        [
          'Account Holder',
          'Authority To Act',
          'Driver',
          'Executor',
          'Joint Account Holder',
          'Lawyer',
          'Named Insured',
          'Power of Attorney',
        ].includes(element)
      ).length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'undefined',
        path: ['dateOfBirth'],
      });
    }
  }),
  dateOfBirth: asString()
    .datetime()
    .refine((val) => new Date(Date.parse(val)) >= new Date(new Date().setFullYear(new Date().getFullYear() - 110)), {
      message: 'Contact cannot be over 110',
    })
    .refine((val) => new Date(Date.parse(val)) <= new Date(new Date().setHours(-24)), {
      message: 'Cannot be today or a future date',
    }),
  title: asRequiredString(10, 'Title is required'),
});

export type FormValues = z.infer<typeof schema>;

export const table: Table<FormValues> = db.contact;
