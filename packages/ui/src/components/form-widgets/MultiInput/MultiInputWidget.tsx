import React, { ReactElement } from 'react';

import { useFormFieldGroup, useScope } from '../../../hooks';
import { type TextInputProps, type FieldGroupProps } from '../../../types';
import { useScopeContext } from '../../../context/ScopeContext';
import { type ScopeTargetProps } from '../../../utils/Scope/Scope';

import { DropdownProps } from '../Dropdown/DropdownWidget';

type InputTypes = DropdownProps & TextInputProps & ScopeTargetProps;

export type MultiInputWidgetProps = {
  disableChildren?: string[];
  children: ReactElement<InputTypes>[] | ReactElement<InputTypes>;
  sizes?: number[];
} & Omit<FieldGroupProps, 'fields'>;

export function MultiInputWidget({ scope = {}, children, disableChildren = [], ...props }: MultiInputWidgetProps): ReactElement {
  const { isEnabled, source } = useScopeContext();

  const formFields = [children].flat().map((child: ReactElement<InputTypes>, index) => {
    const name = `${props.name}.${child.props.name}`.replaceAll(/\.{2,}/g, '.').replace(/^\./, '');

    const disabled = (![source].flat().filter(Boolean).includes(name) && isEnabled === false) || disableChildren.includes(name);

    const scope =
      source || source.length
        ? {
            source,
            condition: child.props.condition,
          }
        : undefined;

    return {
      // this can be overwritten by children's prop
      disabled,
      ...child.props,
      scope,
      name,
      component: child.type,
      key: child.key ?? name,
      size: props?.sizes && props.sizes[index],
    };
  });

  const groupObject = {
    ...props,
    name: props.name,
    isMultiInput: true,
    fields: formFields,
  } as FieldGroupProps;

  const { render } = useFormFieldGroup(groupObject);
  const { isVisible } = useScope(scope);
  return isVisible ? render() : <></>;
}
