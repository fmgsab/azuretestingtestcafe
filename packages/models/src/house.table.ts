import { z } from 'zod';
import { Table } from 'dexie';
import { db } from './@database';
import {
  asKey,
  asOptionalString,
  asPosInteger,
  asRange,
  asRequiredChoices,
  asRequiredString,
  asYear,
  addRequiredIssues,
  asOptionalShortText,
  asOptionalSumInsuredPair,
} from './schemas/schema';
import { toNumber } from '@fmg/utils';
import { buildingAreaTypes, itemSubtypes, oldBuildingYears, occupancies } from './data-dictionary/constants';

export type BuildingAreaType = {
  type: string;
  key: string;
  area?: string | number | null | undefined;
  year?: string | null | undefined;
  description?: string | null | undefined;
};

export function isOldBuilding(targetYear: number) {
  return (buildingAreas: BuildingAreaType[] = []) =>
    buildingAreas?.some(({ type, year, area }: BuildingAreaType) => {
      const isValidYear = asYear().safeParse(year).success;
      return (
        [buildingAreaTypes.domesticUnit, buildingAreaTypes.selfContainedUnit].includes(type) &&
        isValidYear &&
        toNumber(year) < targetYear &&
        toNumber(area)
      );
    });
}

export const schema = z
  .object({
    itemSubtype: asRequiredString().default(itemSubtypes.house.dwelling),
    location: asRequiredString(),
    // Occupancy
    occupancy: asRequiredString(),
    isUnoccupied: asRequiredString(),
    monthsUnoccupied: asPosInteger(99, true),

    isMortgageeSale: asRequiredString(),

    // Business Use
    hasCommercialUse: asRequiredString(),
    percentCommercialUse: asPosInteger(100, true),
    storeBusinessStock: asOptionalString(),
    storeBusinessStockDetails: asOptionalShortText(),
    hasVisitors: asOptionalString(),
    visitorsDetails: asOptionalShortText(),

    // Construction
    roofConstruction: asRequiredString(),
    wallConstruction: asRequiredString(),
    constructionQuality: asRequiredString(),
    storyCount: asRequiredString(),
    landSlope: asRequiredString(),
    waterSupply: asRequiredString(),

    // Building Areas
    buildingAreas: z
      .object({
        key: asKey(),
        type: asRequiredString(),
        year: asYear(),
        area: asRange(1, 9999),
        description: asOptionalShortText(),
      })
      .array(),
    // Other Building Area Info
    rewired: asOptionalString(),
    wiringCert: asOptionalString(),
    reroofed: asOptionalString(),
    historicPlace: asOptionalString(),
    scrimPresent: asOptionalString(),
    // Shared Structure
    hasSharedStructure: asRequiredString(),
    sharedStructureDetails: asOptionalString(250),
    hasCommonAreas: asRequiredString(),
    commonAreaType: asOptionalString(),
    commonAreaDetails: asOptionalString(250),

    // Settlement
    basisOfSettlement: asRequiredString(),
    overrideSystemSumInsured: asRequiredString(),
    sumInsured: asOptionalSumInsuredPair(),
    excess: asRequiredString(),
    hasShortTermGuest: asOptionalString(),
    optionalCovers: asRequiredChoices(),
    hasExcessFreeGlass: asRequiredString(),
    hasMatchingFloorCoverings: asRequiredString(),

    // Lifestyle
    requiresLifestyleBenefits: asRequiredString(),
    hasLifestyleBlockFencing: asRequiredString(),
    hasLifestylePumpsAndMotors: asRequiredString(),

    // Landlord
    needsLandlordContents: asRequiredString(),
    employeeRehousing: asOptionalString(),
    employeeRehousingSumInsured: asRange(20000, 100000000, false, true),
    lossOfRent: asOptionalString(),
    lossOfRentSumInsured: asRange(20000, 100000000, false, true),

    // EQC
    numberEqcClaims: asRequiredString(),
    numberEqcDetails: asOptionalShortText(),
    damageType: asOptionalString(),
    yearLastClaim: asYear(true, 2000),
    totalClaimValue: asRange(1, 100000000, false, true),
    hasAllDamageRepaired: asOptionalString(),
    hasLandDamage: asOptionalString(),
  })
  .superRefine((args, ctx) => {
    addRequiredIssues(args.overrideSystemSumInsured, ['sumInsured.gstExclusive', 'sumInsured.gstInclusive'], args, ctx);
    addRequiredIssues(args.isUnoccupied, ['monthsUnoccupied'], args, ctx);
    addRequiredIssues(args.hasSharedStructure, ['sharedStructureDetails'], args, ctx);
    addRequiredIssues(args.hasCommonAreas, ['commonAreaType'], args, ctx);
    addRequiredIssues(args.commonAreaType === 'Other', ['commonAreaDetails'], args, ctx);
    addRequiredIssues(args.occupancy === occupancies.employee, ['employeeRehousing'], args, ctx);
    addRequiredIssues(args.occupancy === occupancies.tenanted, ['lossOfRent'], args, ctx);
    addRequiredIssues(args.occupancy === occupancies.holidayHome, ['hasShortTermGuest'], args, ctx);

    addRequiredIssues(
      isOldBuilding(oldBuildingYears.historicOrScrim)(args.buildingAreas),
      ['rewired', 'reroofed', 'historicPlace', 'scrimPresent'],
      args,
      ctx
    );
    addRequiredIssues(isOldBuilding(oldBuildingYears.rewireOrReroof)(args.buildingAreas), ['rewired', 'reroofed'], args, ctx);
    addRequiredIssues(args.rewired === 'false', ['wiringCert'], args, ctx);

    addRequiredIssues(args.hasCommercialUse, ['percentCommercialUse', 'storeBusinessStock', 'hasVisitors'], args, ctx);

    addRequiredIssues(args.storeBusinessStock, ['storeBusinessStockDetails'], args, ctx);
    addRequiredIssues(args.hasVisitors, ['visitorsDetails'], args, ctx);
    addRequiredIssues(args.lossOfRent, ['lossOfRentSumInsured'], args, ctx);

    addRequiredIssues(args.employeeRehousing, ['employeeRehousingSumInsured'], args, ctx);
    addRequiredIssues(
      toNumber(args.numberEqcClaims) > 0,
      ['numberEqcDetails', 'damageType', 'yearLastClaim', 'totalClaimValue', 'hasAllDamageRepaired', 'hasLandDamage'],
      args,
      ctx
    );
  });

export type FormValues = z.infer<typeof schema>;

export const table: Table<FormValues> = db.house;
