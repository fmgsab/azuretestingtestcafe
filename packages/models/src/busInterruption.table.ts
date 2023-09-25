import { z, ZodObject, ZodRawShape } from 'zod';
import { Table } from 'dexie';
import { db } from './@database';
import {
  asInteger,
  asRequiredString,
  addRequiredIssues,
  asOptionalSumInsured,
  asDecimal,
  asOptionalBoolean,
  asOptionalString,
} from './schemas/schema';
import { itemSubtypes } from './data-dictionary/constants';

const { dairyFarm, horticultural, commercial, nonDairyFarm } = itemSubtypes.busInterruption;

const siExcl = asOptionalSumInsured(100000000);

const baseSchema = {
  location: asRequiredString(),
  indemnityPeriod: asRequiredString(),
  hasGrossProfit: asOptionalBoolean(),
  grossProfit: siExcl,
  hasAddlIncreasedCosts: asOptionalBoolean(),
  addlIncreasedCosts: siExcl,
};

const nonHorticulturalSchema = {
  ...baseSchema,
  hasOutstandingDebtors: asOptionalBoolean(),
  outstandingDebtors: siExcl,
  hasLossOfRent: asOptionalBoolean(),
  lossOfRent: siExcl,
  hasDualWages: asOptionalBoolean(),
  dualWages: z
    .object({
      sumInsured: siExcl,
      initialPeriod: asInteger({ max: 99, optional: true }),
    })
    .or(asOptionalString())
    .nullish(),
  hasWagesInLieu: asOptionalBoolean(),
  wagesInLieu: z
    .object({
      sumInsured: siExcl,
      numWeeks: asInteger({ max: 99, optional: true }),
    })
    .or(asOptionalString())
    .nullish(),
  claimsPrepCosts: asInteger({ min: 10000, max: 100000000 }),
};

const commercialSchema = {
  ...nonHorticulturalSchema,
  building: asRequiredString(),
};

const dairyFarmSchema = {
  ...nonHorticulturalSchema,
  numberOfMilkingCows: asInteger({ max: 1000000 }),
  peakProduction: asInteger({ max: 1000000 }),
  estimatedPayout: asDecimal({ max: 100 }),
  share: asInteger({ max: 100 }),
};

const horticulturalSchema = {
  ...baseSchema,
  hasFrostCover: asRequiredString(),
};

export const schema = z
  .discriminatedUnion('itemSubtype', [
    z.object({ itemSubtype: z.literal(dairyFarm), ...dairyFarmSchema }),
    z.object({ itemSubtype: z.literal(commercial), ...commercialSchema }),
    z.object({ itemSubtype: z.literal(nonDairyFarm), ...nonHorticulturalSchema }),
    z.object({ itemSubtype: z.literal(horticultural), ...horticulturalSchema }),
  ])
  .superRefine((args: z.infer<ZodObject<ZodRawShape>>, ctx) => {
    addRequiredIssues(args.hasGrossProfit, ['grossProfit'], args, ctx);
    addRequiredIssues(args.hasAddlIncreasedCosts, ['addlIncreasedCosts'], args, ctx);
    addRequiredIssues(args.hasOutstandingDebtors, ['outstandingDebtors'], args, ctx);
    addRequiredIssues(args.hasLossOfRent, ['lossOfRent'], args, ctx);
    addRequiredIssues(args.hasDualWages, ['dualWages.sumInsured', 'dualWages.initialPeriod'], args, ctx);
    addRequiredIssues(args.hasWagesInLieu, ['wagesInLieu.sumInsured', 'wagesInLieu.numWeeks'], args, ctx);
  });

export type FormValues = z.infer<typeof schema>;

export const table: Table<FormValues> = db.busInterruption;
