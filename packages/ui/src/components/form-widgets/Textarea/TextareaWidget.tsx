import React from 'react';

import TextareaInput from '../../atoms/Textarea/Textarea';
import { FieldProps } from '../../../types/form-types';
import { useFormField } from '../../../hooks/useFormField';
import { useScope } from '../../../hooks/useScope';

type TextareaProps = Omit<FieldProps, 'component'> & {
  minRows?: number;
  maxRows?: number;
  rows?: number;
};

export function TextareaWidget({ scope = {}, ...props }: TextareaProps): JSX.Element {
  const { render } = useFormField({ ...props, component: TextareaInput });
  const { isVisible } = useScope(scope);

  return isVisible ? render() : <></>;
}
