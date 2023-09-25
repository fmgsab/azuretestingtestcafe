import React, { FormEventHandler, ForwardRefExoticComponent, ReactElement } from 'react';
import { TypeOf } from 'zod/lib/types';
import { ZodTypeAny } from 'zod';
import { Control, UseFormProps } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/fields';
import { UseFormGetValues, UseFormReturn } from 'react-hook-form/dist/types/form';
import { FieldPath } from 'react-hook-form/dist/types/path';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';
import { InputProps, OptionProps } from './input-types';
import { IModel, RowKeyType } from './model-type';

export type RequiredType = boolean | 'deferred';

export type FieldProps = {
  question?: string;
  control?: Control;
  component: React.JSXElementConstructor<InputProps & FieldValues> | ForwardRefExoticComponent;
  required?: RequiredType;
  rules?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  scope?: UseScopeProps;
  valueAsNumber?: boolean;
  optedFor?: string;
} & InputProps;
export type FieldHandler = Record<string, (e: React.ChangeEvent<HTMLInputElement>) => void> | undefined;

export type TargetFieldProps = Omit<FieldProps, 'question' | 'control'>;

export type FieldGroupProps = Omit<FieldProps, 'component'> & {
  fixWidth?: boolean;
  isMultiInput?: boolean;
  fields: TargetFieldProps[];
  value?: unknown;
  renderAccessory?: () => ReactElement;
};

export type FieldGroupReturn = Partial<UseFormReturn> &
  Partial<FieldProps> & {
    render: () => ReactElement;
  };

type CommonType = number | boolean | string | Record<string, unknown> | unknown[];

export type UseScopeProps = {
  source?: FieldPath;
  condition?: ((controlValue: UseFormGetValues) => boolean) | CommonType;
  values?: Record<string, OptionProps[]>;
  options?: OptionProps[];
  fieldsToReset?: string[];
  resetValue?: unknown;
  controlState?: 'visible' | 'enabled';
};

export type UseScopeReturn = {
  isVisible: boolean;
  isEnabled: boolean;
  options?: OptionProps[];
};

export type FormProps<T> = Partial<UseFormProps> & {
  model: IModel;
  uid: RowKeyType;
  onSubmit: (value?: TypeOf<T & ZodTypeAny> | undefined) => void | FormEventHandler;
  children?: React.ReactNode;
  shouldValidateOnLoad?: boolean;
  shouldResetForm?: boolean;
  autoComplete?: string;
  discriminator?: keyof Awaited<ZodType>;
};
