import React from 'react';
import { useConditionalCriteria } from '../../../hooks/useConditionalCriteria';
import { AbstractFieldProps } from '../../fields';
import { OptionsViewer } from '../OptionsViewer/OptionsViewer';

export type OptionsProps = Pick<
  AbstractFieldProps,
  'as' | 'name' | 'question' | 'lookupKey' | 'scope' | 'fields' | 'hasDefault' | 'required' | 'size' | 'cols' | 'isMulti'
> & {
  hideIfEmpty?: boolean;
};

export function Options({
  as = 'radio',
  name,
  question,
  lookupKey = '',
  scope,
  fields = [],
  hasDefault,
  hideIfEmpty,
  ...props
}: OptionsProps) {
  const { options, defaultValue } = useConditionalCriteria(lookupKey, { fields, hasDefault });

  const otherProps = lookupKey ? { ...props, options: options, defaultValue } : {};

  if (hideIfEmpty && !(options?.length > 0)) {
    return null;
  }
  return <OptionsViewer as={as} name={name} question={question} required={true} {...otherProps} scope={scope} />;
}
