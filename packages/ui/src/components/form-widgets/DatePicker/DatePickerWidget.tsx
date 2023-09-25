import React from 'react';
import { FieldProps } from '../../../types';
import { useFormField } from '../../../hooks';
import { useScope } from '../../../hooks';
import { DatePicker } from '../../atoms/DatePicker/DatePicker';

export type DatePickerWidgetProps = Omit<FieldProps, 'component'> & {
  minDate?: string | Date;
  maxDate?: string | Date;
};

export function DatePickerWidget({ scope = {}, ...props }: DatePickerWidgetProps) {
  const { render } = useFormField({ ...props, component: DatePicker });
  const { isVisible } = useScope(scope);

  return isVisible ? render() : <></>;
}
