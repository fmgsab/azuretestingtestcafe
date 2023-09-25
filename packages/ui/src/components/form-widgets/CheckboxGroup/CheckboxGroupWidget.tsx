import React, { useId } from 'react';
import { Checkbox } from '../../atoms/CheckBox/Checkbox';
import { useFormField } from '../../../hooks/useFormField';
import { useSaveField } from '../../../hooks/useSaveField';
import { useScope } from '../../../hooks/useScope';
import { InputProps, OptionProps } from '../../../types/input-types';
import { FieldHandler } from '../../../types/form-types';
import { useController, useFormContext } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/fields';

export type CheckboxGroupProps = {
  cols?: number;
  size?: number;
  name: string;
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
} & FieldValues &
  InputProps;

export const CheckboxGroup = React.forwardRef(function CheckboxGroup(
  { options = [], cols, size, name, value, ...props }: CheckboxGroupProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const groupId = useId();
  const layout = cols ? `grid grid-cols-${cols} sm:grid-cols-${cols}` : 'flex flex-wrap';
  const values = Array.isArray(value) ? value : value instanceof Set ? Array.from(value) : [value];

  return (
    <div className={`${layout} w-grid-${size} items-center gap-x-1.5`} data-testid={`checkbox-group-${name}`}>
      {options.map((option) => {
        const { id, label, value } = option as OptionProps;
        return (
          <Checkbox
            {...props}
            defaultChecked={values?.includes(value)}
            id={id}
            key={`${groupId}-${value}`}
            label={label}
            name={name}
            ref={ref}
            value={value}
          />
        );
      })}
    </div>
  );
});

export function CheckboxGroupWidget({ scope = {}, name, size = 12, required, ...props }: CheckboxGroupProps): JSX.Element {
  const { control } = useFormContext();
  const { field } = useController({ control, name });
  const saveField = useSaveField();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const set = new Set(field.value && [...field.value]);

    e.target && e.target.checked ? set.add(e.target.value) : set.delete(e.target.value);

    field.onChange(set);

    return saveField({
      name,
      value: set,
    });
  };

  const fieldHandlers = { onChange } as FieldHandler;

  const { render } = useFormField({
    ...props,
    component: CheckboxGroup,
    required,
    size,
    name,
    ...{ fieldHandlers },
  });

  const { isVisible } = useScope(scope);
  return isVisible ? render() : <></>;
}
