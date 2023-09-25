import React, { ReactElement } from 'react';
import classnames from 'classnames';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { InputProps, UseScopeProps } from '../../../types';
import InvalidIcon from '../../../assets/icons/18x18/invalid.svg';

export type AffixInputProps = Omit<InputProps, 'name'> &
  Omit<NumericFormatProps, 'suffix'> & {
    type?: string;
    name?: string;
    showErrorIcon?: boolean;
    isNumeric?: boolean;
    thousandSeparator?: boolean;
    allowDecimals?: boolean;
    prefix?: NumericFormatProps['prefix'] | InputProps['prefix'] | ReactElement;
    suffix?: NumericFormatProps['suffix'] | InputProps['suffix'] | ReactElement;
  } & { scope?: UseScopeProps };

export const AffixInput = React.forwardRef<HTMLInputElement, AffixInputProps>(function AffixInput(affixProps: AffixInputProps, ref) {
  const {
    ariaLabel,
    maxLength,
    disabled,
    error,
    fieldHandlers,
    id,
    name,
    pattern,
    placeholder,
    size = 6,
    value,
    prefix,
    suffix,
    showErrorIcon = true,
    isNumeric = true,
    thousandSeparator = true,
    allowDecimals = true,
    ...props
  } = affixProps;

  const classes = classnames(
    [
      `w-grid-${size}`,
      'text-base font-300 rounded border-0 h-10.5  text-text-primary p-3',
      'bg-field-bg peer-hover:bg-field-bg-hover hover:bg-field-bg-hover',
      'focus:bg-field-bg-hover focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary',
      'disabled:bg-white disabled:hover:bg-white disabled:peer-hover:bg-white disabled:text-text-disabled',
    ].join(' '),
    {
      'pl-7': prefix,
      'pr-8': suffix,
      'outline-none ring-1 ring-inset ring-error focus:ring-error': error,
      'outline-none ring-1 ring-inset ring-gray-10': disabled,
    }
  );

  const commonProps = {
    id: id,
    name: name,
    value: value,
    ...props,
    ...fieldHandlers,
    'aria-invalid': Boolean(error),
    'aria-label': ariaLabel ?? name,
    className: classes,
    disabled: disabled,
    pattern: pattern,
    placeholder: placeholder,
    maxLength: maxLength,
    'data-testid': `text-input-${name}`,
  };

  const decimalScaleProp = allowDecimals ? {} : { decimalScale: 0 };

  return (
    <div className={`form-control w-grid-${size} relative`}>
      {prefix ? <Affix prefix={prefix} disabled={disabled} /> : null}
      {suffix ? <Affix suffix={suffix} disabled={disabled} /> : null} {/* placed before input for "peer" tw functionality */}
      {isNumeric ? (
        <NumericFormat
          {...commonProps}
          valueIsNumericString
          thousandSeparator={thousandSeparator}
          defaultValue=""
          data-testid="numeric-input"
          getInputRef={ref}
          {...decimalScaleProp}
        />
      ) : (
        <input ref={ref} {...commonProps} data-testid="native-input" />
      )}
      {!suffix && showErrorIcon && error && <InvalidIcon className="fill-error absolute right-3 top-3" />}
    </div>
  );
});

const Affix = ({ disabled, suffix, prefix }: Pick<AffixInputProps, 'disabled' | 'suffix' | 'prefix'>) => {
  return (
    <div
      className={classnames('text-text-affix peer absolute flex h-full items-center justify-center', {
        'cursor-default': !disabled,
        'cursor-not-allowed': disabled,
        'left-0 w-7': prefix,
        'right-0 w-8': suffix,
      })}
    >
      {prefix ?? suffix}
    </div>
  );
};
