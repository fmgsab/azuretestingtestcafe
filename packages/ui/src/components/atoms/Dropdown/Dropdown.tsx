import React from 'react';
import { z, ZodTypeAny } from 'zod';
import classnames from 'classnames';
import Select, { components } from 'react-select';

import { CustomDropdownProps, OptionProps } from '../../../types';
import Caret from '../../../assets/icons/18x18/caret.svg';
import Close from '../../../assets/icons/18x18/close.svg';

import { useOptions, isPlaceholder, convertToOptions } from '../../../utils/options/options-util';

export const Dropdown = React.forwardRef(function CustomInput(
  {
    className,
    error,
    disabled,
    label,
    isClearable = false,
    isSearchable = true,
    isMulti,
    size = 4,
    placeholder = 'Select',
    mapExtra,
    ...props
  }: CustomDropdownProps,
  ref: React.ForwardedRef<z.infer<ZodTypeAny>>
) {
  const PLACEHOLDER = 'text-field-text-placeholder';

  const defaultOption = !isMulti && placeholder && props.options?.length ? { value: '', label: placeholder } : null;
  const allOptions = [defaultOption, convertToOptions(props.options ?? [], mapExtra)].filter(Boolean).flat() as OptionProps[];

  const convert = useOptions(allOptions);

  const value = convert(props.value);
  const defaultValue = convert(props.defaultValue);

  return (
    <Select
      unstyled
      isSearchable={isSearchable}
      maxMenuHeight={294}
      className={className ? className : `w-grid-${size}`}
      classNames={{
        container: () => classnames({ '!cursor-not-allowed bg-white': disabled }),
        control: ({ isFocused, isDisabled, menuIsOpen }) =>
          classnames(
            `flex text-base border rounded bg-field-bg hover:bg-field-bg-hover p-[11px] min-h-10.5`,
            {
              '!bg-white !hover:bg-white': isDisabled || (menuIsOpen && !isSearchable),
              'border-1 border-field-border-disabled !cursor-not-allowed': isDisabled,
              'rounded-b-none': menuIsOpen,
              'border-1 border-fmg-green bg-field-bg-focused': (menuIsOpen || isFocused) && !isDisabled && !error,
              'border-transparent': !isDisabled && !error && !menuIsOpen && !isFocused,
              'border-1 border-error': error,
            },
            className
          ),
        option: ({ isDisabled, isSelected, isFocused, data }) =>
          classnames('flex place-content-center h-10.5 p-2.5', {
            'bg-field-bg': isSelected || (isFocused && !isSelected),
            'active:bg-field-bg': !isDisabled,
            'text-field-text-placeholder': isPlaceholder(data),
          }),
        menu: () =>
          classnames('!bg-white border rounded-b border-1 border-t-0 border-fmg-green mt-[-1px] overflow-hidden', {
            '!border-error': error,
          }),
        valueContainer: () => classnames('flex flex-wrap gap-1.5', { '-m-1.5': isMulti }),
        placeholder: () => classnames(PLACEHOLDER, { 'm-1.5': isMulti }),
        input: ({ hasValue }) => classnames('!text-base font-light', { 'm-1.5': isMulti && !hasValue }),
        multiValue: () => classnames('!bg-white p-1.5 border rounded border-field-multi-value-border flex gap-1.5'),
        singleValue: ({ data }) => classnames({ [PLACEHOLDER]: isPlaceholder(data) }),
        noOptionsMessage: () => 'p-3 !text-start',
      }}
      components={{
        DropdownIndicator: ({ isFocused, isDisabled }) => (
          <Caret
            className={classnames({
              'fill-field-fill-black-24': isFocused,
              'fill-field-fill-black-48': !isDisabled && !error && !isFocused,
              'fill-field-fill-black-75': isDisabled,
              'fill-error': error,
            })}
          />
        ),
        MultiValueRemove: (removeProps) => (
          <components.MultiValueRemove {...removeProps}>
            <Close className={classnames('fill-field-multi-value-remove')} />
          </components.MultiValueRemove>
        ),
      }}
      {...props}
      placeholder={placeholder}
      options={allOptions}
      value={value}
      defaultValue={defaultValue}
      ref={ref}
      isClearable={isClearable}
      isDisabled={disabled}
      isMulti={isMulti}
      aria-disabled={disabled}
      aria-invalid={Boolean(error)}
      aria-label={label || props.name}
    />
  );
});

export default Dropdown;
