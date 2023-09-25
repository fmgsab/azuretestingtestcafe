import React from 'react';
import { v4 } from 'uuid';
import * as model from 'models/src/house.table';
import {
  FormProviderWrapper,
  RadioGroupWidget,
  MultiInputWidget,
  RadioGroupInput,
  AffixInput,
  TextareaWidget,
  RowKeyType,
  AffixInputWidget,
  Scope,
  Button,
} from '@fmg/ui';
import { buildingAreaTypes, commonAreaTypes, occupancies } from 'models';

import { AddressSelect, BasisOfSettlement, ExcessHouse, OptionalBenefits, Options } from '../fields';
import { BuildingAreas, ClientProvideSumInsured, OldBuildingAreaInfo } from '../fieldsets';

export function FormHouse({ uid }: { uid: RowKeyType }) {
  // eslint-disable-next-line no-console
  const onSubmit = (data: model.FormValues) => {
    console.log('Submit:', model.schema.safeParse(data));
  };

  return (
    <>
      <FormProviderWrapper
        model={model}
        uid={uid}
        //key={`${jobId}-${uid}`}
        onSubmit={onSubmit}
        mode="all"
        defaultValues={{
          itemType: 'house',
          itemSubtype: 'Dwelling',
          overrideSystemSumInsured: 'false',
          hasSharedStructure: 'false',
          hasCommonAreas: 'false',
          isMortgageeSale: 'false',
          buildingAreas: [{ key: v4(), type: buildingAreaTypes.domesticUnit }],
          hasExcessFreeGlass: 'false',
          hasMatchingFloorCoverings: 'false',
          needsLandlordContents: 'true',
          employeeRehousing: 'true',
          employeeRehousingSumInsured: '20,000',
          lossOfRent: 'true',
          lossOfRentSumInsured: '20,000',
        }}
      >
        {/*C - H*/}
        <AddressSelect name="location" question="Location" mode="physical" />
        <Options name="occupancy" question="House use" lookupKey="occupancyTypes" />
        <Scope inline>
          <MultiInputWidget
            name=""
            question="Is the house currently unoccupied?"
            label="occupancyStatus"
            sizes={[4, 3]}
            required
            saveOnChange
          >
            <Scope.Source key="isUnoccupied" name="isUnoccupied">
              <RadioGroupInput name="isUnoccupied" options={['No', 'Yes']} />
            </Scope.Source>
            <Scope.Target
              condition="Yes"
              key="monthsUnoccupied"
              name="monthsUnoccupied"
              label="Months Unoccupied"
              required="deferred"
              shouldReset
            >
              <AffixInput name="monthsUnoccupied" />
            </Scope.Target>
          </MultiInputWidget>
        </Scope>
        <RadioGroupWidget name="isMortgageeSale" question="Mortgagee sale" />
        <>
          <Scope highlight>
            <Scope.Source>
              <RadioGroupWidget name="hasCommercialUse" question="Commercial Use" />
            </Scope.Source>
            <Scope.Target condition="true">
              <AffixInputWidget name="percentCommercialUse" question="Percentage Commercial Use" suffix="%" size={2} required />
              <RadioGroupWidget name="storeBusinessStock" question="Store business stock" required />
              <TextareaWidget
                name="storeBusinessStockDetails"
                question="Details"
                scope={{
                  source: 'storeBusinessStock',
                  condition: 'true',
                }}
                required
              />
              <RadioGroupWidget
                name="hasVisitors"
                question="Visiting customers or suppliers"
                scope={{
                  source: 'hasCommercialUse',
                  condition: 'true',
                }}
                required
              />
              <TextareaWidget
                name="visitorsDetails"
                question="Details"
                scope={{
                  source: 'hasVisitors',
                  condition: 'true',
                }}
                required
              />
            </Scope.Target>
          </Scope>
        </>

        <>
          <Options name="roofConstruction" question="Roof construction" lookupKey="roofConstruction" />
          <Options as="list" name="wallConstruction" question="Wall construction" lookupKey="wallConstruction" />
          <Options name="constructionQuality" question="Quality of construction" lookupKey="constructionQuality" />
          <Options name="storyCount" question="Number of stories" lookupKey="buildingStories" />
          <Options name="landSlope" question="Slope of land" lookupKey="landSlopeTypes" />
          <Options name="waterSupply" question="Water supply" lookupKey="waterSupplyTypes" />
        </>

        <BuildingAreas />
        <OldBuildingAreaInfo />

        <>
          <Scope highlight>
            <Scope.Source>
              <RadioGroupWidget name="hasSharedStructure" question="Any shared wall, roof, foundation, or other structure?" />
            </Scope.Source>
            <Scope.Target condition="true">
              <TextareaWidget name="sharedStructureDetails" question="Details" required />
            </Scope.Target>
          </Scope>
          <Scope highlight>
            <Scope.Source>
              <RadioGroupWidget name="hasCommonAreas" question="Any commonly owned areas such as drives or pathways?" />
            </Scope.Source>
            <Scope.Target condition="true">
              <Scope>
                <Scope.Source>
                  <Options name="commonAreaType" question="Common area type" lookupKey="commonAreaTypes" />
                </Scope.Source>
                <Scope.Target condition={commonAreaTypes.other}>
                  <TextareaWidget name="commonAreaDetails" question="Details" required />
                </Scope.Target>
              </Scope>
            </Scope.Target>
          </Scope>
        </>

        <BasisOfSettlement />
        <ClientProvideSumInsured />

        <ExcessHouse />
        <RadioGroupWidget
          name="hasShortTermGuest"
          question="Short term paying guests"
          scope={{
            source: 'occupancy',
            condition: occupancies.holidayHome,
          }}
          required
        />

        <OptionalBenefits />

        <Scope highlight>
          <Scope.Source>
            <RadioGroupWidget name="requiresLifestyleBenefits" question="Does this property require lifestyle optional benefits?" />
          </Scope.Source>
          <Scope.Target condition="true">
            <RadioGroupWidget name="hasLifestyleBlockFencing" question="Lifestyle Block Fencing" />
            <RadioGroupWidget name="hasLifestylePumpsAndMotors" question="Lifestyle Pumps & Motors" />
          </Scope.Target>
        </Scope>
        {/*AQ-AU*/}
        <RadioGroupWidget
          name="needsLandlordContents"
          question="Landlord's Contents"
          scope={{
            source: 'occupancy',
            condition: (val) => [occupancies.tenanted, occupancies.employee].includes(val),
          }}
        />

        <Scope highlight>
          <Scope.Source reference="occupancy">
            <RadioGroupWidget
              name="employeeRehousing"
              question="Employee Rehousing"
              required
              scope={{
                source: 'occupancy',
                condition: occupancies.employee,
              }}
            />
          </Scope.Source>
          <Scope.Target
            condition={([occupancy, employeeRehousing]) => occupancy === occupancies.employee && employeeRehousing === 'true'}
            required
          >
            <AffixInputWidget
              name="employeeRehousingSumInsured"
              question="Employee rehousing Sum Insured"
              label="GST Exclusive"
              prefix="$"
              size={4}
            />
          </Scope.Target>
        </Scope>
        <Scope highlight>
          <Scope.Source reference="occupancy">
            <RadioGroupWidget
              name="lossOfRent"
              question="Loss of Rent"
              required
              scope={{
                source: 'occupancy',
                condition: occupancies.tenanted,
              }}
            />
          </Scope.Source>
          <Scope.Target condition={([occupancy, lossOfRent]) => occupancy === occupancies.tenanted && lossOfRent === 'true'} required>
            <AffixInputWidget name="lossOfRentSumInsured" question="Loss of Rent sum insured" label="GST Exclusive" prefix="$" size={4} />
          </Scope.Target>
        </Scope>

        <>
          <Scope highlight>
            <Scope.Source>
              <AffixInputWidget name="numberEqcClaims" question="Number of EQC claims since 1999" size={3} isNumeric={true} required />
            </Scope.Source>
            <Scope.Target condition={(n) => Number(n) > 0}>
              <TextareaWidget name="numberEqcDetails" question="Details" required />
              <Options name="damageType" question="Damage type" lookupKey="damageTypes" required />
              <AffixInputWidget
                name="yearLastClaim"
                question="Year of last claim"
                size={3}
                thousandSeparator={false}
                isNumeric={true}
                required
              />
              <AffixInputWidget name="totalClaimValue" question="Total claim value" prefix="$" size={5} required />
              <RadioGroupWidget name="hasAllDamageRepaired" question="All damage repaired" required />
              <RadioGroupWidget name="hasLandDamage" question="Land damage" required />
            </Scope.Target>
          </Scope>
        </>
        <Button type="submit" className="col-span-2 m-10" aria-label="submit" color="primary">
          Save
        </Button>
      </FormProviderWrapper>
    </>
  );
}
