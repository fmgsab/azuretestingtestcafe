import React, { useId } from 'react';
import classnames from 'classnames';
import { convertToOptions } from '../../../utils/options/options-util';
import { Radio } from '../../atoms/Radio/Radio';
import { useFormField, useScope } from '../../../hooks';
import { FieldProps } from '../../../types';

export type RadioGroupProps = Omit<FieldProps, 'component'> & {
  cols?: number;
};

const defaultOptions = [
  { id: 'yes', label: 'Yes', value: 'true' },
  { id: 'no', label: 'No', value: 'false' },
];

export const RadioGroupInput = React.forwardRef(function CustomInput(
  { options = defaultOptions, size, cols, ...props }: RadioGroupProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const groupId = useId();
  // tailwind-safelist sm:grid-cols-2 sm:grid-cols-3 sm:grid-cols-4
  const layout = cols ? `grid auto-cols-auto sm:grid-cols-${cols}` : 'flex flex-wrap';

  return (
    <div className={`${layout} w-grid-${size} items-center gap-x-1.5 gap-y-1.5`}>
      {convertToOptions(options)?.map((option) => {
        const { id, value, label } = option;
        return (
          <Radio
            key={`${groupId}-${id}-${value}`}
            {...props}
            label={label as string}
            value={value}
            ref={ref}
            defaultChecked={value === props.value || (!props.value && value === props.defaultValue)}
            className={classnames('h-9', { 'w-full': options?.length === 1 })}
          />
        );
      })}
    </div>
  );
});

export function RadioGroupWidget({ scope = {}, size = 12, ...props }: RadioGroupProps) {
  const { isVisible, isEnabled } = useScope(scope);

  const { render } = useFormField({
    ...props,
    disabled: !isEnabled || props.disabled,
    size,
    component: RadioGroupInput,
    saveOnChange: true,
  });

  return isVisible ? render() : <></>;
}
