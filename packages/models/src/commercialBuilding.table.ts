import { z } from 'zod';
import { Table } from 'dexie';
import { db } from './@database';
import {
  addOtherIssues,
  addRequiredIssues,
  asKey,
  asOptionalShortText,
  asOptionalString,
  asRange,
  asRequiredString,
  asSet,
  asShortText,
  asString,
  asYear,
  asYearMessage,
  asYearRange,
  getNumRangeMessage,
} from './schemas/schema';
import { numericCondition, occupancies, oldBuildingYears, securityFeatures } from './data-dictionary/constants';
import { toNumber } from '@fmg/utils';
import { nq } from './data-dictionary/names-questions';
const { defaultSumInsuredExcGst, defaultSumInsuredIncGst, maxBuildingArea } = numericCondition;

export const schema = z
  .object({
    itemSubtype: asRequiredString(),
    location: asRequiredString(),
    occupancy: asRequiredString(),
    tenants: z
      .object({
        key: asKey(),
        name: asShortText(),
        occupation: asShortText(),
      })
      .array(),
    basisOfSettlement: asRequiredString(),
    valuationForSumInsured: asRequiredString(),
    dateOfValuation: asOptionalString(),
    presentDayValue: z
      .object({
        gstExclusive: z.string().or(z.number()).optional(),
        gstInclusive: z.string().or(z.number()).optional(),
      })
      .optional(),
    replacementValue: z
      .object({
        gstExclusive: z.string().or(z.number()).optional(),
        gstInclusive: z.string().or(z.number()).optional(),
      })
      .optional(),
    demolitionCost: z
      .object({
        gstExclusive: z.string().or(z.number()).optional(),
        gstInclusive: z.string().or(z.number()).optional(),
      })
      .or(z.string()) // TODO this is here to prevent parsing from blocking before superrefine.
      .optional(),
    hasDemolitionCost: z.boolean(),
    excess: asRequiredString(),
    waterSupply: asRequiredString(),
    yearConstruction: asYearRange(),
    roofConstruction: asRequiredString(),
    floorConstruction: asRequiredString(),
    wallConstruction: asRequiredString(),
    numberOfStories: asRequiredString(),
    // Fire Protection
    hasFireProtection: asRequiredString(),
    fireProtection: asSet(asString()).nullish(),
    yearSwitchboardCheck: asYearRange(),
    // Hazards
    hasHazards: asRequiredString(),
    hazards: asSet(asString()).nullish(),
    otherHazardDetails: asOptionalShortText(),
    // Security
    hasSecurityFeatures: asOptionalString(),
    securityQuestions: asSet(asString()).nullish(),
    otherSecurityDetails: asOptionalShortText(),

    historicPlace: asOptionalString(),
    domesticArea: asRequiredString(),
    buildingAreas: z
      .object({
        key: asKey(),
        type: asOptionalString(),
        year: asOptionalString(),
        area: asOptionalString(),
        description: asOptionalShortText(),
      })
      .array(),
  })
  .superRefine((args, ctx) => {
    addRequiredIssues(!args?.presentDayValue?.gstExclusive, ['presentDayValue.gstExclusive'], args, ctx);
    addRequiredIssues(!args?.presentDayValue?.gstInclusive, ['presentDayValue.gstInclusive'], args, ctx);
    addRequiredIssues(!args?.replacementValue?.gstExclusive, ['replacementValue.gstExclusive'], args, ctx);
    addRequiredIssues(!args?.replacementValue?.gstInclusive, ['replacementValue.gstInclusive'], args, ctx);

    // Check Ranges
    addOtherIssues(
      !asRange(1, defaultSumInsuredExcGst, true, true).safeParse(args?.presentDayValue?.gstExclusive).success,
      `presentDayValue.gstExclusive`,
      getNumRangeMessage('1', defaultSumInsuredExcGst),
      ctx
    );
    addOtherIssues(
      !asRange(1, defaultSumInsuredIncGst, true, true).safeParse(args?.presentDayValue?.gstInclusive).success,
      `presentDayValue.gstInclusive`,
      getNumRangeMessage(1, defaultSumInsuredIncGst),
      ctx
    );
    addOtherIssues(
      !asRange(1, defaultSumInsuredExcGst, true, true).safeParse(args?.replacementValue?.gstExclusive).success,
      `replacementValue.gstExclusive`,
      getNumRangeMessage(1, defaultSumInsuredExcGst),
      ctx
    );
    addOtherIssues(
      !asRange(1, defaultSumInsuredIncGst, true, true).safeParse(args?.replacementValue?.gstInclusive).success,
      `replacementValue.gstInclusive`,
      getNumRangeMessage(1, defaultSumInsuredIncGst),
      ctx
    );

    // Check Relative Values
    addOtherIssues(
      Boolean(
        args?.replacementValue?.gstInclusive &&
          args?.presentDayValue?.gstInclusive &&
          Number(args?.replacementValue?.gstInclusive) < Number(args?.presentDayValue?.gstInclusive)
      ),
      `replacementValue.gstExclusive`,
      'Must be greater than Present Day Value',
      ctx
    );
    addOtherIssues(
      Boolean(
        args?.replacementValue?.gstInclusive &&
          args?.presentDayValue?.gstInclusive &&
          Number(args?.replacementValue?.gstInclusive) < Number(args?.presentDayValue?.gstInclusive)
      ),
      `replacementValue.gstInclusive`,
      'Enter a value greater than Present Day Value',
      ctx
    );

    // Demolition Cost
    // TODO - below TS is unhappy with the shape of demolitionCost being string or object
    addRequiredIssues(args.hasDemolitionCost, ['demolitionCost.gstExclusive', 'demolitionCost.gstInclusive'], args, ctx);
    addOtherIssues(
      args.hasDemolitionCost && !asRange(1, defaultSumInsuredExcGst, true, true).safeParse(args?.demolitionCost?.gstExclusive).success,
      `demolitionCost.gstExclusive`,
      getNumRangeMessage(1, defaultSumInsuredExcGst),
      ctx
    );
    addOtherIssues(
      args.hasDemolitionCost && !asRange(1, defaultSumInsuredIncGst, true, true).safeParse(args?.demolitionCost?.gstInclusive).success,
      `demolitionCost.gstInclusive`,
      getNumRangeMessage(1, defaultSumInsuredIncGst),
      ctx
    );

    // Fire Protection
    addRequiredIssues(args.hasFireProtection, ['fireProtection'], args, ctx);

    // Hazards
    addRequiredIssues(args.hasHazards === 'Yes', ['hazards'], args, ctx);
    addRequiredIssues(args.hasHazards === 'Yes' && Boolean(args?.hazards?.has('other')), ['otherHazardDetails'], args, ctx);

    // Security
    addRequiredIssues([occupancies.ownerOccupied, occupancies.unoccupied].includes(args.occupancy), ['hasSecurityFeatures'], args, ctx);
    addRequiredIssues(
      [occupancies.ownerOccupied, occupancies.unoccupied].includes(args.occupancy) && args.hasSecurityFeatures === 'Yes',
      ['securityQuestions'],
      args,
      ctx
    );
    addRequiredIssues(
      [occupancies.ownerOccupied, occupancies.unoccupied].includes(args.occupancy) &&
        args?.hasSecurityFeatures === 'Yes' &&
        Boolean(args?.securityQuestions?.has(securityFeatures.other.value)),
      ['otherSecurityDetails'],
      args,
      ctx
    );

    // Historic
    addRequiredIssues(toNumber(args.yearConstruction) < oldBuildingYears.historicOrScrim, ['historicPlace'], args, ctx);

    // Domestic Areas
    addRequiredIssues(args.domesticArea, ['buildingAreas'], args, ctx);
    // Check each area item
    if (args.domesticArea === 'true') {
      args?.buildingAreas?.forEach((areaItem, areaItemIndex) => {
        addRequiredIssues(!areaItem.type, [`${nq.buildingAreas.name}.${areaItemIndex}.${nq.type.name}`], args, ctx);
        addRequiredIssues(!areaItem.year, [`${nq.buildingAreas.name}.${areaItemIndex}.${nq.year.name}`], args, ctx);
        addOtherIssues(
          !asYear().safeParse(areaItem.year).success,
          `${nq.buildingAreas.name}.${areaItemIndex}.${nq.year.name}`,
          asYearMessage(),
          ctx
        );
        addRequiredIssues(!areaItem.area, [`${nq.buildingAreas.name}.${areaItemIndex}.${nq.area.name}`], args, ctx);
        addOtherIssues(
          !asRange(1, maxBuildingArea).safeParse(areaItem.area).success,
          `${nq.buildingAreas.name}.${areaItemIndex}.${nq.area.name}`,
          getNumRangeMessage(1, maxBuildingArea),
          ctx
        );
        addRequiredIssues(
          !areaItem.description || !areaItem.description?.length,
          [`${nq.buildingAreas.name}.${areaItemIndex}.${nq.description.name}`],
          args,
          ctx
        );
      });
    }
  });

export type FormValues = z.infer<typeof schema>;

export const table: Table<FormValues> = db.commercialBuilding;
