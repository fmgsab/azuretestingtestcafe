import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { useFormContext } from 'react-hook-form';
import { CheckboxGroupWidget, DropdownWidget, RadioGroupWidget, type FieldProps, type OptionProps, useSaveField, isOption } from '@fmg/ui';

import { AbstractFieldProps, As } from '../../fields';

export function useIsValidOption({ name, options }: Pick<FieldProps, 'name' | 'options'>) {
  const { getValues } = useFormContext();
  const currValue = getValues(name);

  if (!currValue) {
    return true;
  }

  const checkEquality = (val1: unknown) => (val2: unknown) => {
    return JSON.stringify(isOption(val1) ? val1.value : val1) === JSON.stringify(val2);
  };

  // TODO: Tidy up
  if (Array.isArray(currValue)) {
    return currValue.every((val) => options?.some(checkEquality(val)));
  }

  const isEqual = (element: OptionProps | string | number) => {
    return checkEquality(element)(currValue);
  };

  return options?.some(isEqual);
}

export function useValidateOption({
  name,
  options,
  defaultValue,
  isMulti,
}: Pick<FieldProps, 'name' | 'options' | 'defaultValue'> & { isMulti?: boolean }) {
  const isValidOption = useIsValidOption({ name, options });
  const saveField = useSaveField();

  const [key, setKey] = useState<string>(v4());

  useEffect(() => {
    if (!isValidOption) {
      saveField({ name, value: defaultValue ?? (isMulti ? [] : '') });
      setKey(v4());
    }
  }, [isValidOption, saveField, name, defaultValue, isMulti]);

  return { isValidOption, key };
}

export function OptionsViewer({ as = 'list', name = '', defaultValue, options, ...props }: AbstractFieldProps & Partial<FieldProps>) {
  const { key } = useValidateOption({ name, options, defaultValue, isMulti: props.isMulti });
  const saveField = useSaveField();

  useEffect(() => {
    if (defaultValue) saveField({ name, value: defaultValue }, true);
  }, [saveField, name, defaultValue]);

  const getComponent = () => {
    switch (as) {
      case 'list':
        return DropdownWidget;
      case 'radio':
        return RadioGroupWidget;
      case 'checkbox':
        return CheckboxGroupWidget;
      default:
        return as;
    }
  };

  const Component: As = getComponent();

  return <Component name={name} defaultValue={defaultValue} options={options} {...props} key={key} />;
}
