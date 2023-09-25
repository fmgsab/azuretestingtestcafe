import { z } from 'zod';
import { Table } from 'dexie';
import { db } from './@database';
import {
  addRequiredIssues,
  asDecimal,
  asOptionalShortText,
  asOptionalString,
  asOptionalSumInsuredPair,
  asRange,
  asRequiredString,
  asRequiredSumInsuredPair,
} from './schemas/schema';
import * as constants from './data-dictionary/constants';
import { numericCondition } from './data-dictionary/constants';

type ValidKey = number | string;

const swapKeyValue = <K extends ValidKey, V extends ValidKey>(object: Record<K, V>): Record<V, K> =>
  Object.entries(object).reduce((swapped, [key, value]) => ({ ...swapped, [value as ValidKey]: key }), {} as Record<V, K>);

export const itemSubtypes = constants.itemSubtypes.otherContent;
export const itemSubTypesSwitched = swapKeyValue(itemSubtypes);

const { operatorType } = constants;

export const defaultValues = {
  [itemSubtypes.generalFarm]: {
    formDefaults: {
      nominatedReplacementSumInsured: {
        gstExclusive: null,
        gstInclusive: null,
      },
      name: itemSubtypes.generalFarm,
    },
  },
  [itemSubtypes.generalCommercial]: {
    formDefaults: {
      nominatedReplacementSumInsured: {
        gstExclusive: null,
        gstInclusive: null,
      },
    },
    name: itemSubtypes.generalCommercial,
  },
  [itemSubtypes.fixedPlant]: {
    formDefaults: {
      nominatedReplacementSumInsured: {
        gstExclusive: null,
        gstInclusive: null,
      },
      name: itemSubtypes.fixedPlant,
    },
  },
  [itemSubtypes.tenantsImprovements]: {
    formDefaults: {
      nominatedReplacementSumInsured: {
        gstExclusive: null,
        gstInclusive: null,
      },
      name: itemSubtypes.tenantsImprovements,
    },
  },
  [itemSubtypes.milk]: {
    vatSizeMin: 0,
    vatSizeMax: Number.MAX_SAFE_INTEGER,
    milkSolidsMin: 0.01,
    milkSolidsMax: 100,
    milkPayoutMin: 0,
    milkPayoutMax: 99999.99,
    formDefaults: {
      milkCalcFields: {
        vatSize: '',
        milkSolids: '9.00',
        milkPayout: '6.00',
      },
      nonCollectionSumInsured: {
        gstExclusive: '',
        gstInclusive: '',
      },
      sumInsured: {
        gstExclusive: '',
        gstInclusive: '',
      },
      name: itemSubtypes.milk,
    },
  },
  [itemSubtypes.stock]: {
    formDefaults: {
      stockContaminationSumInsured: {
        gstExclusive: null,
        gstInclusive: null,
      },
      name: itemSubtypes.stock,
    },
  },
  [itemSubtypes.portablePlantAndEquip]: {
    formDefaults: {
      sumInsured: {
        gstExclusive: null,
        gstInclusive: null,
      },
      name: itemSubtypes.portablePlantAndEquip,
      vehicleLocation: null,
    },
  },
};

const baseSchema = z.object({
  jobId: asRequiredString(),
  itemType: asRequiredString(),
  itemSubtype: asRequiredString(),
  location: asRequiredString(),
  name: asOptionalShortText(),
});

const basisOfSettlementSchema = z.object({
  basisOfSettlement: asRequiredString(),
  presentDayValueSumInsured: asRequiredSumInsuredPair().or(z.string()),
  nominatedReplacementSumInsured: asOptionalSumInsuredPair().or(z.string()),
});

const generalFarmSchema = z
  .object({
    insuredEvent: asRequiredString(),
    preventionOfAccess: asRequiredString(),
    excess: asRequiredString(),
  })
  .merge(baseSchema)
  .merge(basisOfSettlementSchema);

const generalCommercialSchema = baseSchema.merge(
  z
    .object({
      contentsKeptIn: asRequiredString(),
      insuredEvent: asRequiredString(),
      excess: asRequiredString(),
    })
    .merge(basisOfSettlementSchema)
);

const fixedPlantSchema = baseSchema
  .merge(
    z.object({
      contentsKeptIn: asRequiredString(),
      insuredEvent: asRequiredString(),
      excess: asRequiredString(),
    })
  )
  .merge(basisOfSettlementSchema);

const tenantsImprovementsSchema = baseSchema.merge(
  z
    .object({
      contentsKeptIn: asRequiredString(),
      insuredEvent: asRequiredString(),
      excess: asRequiredString(),
    })
    .merge(basisOfSettlementSchema)
);

const stockSchema = baseSchema.merge(
  z.object({
    contentsKeptIn: asRequiredString(),
    sumInsured: asRequiredSumInsuredPair(),
    excess: asRequiredString(),
    stockContamination: asRequiredString(),
    stockContaminationSumInsured: asOptionalSumInsuredPair(),
    seasonalStockIncrease: asRequiredString(),
    seasonalStockPeriod: asOptionalString(),
    contaminationType: asOptionalString(),
  })
);

const baledHaySchema = baseSchema.merge(
  z.object({
    storageType: asRequiredString(),
    sumInsured: asRequiredSumInsuredPair(),
    excess: asRequiredString(),
  })
);

const portablePlantAndEquipSchema = baseSchema.merge(
  z.object({
    location: z.string().optional(),
    storageLocation: asRequiredString(),
    vehicleLocation: asOptionalString(),
    sumInsuredOption: asRequiredString(),
    sumInsured: asRequiredSumInsuredPair(),
    excess: asRequiredString(),
  })
);

const milkSchema = baseSchema.merge(
  z.object({
    milkCalcFields: z.object({
      vatSize: asRange(defaultValues[itemSubtypes.milk].vatSizeMin, defaultValues[itemSubtypes.milk].vatSizeMax, true, false),
      milkSolids: asDecimal({ max: defaultValues[itemSubtypes.milk].milkSolidsMax, optional: true, min: 0.01 }),
      milkPayout: asRange(defaultValues[itemSubtypes.milk].milkPayoutMin, defaultValues[itemSubtypes.milk].milkPayoutMax, false, false),
    }),

    sumInsured: z.object({
      gstExclusive: asRange(1, numericCondition.maxValue100million, true, false),
      gstInclusive: asRange(1, numericCondition.maxValue115million, true, false),
    }),

    nonCollection: asRequiredString(),

    nonCollectionSumInsured: z
      .object({
        gstExclusive: asRange(1, numericCondition.maxValue100million, true, true),
        gstInclusive: asRange(1, numericCondition.maxValue115million, true, true),
      })
      .or(z.literal('')),

    spoilageOrContamination: asRequiredString(),

    operatorType: asRequiredString(),
    shareMilkingAgreement: asOptionalString(),
    excess: asRequiredString(),
  })
);

// Refinements
function attachRefinements<O extends Partial<FormValues>, T extends z.ZodTypeDef, I>(schema: z.ZodType<O, T, I>) {
  return schema.superRefine((args, ctx) => {
    // basis of settlement shared
    addRequiredIssues(
      args.basisOfSettlement === constants.settlementTypes.nominatedReplacementValue,
      ['nominatedReplacementSumInsured.gstExclusive', 'nominatedReplacementSumInsured.gstInclusive'],
      args,
      ctx
    );

    // milk
    addRequiredIssues(
      args.operatorType &&
        [operatorType.farmOwnerInSharemilkingAgreement, operatorType.sharemilkerInSharemilkingAgreement].includes(args.operatorType),
      ['shareMilkingAgreement'],
      args,
      ctx
    );
    addRequiredIssues(
      args.nonCollection === 'true',
      ['nonCollectionSumInsured.gstInclusive', 'nonCollectionSumInsured.gstInclusive'],
      args,
      ctx
    );

    // stock
    addRequiredIssues(args.stockContamination === 'true', ['contaminationType'], args, ctx);
    addRequiredIssues(args.contaminationType === 'true', ['contaminationType'], args, ctx);
    addRequiredIssues(args.seasonalStockIncrease === 'true', ['seasonalStockPeriod'], args, ctx);
    addRequiredIssues(
      args.stockContamination === 'true',
      ['stockContaminationSumInsured.gstExclusive', 'stockContaminationSumInsured.gstInclusive'],
      args,
      ctx
    );

    // portable plant and equipment
    addRequiredIssues(args.storageLocation === constants.itemStored.lockedVehicle, ['vehicleLocation'], args, ctx);
  });
}

export type FormValues = z.infer<typeof baseSchema> &
  z.infer<typeof basisOfSettlementSchema> &
  z.infer<typeof milkSchema> &
  z.infer<typeof generalFarmSchema> &
  z.infer<typeof generalCommercialSchema> &
  z.infer<typeof fixedPlantSchema> &
  z.infer<typeof tenantsImprovementsSchema> &
  z.infer<typeof stockSchema> &
  z.infer<typeof baledHaySchema> &
  z.infer<typeof portablePlantAndEquipSchema>;

export const schema = {
  baseSchema,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  [itemSubtypes.milk]: attachRefinements(milkSchema),
  [itemSubtypes.generalFarm]: attachRefinements(generalFarmSchema),
  [itemSubtypes.generalCommercial]: attachRefinements(generalCommercialSchema),
  [itemSubtypes.fixedPlant]: attachRefinements(fixedPlantSchema),
  [itemSubtypes.tenantsImprovements]: attachRefinements(tenantsImprovementsSchema),
  [itemSubtypes.stock]: attachRefinements(stockSchema),
  [itemSubtypes.baledHay]: attachRefinements(baledHaySchema),
  [itemSubtypes.portablePlantAndEquip]: attachRefinements(portablePlantAndEquipSchema),
};
export const table: Table<FormValues> = db.otherContent;
