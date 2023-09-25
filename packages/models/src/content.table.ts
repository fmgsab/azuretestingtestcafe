import { z } from 'zod';
import { Table } from 'dexie';
import { db } from './@database';
import {
  addRequiredIssues,
  asKey,
  asOptionalShortText,
  asOptionalString,
  asRequiredString,
  asRequiredSumInsuredPair,
  getMinMessage,
  getNumRangeMessage,
} from './schemas/schema';
import { itemSubtypes } from './data-dictionary/constants';
import { alphaNumeric } from '@fmg/utils';

const gstRate = 1.15;

const minGstExclusive = 5000;
const maxGstExclusive = 100000000;

const minGstInclusive = minGstExclusive * gstRate;
const maxGstInclusive = maxGstExclusive * gstRate;

const specifiedItemsSchema = z
  .object({
    basisOfSettlement: asOptionalString(),
    details: asOptionalString(255),
    key: asKey(),
    specifiedItem: asOptionalString(),
    sumInsured: z
      .object({
        gstExclusive: z.coerce.number().optional().default(0),
        gstInclusive: z.coerce.number().optional().default(0),
      })
      .optional()
      .default({
        gstExclusive: 0,
        gstInclusive: 0,
      }),
    valuationProvided: z.set(z.string()).optional(),
  })
  .array();

const baseSchema = z.object({
  basisOfSettlement: asRequiredString(),
  excess: asRequiredString(),
  hasContentsInStorage: asRequiredString(),
  hasFixedCarpetCover: asOptionalString(),
  hasShortTermGuest: asOptionalString(),
  hasSpecifiedItems: asRequiredString(),
  hasUnRepairedEqcDamage: asRequiredString(),
  isBodyCorpManaged: asOptionalString(),
  isCommercialUse: asRequiredString(),
  itemSubtype: asRequiredString(),
  itemType: asRequiredString(),
  lifeStyleBlockContents: asRequiredString(),
  location: asRequiredString(),
  name: asOptionalShortText(alphaNumeric),
  occupancy: asOptionalString(),
  occupation: asOptionalShortText(),
  specifiedItems: specifiedItemsSchema,
  sumInsured: asRequiredSumInsuredPair(),
  valueOfContentsInStorage: asOptionalShortText(),
  waterSupply: asRequiredString(),
});

// TODO: refactor: Investigate more into discrimated unions and unwrap() of schemas, current way is too verbose and confusing
function attachRefinements<O extends FormValues, T extends z.ZodTypeDef, I>(schema: z.ZodType<O, T, I>) {
  return schema.superRefine((args, ctx) => {
    addRequiredIssues(() => args.itemSubtype === itemSubtypes.content.household, ['occupancy'], args, ctx);
    addRequiredIssues(() => args.itemSubtype === itemSubtypes.content.holidayHome, ['hasShortTermGuest'], args, ctx);
    addRequiredIssues(args.isCommercialUse, ['occupation'], args, ctx);
    addRequiredIssues(args.hasContentsInStorage, ['valueOfContentsInStorage'], args, ctx);
    addRequiredIssues(args.isBodyCorpManaged, ['hasFixedCarpetCover'], args, ctx);

    args.specifiedItems?.forEach((mod, index) => {
      const arrayName = 'specifiedItems';
      const basePath = `${arrayName}.${index}`;
      const gstExclusive = mod.sumInsured.gstExclusive;
      const gstInclusive = mod.sumInsured.gstInclusive;

      addRequiredIssues(args.hasSpecifiedItems, [`${basePath}.specifiedItem`], args, ctx);
      addRequiredIssues(args.hasSpecifiedItems, [`${basePath}.basisOfSettlement`], args, ctx);
      addRequiredIssues(args.hasSpecifiedItems, [`${basePath}.details`], args, ctx);
      addRequiredIssues(args.hasSpecifiedItems, [`${basePath}.sumInsured`], args, ctx);

      if (args.hasSpecifiedItems === 'true') {
        if (gstExclusive === 0) {
          ctx.addIssue({
            code: 'custom',
            message: 'Required ',
            path: [`${basePath}.sumInsured.gstExclusive`],
          });
        }

        if (gstInclusive === 0) {
          ctx.addIssue({
            code: 'custom',
            message: 'Required ',
            path: [`${basePath}.sumInsured.gstInclusive`],
          });
        }

        if (gstExclusive !== 0) {
          if (gstExclusive < minGstExclusive) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              message: getMinMessage(minGstExclusive),
              inclusive: true,
              fatal: true,
              minimum: minGstExclusive,
              path: [`${basePath}.sumInsured.gstExclusive`],
              type: 'number',
            });

            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              message: getMinMessage(minGstInclusive),
              inclusive: true,
              fatal: true,
              minimum: minGstInclusive,
              type: 'number',
              path: [`${basePath}.sumInsured.gstInclusive`],
            });
            return;
          }

          if (gstExclusive > maxGstExclusive) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              message: getNumRangeMessage(minGstExclusive, maxGstExclusive),
              inclusive: true,
              fatal: true,
              maximum: maxGstExclusive,
              path: [`${basePath}.sumInsured.gstExclusive`],
              type: 'number',
            });

            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              message: getNumRangeMessage(minGstExclusive, maxGstInclusive),
              inclusive: true,
              fatal: true,
              maximum: maxGstInclusive,
              type: 'number',
              path: [`${basePath}.sumInsured.gstInclusive`],
            });
            return;
          }
        }
      }
    });
  });
}

export type FormValues = z.infer<typeof baseSchema>;
export const schema = attachRefinements(baseSchema);
export const table: Table<FormValues> = db.content;
