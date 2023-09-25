import * as React from 'react';
import { AppendableList, CheckboxGroupWidget, DropdownWidget, RadioGroupWidget, Scope, SumInsuredWidget, TextInputWidget } from '@fmg/ui';
import { AbstractFieldProps } from '../../fields/fields';
import { useConditionalCriteria } from '../../hooks/useConditionalCriteria';
import { OptionsViewer } from '../../fields/shared/OptionsViewer/OptionsViewer';
import { BasisOfSettlement } from '../../fields';

export function SpecifiedItems() {
  const { options, defaultValue } = useConditionalCriteria('specifiedItems');
  return (
    <Scope highlight>
      <Scope.Source>
        <RadioGroupWidget name="hasSpecifiedItems" question="Specified items" />
      </Scope.Source>
      <Scope.Target condition="true">
        <AppendableList addButtonLabel="Add another" name="specifiedItems" repeatChildProps>
          <SpecifiedItem
            name="specifiedItem"
            label=""
            question="Specified item type"
            options={options}
            defaultValue={defaultValue}
            required
            saveOnChange
          />
          <TextInputWidget name="details" label="Details" />
          <BasisOfSettlement name="basisOfSettlement" label="basis " />
          <SumInsuredWidget name="sumInsured" question="Sum insured" required />
          <CheckboxGroupWidget
            name="valuationProvided"
            question="Valuation provided"
            options={[{ label: 'Yes', value: 'true' }]}
            required={false}
          />
        </AppendableList>
      </Scope.Target>
    </Scope>
  );
}

export function SpecifiedItem({ ...props }: AbstractFieldProps) {
  return <OptionsViewer as={DropdownWidget} label="Type" {...props} />;
}
