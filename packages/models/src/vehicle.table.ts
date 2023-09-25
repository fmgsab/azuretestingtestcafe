import { z } from 'zod';
import { db } from './@database';
import { Table } from 'dexie';
import {
  asYear,
  asShortText,
  asOptionalString,
  asRequiredString,
  asPosInteger,
  asOptionalShortText,
  asDecimal,
  asRange,
  asKey,
  asRequiredChoices,
  required,
  addRequiredIssues,
  asRequiredSumInsuredPair,
} from './schemas/schema';
import { itemSubtypes, usages } from './data-dictionary/constants';

const { cvu, atv, truck, utv, motorbike, selfPowered, motorhome, horseTruck, drawn } = itemSubtypes.vehicle;

export const schema = z
  .object({
    itemSubtype: asRequiredString(),
    name: asShortText(),
    rego: asOptionalString(6),
    year: asYear(),
    make: asShortText(),
    model: asShortText(),
    variant: asOptionalShortText(),
    vin: asOptionalString(18),
    serial: asOptionalShortText(),
    ccRating: asPosInteger('10000', true),
    glw: asDecimal({ max: 999.0, decimalPlaces: 1 }),
    engineType: asOptionalString(),
    usage: asRequiredString(),
    coverType: asRequiredString(),
    sumInsured: asRequiredSumInsuredPair(),
    hasModification: asRequiredString(),
    viModifications: z
      .object(
        {
          key: asKey(),
          modificationType: asOptionalString(),
          sumInsured: asRange(2000, 999999, true, true),
          description: asOptionalString(500),
        },
        required
      )
      .array()
      .optional(),
    location: asRequiredString(),
    storage: asOptionalString(),
    mainDriver: asOptionalString(),
    excess: asRequiredString(),
    optionalCovers: asRequiredChoices(),
    commercialActivitiesDescription: asOptionalString(4000),
    hasHazardousGoods: asOptionalString(),
    hazardousGoodsDescription: asOptionalString(255),
  })
  .superRefine((args, ctx) => {
    addRequiredIssues(
      [cvu, atv, truck, utv, motorbike, selfPowered, motorhome, horseTruck].includes(args.itemSubtype),
      ['ccRating'],
      args,
      ctx
    );
    addRequiredIssues([atv, utv, motorbike, drawn].includes(args.itemSubtype), ['storage'], args, ctx);
    addRequiredIssues([cvu, atv, truck, utv, motorbike, motorhome, horseTruck].includes(args.itemSubtype), ['engineType'], args, ctx);
    addRequiredIssues(args.usage === usages.private, ['mainDriver'], args, ctx);
    addRequiredIssues(args.usage === usages.commercial, ['commercialActivitiesDescription', 'hasHazardousGoods'], args, ctx);
    addRequiredIssues(args.hasHazardousGoods, ['hazardousGoodsDescription'], args, ctx);
    args.viModifications?.forEach((mod, index) => {
      addRequiredIssues(args.hasModification, [`viModifications.${index}.modificationType`], args, ctx);
      addRequiredIssues(args.hasModification, [`viModifications.${index}.sumInsured`], args, ctx);
    });
  });

export type FormValues = z.infer<typeof schema>;

export const table: Table<FormValues> = db.vehicle;
