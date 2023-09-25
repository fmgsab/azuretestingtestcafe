import React from 'react';
import { z, ZodTypeAny } from 'zod';
import classnames from 'classnames';
import Select from 'react-select';
import { useOptions, isPlaceholder, convertToOptions } from '../../../utils/options/options-util';
import Caret from '../../../assets/icons/12x12/caret-down.svg';
import { CustomDropdownProps, OptionProps } from '../../../types';

type CustomPickerDropdownProps = CustomDropdownProps & {
  onChange: (v: { value: string }) => void;
};

export const DatePickerDropdown = React.forwardRef(function CustomInput(
  { className, error, disabled, label, placeholder = 'Select...', options = [], ...props }: CustomPickerDropdownProps,
  ref: React.ForwardedRef<z.infer<ZodTypeAny>>
) {
  const PLACEHOLDER = 'text-field-text-placeholder';
  const allOptions = [convertToOptions(options)].filter(Boolean).flat() as OptionProps[];
  const convert = useOptions(allOptions);
  const value = convert(props.value);
  const defaultValue = convert(props.defaultValue);

  return (
    <Select
      unstyled
      maxMenuHeight={294}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          minHeight: '36px',
          justifyContent: 'flex-start',
          '&:active': {
            backgroundColor: '#E5E5E5',
          },
        }),
        option: () => ({
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }),
      }}
      className={className}
      classNames={{
        container: () => classnames('text-base', { '!cursor-not-allowed bg-white text-disabled-content': disabled }),
        control: ({ isFocused, isDisabled, menuIsOpen }) =>
          classnames(`flex border border-field-border rounded bg-white hover:bg-field-bg px-[9px] min-h-[34px] font-bold`, {
            'border-field-border-disabled !cursor-not-allowed': isDisabled,
            'rounded-b-none': menuIsOpen,
            'border-fmg-green bg-field-hover': (menuIsOpen || isFocused) && !isDisabled && !error,
            'border-error': error,
          }),
        option: ({ isSelected, isFocused }) =>
          classnames('h-9 pl-2.5', {
            'bg-field-bg': isSelected || (isFocused && !isSelected),
          }),
        menu: () =>
          classnames('!bg-white ' + 'rounded-b border border-t-0 border-fmg-green ' + 'mt-[-2px] overflow-hidden', {
            '!border-error': error,
          }),
        valueContainer: () => classnames('flex justify-start items-center pt-[2px]'),
        singleValue: ({ data }) => classnames({ [PLACEHOLDER]: isPlaceholder(data) }),
      }}
      components={{
        DropdownIndicator: () => <Caret />,
      }}
      {...props}
      placeholder={placeholder}
      options={allOptions}
      value={value}
      defaultValue={defaultValue}
      ref={ref}
      isDisabled={disabled}
      aria-disabled={disabled}
      aria-invalid={Boolean(error)}
      aria-label={`date-picker-dropdown-${label || props.name}`}
      data-testid="date-picker-dropdown"
    />
  );
});

export default DatePickerDropdown;
