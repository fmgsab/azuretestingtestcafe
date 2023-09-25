import * as React from 'react';
import { AffixInput, AppendableList, Dropdown, MultiInputWidget, RadioGroupWidget, Scope, TextareaWidget } from '@fmg/ui';
import { AbstractFieldProps } from '../../fields/fields';
import { useConditionalCriteria } from '../../hooks/useConditionalCriteria';
import { OptionsViewer } from '../../fields/shared/OptionsViewer/OptionsViewer';

type ModificationsProps = {
  reference?: {
    key?: string;
    condition: (a: string) => boolean;
  };
  required?: boolean;
};

export function Modifications({ reference, required }: ModificationsProps) {
  const { options, defaultValue } = useConditionalCriteria('modificationTypes');
  const referenceProp = reference?.key ? { reference: reference?.key } : {};
  const scope =
    reference?.key && reference?.condition
      ? {
          scope: {
            source: reference?.key,
            condition: reference?.condition,
          },
        }
      : {};
  const conditionProp = reference?.key
    ? { condition: ([refVal, keyVal]: [string, unknown]) => reference?.condition?.(refVal) && keyVal === 'true' }
    : { condition: 'true' };
  const requiredProp = required ? { required } : {};

  return (
    <Scope highlight>
      <Scope.Source {...referenceProp}>
        <RadioGroupWidget name="hasModification" question="Modifications & Accessories" defaultValue="false" {...scope} {...requiredProp} />
      </Scope.Source>
      <Scope.Target {...conditionProp}>
        <AppendableList addButtonLabel="Add another" name="viModifications">
          <MultiInputWidget name="" sizes={[5, 5]}>
            <ModificationType name="modificationType" label="Type" options={options} defaultValue={defaultValue} saveOnChange required />
            <AffixInput prefix="$" name="sumInsured" label="Sum Insured" isNumeric required />
          </MultiInputWidget>
          <TextareaWidget name="description" label="Description" deferValidation />
        </AppendableList>
      </Scope.Target>
    </Scope>
  );
}

export function ModificationType({ ...props }: AbstractFieldProps) {
  return <OptionsViewer as={Dropdown} label="Type" {...props} />;
}
