import React from 'react';
import classnames from 'classnames';
import { Controller, FieldError, FieldValues, FormState, useFormContext } from 'react-hook-form';
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form/dist/types/controller';
import { reqMessage } from 'models/src/schemas/schema';

import { FieldGroupProps, FieldGroupReturn, TargetFieldProps } from '../types';
import { useScope } from './useScope';
import { useRequired } from './useRequired';
import { useFieldSize } from './useFieldSize';
import { useFieldEvents } from './useFieldEvents';
import { useOptIn } from './useOptIn';
import { stringToKebab } from '@fmg/utils';
import { UseFormReturn } from 'react-hook-form/dist/types';
import { Checkbox } from '../components/atoms/CheckBox/Checkbox';

type CustomFieldError = Partial<FieldError> & { [key: string]: Partial<FieldError> };

export function isNestedFieldError(error: Partial<FieldError> | CustomFieldError): error is CustomFieldError {
  return error != null && (error as CustomFieldError)?.message == null;
}

export function getErrorMessage(error: Partial<FieldError> | CustomFieldError) {
  if (isNestedFieldError(error)) {
    return Object.values(error)
      .map((fieldErr) => (fieldErr as FieldError).message)
      .join(', ');
  }
  return error?.message;
}

export function resolveError({
  isRequired,
  fieldState: { isDirty, isTouched, error },
}: {
  isRequired: boolean;
  field?: ControllerRenderProps;
  fieldState: Pick<ControllerFieldState, 'isDirty' | 'isTouched' | 'error'>;
  formState?: FormState<FieldValues>;
}) {
  if (error?.message === reqMessage) {
    if (!isRequired || !(isDirty || isTouched)) return null;
  }

  return error;
}

export function useFormFieldGroup({
  question,
  name,
  required,
  control: defaultControl,
  fields,
  size: totalSize,
  fieldHandlers,
  isMultiInput = false,
  renderAccessory,
  saveOnChange,
  optedFor,
  ...props
}: FieldGroupProps): FieldGroupReturn {
  const { control: contextControl, ...formMethods } = useFormContext();
  const control = defaultControl ?? contextControl;
  const { optedIn, optedOut } = useOptIn({ name, optedFor });

  const id = name || stringToKebab(question);
  const groupDisabled = optedOut || props.disabled;

  const isRequired = useRequired(name, required || optedIn);
  const autoSize = optedFor ? (totalSize ?? 10) - 2 : totalSize;

  const render = () => (
    <>
      {question || isRequired ? (
        <div id={`question-${id}`} className="form-question text-text text-base font-medium">
          {question ? <span className="text-end">{question}</span> : null}
          {isRequired ? (
            <span className="text-warning w-1.5 pt-1.5 text-center" data-testid="required" role="img">
              *
            </span>
          ) : null}
        </div>
      ) : null}

      <div id={`fields-${id}`} className="form-fields">
        {optedFor ? (
          <Controller
            name={optedFor}
            control={control}
            render={({ field }) => {
              return (
                <span className={classnames('w-25.5')}>
                  <Checkbox label="Yes" {...field} defaultChecked={optedIn} />
                </span>
              );
            }}
          />
        ) : null}
        {fields.map(({ component, name: fieldName, label, size = autoSize, disabled, ...multiFieldProps }) => (
          <FieldController
            key={fieldName}
            name={fieldName}
            control={control}
            required={required || optedIn}
            component={component}
            label={label}
            size={size}
            fieldHandlers={fieldHandlers}
            saveOnChange={saveOnChange}
            isMultiInput={isMultiInput}
            {...(isMultiInput ? multiFieldProps : props)}
            disabled={disabled || groupDisabled}
          />
        ))}
        {renderAccessory?.()}
      </div>
    </>
  );

  return { question, required, render, control, ...formMethods };
}

export type FieldControllerProps = TargetFieldProps &
  Pick<FieldGroupProps, 'fixWidth' | 'isMultiInput' | 'control'> &
  Partial<UseFormReturn>;

export function FieldController({
  control,
  saveOnChange,
  required,
  component: Component,
  name: fieldName,
  label,
  size,
  fieldHandlers,
  deferValidation,
  isMultiInput,
  ...props
}: FieldControllerProps) {
  const isRequired = useRequired(fieldName, deferValidation ? 'deferred' : required);
  const autoSize = useFieldSize(fieldName, size);
  const [handleChange, handleBlur] = useFieldEvents({ saveOnChange });

  const { isVisible } = useScope(props?.scope ?? {});
  const hasVisibility = props?.scope ? isVisible : true;

  return hasVisibility ? (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => {
        const error = resolveError({ isRequired, field, fieldState, formState: props.formState });
        const eventProps = {
          ...props,
          ...fieldHandlers,
        };
        const onChange = handleChange({ field, ...eventProps });
        const onBlur = handleBlur({ field, ...eventProps });

        const printSubLabel = Component.displayName !== 'Checkbox';

        // console.log(fieldName, { field, fieldState, error, isRequired });

        return (
          <div className={`flex flex-col flex-wrap gap-1 w-grid-${size}`}>
            <Component
              {...field}
              {...props}
              value={field.value ?? ''}
              name={fieldName}
              size={autoSize}
              error={error?.message ? error : ''}
              label={label}
              onChange={onChange}
              onBlur={onBlur}
              {...fieldHandlers}
            />
            {!(error || label) ? null : (
              <div
                className={classnames(
                  `text-xs text-${error ? 'error' : `text-primary opacity-${props.disabled ? '50' : '75'}`} px-1.5 font-normal ${
                    isMultiInput ? 'h-4' : ''
                  }`,
                  { 'w-full flex-wrap outline outline-blue-500': props.fixWidth }
                )}
              >
                {getErrorMessage(error as FieldError) ?? (printSubLabel ? label : '')}
              </div>
            )}
          </div>
        );
      }}
    />
  ) : null;
}
