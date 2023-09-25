import React from 'react';
import { FieldProps } from '../../../types/form-types';
import { useFormField } from '../../../hooks/useFormField';
import { useScope } from '../../../hooks/useScope';
import { InputProps, TextInputProps } from '../../../types/input-types';
import TextInput from '../../atoms/TextInput/TextInput';

type TextInputWidgetProps = Omit<TextInputProps, 'required'> & Omit<FieldProps, 'component' | keyof InputProps>;

export function TextInputWidget({ scope = {}, ...props }: TextInputWidgetProps): JSX.Element {
  const { render } = useFormField({ ...props, component: TextInput });
  const { isVisible } = useScope(scope);

  return isVisible ? render() : <></>;
}

export default TextInputWidget;
