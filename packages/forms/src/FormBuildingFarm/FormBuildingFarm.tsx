import React from 'react';
import * as model from 'models/src/farmBuilding.table';
import {
  AffixInputWidget,
  CheckboxGroupWidget,
  FormProviderWrapper,
  RadioGroupWidget,
  type RowKeyType,
  Scope,
  TextareaWidget,
} from '@fmg/ui';
import { AddressSelect, BasisOfSettlement, ItemSubtype, Options } from '../fields';
import { BuildingAreas, ClientProvideSumInsured } from '../fieldsets';
import { v4 } from 'uuid';
import { buildingAreaTypes, dd, farmBuildingAreas, itemSubtypes, itemTypes, usages, nq } from 'models';

const farmBuilding = itemTypes.farmBuilding.value;
const fireProtectionOptions = dd.get('fireProtections')(farmBuilding);

export function FormBuildingFarm({ uid }: { uid: RowKeyType }) {
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
          itemType: itemTypes.farmBuilding.value,
          usage: usages.farm,
          excess: '500',
          buildingAreas: [{ key: v4(), type: farmBuildingAreas.mainBuildingArea }],
          buildingAreasDomestic: [{ key: v4(), type: buildingAreaTypes.domesticUnit }],
        }}
      >
        <ItemSubtype required />
        <AddressSelect name={nq.location.name} question={nq.location.question} />
        <BasisOfSettlement />
        <ClientProvideSumInsured question={nq.totalSumInsured.question} />
        <Options name="excess" question="Excess" lookupKey="excesses" />
        <Options name={nq.numberWalls.name} question={nq.numberWalls.question} lookupKey="wallSideOptions" />
        <Options name={nq.roofConstruction.name} question={nq.roofConstruction.question} lookupKey="roofConstruction" />
        <Options name={nq.floorConstruction.name} question={nq.floorConstruction.question} lookupKey="floorConstructions" />
        <Options name={nq.wallConstruction.name} question={nq.wallConstruction.question} lookupKey="wallConstruction" />
        <RadioGroupWidget
          name={nq.constructionType.name}
          question={nq.constructionType.question}
          options={['Rotary', 'Herringbone']}
          scope={{
            source: 'itemSubtype',
            condition: itemSubtypes.farmBuilding.dairyShed,
          }}
          required
        />
        <AffixInputWidget
          name={nq.numberOfBales.name}
          question={nq.numberOfBales.question}
          size={3}
          scope={{
            source: 'itemSubtype',
            condition: itemSubtypes.farmBuilding.dairyShed,
          }}
          required
        />

        <Scope highlight>
          <Scope.Source reference={nq.itemSubtype.name}>
            <RadioGroupWidget
              name={nq.hasFireProtection.name}
              question={nq.hasFireProtection.question}
              scope={{
                source: nq.itemSubtype.name,
                condition: (itemSubtype) => itemSubtype === itemSubtypes.farmBuilding.dairyShed,
              }}
              required
            />
          </Scope.Source>
          <Scope.Target
            condition={([referenceValue, fieldValue]: [string, string]) =>
              referenceValue === itemSubtypes.farmBuilding.dairyShed && fieldValue === nq.true.name
            }
          >
            <CheckboxGroupWidget
              name={nq.fireProtection.name}
              question={nq.fireProtection.question}
              options={fireProtectionOptions}
              scope={{
                source: [nq.itemSubtype.name, nq.hasFireProtection.name],
                condition: ([itemSubtype, hasFireProtection]: [string, string]) =>
                  itemSubtype === itemSubtypes.farmBuilding.dairyShed && hasFireProtection === nq.true.name,
              }}
              required
            />
            <TextareaWidget
              name={nq.otherFireProtection.name}
              question={nq.otherFireProtection.question}
              scope={{
                source: [nq.itemSubtype.name, nq.fireProtection.name],
                condition: ([itemSubtype, fireProtection]) =>
                  itemSubtype === itemSubtypes.farmBuilding.dairyShed && fireProtection?.has(nq.other.name),
              }}
              required
            />
          </Scope.Target>
        </Scope>

        <BuildingAreas name={nq.buildingAreas.name} lookupKey="farmBuildingAreas" fields={[nq.buildingAreas.name]} filterOptions={true} />

        <Options
          name={nq.historicPlace.name}
          question={nq.historicPlace.question}
          lookupKey="historicOptions"
          scope={{
            source: nq.buildingAreas.name,
            condition: (areas) => model.isOldBuilding(areas?.[0]?.year),
          }}
          required="deferred"
        />

        <Scope highlight>
          <Scope.Source>
            <RadioGroupWidget name={nq.domesticArea.name} question={nq.domesticArea.question} required />
          </Scope.Source>
          <Scope.Target condition={nq.true.name}>
            <RadioGroupWidget
              name={nq.permanentlyOccupied.name}
              question={nq.permanentlyOccupied.question}
              scope={{
                source: [nq.itemSubtype.name, nq.domesticArea.name],
                condition: ([itemSubtype, domesticArea]) =>
                  itemSubtype !== itemSubtypes.farmBuilding.office && domesticArea === nq.true.name,
              }}
              required
            />
            <BuildingAreas
              name={nq.buildingAreasDomestic.name}
              question={nq.buildingAreasDomestic.question}
              fields={[nq.buildingAreasDomestic.name]}
              disableFirstItem={false}
            />
          </Scope.Target>
        </Scope>
      </FormProviderWrapper>
    </>
  );
}
