import * as React from 'react';
import { AppendableList, Dropdown, MultiInputWidget, RadioGroupWidget, Scope, Textarea, TextareaWidget, TextInput } from '@fmg/ui';
import { dd } from 'models/src/data-dictionary/data-dictionary';
import { DatePicker } from '@fmg/ui/src/components/atoms/DatePicker/DatePicker';

export function Accidents() {
  return (
    <Scope>
      <Scope.Source>
        <RadioGroupWidget
          required={true}
          name="hasAccidents"
          question="Has the driver/rider had any at-fault accidents in the past 5 years?"
        />
      </Scope.Source>
      <Scope.Target condition="true">
        <AppendableList addButtonLabel="Add Accident" name="accident" defaultValues={{type: "At fault"}}>
          <MultiInputWidget name="" question="Details" required={true} sizes={[5, 5]}>
            <TextInput name="type" label="Accident Type" disabled={true} />
            <DatePicker name="date" label="Approx. Date" maxDate={new Date()} placeholder="dd/mm/yyyy Approx. Date"/>
          </MultiInputWidget>
          <TextareaWidget name="description" label="Description" placeholder="Description"/>
        </AppendableList>
      </Scope.Target>
    </Scope>
  );
}
