import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Checkbox, Dropdown, MultiInputWidget, TextInput, useSaveField } from '@fmg/ui';
import { dd } from "models";
import { DatePicker } from "@fmg/ui/src/components/atoms/DatePicker/DatePicker";

export function Name() {
  const saveField = useSaveField();
  const { getValues } = useFormContext();
  const { hasNoMiddleName } = getValues('middleName') ?? {};

  useEffect(() => {
    if (hasNoMiddleName === true) {
      saveField({ name: 'middleName.name', value: '' });
    }
  }, [saveField, hasNoMiddleName]);

  return (
    <MultiInputWidget name="" question="Details" sizes={[2, 4, 4, 4, 4, 6, 4]} required>
      <Dropdown name="title" label="Title" options={dd.get('titles')()} defaultValue="" placeholder="" />
      <TextInput name="firstName" label="First name" placeholder="First Name" />
      <TextInput name="preferredName" label="Preferred name" deferValidation />
      <TextInput name="middleName.name" label="Middle name" placeholder="Middle Name" deferValidation />
      <Checkbox name="middleName.hasNoMiddleName" label="No middle name" required={false} saveOnChange />
      <TextInput name="lastName" label="Last name" placeholder="Last Name" />
      <DatePicker name="dateOfBirth" label="Date of birth" maxDate={new Date(new Date().setHours(-24))} deferValidation />
    </MultiInputWidget>
  );
}
