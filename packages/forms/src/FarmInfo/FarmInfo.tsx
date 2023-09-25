import React from 'react';
import { farmInfo as model } from 'models';
import {
  AppendableList,
  Dropdown,
  DropdownWidget,
  FormProviderWrapper,
  MultiInputWidget,
  RadioGroupWidget,
  TextareaWidget,
  TextInput,
  TextInputWidget,
} from '@fmg/ui';

export function FarmInfoForm() {
  const onSubmit = (data: model.FormValues) => console.log('Submit:', data);

  const opModels = [
    { id: 'owner', label: 'Owner operator', value: 'owner' },
    { id: 'manager', label: 'Owner & Manater', value: 'owner-manager' },
    { id: 'miker', label: 'Contract milker', value: 'milker' },
    { id: 'ownermilker', label: 'Owner & Milker', value: 'owner-milker' },
    { id: 'other', label: 'Other', value: 'other' },
  ];

  const ownerships = [
    { id: 'owned', label: 'Owned', value: 'owned' },
    { id: 'owned-leased', label: 'Owned leased', value: 'owned-leased' },
    { id: 'leased-leasee', label: 'Leased leasee', value: 'leased-leasee' },
    { id: 'shared', label: 'Shared', value: 'shared' },
  ];

  return (
    <FormProviderWrapper model={model} uid={1} onSubmit={onSubmit}>
      <RadioGroupWidget name="operatingModel" question="Operating model" options={opModels} cols={3} size={10} />
      <TextInputWidget name="operations" question="Operations" size={12} />
      <TextInputWidget name="trunover" question="Turnover" size={12} />
      <TextareaWidget name="productionType" question="Production type/Services offered" size={12} />
      <MultiInputWidget name="productionUnits" question="Production units/metrics">
        <Dropdown name="productionUnits.metric" label="Metric" />
        <TextInput name="productionUnits.unit" label="Unit" />
      </MultiInputWidget>
      <MultiInputWidget name="operatingProps" question="Operating properties" sizes={[4, 9]}>
        <TextInput name="operatingProps.situationOfRisk" label="Situation of risk" />
        <TextInput name="operatingProps.description" label="Description" />
      </MultiInputWidget>
      <DropdownWidget name="ownership" question="Ownership" options={ownerships} size={10} />
      <MultiInputWidget name="premSize" question="Block/Premise size">
        <TextInput name="premSize.hec" label="Hectares" />
        <TextInput name="premSize.sqm" label="Square metres" />
      </MultiInputWidget>
      <MultiInputWidget name="premSize" question="Block/Premise size">
        <TextInput name="numEmployees.full" label="Full time" />
        <TextInput name="numEmployees.part" label="Part time" />
        <TextInput name="numEmployees.casual" label="Causal" />
      </MultiInputWidget>
      <AppendableList question="Friends" addButtonLabel="Add Friend" name="friends" required>
        <TextInputWidget name="friend" size={8} />
      </AppendableList>
    </FormProviderWrapper>
  );
}
