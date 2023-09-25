import * as React from 'react';
import * as model from 'models/src/watercraft.table';
import {
  FormProviderWrapper,
  type RowKeyType,
  MultiInputWidget,
  TextInputWidget,
  TextInput,
  AffixInputWidget,
  RadioGroupWidget,
  Scope,
  SumInsuredWidget,
} from '@fmg/ui';
import { AddressSelect, Excess, ItemSubtype, Options } from '../fields';
import { itemSubtypes, convert, coverTypes, storageTypes, nq } from 'models';
import { TwinInputWidget } from '@fmg/ui/src/components/form-widgets/TwinInput/TwinInputWidget';
import { v4 } from 'uuid';
import { Modifications } from '../fieldsets';

const { dinghyInflatable, powerBoat, sailBoatYacht, jetSki } = itemSubtypes.watercraft;
const powerSail = [powerBoat, sailBoatYacht];
const dps = [dinghyInflatable, powerBoat, sailBoatYacht];
const djps = [dinghyInflatable, jetSki, powerBoat, sailBoatYacht];

export function FormWatercraft({ uid }: { uid: RowKeyType }) {
  // eslint-disable-next-line no-console
  const onSubmit = (data: model.FormValues) => console.log('Submit:', data);

  return (
    <>
      <FormProviderWrapper
        model={model}
        uid={uid}
        onSubmit={onSubmit}
        mode="all"
        defaultValues={{
          itemType: 'watercraft',
          hasMotorInsured: 'true',
          excess: '250',
          liabilitySumInsured: '1,000,000',
          coverType: coverTypes.comprehensive,
          hasModification: 'false',
          viModifications: [{ key: v4() }],
        }}
      >
        <ItemSubtype required />
        <TextInputWidget name="year" question="Year" size={5} required />
        <MultiInputWidget name="" question="Make & Model" sizes={[5, 5]} required>
          <TextInput name="make" label="Make" />
          <TextInput name="model" label="Model" />
        </MultiInputWidget>
        <TextInputWidget
          name="boatName"
          question="Boat Name"
          scope={{
            source: 'itemSubtype',
            condition: (itemSubtype) => powerSail.includes(itemSubtype),
          }}
          required
        />
        <TwinInputWidget
          name="hullLength"
          question="Hull Length"
          inputs={[
            { label: 'Feet', name: 'feet', suffix: 'ft' },
            { label: 'Metres', name: 'metres', suffix: 'm' },
          ]}
          conversionFactor={convert.feetToMetres}
          decimalAccuracy={1}
          scope={{
            source: 'itemSubtype',
            condition: (itemSubtype) => dps.includes(itemSubtype),
          }}
          required
        />
        <Options
          name="hullConstruction"
          question="Hull Construction"
          lookupKey="hullConstructions"
          scope={{
            source: 'itemSubtype',
            condition: (itemSubtype) => dps.includes(itemSubtype),
          }}
          required
        />
        <TextInputWidget
          name="hullConstructionOther"
          question="Description"
          scope={{
            source: 'hullConstruction',
            condition: 'Other',
          }}
          required
        />
        <Options
          name="mastConstruction"
          question="Mast Construction"
          lookupKey="mastConstructions"
          scope={{
            source: 'itemSubtype',
            condition: sailBoatYacht,
          }}
          required
        />
        <TextInputWidget
          name="mastConstructionOther"
          question="Description"
          scope={{
            source: 'mastConstruction', // Also check if mast is visible
            condition: 'Other',
          }}
          required
        />
        <Options
          name="hullType"
          question="Hull Type"
          lookupKey="hullTypes"
          scope={{
            source: 'itemSubtype',
            condition: sailBoatYacht,
          }}
          required
        />
        <RadioGroupWidget
          name="hasSleepingBerths"
          question="Sleeping Berths"
          scope={{
            source: 'itemSubtype',
            condition: (itemSubtype) => powerSail.includes(itemSubtype),
          }}
          required
        />
        <Options
          as="list"
          name="jetSkiColour"
          question="Colour"
          lookupKey="jetSkiColours"
          scope={{
            source: 'itemSubtype',
            condition: jetSki,
          }}
          required
        />
        <RadioGroupWidget
          name="jetSkiTurboCharged"
          question="Turbo Charged"
          scope={{
            source: 'itemSubtype',
            condition: jetSki,
          }}
          required
        />
        <AffixInputWidget
          name="jetSkiCcRating"
          question="CC Rating"
          scope={{
            source: 'itemSubtype',
            condition: jetSki,
          }}
          placeholder="e.g. 3000"
          thousandSeparator={false}
          size={4}
          required
        />
        <RadioGroupWidget name="hasCommercialUse" question="Any commercial use" required />
        <RadioGroupWidget name="usedForRacing" question="Used for racing" required />
        <Options
          name="distancedRaced"
          question="Distance raced (Nautical Miles)"
          lookupKey="raceDistances"
          scope={{
            source: ['itemSubtype', 'usedForRacing'],
            condition: ([itemSubtype, usedForRacing]) => itemSubtype === sailBoatYacht && usedForRacing === 'true',
          }}
          required
        />
        <RadioGroupWidget
          name="usedWithinCoastalWaters"
          question="Within NZ coastal waters only"
          scope={{
            source: 'itemSubtype',
            condition: (itemSubtype) => dps.includes(itemSubtype),
          }}
          required
        />
        {/*Motor Insured & Details*/}
        <Scope highlight>
          <Scope.Source reference="itemSubtype">
            <RadioGroupWidget
              name="hasMotorInsured"
              question="Motor to be insured"
              scope={{
                source: 'itemSubtype',
                condition: (itemSubtype) => dps.includes(itemSubtype),
              }}
              required
            />
          </Scope.Source>
          <Scope.Target condition={([itemSubtype, hasMotorInsured]) => dps.includes(itemSubtype) && hasMotorInsured === 'true'}>
            <Options
              name="motorType"
              question="Type of Motor"
              lookupKey="motorTypes"
              scope={{
                source: 'itemSubtype',
                condition: (itemSubtype) => powerSail.includes(itemSubtype),
              }}
              required
            />
            <TextInputWidget
              name="motorTypeOtherDetails"
              question="Description"
              scope={{
                source: 'motorType',
                condition: 'Other',
              }}
              required
            />
            <TextInputWidget name="motorYear" question="Year" />
            <TextInputWidget name="motorMake" question="Make" required />
            <AffixInputWidget name="motorHorsepower" question="Horsepower" size={5} required />
            <RadioGroupWidget name="motorIsTwin" question="Twin Motor" required />
            <RadioGroupWidget name="motorIsTurboCharged" question="Turbo Charged" required />
            <Options name="motorMaximumSpeed" question="Maximum Speed" lookupKey="motorSpeeds" required />
            <Options name="extinguisherType" question="Extinguisher Type" lookupKey="extinguisherTypes" required />
          </Scope.Target>
        </Scope>
        <TextInputWidget
          name="serialNumber"
          question="Serial Number"
          scope={{
            source: ['itemSubtype', 'hasMotorInsured', 'motorType'],
            condition: ([itemSubtype, hasMotorInsured, motorType]) =>
              powerSail.includes(itemSubtype) && hasMotorInsured === 'true' && ['Outboard', 'Other'].includes(motorType),
          }}
          required
        />
        <AddressSelect name="location" question="Location" />
        {/*Storage Details*/}
        <Scope highlight>
          <Scope.Source>
            <Options
              name="storageType"
              question="Storage Type"
              lookupKey="watercraftStorages"
              scope={{
                source: 'itemSubtype',
                condition: (itemSubtype) => djps.includes(itemSubtype),
              }}
              required
            />
          </Scope.Source>
          <Scope.Target condition={(val) => Boolean(val)}>
            <Options
              question="Trailer storage"
              lookupKey="traileredStorages"
              name="trailerStorageType"
              scope={{
                source: ['itemSubtype', 'storageType'],
                condition: ([itemSubtype, storageType]) => !djps.includes(itemSubtype) || storageType === storageTypes.trailered,
              }}
              required
            />
            <Options
              name="mooredStorageType"
              question="Type of mooring"
              lookupKey="mooredStorages"
              scope={{
                source: ['itemSubtype', 'storageType'],
                condition: ([itemSubtype, storageType]) => djps.includes(itemSubtype) && storageType === storageTypes.permanentlyMoored,
              }}
              required
            />
            <TextInputWidget
              name="mooredStorageDetails"
              question="Description"
              scope={{
                source: ['itemSubtype', 'storageType', 'mooredStorageType'],
                condition: ([itemSubtype, storageType, mooredStorageType]) =>
                  djps.includes(itemSubtype) && storageType === 'Permanently moored' && mooredStorageType === nq.other.question,
              }}
              required
            />
          </Scope.Target>
        </Scope>
        <Scope highlight>
          <Scope.Source reference="itemSubtype">
            <RadioGroupWidget
              name="trailer"
              question="Trailer to be insured"
              scope={{
                source: 'itemSubtype',
                condition: (itemSubtype) => djps.includes(itemSubtype),
              }}
              required
            />
          </Scope.Source>
          <Scope.Target condition={([itemSubtype, trailer]) => djps.includes(itemSubtype) && trailer === 'true'}>
            <TextInputWidget name="rego" question="Rego" required />
            <RadioGroupWidget name="hasLock" question="Fitted with External Locking Device" required />

            <TwinInputWidget
              name="trailerValue"
              question="Value"
              inputs={[
                { label: 'GST Exclusive', name: 'gstExclusive', prefix: '$' },
                { label: 'GST Inclusive', name: 'gstInclusive', prefix: '$' },
              ]}
              conversionFactor={convert.gstExcToInc}
              required
            />
          </Scope.Target>
        </Scope>
        <Options
          name="coverType"
          question="Cover type"
          lookupKey="coverTypes"
          hasDefault
          scope={{
            source: 'itemSubtype',
            condition: (itemSubtype) => Boolean(itemSubtype),
          }}
          required
        />
        <SumInsuredWidget name="sumInsured" required />

        <Modifications reference={{ key: 'itemSubtype', condition: (i) => djps.includes(`${i}`) }} required />
        <Excess required />
        <Options name="liabilitySumInsured" question="Liability Sum Insured" lookupKey="liabilitySumsInsured" required />
        <TextInputWidget name="interestedParty" question="Interested Party" required />
      </FormProviderWrapper>
    </>
  );
}
