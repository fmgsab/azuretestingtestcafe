import React from 'react';
import { FieldProps } from '../../../types';
import { useFormField } from '../../../hooks';
import { useScope } from '../../../hooks';
import { NumericInput, NumericInputProps } from '../../atoms/NumericInput/NumericInput';

export type NumericWidgetProps = Pick<NumericInputProps, 'isSumInsured' | 'isCurrency' | 'decimalScale'> & Omit<FieldProps, 'component'>;

export function NumericInputWidget({ scope = {}, ...props }: NumericWidgetProps) {
  const label = props.isSumInsured ? props.label ?? 'GST Exclusive' : props.label;
  const { render } = useFormField({ ...props, label, component: NumericInput });
  const { isVisible } = useScope(scope);

  return isVisible ? render() : <></>;
}
