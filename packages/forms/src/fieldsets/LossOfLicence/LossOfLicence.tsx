import * as React from 'react';
import { AppendableList, Dropdown, MultiInputWidget, RadioGroupWidget, Scope, Textarea, TextInput } from '@fmg/ui';
import { dd } from 'models/src/data-dictionary/data-dictionary';
import { DatePicker } from '@fmg/ui/src/components/atoms/DatePicker/DatePicker';

export function LossOfLicence() {
  return (
    <Scope>
      <Scope.Source>
        <RadioGroupWidget
          required={true}
          name="hasLostLicence"
          question="Has the driver/rider had a loss of licence in the last 3 years?"
        />
      </Scope.Source>
      <Scope.Target condition="true">
        <AppendableList addButtonLabel="Add Loss" name="lossOfLicence">
          <MultiInputWidget name="" question="Details" sizes={[5, 5]}>
            <Dropdown name="offence" label="Offence" options={dd.get('licenceLostReasons')()} placeholder="Select" />
            <DatePicker name="date" label="Approx. Date" maxDate={new Date()} placeholder="dd/mm/yyyy Approx. Date"/>
          </MultiInputWidget>
          <MultiInputWidget name="" sizes={[3, 4, 3, 10]}>
            <TextInput name="fine" label="Fine" />
            <TextInput name="demeritPoints" label="Demerit Points" />
            <TextInput name="length" label="Length of Loss (mths)" placeholder="Length of Loss" />
            <Textarea name="description" label="Description" placeholder="Description" />
          </MultiInputWidget>
        </AppendableList>
      </Scope.Target>
    </Scope>
  );
}
