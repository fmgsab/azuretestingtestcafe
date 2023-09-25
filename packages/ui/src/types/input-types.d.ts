import React, { ReactElement, ReactNode } from 'react';
import { Props } from 'react-select';
import { FieldHandler } from './form-types';
import { FieldError } from 'react-hook-form';

export type InputProps = {
  'aria-label'?: string | undefined; //TODO: reverse it back to 'aria-label' in components
  ariaLabel?: string | undefined;
  className?: string;
  defaultValue?: string | undefined;
  disabled?: boolean;
  error?: string | boolean | FieldError;
  id?: string | undefined;
  label?: string;
  name: string;
  options?: OptionProps[] | string[] | number[];
  pattern?: string;
  placeholder?: string;
  size?: number;
  maxLength?: number;
  fieldHandlers?: FieldHandler;
  value?: string | ReadonlyArray<string> | number | undefined;
  prefix?: string;
  suffix?: string | ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | InputElement>) => void;
  'data-group-name'?: string;
  saveOnChange?: boolean;
  deferValidation?: boolean;
};

export type OptionProps = {
  id?: string;
  label: string | ReactElement | ReactNode;
  name?: string;
  value?: string | ReadonlyArray<string> | number | undefined;
};

export type CustomRadioGroupProps = {
  cols?: number;
  error?: string | boolean | object;
} & InputProps;

export type CheckboxProps = {
  defaultChecked?: boolean;
  disabled?: boolean;
  error?: string | boolean | FieldError;
  required?: boolean;
} & OptionProps &
  Pick<InputProps, 'saveOnChange' | 'onChange'>;

export type CustomDropdownProps = Omit<Props, 'size' | 'options' | 'placeholder'> &
  Omit<InputProps, 'onChange' | 'placeholder'> & {
    value?: Pick<OptionProps>;
    defaultValue?: Pick<OptionProps>;
    placeholder?: Props['placeholder'] | false;
    required?: boolean;
    mapExtra?: (option: string | number | OptionProps, idx?: number) => Record<string, unknown>;
  };

export type ButtonProps = {
  'aria-label': string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
};

export type BlockButtonProps = ButtonProps & {
  block?: boolean;
  children?: React.ReactNode;
  color: 'primary' | 'secondary' | 'primary-block-light';
  error?: boolean;
  startIcon?: React.ReactNode;
};

export type InlineButtonProps = ButtonProps & {
  children?: React.ReactNode;
  color: 'light' | 'secondary' | 'secondary-light' | 'remove';
  startIcon?: React.ReactNode;
};

export type RoundButtonProps = ButtonProps & {
  startIcon: React.ReactNode;
};

export type LoginButtonProps = ButtonProps & {
  imageUrl?: string;
};

export type ApplicationSummaryButtonProps = ButtonProps & {
  children: React.ReactNode;
  isActive: boolean;
};

export type PhoneTypeProps = {
  phoneType?: 'Home' | 'Work' | 'Mobile' | '';
};

export type TextInputProps = Pick<
  InputProps,
  | 'ariaLabel'
  | 'disabled'
  | 'error'
  | 'fieldHandlers'
  | 'id'
  | 'label'
  | 'maxLength'
  | 'name'
  | 'pattern'
  | 'placeholder'
  | 'size'
  | 'value'
  | 'deferValidation'
  | 'onChange'
> & {
  required?: boolean;
};
