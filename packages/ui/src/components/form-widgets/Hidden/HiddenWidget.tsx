import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { FieldProps, InputProps } from '../../../types';
import { useSaveField } from '../../../hooks';

function HiddenInput(props: InputProps) {
  return <input hidden {...props} />;
}

export function HiddenWidget({ name, value, ...props }: Omit<FieldProps, 'component'>) {
  const { register, getValues } = useFormContext();
  const save = useSaveField();
  const formValue = getValues(name);

  useEffect(() => {
    if (formValue !== value) {
      save({ name, value });
    }
  }, [formValue, name, save, value]);

  return <HiddenInput {...register(name)} value={value} {...props} />;
}
