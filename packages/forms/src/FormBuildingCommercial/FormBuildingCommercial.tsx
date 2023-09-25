import React from 'react';
import * as model from 'models/src/commercialBuilding.table';
import {
  AffixInputWidget,
  FormProviderWrapper,
  type RowKeyType,
  RadioGroupWidget,
  DatePickerWidget,
  AppendableList,
  TextInput,
  MultiInputWidget,
  Scope,
  SumInsuredWidget,
} from '@fmg/ui';
import { BasisOfSettlement, ItemSubtype, Occupancy, Options, ConditionalQuestionSI, AddressSelect } from '../fields';
import { v4 } from 'uuid';
import { itemTypes, buildingAreaTypes, occupancies } from 'models';
import { BuildingAreas } from '../fieldsets';
import { FireProtection } from '../fieldsets/FireProtection/FireProtection';
import { CommercialHazards } from '../fieldsets/CommercialHazards/CommercialHazards';
import { CommercialSecurity } from '../fieldsets/CommercialSecurity/CommercialSecurity';

const { ownerOccupied } = occupancies;
const commercialBuilding = itemTypes.commercialBuilding.value;

export function FormBuildingCommercial({ uid }: { uid: RowKeyType }) {
  // eslint-disable-next-line no-console
  const onSubmit = (data: model.FormValues) => console.log('Submit:', data);
  const jobId = 1;
  return (
    <>
      <FormProviderWrapper
        model={model}
        uid={uid}
        onSubmit={onSubmit}
        mode="all"
        defaultValues={{
          jobId,
          itemType: commercialBuilding,
          occupancy: ownerOccupied,
          tenants: [{ key: v4() }],
          hasDemolitionCost: false,
          excess: '500',
          hasFireProtection: 'true',
          buildingAreas: [{ key: v4(), type: buildingAreaTypes.domesticUnit }],
        }}
      >
        <ItemSubtype required />
        <AddressSelect name="location" question="Location" />
        <Occupancy required />
        <AppendableList name="tenants" question="Tenants" addButtonLabel="Add Another" required minLength={1}>
          <MultiInputWidget name="" sizes={[5, 5]} saveOnChange fixWidth>
            <TextInput name="name" label="Tenant name" required />
            <TextInput name="occupation" label="Occupation" required />
          </MultiInputWidget>
        </AppendableList>
        <BasisOfSettlement />
        <Scope highlight>
          <Scope.Source>
            <RadioGroupWidget
              name="valuationForSumInsured"
              question="Valuation to be supplied?"
              label="Valuation should be less than 2 years old"
              required
            />
          </Scope.Source>
          <Scope.Target condition="true">
            <DatePickerWidget
              name="dateOfValuation"
              question="Date of valuation"
              scope={{
                source: 'valuationForSumInsured',
                condition: 'true',
              }}
              size={6}
            />
          </Scope.Target>
        </Scope>

        <SumInsuredWidget name="presentDayValue" question="Present Day Value" required />
        <ConditionalQuestionSI />
        <SumInsuredWidget name="demolitionCost" question="Demolition cost" optedFor="hasDemolitionCost" sizes={[4, 4]} />
        <Options name="excess" question="Excess" lookupKey="excesses" />
        <Options name="waterSupply" question="Water supply" lookupKey="waterSupplyTypes" />
        <AffixInputWidget
          name="yearConstruction"
          question="Construction year"
          size={3}
          thousandSeparator={false}
          isNumeric={true}
          allowDecimals={false}
          required
        />
        <Options name="roofConstruction" question="Roof construction" lookupKey="roofConstruction" />
        <Options name="floorConstruction" question="Floor construction" lookupKey="floorConstructions" />
        <Options name="wallConstruction" question="Wall construction" lookupKey="wallConstruction" />
        <Options name="numberOfStories" question="Number of stories" lookupKey="buildingStories" />

        <FireProtection />

        <AffixInputWidget
          name="yearSwitchboardCheck"
          question="Year of last satisfactory switchboard check"
          size={3}
          thousandSeparator={false}
          isNumeric={true}
          allowDecimals={false}
          required
        />

        <CommercialHazards />

        <CommercialSecurity />

        <Options
          name="historicPlace"
          question="Historic place"
          lookupKey="historicOptions"
          scope={{
            source: 'yearConstruction',
            condition: (year) => year < 1940,
          }}
          required="deferred"
        />
        <Scope highlight>
          <Scope.Source>
            <RadioGroupWidget name="domesticArea" question="Domestic Area" required />
          </Scope.Source>
          <Scope.Target condition="true">
            <BuildingAreas />
          </Scope.Target>
        </Scope>
      </FormProviderWrapper>
    </>
  );
}
