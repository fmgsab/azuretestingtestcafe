import React from 'react';
import InvalidIcon from '../../../assets/icons/18x18/invalid.svg';
import classNames from 'classnames';
import { TextInputProps } from '../../../types';

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  {
    ariaLabel,
    maxLength,
    disabled,
    error,
    fieldHandlers,
    id,
    name,
    pattern,
    placeholder,
    size = 8,
    value,
    onChange,
    ...props
  }: TextInputProps,
  ref
) {
  const classes = classNames(
    `input bg-gray-5 border-0 hover:bg-gray-10 text-base font-300
    rounded text-text-primary h-10.5 w-grid-${size} focus:outline-none 
    focus:ring-1 focus:ring-inset focus:ring-primary focus:bg-gray-10 p-3`,
    {
      'outline-none ring-1 ring-inset ring-error focus:ring-error': error,
      'outline-none ring-1 ring-inset ring-gray-10 disabled:hover:bg-white disabled:bg-white disabled:placeholder-text-disabled': disabled,
    }
  );

  return (
    <div className={`form-control w-grid-${size} relative`}>
      <input
        id={id}
        name={name}
        value={value}
        {...props}
        {...fieldHandlers}
        aria-invalid={Boolean(error)}
        aria-label={ariaLabel ?? name}
        className={classes}
        onChange={onChange}
        disabled={disabled}
        pattern={pattern}
        placeholder={placeholder}
        ref={ref}
        type="text"
        maxLength={maxLength}
        data-testid={`text-input-${name}`}
      />
      {error && <InvalidIcon className="fill-error absolute right-3 top-3" />}
    </div>
  );
});

export default TextInput;
