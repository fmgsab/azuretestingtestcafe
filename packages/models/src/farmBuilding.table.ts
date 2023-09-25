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
  asString,
  asYear,
  asYearMessage,
  getNumRangeMessage,
} from './schemas/schema';
import { toNumber } from '@fmg/utils';
import { nq } from './data-dictionary/names-questions';
import { itemSubtypes, numericCondition, oldBuildingYears } from './data-dictionary/constants';
const { defaultSumInsuredExcGst, defaultSumInsuredIncGst, maxNumberOfBales, maxBuildingArea, defaultMinYear } = numericCondition;

export function isOldBuilding(targetYear: unknown) {
  return toNumber(targetYear) < oldBuildingYears.historicOrScrim && toNumber(targetYear) >= defaultMinYear;
}

export const schema = z
  .object({
    itemSubtype: asRequiredString(),
    usage: asRequiredString(),
    [nq.location.name]: asRequiredString(),

    // Cover
    [nq.basisOfSettlement.name]: asRequiredString(),
    [nq.overrideSystemSumInsured.name]: asRequiredString(),
    sumInsured: z.object({
      gstExclusive: z.string().or(z.number()).optional(),
      gstInclusive: z.string().or(z.number()).optional(),
    }),
    [nq.excess.name]: asRequiredString(),

    // Construction
    [nq.numberWalls.name]: asRequiredString(),
    [nq.roofConstruction.name]: asRequiredString(),
    [nq.floorConstruction.name]: asRequiredString(),
    [nq.wallConstruction.name]: asRequiredString(),

    // Dairy
    [nq.constructionType.name]: asOptionalString(),
    [nq.numberOfBales.name]: asOptionalString(),

    // Fire Protection
    hasFireProtection: asOptionalString(),
    fireProtection: asSet(asString()).nullish(),
    [nq.otherFireProtection.name]: asOptionalString(),

    // Areas
    buildingAreas: z
      .object({
        key: asKey(),
        type: asOptionalString(),
        year: asOptionalString(),
        area: asOptionalString(),
        description: asOptionalShortText(),
      })
      .array(),
    [nq.historicPlace.name]: asOptionalString(),
    domesticArea: asRequiredString(),
    [nq.permanentlyOccupied.name]: asOptionalString(),
    buildingAreasDomestic: z
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
    addRequiredIssues(
      `${args?.overrideSystemSumInsured}`,
      [`${nq.sumInsured.name}.${nq.gstExclusive.name}`, `${nq.sumInsured.name}.${nq.gstInclusive.name}`],
      args,
      ctx
    );
    addOtherIssues(
      args.overrideSystemSumInsured === nq.true.name && !asRange().safeParse(args?.sumInsured?.gstExclusive).success,
      `${nq.sumInsured.name}.${nq.gstExclusive.name}`,
      getNumRangeMessage(1, defaultSumInsuredExcGst),
      ctx
    );
    addOtherIssues(
      args.overrideSystemSumInsured === nq.true.name &&
        !asRange(1, defaultSumInsuredIncGst, true).safeParse(args?.sumInsured?.gstInclusive).success,
      `${nq.sumInsured.name}.${nq.gstInclusive.name}`,
      getNumRangeMessage(1, defaultSumInsuredIncGst),
      ctx
    );
    // Dairy Construction
    addRequiredIssues(args.itemSubtype === itemSubtypes.farmBuilding.dairyShed, [nq.constructionType.name], args, ctx);
    addRequiredIssues(args.itemSubtype === itemSubtypes.farmBuilding.dairyShed, [nq.numberOfBales.name], args, ctx);
    addOtherIssues(
      args.itemSubtype === itemSubtypes.farmBuilding.dairyShed && !asRange(1, maxNumberOfBales).safeParse(args.numberOfBales).success,
      nq.numberOfBales.name,
      getNumRangeMessage(1, maxNumberOfBales),
      ctx
    );
    // Fire Protection
    addRequiredIssues(args.itemSubtype === itemSubtypes.farmBuilding.dairyShed, [nq.hasFireProtection.name], args, ctx);
    addRequiredIssues(
      args?.itemSubtype === itemSubtypes.farmBuilding.dairyShed && args?.hasFireProtection,
      [nq.fireProtection.name],
      args,
      ctx
    );
    addRequiredIssues(
      args.itemSubtype === itemSubtypes.farmBuilding.dairyShed &&
        args.hasFireProtection === nq.true.name &&
        args.fireProtection?.has(nq.other.name),
      [nq.otherFireProtection.name],
      args,
      ctx
    );
    // Building Areas
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
    addRequiredIssues(isOldBuilding(args?.buildingAreas?.[0]?.year), [nq.historicPlace.name], args, ctx);
    // Domestic Areas
    addRequiredIssues(args.domesticArea, [nq.buildingAreasDomestic.name], args, ctx);
    addRequiredIssues(args.domesticArea, [nq.permanentlyOccupied.name], args, ctx);
    if (args.domesticArea === nq.true.name) {
      args?.buildingAreasDomestic?.forEach((areaItem, areaItemIndex) => {
        addRequiredIssues(!areaItem.type, [`${nq.buildingAreasDomestic.name}.${areaItemIndex}.${nq.type.name}`], args, ctx);
        addRequiredIssues(!areaItem.year, [`${nq.buildingAreasDomestic.name}.${areaItemIndex}.${nq.year.name}`], args, ctx);
        addOtherIssues(
          !asYear().safeParse(areaItem.year).success,
          `${nq.buildingAreasDomestic.name}.${areaItemIndex}.${nq.year.name}`,
          asYearMessage(),
          ctx
        );
        addRequiredIssues(!areaItem.area, [`${nq.buildingAreasDomestic.name}.${areaItemIndex}.${nq.area.name}`], args, ctx);
        addOtherIssues(
          !asRange(1, maxBuildingArea).safeParse(areaItem.area).success,
          `${nq.buildingAreasDomestic.name}.${areaItemIndex}.${nq.area.name}`,
          getNumRangeMessage(1, maxBuildingArea),
          ctx
        );
        addRequiredIssues(
          !areaItem.description || !areaItem.description?.length,
          [`${nq.buildingAreasDomestic.name}.${areaItemIndex}.${nq.description.name}`],
          args,
          ctx
        );
      });
    }
  });

export type FormValues = z.infer<typeof schema>;

export const table: Table<FormValues> = db.farmBuilding;
