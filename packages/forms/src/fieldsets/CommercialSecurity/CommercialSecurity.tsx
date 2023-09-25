import { CheckboxGroupWidget, RadioGroupWidget, Scope, TextareaWidget } from '@fmg/ui';
import React from 'react';
import { dd, itemTypes, occupancies } from 'models';

const { ownerOccupied, unoccupied } = occupancies;
const commercialBuilding = itemTypes.commercialBuilding.value;
const securityOptions = dd.get('securityFeatures')(commercialBuilding);

export function CommercialSecurity() {
  return (
    <Scope highlight>
      <Scope.Source reference="occupancy">
        <RadioGroupWidget
          name="hasSecurityFeatures"
          question="Any security features"
          options={['None', 'Yes']}
          scope={{
            source: 'occupancy',
            condition: (val) => [ownerOccupied, unoccupied].includes(val),
          }}
          required="deferred"
        />
      </Scope.Source>
      <Scope.Target condition={([occupancy, features]) => [ownerOccupied, unoccupied].includes(occupancy) && features === 'Yes'}>
        <CheckboxGroupWidget // <Options ... /> does not handle Set() as expected
          name="securityQuestions"
          question="Security Questions"
          options={securityOptions}
          cols={2}
          scope={{
            source: ['occupancy', 'hasSecurityFeatures'],
            condition: ([occupancy, hasSecurity]: string[]) => [ownerOccupied, unoccupied].includes(occupancy) && hasSecurity === 'Yes',
          }}
          required
        />
        <TextareaWidget
          name="otherSecurityDetails"
          question="Details"
          scope={{
            source: ['occupancy', 'hasSecurityFeatures', 'securityQuestions'],
            condition: ([occupancy, hasSecurityFeatures, securityQuestions]) =>
              [ownerOccupied, unoccupied].includes(occupancy) && hasSecurityFeatures === 'Yes' && securityQuestions?.has('other'),
          }}
          required
        />
      </Scope.Target>
    </Scope>
  );
}
