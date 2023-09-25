import { ChangeEvent } from 'react';
import { UseControllerReturn, useFormContext } from 'react-hook-form';
import { extractValues, isOption } from '../utils/options/options-util';
import { useSaveField } from './useSaveField';
import { FieldProps, OptionProps } from '../types';

export type UseOptionChangeProps = Pick<FieldProps, 'saveOnChange' | 'onChange'>;
export type HandleEventProps = Pick<UseControllerReturn, 'field'> & UseOptionChangeProps;

export function useFieldEvents({ ...props }: UseOptionChangeProps) {
  const saveField = useSaveField();
  const { getValues } = useFormContext() ?? {};

  const handleChange = ({ field, ...fieldProps }: HandleEventProps) => {
    return (change: ChangeEvent | OptionProps) => {
      if (isOption(change) || Array.isArray(change)) {
        const value = extractValues(change);
        if (fieldProps.saveOnChange || props.saveOnChange) {
          saveField({ name: field.name, value });
        }
        // TODO: Fix type error
        // eslint-disable-next-line
        // @ts-ignore
        fieldProps.onChange?.(value);
        field.onChange(value);
      } else {
        field.onChange(change);
        fieldProps.onChange?.(change);
        props.onChange?.(change);
        if (fieldProps.saveOnChange || props.saveOnChange) {
          saveField({ name: field.name, value: getValues?.(field.name) ?? (change.target as HTMLInputElement).value });
        }
      }
    };
  };

  const handleBlur = ({ field, ...fieldProps }: HandleEventProps) => {
    return () => {
      field.onBlur();
      if (fieldProps.saveOnChange || props.saveOnChange) return;

      saveField(field);
    };
  };

  return [handleChange, handleBlur] as const;
}
