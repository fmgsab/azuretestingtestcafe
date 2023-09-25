import React from 'react';
import { useFormField, useScope } from '../../../hooks';
import { FieldProps, CustomDropdownProps } from '../../../types';

import { convertToOptions } from '../../../utils/options/options-util';

import Dropdown from '../../atoms/Dropdown/Dropdown';

export type DropdownProps = Omit<FieldProps, 'component'> & CustomDropdownProps;

export function DropdownWidget({options, placeholder = 'Select...', scope = {}, isMulti, ...props}: DropdownProps) {
  const allOptions = convertToOptions(options ?? [])
    .filter(Boolean)
    .flat();

  const {render} = useFormField({
    ...props,
    options: allOptions,
    placeholder,
    isMulti,
    component: Dropdown,
    saveOnChange: true
  });
  const {isVisible} = useScope(scope);

  return isVisible ? render() : <></>;
}
