import { CheckboxGroupWidget, RadioGroupWidget, Scope } from '@fmg/ui';
import React from 'react';
import { dd, itemTypes } from 'models';

const commercialBuilding = itemTypes.commercialBuilding.value;
const fireProtectionOptions = dd.get('fireProtections')(commercialBuilding);
export function FireProtection() {
  return (
    <Scope highlight>
      <Scope.Source>
        <RadioGroupWidget name="hasFireProtection" question="Has Fire Protection?" />
      </Scope.Source>
      <Scope.Target condition="true">
        <CheckboxGroupWidget name="fireProtection" question="Types of protection" options={fireProtectionOptions} required />
      </Scope.Target>
    </Scope>
  );
}
