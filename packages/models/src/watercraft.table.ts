import { z } from 'zod';
import { db } from './@database';
import { Table } from 'dexie';
import {
  addOtherIssues,
  addRequiredIssues,
  asKey,
  asOptionalShortText,
  asOptionalString,
  asRange,
  asRequiredString,
  asRequiredSumInsuredPair,
  asShortText,
  asYear,
  getNumRangeMessage,
  maxYear,
  required,
} from './schemas/schema';
import { itemSubtypes, numericCondition } from './data-dictionary/constants';
import { nq } from './data-dictionary/names-questions';
import { alphaNumericSpaceless } from '@fmg/utils';
const { defaultSumInsuredExcGst, defaultSumInsuredIncGst } = numericCondition;
const { dinghyInflatable, jetSki, powerBoat, sailBoatYacht } = itemSubtypes.watercraft;
const powerSail = [powerBoat, sailBoatYacht];
const dps = [dinghyInflatable, powerBoat, sailBoatYacht];
const djps = [dinghyInflatable, jetSki, powerBoat, sailBoatYacht];
const hullLengthFeet = { min: 1, max: 324.8 };
const hullLengthMetres = { min: 0.3, max: 99 };
const motorHorsepower = { min: 1, max: 999 };

export const schema = z
  .object({
    itemSubtype: asRequiredString(),
    year: asRange(1880, maxYear, true, false, getNumRangeMessage('1880', `${maxYear}`)), // Always
    make: asRequiredString(), // Always
    model: asRequiredString(), // Always
    boatName: asOptionalString(),

    // Hull
    hullLength: z.object({ metres: z.string().or(z.number()).optional(), feet: z.string().or(z.number()).optional() }).optional(),
    hullConstruction: asOptionalString(),
    hullConstructionOther: asOptionalShortText(),
    mastConstruction: asOptionalString(),
    mastConstructionOther: asOptionalShortText(),
    hullType: asOptionalString(),
    hasSleepingBerths: asOptionalString(),

    // Jet Ski
    jetSkiColour: asOptionalString(),
    jetSkiTurboCharged: asOptionalString(),
    jetSkiCcRating: asOptionalString(),

    // Commercial
    hasCommercialUse: asRequiredString(), // Unconditional
    usedForRacing: asRequiredString(), // Unconditional
    distancedRaced: asOptionalString(),
    usedWithinCoastalWaters: asOptionalString(),

    // Motor
    hasMotorInsured: asOptionalString(),
    motorType: asOptionalString(),
    motorTypeOtherDetails: asOptionalString(),
    motorYear: asYear(true),
    motorMake: asOptionalShortText(),
    motorHorsepower: asOptionalString(),
    motorIsTwin: asOptionalString(),
    motorIsTurboCharged: asOptionalString(),
    motorMaximumSpeed: asOptionalString(),
    extinguisherType: asOptionalString(),
    serialNumber: asOptionalShortText(),

    location: asShortText(),

    // Storage
    storageType: asOptionalString(),
    trailerStorageType: asOptionalString(),
    mooredStorageType: asOptionalString(),
    mooredStorageDetails: asOptionalString(),

    // Trailer
    trailer: asOptionalString(),
    rego: asOptionalString(6),
    hasLock: asOptionalString(),
    trailerValue: z.object({
      gstExclusive: z.string().or(z.number()).optional(),
      gstInclusive: z.string().or(z.number()).optional(),
    }),

    // Cover
    coverType: asRequiredString(), // Unconditional
    sumInsured: asRequiredSumInsuredPair(), // Unconditional

    // Modifications
    hasModification: asOptionalString(),
    viModifications: z
      .object(
        {
          key: asKey(),
          modificationType: asOptionalString(),
          sumInsured: asOptionalString(),
          description: asOptionalString(500),
        },
        required
      )
      .array()
      .optional(),

    excess: asOptionalString(), // Unconditional
    liabilitySumInsured: asRequiredString(), // Unconditional
    interestedParty: asRequiredString(), // Unconditional
  })
  .superRefine((args, ctx) => {
    addRequiredIssues(powerSail.includes(args?.itemSubtype), [`boatName`], args, ctx);

    // Hull
    addRequiredIssues(dps.includes(args?.itemSubtype), [`hullLength.metres`, `hullLength.feet`], args, ctx);
    addRequiredIssues(dps.includes(args?.itemSubtype), [`hullConstruction`], args, ctx);
    addRequiredIssues(
      dps.includes(args?.itemSubtype) && args?.hullConstruction === nq.other.question,
      [`hullConstructionOther`],
      args,
      ctx
    );
    addRequiredIssues(dps.includes(args?.itemSubtype), [`hullLength.feet`, `hullLength.metres`], args, ctx);
    addOtherIssues(
      dps.includes(args?.itemSubtype) &&
        !asRange(hullLengthFeet.min, hullLengthFeet.max, false, true).safeParse(args?.hullLength?.feet).success,
      `hullLength.feet`,
      getNumRangeMessage(hullLengthFeet.min, hullLengthFeet.max),
      ctx
    );
    addOtherIssues(
      dps.includes(args?.itemSubtype) &&
        !asRange(hullLengthMetres.min, hullLengthMetres.max, false, true).safeParse(args?.hullLength?.metres).success,
      `hullLength.metres`,
      getNumRangeMessage(hullLengthMetres.min, hullLengthMetres.max),
      ctx
    );

    addRequiredIssues([sailBoatYacht].includes(args?.itemSubtype), [`mastConstruction`], args, ctx);
    addRequiredIssues(
      [sailBoatYacht].includes(args?.itemSubtype) && args?.mastConstruction === nq.other.question,
      [`mastConstructionOther`],
      args,
      ctx
    );
    addRequiredIssues(sailBoatYacht.includes(args?.itemSubtype), [`hullType`], args, ctx);
    addRequiredIssues(powerSail.includes(args?.itemSubtype), [`hasSleepingBerths`], args, ctx);

    // Jet Ski
    addRequiredIssues([jetSki].includes(args?.itemSubtype), ['jetSkiColour', 'jetSkiTurboCharged', 'jetSkiCcRating'], args, ctx);
    addOtherIssues(
      [jetSki].includes(args?.itemSubtype) && !asRange(1, 10000, true, false).safeParse(args?.jetSkiCcRating).success,
      `jetSkiCcRating`,
      getNumRangeMessage(1, 10000),
      ctx
    );

    addRequiredIssues([sailBoatYacht].includes(args?.itemSubtype) && args?.usedForRacing === nq.true.name, [`distancedRaced`], args, ctx);
    addRequiredIssues(dps.includes(args?.itemSubtype), [`usedWithinCoastalWaters`], args, ctx);
    addRequiredIssues(dps.includes(args?.itemSubtype), [`hasMotorInsured`], args, ctx);

    // Motor Insured
    if (args?.hasMotorInsured === nq.true.name) {
      addRequiredIssues(powerSail.includes(args?.itemSubtype), [`motorType`], args, ctx);
      // console.log(args);
      addRequiredIssues(dps.includes(args?.itemSubtype) && args?.motorType === nq.other.question, [`motorTypeOtherDetails`], args, ctx);
      addRequiredIssues(dps.includes(args?.itemSubtype), [`motorMake`], args, ctx);
      addRequiredIssues(dps.includes(args?.itemSubtype), [`motorHorsepower`], args, ctx);
      addOtherIssues(
        dps.includes(args?.itemSubtype) &&
          !asRange(motorHorsepower.min, motorHorsepower.max, true, true).safeParse(args?.motorHorsepower).success,
        `motorHorsepower`,
        getNumRangeMessage(motorHorsepower.min, motorHorsepower.max),
        ctx
      );
      addRequiredIssues(dps.includes(args?.itemSubtype), [`motorIsTwin`], args, ctx);
      addRequiredIssues(dps.includes(args?.itemSubtype), [`motorIsTurboCharged`], args, ctx);
      addRequiredIssues(dps.includes(args?.itemSubtype), [`motorMaximumSpeed`], args, ctx);
      addRequiredIssues(dps.includes(args?.itemSubtype), [`extinguisherType`], args, ctx);
    }

    addRequiredIssues(
      powerSail.includes(args?.itemSubtype) && ['Outboard', nq.other.question].includes(`${args?.motorType}`),
      [`serialNumber`],
      args,
      ctx
    );
    addOtherIssues(
      powerSail.includes(args?.itemSubtype) &&
        ['Outboard', nq.other.question].includes(`${args?.motorType}`) &&
        !alphaNumericSpaceless.test(`${args?.serialNumber}`),
      'serialNumber',
      'Only letters and digits',
      ctx
    );
    addRequiredIssues(djps.includes(args?.itemSubtype), [`storageType`], args, ctx);
    addRequiredIssues(djps.includes(args?.itemSubtype) && args?.storageType === 'Trailered', [`trailerStorageType`], args, ctx);
    addRequiredIssues(djps.includes(args?.itemSubtype) && args?.storageType === 'Permanently moored', [`mooredStorageType`], args, ctx);
    addRequiredIssues(
      djps.includes(args?.itemSubtype) && args?.storageType === 'Permanently moored' && args?.mooredStorageType === nq.other.question,
      [`mooredStorageDetails`],
      args,
      ctx
    );

    // Trailer
    addRequiredIssues(djps.includes(args?.itemSubtype), [`trailer`], args, ctx);
    addRequiredIssues(djps.includes(args?.itemSubtype) && args?.trailer === nq.true.name, [`rego`], args, ctx);
    addRequiredIssues(djps.includes(args?.itemSubtype) && args?.trailer === nq.true.name, [`hasLock`], args, ctx);

    // Trailer Value
    addRequiredIssues(
      djps.includes(args?.itemSubtype) && args?.trailer === nq.true.name,
      [`trailerValue.${nq.gstExclusive.name}`, `trailerValue.${nq.gstInclusive.name}`],
      args,
      ctx
    );
    addOtherIssues(
      djps.includes(args?.itemSubtype) &&
        args?.trailer === nq.true.name &&
        !asRange(1, defaultSumInsuredExcGst, true, true).safeParse(args?.trailerValue?.gstExclusive).success,
      `trailerValue.${nq.gstExclusive.name}`,
      getNumRangeMessage(1, defaultSumInsuredExcGst),
      ctx
    );
    addOtherIssues(
      djps.includes(args?.itemSubtype) &&
        args?.trailer === nq.true.name &&
        !asRange(1, defaultSumInsuredIncGst, true, true).safeParse(args?.trailerValue?.gstInclusive).success,
      `trailerValue.${nq.gstInclusive.name}`,
      getNumRangeMessage(1, defaultSumInsuredIncGst),
      ctx
    );

    // Modifications and Accessories
    addRequiredIssues(djps.includes(args?.itemSubtype), [`hasModification`], args, ctx);
    if (djps.includes(args?.itemSubtype) && args?.hasModification === nq.true.name) {
      args?.viModifications?.forEach((mod, modIndex) => {
        addRequiredIssues(!mod?.modificationType, [`viModifications.${modIndex}.modificationType`], args, ctx);
        addRequiredIssues(!mod?.sumInsured, [`viModifications.${modIndex}.sumInsured`], args, ctx);
        addRequiredIssues(!mod?.description, [`viModifications.${modIndex}.description`], args, ctx);

        addOtherIssues(
          !asRange(1, defaultSumInsuredExcGst, true, true).safeParse(mod?.sumInsured).success,
          `viModifications.${modIndex}.sumInsured`,
          getNumRangeMessage(1, defaultSumInsuredExcGst),
          ctx
        );
      });
    }

    addRequiredIssues(args?.sumInsured?.gstExclusive, [`excess`], args, ctx);
  });

export type FormValues = z.infer<typeof schema>;

export const table: Table<FormValues> = db.watercraft;
