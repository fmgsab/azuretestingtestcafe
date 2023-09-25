import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { FieldProps, isOptions, useSaveField } from '@fmg/ui';

export type UseDefaultCheckedProps = Pick<FieldProps, 'options' | 'name' | 'defaultValue'>;

export function useDefaultValue({ name = '', options, defaultValue }: UseDefaultCheckedProps) {
  const saveField = useSaveField();
  const { getValues, setValue } = useFormContext();

  const result = useRef<Record<string, unknown>>();

  useEffect(() => {
    const currValue = getValues(name);

    // Check if ALL values are set, otherwise reset with default values given
    if (options?.length && Object.values(currValue ?? {})?.filter(Boolean).length !== options.length) {
      const value = isOptions(options)
        ? options.reduce((acc, { value }) => ({ ...acc, [value as string]: defaultValue }), {})
        : defaultValue;
      result.current = { name, value };
      saveField({ name, value }, true);
    }
  }, [defaultValue, getValues, name, options, saveField, setValue]);

  return result.current;
}
