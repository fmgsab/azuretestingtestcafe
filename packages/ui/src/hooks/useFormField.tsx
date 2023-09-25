import { FieldProps } from '../types/form-types';
import { useFormFieldGroup } from './useFormFieldGroup';

export function useFormField<T>({ name, component, ...props }: FieldProps & T) {
  const fields = [{ name, component, label: props.label }];

  return useFormFieldGroup({ name, fields, ...props });
}
