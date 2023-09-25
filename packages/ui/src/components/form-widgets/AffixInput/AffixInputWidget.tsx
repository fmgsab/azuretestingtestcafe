import React from 'react';
import { FieldProps } from '../../../types';
import { useFormField } from '../../../hooks';
import { useScope } from '../../../hooks';
import { AffixInput, AffixInputProps } from '../../atoms/AffixInput/AffixInput';

export type AffixWidgetProps = Omit<FieldProps, 'component'> & AffixInputProps;

export function AffixInputWidget({ scope = {}, ...props }: AffixWidgetProps) {
  const { render } = useFormField({ ...props, component: AffixInput });
  const { isVisible } = useScope(scope);

  return isVisible ? render() : <></>;
}
