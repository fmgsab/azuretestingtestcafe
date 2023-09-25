import { CheckboxGroupWidget, RadioGroupWidget, Scope, TextareaWidget } from '@fmg/ui';
import React from 'react';
import { dd, itemTypes } from 'models';

const commercialBuilding = itemTypes.commercialBuilding.value;
const hazardsOptions = dd.get('hazards')(commercialBuilding);
export function CommercialHazards() {
  return (
    <Scope highlight>
      <Scope.Source>
        <RadioGroupWidget name="hasHazards" question="Any hazardous processes or substances" options={['None', 'Yes']} required />
      </Scope.Source>
      <Scope.Target condition="Yes">
        <CheckboxGroupWidget // Used because <Options ... /> does not handle Set as this does
          name="hazards"
          question="Hazardous processes or substances"
          options={hazardsOptions} // Used because not using <Options ... />
          cols={2}
          required
        />
        <TextareaWidget
          name="otherHazardDetails"
          question="Details"
          scope={{
            source: 'hazards',
            condition: (hazardsSet) => hazardsSet?.has('other'),
          }}
          required
        />
      </Scope.Target>
    </Scope>
  );
}
