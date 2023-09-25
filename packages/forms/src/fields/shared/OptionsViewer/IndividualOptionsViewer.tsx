import React, { useEffect, useRef } from 'react';
import { v4 } from 'uuid';
import { useFormContext } from 'react-hook-form';
import { RadioGroupWidget, type FieldProps, useSaveField, isOption, isOptions } from '@fmg/ui';

import { useDefaultValue } from '../../../hooks/useDefaultValue';
import { AbstractFieldProps } from '../../fields';

type OptionListType = FieldProps['options'];

type UseIsValidOptionProps = Pick<FieldProps, 'name'> & {
  options: OptionListType;
};

export function useIsValidOption({ name, options }: UseIsValidOptionProps) {
  const { getValues } = useFormContext();
  const currValue = getValues(name);

  const prevOptions = useRef<OptionListType>(options);

  if (currValue == null) {
    prevOptions.current = options;
    return true;
  }

  const findValues = (list: OptionListType) => (isOptions(list) ? list.map(({ value }) => value) : list?.map((value) => value));

  if (options?.length) {
    const areSameOptions =
      prevOptions.current?.length === options?.length &&
      findValues(options)?.every((value) => findValues(prevOptions.current)?.includes(value));
    prevOptions.current = options;
    return areSameOptions;
  }
  return false;
}

export function IndividualOptionsViewer({
  name = '',
  defaultValue = 'false',
  options,
  ...props
}: AbstractFieldProps & Partial<FieldProps>) {
  const saveField = useSaveField();

  const isValidOption = useIsValidOption({ name, options });

  useEffect(() => {
    if (!isValidOption) {
      saveField({ name, value: '' });
      //setKey(v4());
    }
  }, [isValidOption, saveField, name, defaultValue]);

  useDefaultValue({ name, options, defaultValue });

  return (
    <>
      {options?.map((option) => {
        const { value, label } = isOption(option) ? option : { value: option, label: String(option) };
        return (
          <RadioGroupWidget
            key={`${v4()}${value}`}
            {...props}
            defaultValue={defaultValue}
            name={`${name}.${value}`}
            question={label as string}
            required
          />
        );
      })}
    </>
  );
}
