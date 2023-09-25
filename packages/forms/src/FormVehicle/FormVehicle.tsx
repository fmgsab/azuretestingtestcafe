import * as React from 'react';
import { v4 } from 'uuid';
import * as model from 'models/src/vehicle.table';
import { TextInputWidget, FormProviderWrapper, TextInput, MultiInputWidget, type RowKeyType } from '@fmg/ui';
import {
  AddressSelect,
  CCRating,
  CoverType,
  EngineType,
  Excess,
  GLW,
  ItemSubtype,
  MainDriver,
  OptionalBenefits,
  Serial,
  StorageLocation,
  SumInsured,
  Usage,
} from '../fields';
import { CommercialActivities, Modifications } from '../fieldsets';
import { SetName } from '../field-actions/SetName/SetName';

export function FormVehicle({ uid }: { uid: RowKeyType }) {
  // eslint-disable-next-line no-console
  const onSubmit = (data: model.FormValues) => console.log('Submit:', data);

  return (
    <>
      <FormProviderWrapper
        model={model}
        uid={uid}
        onSubmit={onSubmit}
        mode="all"
        defaultValues={{ itemType: 'vehicle', viModifications: [{ key: v4() }], hasModification: 'false' }}
      >
        <ItemSubtype />
        <SetName sources={['year', 'make', 'model', '-', 'rego']} />
        {/*Fieldset A*/}
        <TextInputWidget name="rego" question="Rego" />
        <TextInputWidget name="year" question="Year" />
        <MultiInputWidget name="" question="Make & Model" sizes={[5, 5]} required>
          <TextInput name="make" label="Make" />
          <TextInput name="model" label="Model" />
        </MultiInputWidget>
        <TextInputWidget name="variant" question="Variant" />
        <TextInputWidget name="vin" question="VIN" />
        <Serial />
        <CCRating placeholder="e.g. 3000" />
        <GLW />
        <EngineType />

        {/*Standalone Fields*/}
        <Usage name="usage" />
        <CoverType />

        {/*Fieldset B*/}
        <SumInsured required />

        {/*Fieldset C*/}
        <Modifications />

        {/*Fieldset D*/}
        <AddressSelect name="location" question="Location" mode="physical" />

        {/*Standalone Field*/}
        <StorageLocation />

        {/*Fieldset E*/}
        <MainDriver />

        {/*Fieldset H*/}
        <CommercialActivities />

        {/*Fieldset F*/}
        <Excess />

        {/*Fieldset J*/}
        <OptionalBenefits />
      </FormProviderWrapper>
    </>
  );
}
